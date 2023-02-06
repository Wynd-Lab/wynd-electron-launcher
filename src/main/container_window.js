const path = require('path')
const { app, BrowserWindow } = require('electron')

const package = require("../../package.json")

const log = require('./helpers/electron_log')

let pm2 = app.isPackaged ? null : require("pm2")

const getAssetPath = require("./helpers/get_asset")
const { config } = require('yargs')

module.exports = function generatecontainerWindow(store) {

	let isFrame = store.conf.frame

	if (isFrame === undefined || isFrame === null) {
		isFrame = false
	}
	 else if (typeof isFrame === "string") {
		isFrame = isFrame === "1" || isFrame === 'true'
	}

	const containerWindow = new BrowserWindow({
		show: false,
		frame: isFrame,
		icon: getAssetPath('icons/png/32x32.png'),
		useContentSize: true,
		x: store.choosen_screen.x + store.choosen_screen.width / 2 - store.windows.loader.width / 2,
		y: store.choosen_screen.y + store.choosen_screen.height / 2 - store.windows.loader.height / 2,
		// width: store.choosen_screen.width,
		// height: store.choosen_screen.height,
		webPreferences: {
			webviewTag: true,
			nodeIntegration: true,
			contextIsolation: false,
			enableRemoteModule: true,
			preload: path.join(__dirname, '..', 'container', 'assets', 'preload.js'),
		},
		title: store.conf.title ? store.conf.title : store.conf.infos.name
	})
	// const view = new BrowserView()
  // containerWindow.setBrowserView(view)
	// view.setBounds({ x: 0, y: 0, width: store.choosen_screen.width, height: store.choosen_screen.height })
	// view.webContents.loadURL('http://pos.chrono.demomkt.xyz')
	containerWindow.webContents.on('ready-to-show', async () => {
		if (process.env.DEBUG || store.conf.debug ) {
			// if (store.conf.view !== 'webview') {
				containerWindow.webContents.openDevTools({mode: "right" })
			// }
		}
		log.debug('[WINDOW] > container : ready-to-show')
	})

	containerWindow.on('closed', () => {
		if (pm2 && process.env.NODE_ENV === "development" && store.pm2.connected) {
			pm2.delete(package.pm2.process[0].name)
		}
		store.windows.container.current = null
	})
	containerWindow.removeMenu()
	containerWindow.on('show', () => {
		setTimeout(() => {
			containerWindow.focus();
		}, 200);
	});

	return containerWindow
}
