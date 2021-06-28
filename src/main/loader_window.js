const path = require('path')
const url = require('url')
const log = require("electron-log")

const { BrowserWindow } = require('electron')

const getAssetPath = require("./helpers/get_asset")

module.exports = function generateLoaderWindow(store) {

	const loaderWindow = new BrowserWindow({
		closable: false,
		hasShadow: true,
		show: false,
		closable: false,
		resizable: false,
		width: store.windows.loader.width,
		height: store.windows.loader.height,
		x: store.choosen_screen.x + store.choosen_screen.width / 2 - store.windows.loader.width / 2,
		y: store.choosen_screen.y + store.choosen_screen.height / 2 - store.windows.loader.height / 2,
		hasShadow: true,
		icon: getAssetPath('logo.png'),
		frame: false,
		parent: store.windows.container.current,
		enableLargerThanScreen: true,
		paintWhenInitiallyHidden: false,
		alwaysOnTop: true,
		webPreferences: {
		nodeIntegration: true,
		contextIsolation: false,
				preload: path.join(__dirname, '..', 'loader', 'assets', 'preload.js'),
		},
	})

	loaderWindow.on('closed', () => {
		store.windows.loader.current = null
	})

	loaderWindow.webContents.on('ready-to-show', async () => {
		log.debug('loader window', 'ready-to-show')
	})

	const loaderFile = url.format({
		pathname: path.join(__dirname, '..', 'loader', 'assets', 'index.html'),
		protocol: 'file',
		slashes: true
	})

	loaderWindow.loadURL(loaderFile)

	if (process.env.DEBUG && process.env.DEBUG.indexOf("main_d") >= 0) {
		loaderWindow.setResizable(true)
		loaderWindow.setMovable(true)
		loaderWindow.setFullScreen(true)
		loaderWindow.setSize(store.choosen_screen.width -40, store.choosen_screen.height- 40)

		loaderWindow.webContents.openDevTools()
		loaderWindow.center()
	}
	return loaderWindow
}
