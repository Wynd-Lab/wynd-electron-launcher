const { app, globalShortcut } = require('electron')
const log = require("electron-log")

const path = require('path')

let pm2 = app.isPackaged ? null : require("pm2")

const yargs = require('yargs/yargs')
const { hideBin } = require('yargs/helpers')

const getScreens = require("./helpers/get_screens")
const killWPT = require("./helpers/kill_wpt")
const package = require("../../package.json")
const chooseScreen = require('./helpers/choose_screen')
const generateLoaderWindow = require('./loader_window')
const generateContainerWindow = require('./container_window')
const generateIpc = require('./ipc')
const generateInitCallback = require('./initcallback')
const innerGlobalShortcut = require("./global_shortcut")
require('./helpers/stream_logger')


const wpt = {
	process: null,
	pid: null,
	socket: null,
	infos: null,
	plugins: null,
	connect: false,
}

const store = {
	version: null,
	wpt: wpt,
	conf: null,
	screens: [],
	ready: false,
	packaged: false,
	path: {
		conf: null
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
	http: null
}

if (process.env.NODE_ENV === "development") {
	process.env.APPIMAGE = path.join(__dirname, '..', '..', 'dist', `${app.name}-1.0.0.AppImage`)
}

const argv = yargs(hideBin(process.argv))
  .option('config_path', {
    alias: 'c',
    type: 'string',
    description: 'set config path',
		default: app.isPackaged ? path.resolve(app.getPath("userData"), 'config.ini') : '../../config.ini'
  })
	.option('screen', {
    alias: 's',
    type: 'number',
    description: 'set screen',
		default: 0
  })
	.option('hooks', {
    alias: 'h',
    type: 'string',
    description: 'set hooks file',
		default: null
  })
  .argv;

store.path.conf =  path.isAbsolute(argv.config_path)  ?  argv.config_path : app.isPackaged ? path.resolve(path.dirname(process.execPath), argv.config_path) : path.resolve(__dirname, argv.config_path)
store.version = app.getVersion()

log.info(`[${package.pm2.process[0].name.toUpperCase()}] > config `, store.path.conf)
const initCallback = generateInitCallback(store)

const createWindow = async () => {
	log.debug('app is packaged', app.isPackaged, process.resourcesPath)

	store.choosen_screen = chooseScreen(argv.screen, store.screens)

	store.windows.container.current = generateContainerWindow(store)

	store.windows.loader.current = generateLoaderWindow(store)

	generateIpc(store, initCallback)
}
app.on("before-quit", async (e) => {
	log.debug("before-quit")
	globalShortcut.unregisterAll()
	if (wpt.process && !wpt.process.killed) {
		try {
			await killWPT(wpt.process, wpt.socket)
		}
		catch(err) {
		}
	}
	if (wpt.socket) {
        store.wpt.socket.emit("central.custom", '@cdm/wyndpos-desktop', 'disconnected')
		wpt.socket.close()
		wpt.socket = null
	}
	if (store.http) {
		store.http.close()
		store.http = null
	}
	process.exit(0)
})

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {

		if (pm2 && process.env.NODE_ENV === "development" && store.pm2.connected) {
			pm2.delete(package.pm2.process[0].name)
		}
		app.quit()
	}
})

app.whenReady()
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
	innerGlobalShortcut(store)
})
.then(() => {
	store.screens = getScreens()
})
.then(createWindow)
.catch(log.error)

app.on('activate', () => {
	if (store.windows.container.current === null) createWindow()
})
