const autoUpdater = require('./auto_updater')
const downloadUpdateInstall = require("./update_download_install")
const reinitialize = require("./reinitialize")
const getConfig = require('./get_config')
const setConfig = require('./set_config')
const log = require("./electron_log")

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
			downloadUpdateInstall(params, initCallback).then(() => {
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
		} else if (request.event && request.type === "REQUEST" ) {
			let ignored = true
			let messageRunning = null
			log.info(`[Central] > request event ${request.event}, data : ${request.data}`)
			switch (request.event) {
				case 'notification':
					initCallback('action.notification', request.data)
					if (request.data && request.data.confirm) {
						store.current_request = request
						const message = {
							message: {
								id: request.id,
								event: request.event,
								type: 'DATA',
								data: null
							}
						}
						socket.emit("central.message", message)
						ignored = true
					} else {
						ignored = false
					}
					break;
				case 'reload':
					reinitialize(store, initCallback, { keep_socket_connection: true }).then(() => {
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
					messageRunning = true
					break;
				case 'config.get':
					messageRunning = true
					getConfig(store.path.conf, true).then(conf => {
						const message = {
							message: {
								id: request.id,
								event: request.event,
								type: 'END',
								data: conf
							}
						}
						socket.emit("central.message", message)
					}).catch(() => {
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

					break;
				case 'config.set':
					messageRunning = true
					let data = null
					if (request.data && typeof request.data === "string") {
						data = request.data
					} else if (request.data && typeof request.data === "object" && request.data.type && request.data.type === 'base64') {
						const tmp = Buffer.from(request.data.content, 'base64')
						data = tmp.toString()
					}

					if (data) {
						setConfig(store.path.conf, data).then(conf => {
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
					} else {
						const message = {
							message: {
								id: request.id,
								event: request.event,
								type: 'ERROR',
								data: 'request data could not be parse correctly'
							}
						}
						socket.emit("central.message", message)
					}

					break;

				case 'config.get':
					messageRunning = true
					getConfig(store.path.conf).then((data) => {
						const message = {
							message: {
								id: request.id,
								event: request.event,
								type: 'END',
								data: data
							}
						}
						socket.emit("central.message", message)
					}).catch((err) => {
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
					break;
				case 'config.set':
					messageRunning = true
					setConfig(store.path.conf).then((data) => {
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
					break;
				default:
					const message = {
						message: {
							id: request.id,
							event: request.event,
							type: 'ERROR',
							data: `event ${request.event} not found`
						}
					}
					socket.emit("central.message", message)
					ignored = true
					break;
			}

			if (messageRunning) {
				const tmpMessage = {
					message: {
						id: request.id,
						event: request.event,
						type: 'DATA',
						data:  null
					}
				}
				socket.emit("central.message", tmpMessage)
				ignored = true
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
