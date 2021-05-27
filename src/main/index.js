const path = require('path')
const { app } = require('electron')
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
const generateInitCallback = require('./initcallback')
const globalShortcut = require("./global_shortcut")

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

const initCallback = generateInitCallback(store)

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

		if (pm2 && process.env.NODE_ENV === "development" && store.pm2.connected) {
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
	globalShortcut(store)
})
.then(() => {
	store.screens = getScreens()
})
.then(createWindow)
.catch(log.error)

app.on('activate', () => {
	if (store.windows.pos.current === null) createWindow()
})
