const autoUpdater = require('./auto_updater')
const downloadUpdateInstall = require("./update_download_install")
const reinitialize = require("./reinitialize")

module.exports = function onSocket(store, socket, initCallback) {
	const centralState = store.central

	socket.on("central.started", () => {
		centralState.registered = false
	})
	socket.on("central.register", () => {
		centralState.registered = true
	})
	socket.on("central.register.error", () => {
		centralState.registered = false
	})
	socket.on("central.error", () => {
		centralState.registered = false
	})

	socket.on("central.status", (status) => {
		centralState.status = status
		if (centralState.ready && status === 'READY' && !centralState.registered) {
			const register = {
				name: store.infos.name,
				url: store.conf.http && store.conf.http.enable ? `http://localhost:${store.conf.http.port}` : null,
				version: store.infos.version,
				stack: store.infos.stack,
				app_versions: store.infos.app_versions
			}
			store.wpt.socket.emit("central.register", register)
		}
	})

	socket.on("central.message", (request) => {
		if (request.event === "update" && request.type === "REQUEST" && store.conf.update.enable) {
			const onLog = (data) => {
				try {
					data = JSON.parse(data.toString())
				}
				catch (err) {
					data = data.toString()
				}
				const message = {
					message: {
						id: request.id,
						event: request.event,
						type: 'DATA',
						data: data
					}
				}
				socket.emit("central.message", message)
			}

			if (autoUpdater.logger) {
				autoUpdater.logger.on("data", onLog)
			}

			// TODO "show_loader", 'update', 'start')

			const params = {
				...store.conf.publish,
				...request.data
			}
			downloadUpdateInstall(params, callback).then(() => {
				const message = {
					message: {
						id: request.id,
						event: request.event,
						type: 'END',
						data: null
					}
				}
				socket.emit("central.message", message)
			})
				.catch((err) => {

					const message = {
						message: {
							id: request.id,
							event: request.event,
							type: 'ERROR',
							data: err.message
						}
					}

					socket.emit("central.message", message)
				})
				.finally(() => {
					if (autoUpdater.logger) {
						autoUpdater.logger.removeListener("data", onLog)
					}
					// TODO "show_loader", 'update', 'end')
				})
		} else {
			let ignored = true
			switch (request.event) {
				case 'notification':
					callback('action.notification', request.data)
					ignored = false
					break;
				case 'reload':
					reinitialize(store, initCallback, {keep_socket_connection: true}).then(() => {
						// issue: reintialize will kill socket connection
						const message = {
							message: {
								id: request.id,
								event: request.event,
								type: 'END',
								data: null
							}
						}
						socket.emit("central.message", message)
					}).catch((err) => {
						// issue: reintialize will kill socket connection
						const message = {
							message: {
								id: request.id,
								event: request.event,
								type: 'ERROR',
								data: err.message
							}
						}
						socket.emit("central.message", message)
					})
					ignored = true
					break;

				default:
					break;
			}

			if (!ignored && request.type === "REQUEST") {
				const message = {
					message: {
						id: request.id,
						event: request.event,
						type: 'END',
						data: null
					}
				}
				socket.emit("central.message", message)
			}
		}
	})
}
