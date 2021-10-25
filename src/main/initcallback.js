const url = require('url')
const path = require('path')
const log = require("electron-log")

const package = require("../../package.json")
const CustomError = require("../helpers/custom_error")
const choose_screen = require('./helpers/choose_screen')

const checkWptPlugin = require('./helpers/check_wpt_plugin')
const requestWpt = require('./helpers/request_wpt')


module.exports = function generataInitCallback(store) {
	return function initCallback(action, data, data2) {
		if (action === 'launch_wpt_done') {
			log.debug(`[${package.pm2.process[0].name.toUpperCase()}] > init `, action, "process.pid: " + data.pid)
		} else 	if (action === 'create_http_done') {
			log.debug(`[${package.pm2.process[0].name.toUpperCase()}] > init `, action)
		} else {
			log.debug(`[${package.pm2.process[0].name.toUpperCase()}] > init `, action, data)
		}

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
			['download_progress', "get_wpt_pid_done", "show_loader"].indexOf(action) < 0
		) {
			if (data && (data instanceof CustomError || data instanceof Error)) {
				store.windows.loader.current.webContents.send("current_status", action, { api_code: data.api_code || data.code, status: data.status, message: data.message})
			} else {
				store.windows.loader.current.webContents.send("current_status", action)
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

				if (store.conf && !store.conf.http.enable) {

					if (store.conf.raw) {
						if (store.conf.url.protocol === 'file') {
							const containerFile = url.format({
								pathname: path.join(store.conf.url.href, 'index.html'),
								protocol:'file',
								slashes: true
							})
							store.windows.container.current.loadURL(containerFile)

						} else {
							store.windows.container.current.loadURL(store.conf.url.href)
						}

					} else {
						const containerFile = url.format({
							pathname: path.join(__dirname, '..', 'container', 'assets', 'index.html'),
							protocol:'file',
							slashes: true
						})
						store.windows.container.current.loadURL(containerFile)
					}
				}
				if (store.windows.container.current && store.ready) {
					store.windows.container.current.webContents.send("conf", data)
				}
				if (store.choosen_screen && store.choosen_screen.id !== null && data.screen !== null && store.choosen_screen.id !== data.screen) {
					let choosenSreen = choose_screen(data.screen, store.screens)
					log.warn(`[${package.pm2.process[0].name.toUpperCase()}] > config.screen not exist. It will be set to 0`)
					if (!choosenSreen) {
						choosenSreen = choose_screen(0, store.screens)
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
			case 'launch_wpt_done':
				store.wpt.process = data
				if (!store.wpt.pid) {
					store.wpt.pid = process.pid
				}
				break;
			case 'wpt_connect':
				store.wpt.socket = data
				break;
			case 'wpt_connect_done':
				store.wpt.connect = data
				if (store.wpt.socket && data) {

					checkWptPlugin(store.wpt.socket, 'Central').then(() => {
						return requestWpt(store.wpt.socket, { emit: 'central.client.register', datas: [store.name, store.infos] })
					})
					.catch((silentErr) => {
						log.debug(silentErr)
					})
				}
				if (store.windows.container.current && store.ready) {
					store.windows.container.current.webContents.send("wpt_connect", store.wpt.connect)
				}
				break;
			case 'wpt_infos_done':
				store.wpt.infos = data
				if (store.windows.container.current && store.ready) {
					store.windows.container.current.webContents.send("request_wpt.done", 'infos', store.wpt.infos)
				}
				break;
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
			// case 'update_error':
			// 	if (!store.windows.loader.current && store.windows.loader.current.isVisible()) {
			// 		store.windows.loader.current.webContents.send("error", data)
			// 	}
			// 	break
			case 'create_http_done':
				store.http = data
				if (store.conf && store.conf.http.enable ) {
					const containerFile = url.format({
						pathname: store.conf.raw ? path.join(`localhost:${store.conf.http.port}`, 'index.html'): path.join(`localhost:${store.conf.http.port}`, 'container', 'index.html'),
						protocol: 'http',
						slashes: true
					})
					store.windows.container.current.loadURL(containerFile)
				}
				break
			case 'finish':
				if (process.env.DEV && process.env.DEV === "LOADER") {
					break
				}
				store.finish = true
				store.windows.container.current.webContents.send("ready", true)
				!!store.windows.container.current && !store.windows.container.current.isVisible() && store.windows.container.current.show()
				!!store.windows.container.current && !store.windows.container.current.isFullScreen() && store.windows.container.current.setFullScreen(true)
				!!store.windows.container.current && !store.windows.container.current.isFullScreen() && store.windows.container.current.setKiosk(true)
				!!store.windows.loader.current && store.windows.loader.current.isVisible() && store.windows.loader.current.hide()

				if (process.env.DEBUG) {
					store.windows.container.current.webContents.openDevTools()
				} else {
					store.windows.container.current.webContents.closeDevTools()
				}
				break;
			case 'action.notification':
				if (store.windows.container.current && store.ready) {
					store.windows.container.current.webContents.send("notification", data)
				}
				break;

			default:
				break;
		}
	}
}
