const log = require("electron-log")
const package = require("../../package.json")

module.exports = function generataInitCallback(store) {
	return function initCallback(action, data) {
		if (action === 'launch_wpt_done') {
			log.debug(`[${package.pm2.process[0].name.toUpperCase()}] > init `, action, "process.pid: " + data.pid)
		} else {
			log.debug(`[${package.pm2.process[0].name.toUpperCase()}] > init `, action, data)
		}
		if (store.windows.loader.current && store.windows.loader.current.isVisible() && !store.windows.loader.current.isDestroyed()) {
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
					store.windows.pos.current.webContents.send("conf", store.conf)
				}
				break;
			case 'get_wpt_pid_done':
				store.wpt.pid = data
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
					store.windows.pos.current.webContents.send("wpt_infos", store.wpt.infos)
				}
				break;
			case 'wpt_plugins_done':
					store.wpt.plugins = data
					if (store.windows.pos.current && store.ready) {
						store.windows.pos.current.webContents.send("wpt_plugins", store.wpt.plugins)
					}
				break;
			case 'finish':
				if (process.env.DEBUG && process.env.DEBUG === "main") {
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
