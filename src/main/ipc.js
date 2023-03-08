const { app, ipcMain, session, Notification } = require('electron')
const path = require('path')

const showDialogError = require("./dialog_err")

const initialize = require("./helpers/initialize")
const requestWPT = require('./helpers/request_wpt')
const reinitialize = require("./helpers/reinitialize")
const checkWptPlugin = require("./helpers/check_wpt_plugin")
const openLoaderDevTools = require('./helpers/open_loader_dev_tools')
const sendOnReady = require('./helpers/send_on_ready')
const hasLevel = require('./helpers/has_level')
const log = require("./helpers/electron_log")
const clearCache = require('./helpers/clear_cache')

module.exports = function generateIpc(store, initCallback) {
	let count = 0

	ipcMain.on('ready', async (event, who) => {
		log.info(`[WINDOW] > ${who} ready to received info`)
		if (who === 'main' && store.windows.container.current) {

			store.ready = true
			store.windows.container.current.webContents.send("user_path", store.infos.user_path)

			const name = store.conf && store.conf.title ? store.conf.title : store.infos.name
			store.windows.container.current.webContents.send("app_infos", { version: store.infos.version, name: name })
			sendOnReady(store)

			if (store.screens.length > 0) {
				store.windows.container.current.webContents.send("screens", store.screens)
			}
			store.windows.container.current.webContents.send("wpt_connect", store.wpt.connect)
			if (store.wpt.infos) {
				store.windows.container.current.webContents.send("request_wpt.done", 'infos', store.wpt.infos)

			}
			if (store.wpt.plugins) {
				store.windows.container.current.webContents.send("request_wpt.done", 'plugins', store.wpt.plugins)
			}

			if (store.finish) {
				store.windows.container.current.webContents.send("ready", true)
			}

		} else if (who === 'loader' && store.windows.loader.current && count === 0) {

			if (store.windows.container.current) {
				store.windows.container.current.webContents.send("user_path", store.infos.user_path)
			}
			count++
			try {

				if (store.windows.loader.current && !store.windows.loader.current.isVisible() && !store.windows.loader.current.isDestroyed()) {
					store.windows.loader.current.show()

					const name = store.conf && store.conf.title ? store.conf.title : store.infos.name

					store.windows.loader.current.webContents.send("loader.action", "initialize")
					store.windows.loader.current.webContents.send("app_infos", { version: store.infos.version, name: name })

					if (store.debug) {
						openLoaderDevTools(store)
					}
				}
				await initialize({ conf: store.conf || store.path.conf, version: store.infos.version }, initCallback)


				if (store.conf && store.conf.extensions) {
					for (const name in store.conf.extensions) {
						const extPath = path.resolve(
							store.conf.extensions[name]
						)
						await session.defaultSession.loadExtension(extPath, { allowFileAccess: true })
					}
				}
			}
			catch (err) {
				showDialogError(store, err)
			}
		}
	})

	ipcMain.on('child.action', (event, action, ...others) => {
		switch (action) {
			case 'log':
				let level = "INFO"
				if (others.length >= 2) {
					level = others.shift()
					if (["INFO", "DEBUG", "ERROR"].indexOf(level) < 0) {
						level = 'INFO'
					}
				}
				switch (level) {
					case 'DEBUG':
						store.appLog && store.appLog.debug(...others)
						break;
					case 'ERROR':
						store.appLog && store.appLog.error(...others)
						break;
					case 'INFO':
						store.appLog && store.appLog.info(...others)
						break;
					default:
						store.appLog && store.appLog.default(...others)
						break;
				}
				if (store.conf && store.conf.central && store.conf.central.log && hasLevel(store.conf.central.log, level)) {
					const timestamp = Date.now()
					const messageContainer = {
						message: {
							id: timestamp,
							event: "log",
							type: "PUSH",
							data: {
								type: level.toLowerCase(),
								message: others[0]
							}
						}
					}
					if (store.wpt && store.wpt.socket) {
						store.wpt.socket.emit("central.message", messageContainer)
					}

				}
				break;

			case 'central.register':
				store.infos.app_versions = others[0]
				store.central.ready = true

				if (store.wpt.socket && store.conf && store.conf.central && store.conf.central.enable &&
					store.conf.central.mode === 'MANUAL' &&
					store.central.status === "READY" &&
					!store.central.registered &&
					!store.central.registering) {
					const register = {
						name: store.infos.name,
						url: store.conf.http && store.conf.http.enable ? `http://localhost:${store.conf.http.port}` : null,
						version: store.infos.version,
						stack: store.infos.stack,
						app_versions: store.infos.app_versions
					}
					store.wpt.socket.emit("central.register", register)
				}
				break
			default:
				break;
		}
	})

	ipcMain.on('request_wpt', async (event, action, ...datas) => {
		if (store.wpt.socket) {

			let err = null
			if (action.indexOf("fastprinter") === 0) {
				await checkWptPlugin(store.wpt.socket, 'FastPrinter')
			}

			if (err) {
				if (store.windows.container.current) {
					store.windows.container.current.webContents.send("request_wpt.error", action, err)
				} else {
					const notification = {
						title: err.api_code || err.code || "An error as occured",
						body: err.message
					}
					new Notification(notification).show()
				}
			}

			requestWPT(store.wpt.socket, { emit: action, datas: datas }).then((data) => {
				store.windows.container.current.webContents.send("request_wpt.done", action, data)
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

	ipcMain.on('main.action', async (event, action, other) => {
		log.info(`[ACTION] > ${action} received`)
		if (!action) {
			return
		}
		if (store.windows.loader.current && !store.windows.loader.current.isDestroyed() && ['close', 'reload'].includes(action)) {
			store.windows.loader.current.show()
			store.windows.loader.current.webContents.send("loader.action", action)
		}
		switch (action) {
			case 'reload':
				await reinitialize(store, initCallback, { keep_wpt: true, keep_http: false })
				if (other) {
					await clearCache()
				}
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
						return plugin.name.toLowerCase() === 'fastprinter'
					})

					const cashdrawer = store.wpt.plugins.find((plugin) => {
						return plugin.name.toLowerCase() === 'cashdrawer'
					})

					if (fastprinter && fastprinter.enabled) {
						try {
							await requestWPT(store.wpt.socket, { emit: 'fastprinter.cashdrawer', datas: null }, 3)
							log.info(`[ACTION] > ${action} : fastprinter.cashdrawer sent`)

						} catch (err) {
							log.error(`[ACTION] > ${action} : fastprinter.cashdrawer sent error, ${err}`)
						}
						log.info(`[ACTION] > ${action} : fastprinter.cashdrawer sent`)
					} else if (fastprinter && !fastprinter.enabled) {
						log.debug(`[ACTION] > ${action} : fastprinter not enabled`)
					} else {
						log.debug(`[ACTION] > ${action} : fastprinter not found`)
					}
					if (cashdrawer && cashdrawer.enabled) {
						try {
							await requestWPT(store.wpt.socket, { emit: 'cashdrawer.open', datas: null }, 3)
							log.info(`[ACTION] > ${action} : cashdrawer.open sent`)

						} catch (err) {
							log.error(`[ACTION] > ${action} : cashdrawer.open sent error, ${err}`)
						}
						store.wpt.socket.emit('cashdrawer.open')
						log.info(`[ACTION] > ${action} : cashdrawer.open sent`)
					} else if (cashdrawer && !cashdrawer.enabled) {
						log.debug(`[ACTION] > ${action} : cashdrawer not enabled`)
					} else {
						log.debug(`[ACTION] > ${action} : cashdrawer not found`)
					}

				} else if (!store.wpt.socket) {
					log.error(`[ACTION] > ${action} : socket not found`)

				} else if (!store.wpt.plugins) {
					log.error(`[ACTION] > ${action} : wpt.plugins not found`)
				}

				app.quit()
				break;
			case 'notification':
				if (store.current_request && store.current_request.event === "notification") {
					const messageContainer = {
						message: {
							id: store.current_request.id,
							event: store.current_request.event,
							type: other ? 'END' : 'ERROR'
						}
					}
					if (store.wpt && store.wpt.socket) {
						store.wpt.socket.emit("central.message", messageContainer)
					}
					store.current_request = null
				}
				break
			case 'open_dev_tools':
				if (store.windows.container.current && store.windows.container.current.isVisible() && !store.windows.container.current.isDestroyed()) {
					store.windows.container.current.webContents.openDevTools({ mode: "right" })
				} else if (store.windows.loader.current && store.windows.loader.current.isVisible() && !store.windows.loader.current.isDestroyed()) {
					store.windows.loader.current.webContents.openDevTools({ mode: "undocked" })
				}
				break;

			default:
				break;
		}
	})
}
