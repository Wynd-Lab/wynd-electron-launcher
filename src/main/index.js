const path = require('path')
const { app,  globalShortcut } = require('electron')
let pm2 = app.isPackaged ? null : require("pm2")
const log = require("electron-log")

const yargs = require('yargs/yargs')
const { hideBin } = require('yargs/helpers')

const getScreens = require("./helpers/get_screens")
const killWPT = require("./helpers/kill_wpt")
const package = require("../../package.json")
const chooseScreen = require('./helpers/choose_screen')
const generateLoaderWindow = require('./loader_window')
const generatePosWindow = require('./pos_window')
const generateIpc = require('./ipc')

app.commandLine.hasSwitch('disable-gpu')

log.transports.console.level = process.env.DEBUG ? 'silly' : 'info'

const wpt = {
	process: null,
	pid: null,
	socket: null,
	infos: null,
	plugins: null,
	connect: false,
}

const store = {
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
		pos: {
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
	}
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
  .argv

store.path.conf =  path.isAbsolute(argv.config_path)  ?  argv.config_path : app.isPackaged ? path.resolve(path.dirname(process.execPath), argv.config_path) : path.resolve(__dirname, argv.config_path)

log.info(`[${package.pm2.process[0].name.toUpperCase()}] > config `, store.path.conf)

const initCallback = (action, data) => {
	if (action === 'launch_wpt_done') {
		log.debug(`[${package.pm2.process[0].name.toUpperCase()}] > init `, action, "process.pid: " + data.pid)
	} else {
		log.debug(`[${package.pm2.process[0].name.toUpperCase()}] > init `, action, data)
	}
	if (store.windows.loader.current && store.windows.loader.current.isVisible() && !store.windows.loader.current.isDestroyed()) {
		store.windows.loader.current.webContents.send("current_status", action)
	}
	switch (action) {
		case 'get_screens_done':
			store.screens = data
			if (store.windows.pos.current && store.ready) {
				store.windows.pos.current.webContents.send("screens", store.screens)
			}
			break;
		case 'check_conf_done':
			store.conf = data
			if (store.windows.pos.current && store.ready) {
				store.windows.pos.current.webContents.send("conf", store.conf)
			}
			break;
		case 'get_wpt_pid_done':
			wpt.pid = data
			break;
		case 'launch_wpt_done':
			wpt.process = data
			if (!wpt.pid) {
				wpt.pid = process.pid
			}
			break;
		case 'wpt_connect_done':
			wpt.connect = data
			if (store.windows.pos.current && store.ready) {
				store.windows.pos.current.webContents.send("wpt_connect", wpt.connect)
			}
			break;
		case 'wpt_infos_done':
			wpt.infos = data
			if (store.windows.pos.current && store.ready) {
				store.windows.pos.current.webContents.send("wpt_infos", wpt.infos)
			}
			break;
		case 'wpt_plugins_done':
				wpt.plugins = data
				if (store.windows.pos.current && store.ready) {
					store.windows.pos.current.webContents.send("wpt_plugins", wpt.plugins)
				}
			break;
		case 'finish':

			if (process.env.DEBUG && process.env.DEBUG === "main") {
				break
			}
			store.windows.pos.current.webContents.send("display", true)
			!!store.windows.pos.current && !store.windows.pos.current.isVisible() && store.windows.pos.current.show()
			!!store.windows.pos.current && !store.windows.pos.current.isFullScreen() && store.windows.pos.current.setFullScreen(true)
			!!store.windows.loader.current && store.windows.loader.current.isVisible() && store.windows.loader.current.hide()

			break;

		default:
			break;
	}
}

const createWindow = async () => {
	log.debug('app is packaged', app.isPackaged, process.resourcesPath)

	store.choosen_screen = chooseScreen(argv.screen, store.screens)

	store.windows.pos.current = generatePosWindow(store)

	store.windows.loader.current = generateLoaderWindow(store)

	generateIpc(store, initCallback)

}

app.on("before-quit", async (e) => {
	log.debug("before-quit")
	if (wpt.process && !wpt.process.killed) {
		try {
			await killWPT(wpt.process, wpt.socket)
		}
		catch(err) {
			process.exit(1)
		}
	}
	process.exit(0)
})

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {

		if (pm2 && process.env.NODE_ENV === "development" && pm2Connected) {
			pm2.delete(package.pm2.process[0].name)
		}
		app.quit()
	}
})

app.whenReady()
.then(() => {
	return new Promise((resolve, reject) => {
		if (pm2 && process.env.NODE_ENV === "development") {
			pm2.connect(true, (err) => {
				if (err) {
					return reject(err)
				}
				pm2Connected = true
				resolve()
			})
		}
		else {
			resolve()
		}
	})

})
.then(() => {
	globalShortcut.register('Control+Shift+I', () => {
		if (store.windows.pos.current && store.windows.pos.current.isVisible()) {
			store.windows.pos.current.webContents.openDevTools();
		}
		if (store.windows.loader.current && store.windows.loader.current.isVisible()) {
			store.windows.loader.current.setResizable(true)
			store.windows.loader.current.setFullScreen(true)
			store.windows.loader.current.webContents.openDevTools();
		}

		return true;
	});
	globalShortcut.register('Control+Shift+F', () => {
		if (store.windows.loader.current && store.windows.loader.current.isVisible()) {
			if (store.windows.loader.current.isFullScreen()) {
				store.windows.loader.current.setFullScreen(false)
				store.windows.loader.current.setSize(300, 120)
				store.windows.loader.current.show()
			}
		}

		return true;
	});
})
.then(() => {
	store.screens = getScreens()
})
.then(createWindow)
.catch(log.error)

app.on('activate', () => {
	if (store.windows.pos.current === null) createWindow()
})
