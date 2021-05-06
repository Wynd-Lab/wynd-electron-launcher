const path = require('path')
const { app, BrowserWindow, dialog } = require('electron')
const url = require('url')

const initialize = require("./helpers/initialize")
let mainWindow = null

try {
	require('electron-reloader')(module,
		{
			watchRenderer: false
		});
} catch {

}

if (process.env.NODE_ENV === 'production') {
	const sourceMapSupport = require('source-map-support')
	sourceMapSupport.install()
}

const createWindow = async () => {

	console.log(app.isPackaged, process.resourcesPath)
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

	const mainFile = url.format({
		pathname: path.join(__dirname, '..', 'renderer', 'index.html'),
		protocol: 'file',
		slashes: true
	})

	mainWindow.loadURL(mainFile)
	mainWindow.webContents.openDevTools();

	// @TODO: Use 'ready-to-show' event
	//        https://github.com/electron/electron/blob/master/docs/api/browser-window.md#using-ready-to-show-event
	mainWindow.webContents.on('ready-to-show', async () => {
		if (!mainWindow) {
			throw new Error('"mainWindow" is not defined')
		}

		const confPath = process.env.NODE_ENV === "development" ? path.resolve(__dirname,'../../config.ini') : path.resolve(path.dirname(process.execPath), 'config.ini')

		try {
			const data = await initialize({
				conf: confPath
			}, (action, data) => {
				console.log(action, data)
				// mainWindow.webContents.send()
			})
			console.log(data)
		}
		catch(err) {
			console.log('ERR', err)
			const dialogOpts = {
				type: 'error',
				buttons: ['Close'],
				title: 'Application Update',
				message: "An error as occured",
				detail: err.message
			}

			dialog.showMessageBox(mainWindow, dialogOpts).then((returnValue) => {
				app.quit()
			})
		}
		if (mainWindow) {
			mainWindow.show()
		}

	})

	mainWindow.on('closed', () => {
		mainWindow = null

	})
}

app.on('window-all-closed', () => {
	// Respect the OSX convention of having the application in memory even
	// after all windows have been closed
	if (process.platform !== 'darwin') {
		app.quit()
	}
})

app.whenReady().then(createWindow).catch(console.log)

app.on('activate', () => {
	// On macOS it's common to re-create a window in the app when the
	// dock icon is clicked and there are no other windows open.
	if (mainWindow === null) createWindow()
})
