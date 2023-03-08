const { webFrame } = require('electron')
const showDialogError = require("../dialog_err")
const initialize = require('./initialize')
const closeHttp = require('./close_http')

module.exports = async function reinitialize(store, initCallback, opts) {

	if (!opts) {
		opts = {}
	}

	if (webFrame) {
		webFrame.clearCache()
	}

	if (store.wpt.socket && !opts.keep_socket_connection) {
		store.wpt.socket.destroy()
		store.wpt.socket.close()
	}

	if (store.http && !opts.keep_http) {
		const isClosed = await closeHttp(store.http)
		if (isClosed) {
			store.http = null
		}
	}

	if (store.windows.container.current) {
		store.windows.container.current.reload()
	}

	try {
		await initialize({ conf: store.path.conf, wpt_version: store.wpt.version, infos: store.infos }, initCallback, opts)
		// if (store.wpt.socket) {
		// 	store.wpt.socket.emit("central.custom", '@cdm/wynd-desktop', 'connected', store.version)
		// }
	}
	catch (err) {
		showDialogError(store, err)
	}
}
