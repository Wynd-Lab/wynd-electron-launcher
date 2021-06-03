const log = require("electron-log")

const package = require("../../package.json")

module.exports = function generataInitCallback(store) {
	return function initCallback(action, data) {
		if (action === 'launch_wpt_done') {
			log.debug(`[${package.pm2.process[0].name.toUpperCase()}] > init `, action, "process.pid: " + data.pid)
		} else {
			log.debug(`[${package.pm2.process[0].name.toUpperCase()}] > init `, action, data)
		}
		if (
			store.windows.loader.current &&
			store.windows.loader.current.isVisible() &&
			!store.windows.loader.current.isDestroyed() &&
			['download_progress', "get_wpt_pid_done"].indexOf(action) < 0
			) {
			store.windows.loader.current.webContents.send("current_status", action)
		}
		switch (action) {
			case 'get_screens_done':
				store.screens = data
				if (store.windows.pos.current && store.ready) {
					store.windows.pos.current.webContents.send("screens", store.screens)
				}
				break;
			case 'check_conf_done':
				store.conf = data
				if (store.windows.pos.current && store.ready) {
					store.windows.pos.current.webContents.send("conf", data)
				}
				if (store.choosen_screen && data.screen && store.choosen_screen !== data.screen) {
					store.choosen_screen = data.screen
					store.windows.loader.setPosition(store.choosen_screen.x + store.choosen_screen.width / 2 - store.windows.loader.width / 2,
																						store.choosen_screen.y + store.choosen_screen.height / 2 - store.windows.loader.height / 2)
					store.windows.pos.setPosition(store.choosen_screen.x + store.choosen_screen.width / 2 - store.windows.loader.width / 2,
						store.choosen_screen.y + store.choosen_screen.height / 2 - store.windows.loader.height / 2)
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
			case 'wpt_connect_done':
				store.wpt.connect = data
				if (store.windows.pos.current && store.ready) {
					store.windows.pos.current.webContents.send("wpt_connect", store.wpt.connect)
				}
				break;
			case 'wpt_infos_done':
				store.wpt.infos = data
				if (store.windows.pos.current && store.ready) {
					store.windows.pos.current.webContents.send("request_wpt.done", 'infos', store.wpt.infos)
				}
				break;
			case 'wpt_plugins_done':
					store.wpt.plugins = data
					if (store.windows.pos.current && store.ready) {
						store.windows.pos.current.webContents.send("request_wpt.done", 'plugins', store.wpt.plugins)
					}
				break;
			case 'download_progress':
				if (store.windows.loader.current && store.windows.loader.current.isVisible() && !store.windows.loader.current.isDestroyed()) {
					store.windows.loader.current.webContents.send("download_progress", data.percent)
				}
				break
			case 'finish':
				if (process.env.DEBUG && process.env.DEBUG.indexOf("main") >= 0) {
					break
				}
				store.windows.pos.current.webContents.send("ready", true)
				!!store.windows.pos.current && !store.windows.pos.current.isVisible() && store.windows.pos.current.show()
				!!store.windows.pos.current && !store.windows.pos.current.isFullScreen() && store.windows.pos.current.setFullScreen(true)
				!!store.windows.loader.current && store.windows.loader.current.isVisible() && store.windows.loader.current.hide()

				break;

			default:
				break;
		}
	}
}
