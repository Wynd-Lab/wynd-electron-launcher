const ini = require('ini')

const autoUpdater = require('./auto_updater')
const downloadUpdateInstall = require("./update_download_install")
const reinitialize = require("./reinitialize")
const getConfig = require('./get_config')
const setConfig = require('./set_config')
const log = require("./electron_log")
const requestWPT = require("./request_wpt")
const restartWPT = require("./reload_wpt")

const checkConfig = require('./check_config')


module.exports = function onSocket(store, socket, initCallback) {
	socket.removeAllListeners()

	socket.on('connect', () => {
		if (initCallback) {
			initCallback('wpt_connect_done', true)
		}
	})

	socket.on('disconnect', () => {
		centralState.registered = false
		centralState.registering = false
		if (initCallback) {
			initCallback('wpt_connect_done', false)
		}
	})

	socket.on('reconnect', () => {
		if (initCallback) {
			initCallback('wpt_connect_done', true)
		}
	})

	socket.on('reconnect_error', () => {
		if (initCallback) {
			initCallback('wpt_connect_done', false)
		}
	})

	const centralState = store.central

	const sendMessage = (message) => {
		if (!centralState.registered) {
			centralState.pending_messages.push(message)
		} else if (store.wpt.socket) {
			store.wpt.socket.emit("central.message", message)
		}
	}

	socket.on("central.started", () => {
		centralState.registered = false
	})

	socket.on("central.ended", () => {
		centralState.registered = false
	})

	socket.on("central.register", (data) => {
		centralState.registered = true
		centralState.registering = false
		log.info(`[CENTRAL] > Registered ${data}`)

		if (centralState.pending_messages && centralState.pending_messages.length > 0) {
			while (centralState.pending_messages.length > 0) {
				const messageToSend = centralState.pending_messages.shift()
				setTimeout(() => {
					socket.emit('central.message', messageToSend)
					log.info(`[CENTRAL] > message pended to send ${messageToSend}`)
				})
			}
		}
	})

	socket.on('central.register.ask', () => {
		centralState.registered = false
		centralState.registering = false
		const register = {
			name: store.infos.name,
			url: store.conf.http && store.conf.http.enable ? `http://localhost:${store.conf.http.port}` : null,
			version: store.infos.version,
			stack: store.infos.stack,
			app_versions: store.infos.app_versions,
			logs: {
				path: store.logs.app
			}
		}
		store.wpt.socket.emit("central.register", register)
		centralState.registering = true
		log.info(
			`[CENTRAL] > try to register name=${register.name} version=${register.version} versions=${JSON.stringify(
				register.app_versions,
			)}`,
		)
	})

	socket.on("central.register.error", (err) => {
		centralState.registered = false
		centralState.registering = false
		log.error(`[CENTRAL] > Registered error ${err}`)


	})
	socket.on("central.error", (err) => {
		centralState.registered = false
		centralState.registering = false
		log.error(`[CENTRAL] > error ${JSON.stringify(err)}`)

	})

	socket.on("central.status", (status) => {
		centralState.status = status
		if (centralState.ready && status === 'READY' && !centralState.registered && !centralState.registering) {
			const register = {
				name: store.infos.name,
				url: store.conf.http && store.conf.http.enable ? `http://localhost:${store.conf.http.port}` : null,
				version: store.infos.version,
				stack: store.infos.stack,
				app_versions: store.infos.app_versions,
				logs: {
					path: store.logs.app
				}
			}
			store.wpt.socket.emit("central.register", register)

			log.info(
				`[CENTRAL] > try to register name=${register.name} version=${register.version} versions=${JSON.stringify(
					register.app_versions,
				)}`,
			)

			centralState.registering = true
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
					id: request.id,
					event: request.event,
					type: 'DATA',
					data: data
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
					id: request.id,
					event: request.event,
					type: 'END',
					data: null
				}
				sendMessage(message)
			})
				.catch((err) => {

					const message = {
						id: request.id,
						event: request.event,
						type: 'ERROR',
						data: err.message
					}
					sendMessage(message)
				})
				.finally(() => {
					if (autoUpdater.logger) {
						autoUpdater.logger.removeListener("data", onLog)
					}
					// TODO "show_loader", 'update', 'end')
				})
		} else if (request.event && request.type === "REQUEST") {
			let ignored = true
			let messageRunning = null
			log.info(`[CENTRAL] > request event ${request.event}, data : ${request.data}`)
			switch (request.event) {
				case 'notification':
					initCallback('action.notification', request.data)
					if (request.data && request.data.confirm) {
						store.current_request = request
						const message = {
							id: request.id,
							event: request.event,
							type: 'DATA',
							data: null
						}
						sendMessage(message)
						ignored = true
					} else {
						ignored = false
					}
					break;
				case 'reload':
					reinitialize(store, initCallback, { keep_socket_connection: true, keep_http: true }).then(() => {
						// issue: reintialize will kill socket connection
						const message = {
							id: request.id,
							event: request.event,
							type: 'END',
							data: null
						}
						sendMessage(message)
					}).catch((err) => {
						// issue: reintialize will kill socket connection
						const message = {
							id: request.id,
							event: request.event,
							type: 'ERROR',
							data: err.message
						}
						sendMessage(message)
					})
					messageRunning = true
					break;
				case 'config':
					messageRunning = false
					getConfig(store.path.conf, true).then(conf => {
						const message = {
							id: request.id,
							event: request.event,
							meta:{
								file: "config.ini",
								type: "buffer",
								update: {
									url: 'config/update'
								}
							},
							type: 'END',
							data: conf
						}
						sendMessage(message)
					}).catch((err) => {
						const message = {
							id: request.id,
							event: request.event,
							type: 'ERROR',
							data: err.message
						}
						sendMessage(message)
					})

					break;
				case 'store':
					messageRunning = false

					const storeToSend = {
						infos: store.infos,
						wpt: {
							version: store.wpt.version,
							process: !!store.wpt.process,
							connect: store.wpt.connect,
							pid: store.wpt.pid,
							socket: !!store.wpt.socket,
							ipc: store.wpt.ipc
						},
						central: store.central,
						conf: store.conf,
						screens: store.screens,
						ready: store.ready,
						path: store.path,
						ask: store.ask,
						choosen_screen: store.choosen_screen,
						http: store.http,
						finish: store.finish,
						logs: store.logs,
						current_request: store.current_request,
						version: store.version

					}
					const message2 = {
						id: request.id,
						event: request.event,
						meta:{
							file: "store.json",
							type: "json",
						},
						type: 'END',
						data: storeToSend
					}
					try {
						sendMessage(message2)
					}
					catch(err) {
						const message = {
							id: request.id,
							event: request.event,
							type: 'ERROR',
							data: err.message
						}
						sendMessage(message)
					}
					break;
				case 'config/update':
					messageRunning = true
					let data = null
					if (request.data && typeof request.data === "string") {
						data = request.data
					} else if (request.data && typeof request.data === "object" && request.data.type && request.data.type === 'base64') {
						const tmp = Buffer.from(request.data.content, 'base64')
						data = tmp.toString()
					}

					if (data) {
						try {
							let toCheck = data
							if (typeof data === 'string') {
								toCheck = ini.parse(data)
							}
							checkConfig(toCheck, store.infos.user_path)
							setConfig(store.path.conf, data).then(() => {
								const message = {
									id: request.id,
									event: request.event,
									type: 'END',
									data: null
								}
								sendMessage(message)
							}).catch((err) => {
								//TODO see format to send to CDM
								const message = {
									id: request.id,
									event: request.event,
									type: 'ERROR',
									data: err
								}
								sendMessage(message)
							})
						}
						catch(err) {
							const message = {
								id: request.id,
								event: request.event,
								type: 'ERROR',
								data: err
							}
							sendMessage(message)
						}

					} else {
						const message = {
							id: request.id,
							event: request.event,
							type: 'ERROR',
							data: 'request data could not be parse correctly'
						}
						sendMessage(message)
					}

					break;

					case 'config/wpt':
						// request.data = require('../../../draft/wpt.json')
						messageRunning = false
						requestWPT(store.wpt.socket, { emit: 'configuration.getfile' })
							.then((data) => {
								const message = {
									id: request.id,
									event: request.event,
									meta: {
										type: "json",
										file: "wpt.json",
										update: {
											url: 'config/wpt/change'
										}
									},
									type: 'END',
									data: data
								}
								sendMessage(message)
							})
							.catch((err) => {
								const message = {
									id: request.id,
									event: request.event,
									type: 'ERROR',
									data: err.message
								}
								sendMessage(message)
							})
						break;

				case 'config/wpt/change':
					// request.data = require('../../../draft/wpt.json')
					messageRunning = true
					requestWPT(store.wpt.socket, { emit: 'configuration.changeall', datas: request.data })
						.then((data) => {
							const message = {
								id: request.id,
								event: request.event,
								type: 'END',
								data: data
							}
							sendMessage(message)
						})
						.catch((err) => {
							const message = {
								id: request.id,
								event: request.event,
								type: 'ERROR',
								data: err.message
							}
							sendMessage(message)
						})
					break;
				case 'wpt/restart':
					const wptConf = {
						...store.conf.wpt
					}
					if (request.data && typeof request.data === "object") {
						for (const key in wptConf) {
							if (Object.hasOwn(request.data, key)) {
								wptConf[key] = request.data[key]
							}
						}
					}

					restartWPT(store.wpt, wptConf, initCallback).then(conf => {
						const message = {
							id: request.id,
							event: request.event,
							type: 'END',
							data: null
						}
						sendMessage(message)
					}).catch((err) => {

						const message = {
							id: request.id,
							event: request.event,
							type: 'ERROR',
							data: err.message
						}
						sendMessage(message)
					})
				default:
					const message = {
						id: request.id,
						event: request.event,
						type: 'ERROR',
						data: `event ${request.event} not found`
					}
					ignored = true
					sendMessage(message)
					break;
			}

			if (messageRunning) {
				const tmpMessage = {
					id: request.id,
					event: request.event,
					type: 'DATA',
					data: null
				}
				sendMessage(tmpMessage)
				ignored = true
			}
			if (!ignored && request.type === "REQUEST") {
				const message = {
					id: request.id,
					event: request.event,
					type: 'END',
					data: null
				}
				sendMessage(message)
			}
		}
	})
}
