const { app, globalShortcut, autoUpdater } = require('electron')

const path = require('path')
const os = require('os')

let pm2 = app.isPackaged ? null : require("pm2")

const yargs = require('yargs/yargs')
const { hideBin } = require('yargs/helpers')

const package = require("../../package.json")

const getScreens = require("./helpers/get_screens")
const killWPT = require("./helpers/kill_wpt")
const chooseScreen = require('./helpers/choose_screen')
const getConfig = require("./helpers/get_config")
const log = require("./helpers/electron_log")
const showDialogError = require("./dialog_err")
const createAppLog = require("./helpers/create_app_log")
const configureProtocol = require("./helpers/register_file_protocol")
const generateLoaderWindow = require('./loader_window')
const generateContainerWindow = require('./container_window')
const generateIpc = require('./ipc')
const generateInitCallback = require('./initcallback')
const innerGlobalShortcut = require("./global_shortcut")
const generateTray = require('./tray')

require('./lock')
require('./helpers/stream_logger')(log)
// require('@electron/remote/main').initialize()

// const contextMenu = require('electron-context-menu');

// contextMenu({});
// try {
// 	const Hooks = require(path.join(app.getPath("userData"), 'hooks'))

// 	const hooks = new Hooks()
// }
// catch(err) {
// }

const wpt = {
	process: null,
	version: null,
	pid: null,
	socket: null,
	infos: null,
	plugins: null,
	connect: false,
}

const store = {
	infos: {
		name: app.getName(),
		version: app.getVersion(),
		stack: {
			electron: process.versions.electron,
			node: process.versions.node,
			os: os.release()
		},
		app_versions: null,
		os: {
			platform: process.platform,
			arch: os.arch(),
			version: os.release()
		},
		debug: !!process.env.DEBUG,
		packaged: app.isPackaged,
	},
	wpt: wpt,
	central: {
		registered: false,
		registering: false,
		status: "DISCONNECTED",
		ready: false,
		pending_messages: []
	},
	conf: null,
	screens: [],
	ready: false,
	path: {
		conf: null
	},
	ask: {
		request: null,
		next_action: null
	},
	choosen_screen: null,
	windows: {
		container: {
			current: null
		},
		loader: {
			current: null,
			width: 300,
			height: 140
		}
	},
	pm2: {
		connected: false
	},
	http: null,
	finish: false,
	appLog: createAppLog(app),
	current_request: null,
}

if (process.env.NODE_ENV === "development") {
	process.env.APPIMAGE = path.join(__dirname, '..', '..', 'dist', `${app.name}-1.0.0.AppImage`)
}

const default_path = process.env.EL_CONFIG_PATH || (app.isPackaged ? path.resolve(app.getPath("userData"), 'config.ini') : '../../config.ini')

if (process.env.EL_CONFIG_PATH) {
	log.info(`[CONFIG] EL_CONFIG_PATH env is set ${process.env.EL_CONFIG_PATH}`)
}

const argv = yargs(hideBin(process.argv))
  .option('config_path', {
    alias: 'c',
    type: 'string',
    description: 'set config path',
		default: default_path
  })
	.option('screen', {
    alias: 's',
    type: 'number',
    description: 'set screen',
		default: 0
  })
	// .option('hooks', {
  //   alias: 'h',
  //   type: 'string',
  //   description: 'set hooks file',
	// 	default: null
  // })
  .argv;

if (argv.config_path !== default_path)  {
	log.info(`[CONFIG] --config_path set ${argv.config_path}`)
}

store.path.conf = path.isAbsolute(argv.config_path)  ?
 									argv.config_path :
									app.isPackaged ?  path.resolve(path.dirname(process.execPath), argv.config_path) :
																	  path.resolve(__dirname, argv.config_path)



store.version = app.getVersion()

log.info(`[CONFIG] > path used ${store.path.conf}`)
log.info(`[LOG] > path used ${path.join(app.getPath('userData'), 'logs')}`)

const initCallback = generateInitCallback(store, log)

const createWindows = () => {
	log.debug(`[APP] > packaged: ${app.isPackaged, process.resourcesPath}`)

	store.choosen_screen = chooseScreen(argv.screen, store.screens)

	store.windows.container.current = generateContainerWindow(store)
	store.windows.loader.current = generateLoaderWindow(store)
	generateIpc(store, initCallback)
}

app.commandLine.appendSwitch("disable-http-cache");

app.on("will-quit", async (e) => {
	globalShortcut.unregisterAll()
	if (wpt.process && !wpt.process.killed) {
		try {
			await killWPT(wpt.process, wpt.socket, wpt.pid)
			store.wpt.process = null
			store.wpt.pid = null

		}
		catch(err) {
			log.error(`[QUIT] > before-quit: ${err.message}`)
		}
	}
	if (wpt.socket) {
		wpt.socket.close()
		wpt.socket = null
	}
	if (store.http) {
		store.http.close()
		store.http = null
	}
})

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {

		if (pm2 && process.env.NODE_ENV === "development" && store.pm2.connected) {
			pm2.delete(package.pm2.process[0].name)
		}
		app.quit()
	}
})

getConfig(store.path.conf).then(conf => {
	store.conf = conf
	if (conf.commandline) {
		for (const commandName in conf.commandline) {
				const value = conf.commandline[commandName];
				app.commandLine.appendSwitch(commandName, value)
				log.info('[COMMANDLINE] > ' + commandName + ', ' + value)
		}
	}
})
.catch((err) => {
	store.pre_error_init = err
})
.finally(() => {
	app.whenReady()
	.then(() => {

		if (store.pre_error_init) {
			showDialogError(store, store.pre_error_init)
			throw err
		}
		process.on("SIGINT", () => {
			log.info("[PROCESS] > SIGINT")
			app.quit()
		});

		process.on("SIGTERM", () => {
			log.info("[PROCESS] > SIGTERM")
			app.quit()
		});

	})
// .then(() => {
// 	return session.defaultSession.clearCache()
// })
// .then(() => {
// 	return session.defaultSession.clearStorageData()
// })
// .then(() => {
// 	return session.defaultSession.clearAuthCache()
// })
	.then(() => {
		return new Promise((resolve, reject) => {
			if (pm2 && process.env.NODE_ENV === "development") {
				pm2.connect(true, (err) => {
					if (err) {
						return reject(err)
					}
					store.pm2.connected = true
					resolve()
				})
			}
			else {
				resolve()
			}
		})

	})
	.then(() => {
		configureProtocol(store)
	})
	.then(() => {
		innerGlobalShortcut(store)
	})
	.then(() => {
		store.screens = getScreens()
	})
	.then(createWindows)
	.then(() => {
		generateTray(store)
	})
	.catch(log.error)

	app.on('activate', () => {
		if (store.windows.container.current === null) createWindows()
	})
})
