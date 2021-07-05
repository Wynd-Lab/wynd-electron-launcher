const { app, ipcMain, session, webFrame, Notification } = require('electron')
const log = require("electron-log")

const showDialogError = require("./dialog_err")

const initialize = require("./helpers/initialize")
const requestWPT = require('./helpers/request_wpt')
const killWPT = require("./helpers/kill_wpt")
const reinitialize = require("./helpers/reinitialize")
// const connectToWpt = require("./helpers/connect_to_wpt")

module.exports = function generateIpc(store, initCallback) {

	ipcMain.on('ready', async(event, who) => {
		log.info(who +' window', 'ready to received info')
		if (who === 'main' && store.windows.container.current) {
			store.ready = true

			store.windows.container.current.webContents.send("app_infos", {version: app.getVersion(), name: app.getName()})
			store.windows.container.current.webContents.closeDevTools()
			if (store.conf) {
				store.windows.container.current.webContents.send("conf", store.conf)
			}
			if (store.screens.length > 0) {
				store.windows.container.current.webContents.send("screens", store.screens)
			}
			store.windows.container.current.webContents.send("wpt_connect", store.wpt.connect)
			if (store.wpt.infos) {
				store.windows.container.current.webContents.send("request_wpt.done",'infos',  store.wpt.infos)

			}
			if (store.wpt.plugins) {
				store.windows.container.current.webContents.send("request_wpt.done",'plugins', store.wpt.plugins)
			}


		} else if (who === 'loader' && store.windows.loader.current) {
			try {


			// const callback = (event, data) => {
			// 	console.log(event, data)
			// }

			// connectToWpt("http://localhost:9963", callback)
			// .then((socket) => {
			// 	socket.close()
			// 	return connectToWpt("http://localhost:9963", callback)
			// })
			// .then((socket) => {
			// 	socket.close()
			// })

				if (store.windows.loader.current && !store.windows.loader.current.isVisible() && !store.windows.loader.current.isDestroyed()) {
					store.windows.loader.current.show()
					store.windows.loader.current.webContents.send("app_infos", {version: app.getVersion(), name: app.getName()})
					store.windows.loader.current.webContents.send("loader.action", "initialize")
				}
				if (store.wpt) {
					store.wpt.socket = await initialize({conf: store.path.conf}, initCallback)
					if (store.wpt.socket) {
						store.wpt.socket.emit("central.custom", '@cdm/wyndpos-desktop', 'connected', store.version)
					}
				}

				if (store.conf && store.conf.extensions) {
					for (const name in store.conf.extensions) {
						const extPath = path.resolve(
							store.conf.extensions[name]
						)
						await session.defaultSession.loadExtension(extPath, {allowFileAccess: true})
					}
				}

			}
			catch(err) {
				showDialogError(store, err)
			}
		}
	})


	ipcMain.on('child.action', (event, action, ...others) => {
		switch (action) {
			case 'log':
				others.shift()
				log.info("[CHILD RENDERER]", ...others)
				break;

			default:
				break;
		}
	})

	// ipcMain.on('action.reload', (event) => {

	// 	console.log("trigger")
	// 	reinitialize(store, initCallback)
	// })

	ipcMain.on('request_wpt', (event, action) => {
		if (store.wpt.socket) {
			requestWPT(store.wpt.socket, { emit: 'plugins'}).then((plugins) => {
				store.windows.container.current.webContents.send("request_wpt.done", action, plugins)
			})
			.catch((err) => {

				const notification = {
					title: err.api_code || err.code || "An error as occured",
					body: err.message
				}
				new Notification(notification).show()

				if (store.windows.container.current) {
					store.windows.container.current.webContents.send("request_wpt.error", action, err)
				}
			})

		}
	})

	ipcMain.on('main.action', async( event, action) => {
		console.log('main.action', action)
		if(store.windows.loader.current && !store.windows.loader.current.isDestroyed() && action !== "close" && action !== "open_dev_tools") {
			store.windows.loader.current.show()
			store.windows.loader.current.webContents.send("loader.action", action)
		}
		if(store.wpt.process) {
			await killWPT(store.wpt.process, store.wpt.socket, store.wpt.pid)
			store.wpt.process = null
			store.wpt.pid = null
		}
		switch (action) {
			case 'reload':
				await reinitialize(store, initCallback)
				break;
			case 'close':
				if (store.windows.loader.current && store.windows.loader.current.isVisible() && !store.windows.loader.current.isDestroyed()) {
					store.windows.loader.current.close()
				}
				if (store.windows.container.current && store.windows.container.current.isVisible() && !store.windows.container.current.isDestroyed()) {
					store.windows.container.current.close()
				}
				break;

			case 'emergency':
				if (store.wpt.socket && store.wpt.plugins) {
					const fastprinter = store.wpt.plugins.find((plugin) => {
						return plugin.name === 'Fastprinter' && plugin.enabled ===true
					})

					const cashdrawer = store.wpt.plugins.find((plugin) => {
						return plugin.name === 'Cashdrawer' && plugin.enabled === true
					})

					if (fastprinter) {
						store.wpt.socket.emit('fastprinter.cashdrawer')
					}
					if (cashdrawer) {
						store.wpt.socket.emit('cashdrawer.open')
					}
					app.quit()
				}
				break;
			case 'open_dev_tools':
				if (store.windows.container.current && store.windows.container.current.isVisible() && !store.windows.container.current.isDestroyed()) {
					store.windows.container.current.webContents.openDevTools()
				}
				break;

			default:
				break;
		}
	})
}
