const path = require('path')
const url = require('url')
const { app, BrowserWindow, dialog, ipcMain, session, globalShortcut, webFrame } = require('electron')

const pm2 = require("pm2")
const log = require("electron-log")

const yargs = require('yargs/yargs')
const { hideBin } = require('yargs/helpers')


const initialize = require("./helpers/initialize")
const getScreens = require("./helpers/get_screens")
const killWPT = require("./helpers/kill_wpt")
const CustomError = require("../helpers/custom_error")
const package = require("../../package.json")
const chooseScreen = require('./helpers/choose_screen')

app.commandLine.hasSwitch('disable-gpu')

let pm2Connected = false
let posWindow = null
let loaderWindow = null

log.transports.console.level = process.env.DEBUG ? 'silly' : 'info'

const wyndpos = {
	conf: null,
	screens: []
}

const loader = {
	width: 300,
	height: 140
}

const wpt = {
	process: null,
	pid: null,
	socket: null,
	infos: null,
	plugins: null,
	connect: false,
}

const argv = yargs(hideBin(process.argv))
  .option('config_path', {
    alias: 'c',
    type: 'string',
    description: 'set config path',
		default: app.isPackaged ? './config.ini' : '../../config.ini'
  })
	.option('screen', {
    alias: 's',
    type: 'number',
    description: 'set screen',
		default: 0
  })
  .argv

const confPath =  path.isAbsolute(argv.config_path)  ?  argv.config_path : app.isPackaged ? path.resolve(path.dirname(process.execPath), argv.config_path) : path.resolve(__dirname, argv.config_path)

log.info(`[${package.pm2.process[0].name.toUpperCase()}] > config `, confPath)

const showDialogError = (err) => {

	log.error(err instanceof Buffer, err instanceof Error, err instanceof CustomError, typeof err)
	log.error(err instanceof Buffer ? err.toString() : err)
	const message = err.toString ? err.toString() : err.message

	const dialogOpts = {
		type: 'error',
		buttons: ['Close'],
		title: 'Application error',
		message: err.api_code || err.api_code || "An error as occured",
		detail: message
	}

	dialog.showMessageBox(posWindow, dialogOpts).then((returnValue) => {
		app.quit()
	})
}

const initCallback = (action, data) => {
	log.debug(`[${package.pm2.process[0].name.toUpperCase()}] > init `, action, data)
	// if (loaderWindow && !loaderWindow.isVisible() && !loaderWindow.isDestroyed()) {
	// 	loaderWindow.show()
	// }
	if (loaderWindow && loaderWindow.isVisible() && !loaderWindow.isDestroyed()) {
		loaderWindow.webContents.send("current_status", action)
	}
	switch (action) {
		case 'get_screens_done':
			wyndpos.screens = data
			// const choosenScreen = chooseScreen(wyndpos.conf.screen, wyndpos.screens)
			// loaderWindow.setPosition
			if (posWindow && wyndpos.ready) {
				posWindow.webContents.send("screens", wyndpos.screens)
			}
			break;
		case 'check_conf_done':
			wyndpos.conf = data
			if (posWindow && wyndpos.ready) {
				posWindow.webContents.send("conf", wyndpos.conf)
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
			if (posWindow && wyndpos.ready) {
				posWindow.webContents.send("wpt_connect", wpt.connect)
			}
			break;
		case 'wpt_infos_done':
			wpt.infos = data
			if (posWindow && wyndpos.ready) {
				posWindow.webContents.send("wpt_infos", wpt.infos)
			}
			break;
		case 'wpt_plugins_done':
				wpt.plugins = data
				if (posWindow && wyndpos.ready) {
					posWindow.webContents.send("wpt_plugins", wpt.plugins)
				}
			break;
		case 'finish':
			!!posWindow && !posWindow.isVisible() && posWindow.show()
			!!posWindow && !posWindow.isFullScreen() && posWindow.setFullScreen(true)
			!!loaderWindow && loaderWindow.isVisible() && loaderWindow.hide()
			break;

		default:
			break;
	}
}

const createWindow = async () => {
	log.debug('app is packaged', app.isPackaged, process.resourcesPath)
	//  const RESOURCES_PATH = app.isPackaged
	//    ? path.join(process.resourcesPath, 'assets')
	//    : path.join(__dirname, '../assets')

	//  const getAssetPath = (paths) => {
	//    return path.join(RESOURCES_PATH, ...paths)
	//  }

	const choosenScreen = chooseScreen(argv.screen, wyndpos.screens)

	posWindow = new BrowserWindow({
		show: false,
		frame: false,
		icon: path.join(__dirname, '..', '..', 'assets', 'logo.png'),
		x: choosenScreen.x,
		x: choosenScreen.y,
		webPreferences: {
			nodeIntegration: true,
			contextIsolation: false,
			preload: path.join(__dirname, '..', 'pos', 'assets', 'preload.js'),
		},
	})

	loaderWindow = new BrowserWindow({
		center: true,
		closable: false,
		hasShadow: true,
		show: false,
		closable: false,
		resizable: false,
		width: loader.width,
		height: loader.height,
		x: choosenScreen.x,
		x: choosenScreen.y,
		hasShadow: true,
		frame: false,
		parent: posWindow,
		enableLargerThanScreen: true,
		alwaysOnTop: true,
		webPreferences: {
		nodeIntegration: true,
		contextIsolation: false,
				preload: path.join(__dirname, '..', 'loader', 'assets', 'preload.js'),
		},
	})

	posWindow.webContents.on('ready-to-show', async () => {
		log.debug('pos window', 'ready-to-show')
	})

	loaderWindow.webContents.on('ready-to-show', async () => {
		log.debug('loader window', 'ready-to-show')
	})

	posWindow.on('closed', () => {
		if (process.env.NODE_ENV === "development" && pm2Connected) {
			pm2.delete(package.pm2.process[0].name)
		}
		posWindow = null
	})

	const posFile = url.format({
		pathname: path.join(__dirname, '..', 'pos', 'assets', 'index.html'),
		protocol: 'file',
		slashes: true
	})

	posWindow.loadURL(posFile)

	const loaderFile = url.format({
		pathname: path.join(__dirname, '..', 'loader', 'assets', 'index.html'),
		protocol: 'file',
		slashes: true
	})

	loaderWindow.loadURL(loaderFile)

	ipcMain.on('ready', async(event, who) => {
		log.debug(who +' window', 'ready to received info')
		if (who === 'main' && posWindow) {
			wyndpos.ready = true
			if (wyndpos.conf) {
				posWindow.webContents.send("conf", wyndpos.conf)
			}
			if (wyndpos.screens.length > 0) {
				posWindow.webContents.send("screens", wyndpos.screens)
			}
			posWindow.webContents.send("wpt_connect", wpt.connect)
			if (wpt.infos) {
				posWindow.webContents.send("wpt_infos", wpt.infos)

			}
			if (wpt.plugins) {
				posWindow.webContents.send("wpt_plugins", wpt.plugins)

			}
		} else if (who === 'loader' && loaderWindow) {
			try {
				if (loaderWindow && !loaderWindow.isDestroyed()) {
					loaderWindow.webContents.send("app_version", app.getVersion())
					loaderWindow.webContents.send("loader_action", "initialize")
				}
				if (loaderWindow && !loaderWindow.isVisible() && !loaderWindow.isDestroyed()) {
					loaderWindow.show()
				}
				wpt.socket =	await initialize({conf: confPath}, initCallback)
				if (wyndpos.conf.extensions) {
					for (const name in wyndpos.conf.extensions) {
						const extPath = path.resolve(
								wyndpos.conf.extensions[name]
						)
						await session.defaultSession.loadExtension(extPath, {allowFileAccess: true})
					}
				}

			}
			catch(err) {
				showDialogError(err)
			}
		}
	})

	ipcMain.on('main_action', async( event, action) => {
		if(loaderWindow) {
			if (loaderWindow && loaderWindow.isVisible() && !loaderWindow.isDestroyed()) {
				loaderWindow.webContents.send("loader_action", action)
			}
			loaderWindow.show()
		}
		if(wpt.process) {
			await killWPT(wpt.process, wpt.socket)
			wpt.process = null
		}
		switch (action) {
			case 'reload':
				if(webFrame) {
					webFrame.clearCache()
				}
				if(posWindow) {
					posWindow.reload()
				}
				try {
					wpt.socket = await initialize({conf: confPath}, initCallback)
				}
				catch(err) {
					showDialogError(err)
				}
				break;
			case 'close':
				if (loaderWindow && loaderWindow.isVisible() && !loaderWindow.isDestroyed()) {
					loaderWindow.close()
				}
				if (posWindow && posWindow.isVisible() && !posWindow.isDestroyed()) {
					posWindow.close()
				}
				break;

			case 'emergency':
				if (wpt.socket && wpt.plugins) {
					const fastprinter = wpt.plugins.find((plugin) => {
						return plugin.name === 'Fastprinter' && plugin.enabled ===true
					})

					const cashdrawer = wpt.plugins.find((plugin) => {
						return plugin.name === 'Cashdrawer' && plugin.enabled === true
					})

					if (fastprinter) {
						wpt.socket.emit('fastprinter.cashdrawer')
					}
					if (cashdrawer) {
						wpt.socket.emit('cashdrawer.open')
					}
					app.quit()
				}
				break;

			default:
				break;
		}
	})
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

		if (process.env.NODE_ENV === "development" && pm2Connected) {
			pm2.delete(package.pm2.process[0].name)
		}
		app.quit()
	}
})

app.whenReady()
.then(() => {
	return new Promise((resolve, reject) => {
		if (process.env.NODE_ENV === "development") {
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
		console.log("CTRL")
		if (posWindow && posWindow.isVisible()) {
			posWindow.webContents.openDevTools();
		}
		if (loaderWindow && loaderWindow.isVisible()) {
			loaderWindow.webContents.openDevTools();
			loaderWindow.setResizable(true)
			loaderWindow.setFullScreen(true)
		}

		return true;
	});
	globalShortcut.register('Control+Shift+F', () => {
		if (loaderWindow && loaderWindow.isVisible()) {
			if (loaderWindow.isFullScreen()) {
				loaderWindow.setFullScreen(false)
				loaderWindow.setSize(300, 120)
				loaderWindow.show()
			}
		}

		return true;
	});
})
.then(() => {
	wyndpos.screens = getScreens()
})
.then(createWindow)
.catch(log.error)

app.on('activate', () => {
	if (posWindow === null) createWindow()
})
