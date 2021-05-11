const path = require('path')
const url = require('url')
const { app, BrowserWindow, dialog, ipcMain, session } = require('electron')

const log = require("electron-log")
const initialize = require("./helpers/initialize")
const killWPT = require("./helpers/kill_wpt")
let mainWindow = null

log.transports.console.level = process.env.DEBUG ? 'silly' : 'info'

const wyndpos = {
	conf: null,
	screens: [],
	ready: false
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

const initCallback = (action, data) => {
	log.debug("init", action)
	switch (action) {
		case 'get_screens':
			wyndpos.screens = data
			if (mainWindow && wyndpos.ready) {
				mainWindow.webContents.send("screens", wpt.infos)
			}
			break;
		case 'check_conf':
			wyndpos.conf = data
			if (mainWindow && wyndpos.ready) {
				mainWindow.webContents.send("conf", wpt.infos)
			}
			break;
		case 'get_wpt_pid':
			wpt.pid = data
			break;
		case 'get_wpt':
			wpt.process = data
			if (!wpt.pid) {
				wpt.pid = process.pid
			}
			break;
		case 'get_socket':
			wpt.socket = data
			break
		case 'wpt_connect':
			wpt.connect = data
			if (mainWindow && wyndpos.ready) {
				mainWindow.webContents.send("wpt_connect", wpt.connect)
			}
			break;
		case 'wpt_infos':
			wpt.infos = data
			if (mainWindow && wyndpos.ready) {
				mainWindow.webContents.send("wpt_infos", wpt.infos)
			}
			break;
			case 'wpt_plugins':
				wpt.plugins = data
				if (mainWindow && wyndpos.ready) {
					mainWindow.webContents.send("wpt_plugins", wpt.plugins)
				}
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
	log.debug('app is packaged', app.isPackaged, process.resourcesPath)
	//  const RESOURCES_PATH = app.isPackaged
	//    ? path.join(process.resourcesPath, 'assets')
	//    : path.join(__dirname, '../assets')

	//  const getAssetPath = (paths) => {
	//    return path.join(RESOURCES_PATH, ...paths)
	//  }

	mainWindow = new BrowserWindow({
		show: false,
		width: 1024,
		height: 728,
		//  icon: getAssetPath('icon.png'),
		webPreferences: {
			nodeIntegration: true,
			contextIsolation: false,
			preload: path.join(__dirname, '..', 'renderer', 'preload.js'),
		},
	})

	mainWindow.webContents.on('ready-to-show', async () => {
		log.debug('main window', 'ready-to-show')
		if (!mainWindow) {
			throw new Error('"mainWindow" is not defined')
		}
		try {
			await initialize({conf: confPath}, initCallback)
			if (wyndpos.conf.extensions) {
				for (const name in wyndpos.conf.extensions) {
					const extPath = path.resolve(
							wyndpos.conf.extensions[name]
					)
					await session.defaultSession.loadExtension(extPath, {allowFileAccess: true})
				}
			}
			if (mainWindow && !mainWindow.isVisible()) {
				mainWindow.show()
			}

		}
		catch(err) {
			const message = err.toString ? err.toString() : err.message
			log.error(message)
			const dialogOpts = {
				type: 'error',
				buttons: ['Close'],
				title: 'Application Update',
				message: "An error as occured",
				detail: err.toString ? err.toString() : err.message
			}

			dialog.showMessageBox(mainWindow, dialogOpts).then((returnValue) => {
				app.quit()
			})
		}

	})

	mainWindow.on('closed', () => {
		mainWindow = null

	})

	const mainFile = url.format({
		pathname: path.join(__dirname, '..', 'renderer', 'index.html'),
		protocol: 'file',
		slashes: true
	})

	mainWindow.loadURL(mainFile)
	mainWindow.webContents.openDevTools();

	ipcMain.on('ready', (event, who) => {
		log.debug('main window', 'ready to received info')
		if (who === 'main' && mainWindow) {
			wyndpos.ready = true
			if (wyndpos.conf) {
				mainWindow.webContents.send("conf", wyndpos.conf)
			}
			if (wyndpos.screens.length > 0) {
				mainWindow.webContents.send("screens", wyndpos.screens)
			}
			mainWindow.webContents.send("wpt_connect", wpt.connect)
			if (wpt.infos) {
				mainWindow.webContents.send("wpt_infos", wpt.infos)

			}
			if (wpt.plugins) {
				mainWindow.webContents.send("wpt_plugins", wpt.plugins)

			}
		}
	})

	ipcMain.on('main_action', async( event, action) => {
		if(wpt.process) {
			await killWPT(wpt.process, wpt.socket)
			wpt.process = null
		}
		switch (action) {
			case 'reload':
				try {
					await initialize({conf: confPath}, initCallback)
				}
				catch(err) {
					log.error(err)
					const dialogOpts = {
						type: 'error',
						buttons: ['Close'],
						title: 'Application Update',
						message: "An error as occured",
						detail: err.toString ? err.toString() : err.message
					}

					dialog.showMessageBox(mainWindow, dialogOpts).then((returnValue) => {
						app.quit()
					})
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
.then(createWindow)
.catch(log.error)

app.on('activate', () => {
	if (mainWindow === null) createWindow()
})
