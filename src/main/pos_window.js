const path = require('path')
const url = require('url')
const { app, BrowserWindow } = require('electron')
const log = require("electron-log")

const package = require("../../package.json")

let pm2 = app.isPackaged ? null : require("pm2")

const getAssetPath = require("./helpers/get_asset")

module.exports = function generatePosWindow(store, app) {

	const posWindow = new BrowserWindow({
		show: false,
		frame: false,
		icon: getAssetPath('icons/png/16x16.png'),
		x: store.choosen_screen.x + store.choosen_screen.width / 2 - store.windows.loader.width / 2,
		y: store.choosen_screen.y + store.choosen_screen.height / 2 - store.windows.loader.height / 2,
		webPreferences: {
			nodeIntegration: true,
			contextIsolation: false,
			preload: path.join(__dirname, '..', 'pos', 'assets', 'preload.js'),
		},
	})


	posWindow.webContents.on('ready-to-show', async () => {
		log.debug('pos window', 'ready-to-show')
	})

	posWindow.on('closed', () => {
		if (pm2 && process.env.NODE_ENV === "development" && store.pm2.connected) {
			pm2.delete(package.pm2.process[0].name)
		}
		store.windows.pos.current = null
	})

	const posFile = url.format({
		pathname: path.join(__dirname, '..', 'pos', 'assets', 'index.html'),
		protocol: 'file',
		slashes: true
	})

	posWindow.loadURL(posFile)

	return posWindow
}
