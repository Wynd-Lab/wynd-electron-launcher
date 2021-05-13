const path = require('path')
const url = require('url')
const { app, BrowserWindow, dialog, ipcMain, session, globalShortcut, webFrame} = require('electron')

const log = require("electron-log")
const initialize = require("./helpers/initialize")
const killWPT = require("./helpers/kill_wpt")
const CustomError = require("../helpers/custom_error")

let posWindow = null
let loaderWindow = null

log.transports.console.level = process.env.DEBUG ? 'silly' : 'info'

const wyndpos = {
	conf: null,
	screens: []
}

const wpt = {
	process: null,
	pid: null,
	socket: null,
	infos: null,
	plugins: null,
	connect: false,
}

const confPath = process.env.NODE_ENV === "development" ? path.resolve(__dirname,'../../config.ini') : path.resolve(path.dirname(process.execPath), 'config.ini')

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
	log.debug("init", action)
	if (loaderWindow && loaderWindow.isVisible() && !loaderWindow.isDestroyed()) {
		loaderWindow.webContents.send("current_action", action)
	}
	switch (action) {
		case 'get_screens_done':
			wyndpos.screens = data
			if (posWindow && wyndpos.ready) {
				posWindow.webContents.send("screens", wpt.infos)
			}

			break;
		case 'check_conf_done':
			wyndpos.conf = data
			if (posWindow && wyndpos.ready) {
				posWindow.webContents.send("conf", wpt.infos)
			}
			break;
		case 'get_wpt_pid_done':
			wpt.pid = data
			break;
		case 'get_wpt_done':
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

		case 'finish':
			posWindow && !posWindow.isVisible() && posWindow.show()
			posWindow && !posWindow.isFullScreen() && posWindow.setFullScreen(true)
			loaderWindow && posWindow.isVisible() && loaderWindow.hide()
			break;

		default:
			break;
	}
}

// try {
// 	require('electron-reloader')(module,
// 		{
// 			watchRenderer: false
// 		});
// } catch(err) {
// 	log.error(err)
// }

// if (process.env.NODE_ENV === 'production') {
// 	const sourceMapSupport = require('source-map-support')
// 	sourceMapSupport.install()
// }


const createWindow = async () => {
	// log.debug('app is packaged', app.isPackaged, process.resourcesPath)
	//  const RESOURCES_PATH = app.isPackaged
	//    ? path.join(process.resourcesPath, 'assets')
	//    : path.join(__dirname, '../assets')

	//  const getAssetPath = (paths) => {
	//    return path.join(RESOURCES_PATH, ...paths)
	//  }

	// posWindow = createWindow()
	posWindow = new BrowserWindow({
		show: false,
		width: 1024,
		height: 728,
		icon: path.join(__dirname, '..', '..', 'assets', 'logo.png'),
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
		width: 300,
		height: 120,
		hasShadow: true,
		frame: false,
		modal: posWindow,
		enableLargerThanScreen: true,
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
		loaderWindow.show()
		log.debug('loader window', 'ready-to-show')
	})

	posWindow.on('closed', () => {
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
				wpt.socket =	await initialize({conf: confPath}, initCallback)
				if (wyndpos.conf.extensions) {
					for (const name in wyndpos.conf.extensions) {
						const extPath = path.resolve(
								wyndpos.conf.extensions[name]
						)
						await session.defaultSession.loadExtension(extPath, {allowFileAccess: true})
					}
				}
				// loaderWindow.hide()
				// if (posWindow && !posWindow.isVisible()) {
				// 	posWindow.show()
				// 	posWindow.setFullScreen(true)
				// }

			}
			catch(err) {
				showDialogError(err)
			}
		}
	})

	ipcMain.on('main_action', async( event, action) => {
		if(wpt.process) {
			await killWPT(wpt.process, wpt.socket)
			wpt.process = null
		}
		if(loaderWindow) {
			loaderWindow.show()
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
				app.quit()
				break;

			default:
				break;
		}
	})


}

// not working
process.on("SIGINT", async() => {
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
// app.on("before-quit", async(e) => {
// 	log.debug("before-quit")
// 	e.preventDefault()
// 	if (wpt.process && !wpt.process.killed) {
// 		try {
// 			await killWPT(wpt.process)
// 			process.exit(0)
// 		}
// 		catch(err) {
// 			process.exit(1)
// 		}
// 	}
// 	process.exit(0)
// })

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit()
	}
})

app.whenReady()
.then(() => {
	globalShortcut.register('Control+Shift+I', () => {
		// When the user presses Ctrl + Shift + I, this function will get called
		// You can modify this function to do other things, but if you just want
		// to disable the shortcut, you can just return false
		if (posWindow && posWindow.isVisible()) {
			posWindow.webContents.openDevTools();
		}
		if (loaderWindow && loaderWindow.isVisible()) {
			loaderWindow.setFullScreen(true)
			loaderWindow.webContents.openDevTools()
		}

		return true;
	});
})
.then(createWindow)
.catch(log.error)

app.on('activate', () => {
	if (posWindow === null) createWindow()
})
