const url = require('url')
const path = require('path')
const log = require("./helpers/electron_log")

const CustomError = require("../helpers/custom_error")
const chooseScreen = require('./helpers/choose_screen')
const onSocket = require("./helpers/on_socket")
const sendOnReady = require("./helpers/send_on_ready")
const clearCache = require('./helpers/clear_cache')
const getCentralRegister = require('./helpers/get_central_register')

module.exports = function generataInitCallback(store) {

	const loadURL = (url) => {
		if (store.conf.proxy.enable) {
			store.windows.container.current.webContents.session.setProxy({ proxyRules: store.conf.proxy.url.href }).then(() => {
				store.windows.container.current.loadURL(url);
			})
		} else {
			store.windows.container.current.loadURL(url)
		}
	}
	return function initCallback(action, data, data2) {
		if (
			store.windows.loader.current &&
			!store.windows.loader.current.isVisible() &&
			action === 'show_loader' && data2 === "start"
		) {
			store.windows.loader.current.show()
			store.windows.loader.current.webContents.send("loader.action", data)
		} else if (
			store.windows.loader.current &&
			store.windows.loader.current.isVisible() &&
			store.windows.container.current &&
			store.windows.container.current.isVisible() &&
			action === 'show_loader' && data2 === "end"
		) {
			store.windows.loader.current.hide()
		} else if (
			store.windows.loader.current &&
			store.windows.loader.current.isVisible() &&
			!store.windows.loader.current.isDestroyed() &&
			['download_progress', "get_wpt_pid_done", "show_loader", "wpt_version_done", 'wpt_ipc_datas'].indexOf(action) < 0
		) {
			if (data && (data instanceof CustomError || data instanceof Error)) {
				store.windows.loader.current.webContents.send("current_status", action, { api_code: data.api_code || data.code, status: data.status, message: data.message })
			} else if (action === 'create_wpt_done') {
				store.windows.loader.current.webContents.send("current_status", action, null)
			} else if (action === 'wpt_connect') {
				store.windows.loader.current.webContents.send("current_status", action, null)
			} else if (action === 'create_http_done') {
				store.windows.loader.current.webContents.send("current_status", action, null)
			} else {
				store.windows.loader.current.webContents.send("current_status", action, data)
			}
		}
		switch (action) {
			case 'get_screens_done':
				store.screens = data
				if (store.windows.container.current && store.ready) {
					store.windows.container.current.webContents.send("screens", store.screens)
				}
				break;
			case 'check_conf_done':
				store.conf = data
				if (store.conf.central && store.conf.central.enable && store.conf.central.mode === "AUTO") {
					if (store.central.status === 'READY' && !store.central.registered && !store.central.registering) {
						const register = getCentralRegister(store)

						store.wpt.socket.emit("central.register", register)
					}
					store.central.ready = true
				} else if (store.conf.central && store.conf.central.enable && store.conf.central.mode !== "AUTO") {
					store.central.ready = false
				}

				if (store.conf && store.conf.clear_cache_on_start) {
					clearCache()
				}
				if (store.conf && !store.conf.http.enable) {

					if (store.conf.raw) {
						if (store.conf.url.protocol === 'file') {
							const containerFile = url.format({
								pathname: path.join(store.conf.url.href, 'index.html'),
								protocol: 'file',
								slashes: true
							})
							loadURL(containerFile)
						} else {
							loadURL(store.conf.url.href)
						}

					} else {
						const containerFile = url.format({
							pathname: path.join(__dirname, '..', 'container', 'assets', 'index.html'),
							protocol: 'file',
							slashes: true
						})
						loadURL(containerFile)
					}
				}

				if (store.conf.log && store.conf.log.main) {
					log.level = store.conf.log.main
					// log.transports.console.level = store.conf.log.main
				}

				if (store.conf.log.app && store.appLog) {
					store.appLog.level = store.conf.log.app
					// store.appLog.transports.console.level = store.conf.log.app
				}

				sendOnReady(store)

				if (store.choosen_screen && store.choosen_screen.id !== null && data.screen !== null && store.choosen_screen.id !== data.screen) {
					let choosenSreen = chooseScreen(data.screen, store.screens)
					log.warn(`[INIT] > check_conf_done  config.screen not exist. It will be set to 0`)
					if (!choosenSreen) {
						choosenSreen = chooseScreen(0, store.screens)
					}
					store.choosen_screen = choosenSreen
					if (store.windows.loader.current) {
						store.windows.loader.current.setPosition(choosenSreen.x + choosenSreen.width / 2 - store.windows.loader.width / 2,
							choosenSreen.y + choosenSreen.height / 2 - store.windows.loader.height / 2)
					}
					if (store.windows.container.current) {
						store.windows.container.current.setPosition(choosenSreen.x + choosenSreen.width / 2 - store.windows.loader.width / 2,
							choosenSreen.y + choosenSreen.height / 2 - store.windows.loader.height / 2)
					}
				}

				break;
			case 'get_wpt_pid_done':
				store.wpt.pid = data
				store.windows.loader.current.webContents.send("current_status", action, data)
				break;
			case 'wpt_ipc_datas':
				store.wpt.ipc = data
				break;
			case 'create_wpt_done':
				store.wpt.process = data

				const wptVersion = store.wpt.ipc && store.wpt.ipc.version || store.wpt && store.wpt.version || null
				if (wptVersion) {
					if (!store.infos.app_versions) {
						store.infos.app_versions = {
							wpt: wptVersion
						}
					} else {
						store.infos.app_versions.wpt = wptVersion
					}
				}
				if (store.conf && store.conf.wpt && store.conf.wpt.keep_listeners && data.stdout) {
					data.stdout.on("data", () => {
						//
					})
				}
				data.once("exit", () => {
					store.wpt.process = null
					store.wpt.pid = null
					if (store.infos.app_versions && store.infos.app_versions.wpt) {
						store.infos.app_versions.wpt = undefined
					}
				})
				if (!store.wpt.pid) {
					store.wpt.pid = process.pid
				}
				break;
			case 'wpt_connect':

			if (data) {

					if (store.wpt.socket) {
						store.wpt.socket.destroy()
						store.wpt.socket.removeAllListeners()
						store.wpt.socket.close()
						store.central.registered = false
						store.central.registering = false
					}
					store.wpt.socket = data

					const innerCallback = (action, data, data2) => {
						initCallback(action, data, data2)
					}
					if (store.conf && store.conf.central.enable) {
						onSocket(store, store.wpt.socket, innerCallback)
					}
				}
				break;
			case 'wpt_kill':
				store.central.status === 'DISCONNECTED'
				store.central.registered = false
				store.central.registering = false
				break
			case 'wpt_connect_done':
				store.wpt.connect = data
				if (store.windows.container.current && store.ready) {
					store.windows.container.current.webContents.send("wpt_connect", store.wpt.connect)
				}
				break;
			case 'wpt_version_done':
				store.wpt.version = data

				if (!store.infos.app_versions) {
					store.infos.app_versions = {
						wpt: store.wpt.version
					}
				} else if (!store.infos.app_versions.wpt || !store.infos.app_versions.wpt !== store.wpt.version) {
					store.infos.app_versions.wpt = store.wpt.version
				}
				break
			case 'wpt_infos_done':
				store.wpt.infos = data

				break;
			case 'wpt_plugin_state.update':
				if (store.wpt.plugins_state[data]) {
					store.wpt.plugins_state[data].status = data2
				}
				if (store.windows.container.current && store.ready) {
					store.windows.container.current.webContents.send('wpt_plugin_state.update', data, data2)
				}
				break
			case 'REQUEST_WPT_done':
				store.wpt.plugins = data

				if (store.windows.container.current && store.ready) {
					store.windows.container.current.webContents.send("request_wpt.done", 'plugins', store.wpt.plugins)
				}
				break;
			case 'download_progress':
				if (store.windows.loader.current && store.windows.loader.current.isVisible() && !store.windows.loader.current.isDestroyed()) {
					store.windows.loader.current.webContents.send("download_progress", data.percent)
				}
				break

				case 'create_http_done':
				store.http = data
				if (store.conf && store.conf.http.enable) {
					const containerFile = url.format({
						pathname: store.conf.raw ? path.join(`localhost:${store.conf.http.port}`, 'index.html') : path.join(`localhost:${store.conf.http.port}`, 'container', 'index.html'),
						protocol: 'http',
						slashes: true
					})
					loadURL(containerFile)
				}
				break
			case 'finish':
				if (process.env.DEV && process.env.DEV === "LOADER") {
					break
				}
				store.finish = true
				store.windows.container.current.webContents.send("ready", true)
				!!store.windows.container.current && !store.windows.container.current.isVisible() && store.windows.container.current.show()
				if (store.conf.kiosk) {
					!!store.windows.container.current && !store.windows.container.current.isFullScreen() && store.windows.container.current.setKiosk(true)
				}
				if (store.conf.full_screen) {
					!!store.windows.container.current && !store.windows.container.current.isFullScreen() && store.windows.container.current.setFullScreen(true)
				} else {
					!!store.windows.container.current && store.windows.container.current.isFullScreen() && store.windows.container.current.setFullScreen(false)
					!!store.windows.container.current && store.windows.container.current.setFullScreenable(true)
					!!store.windows.container.current && store.windows.container.current.setMovable(true)
					!!store.windows.container.current && store.windows.container.current.setResizable(true)
					!!store.windows.container.current && store.windows.container.current.center()
					!!store.windows.container.current && store.windows.container.current.maximize()
				}
				!!store.windows.loader.current && store.windows.loader.current.isVisible() && store.windows.loader.current.hide()

				break;
			case 'action.notification':
				if (store.windows.container.current && store.ready) {
					store.windows.container.current.webContents.send("notification", data)
				}
				break;

			default:
				break;
		}

		if (action === 'create_wpt_done') {
			log.debug(`[INIT] > ${action} process.pid: ${data.pid}`)
		} else if (action === 'wpt_connect') {
			log.debug(`[INIT] > ${action} ${Boolean(data)}`)
		} else if (action === 'create_http_done') {
			log.debug(`[INIT] > ${action}`)
		} else if (['get_conf', 'get_conf_done', 'check_conf', 'wpt_connect'].indexOf(action) < 0) {
			log.debug(`[INIT] > ${action} ${data && typeof data === "object" ? JSON.stringify(data) : data}`)
		}

	}
}
