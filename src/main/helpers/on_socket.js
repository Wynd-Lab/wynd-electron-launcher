const ini = require('ini')

const autoUpdater = require('./auto_updater')
const CustomError = require("../../helpers/custom_error")
const downloadUpdateInstall = require("./update_download_install")
const reinitialize = require("./reinitialize")
const getConfig = require('./config/get_config')
const setConfig = require('./config/set_config')
const log = require("./electron_log")
const requestWPT = require("./request_wpt")
const restartWPT = require("./reload_wpt")
const getCentralRegister = require('./get_central_register')
const checkConfig = require('./config/check_config')
const requestContainer = require('./request_container')

module.exports = function onSocket(store, socket, initCallback) {
	socket.removeAllListeners()


	const tryToRegister = (centralState) => {
		if (centralState.ready && centralState.status === 'READY' && !centralState.registered && !centralState.registering) {
			if (centralState.timeoutRegister) {
				clearTimeout(timeoutRegister)
				centralState.timeoutRegister = null
			}
			const register = getCentralRegister(store)
			centralState.registering = true
			store.wpt.socket.emit("central.register", register)

			log.info(
				`[CENTRAL] > try to register name=${register.name} version=${register.version} versions=${JSON.stringify(
					register.app_versions,
				)}`,
			)

		}
	}
	const sendToContainer = (eventPrefix, status) => {
		if (initCallback) {
			initCallback('wpt_plugin_state.update', eventPrefix, status)
		}

	}
	const config = store.conf
	if (config.display_plugin_state && config.display_plugin_state.enable) {

		store.wpt.plugins_state = {}
		for (const eventPrefix in config.display_plugin_state) {

			if (eventPrefix !== 'enable' && !eventPrefix.startsWith('_')) {

				store.wpt.plugins_state[eventPrefix] = { name: config.display_plugin_state[eventPrefix], status: 'offline' }

				if (eventPrefix === 'universalterminal') {
					socket.on(eventPrefix + '.started', (init) => {
						sendToContainer(eventPrefix, init ? 'online' : 'offline')

					})
					socket.on(eventPrefix + '.initialized', () => {
						sendToContainer(eventPrefix, 'online')
					})
					socket.on(eventPrefix + '.ended', () => {
						sendToContainer(eventPrefix, 'offline')
					})
				} else {
					socket.on(eventPrefix + '.started', () => {
						sendToContainer(eventPrefix, 'online')
					})
					socket.on(eventPrefix + '.ended', () => {
						sendToContainer(eventPrefix, 'offline')
					})
				}
			}
		}
	}

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

	socket.on("central.started", (connect1, connect2) => {
		centralState.registered = false
		if (initCallback && store.wpt.plugins_state.central) {
			sendToContainer('central', connect1 && connect2 ? 'initializing' : "offline")
		}
	})

	socket.on("central.ended", () => {
		centralState.registered = false
		if (initCallback && store.wpt.plugins_state.central) {
			sendToContainer('central', "offline")
		}
	})

	socket.on("central.register", (data) => {
		centralState.registered = true
		centralState.registering = false
		if (centralState.timeoutRegister) {
			clearTimeout(timeoutRegister)
			centralState.timeoutRegister = null
		}
		if (initCallback && store.wpt.plugins_state.central) {
			sendToContainer('central', 'online')
		}
		log.info(`[CENTRAL] > Registered ${data}`)

		if (centralState.pending_messages && centralState.pending_messages.length > 0) {
			while (centralState.pending_messages.length > 0) {
				const messageToSend = centralState.pending_messages.shift()
				setTimeout(() => {
					socket.emit('central.message', messageToSend)
					log.info(`[CENTRAL] > message pended to send ${JSON.stringify(messageToSend)}`)
				})
			}
		}
	})

	socket.on('central.register.ask', () => {
		centralState.registered = false
		centralState.registering = false
		tryToRegister(centralState)
	})

	socket.on("central.register.error", (err) => {
		centralState.registered = false
		centralState.registering = false
		if (!centralState.timeoutRegister) {
			central.timeoutRegister = setTimeout(() => {
				tryToRegister(centralState)
			}, 10 * 1000)
		}
		if (initCallback && store.wpt.plugins_state.central) {
			sendToContainer('central', 'offline')
		}
		if (!err.datas) {
			err.datas = {}
		}
		err.datas.internal_state = centralState
		log.error(`[CENTRAL] > Registered error ${err}`)


	})
	socket.on("central.error", (err) => {
		centralState.registered = false
		centralState.registering = false
		if (!err.datas) {
			err.datas = {}
		}
		err.datas.internal_state = centralState
		log.error(`[CENTRAL] > error ${JSON.stringify(err)}`)

	})

	socket.on("central.status", (status) => {
		centralState.status = status

		tryToRegister(centralState)
		if (initCallback && store.wpt.plugins_state.central && centralState.registering) {
			sendToContainer('central', 'initializing')
		} else if (initCallback && store.wpt.plugins_state.central) {
			sendToContainer('central', centralState.registered && status === "READY" ? 'online' : centralState.registered ? "initializing" : "offline")
		}

	})

	socket.on("central.message", (request) => {
		if (request.event === "update" && request.type === "REQUEST" && !store.conf.update.enable) {
			const err = new CustomError(400, CustomError.CODE.INVALID_PARAMETER_VALUE, 'update.enable is false')
			const message = {
				id: request.id,
				event: request.event,
				type: 'ERROR',
				data: err
			}
			sendMessage(message)
		} else if (request.event === "update" && request.type === "REQUEST" && store.conf.update.enable) {
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
					getConfig(store.path.conf, "string").then(conf => {
						const message = {
							id: request.id,
							event: request.event,
							_ignore_logs: true,
							type: 'DATA',
							data: conf
						}
						sendMessage(message)
						message.meta = {
							file: "config.ini",
							type: "file",
							update: {
								url: 'config/update'
							}
						}
						message.type = 'END'
						message.data = null
						setTimeout(() => {
							sendMessage(message)
						})
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
				case 'container.state':
					messageRunning = false
					requestContainer(store, 'get.state').then(() => {
						const message2 = {
							id: request.id,
							event: request.event,
							meta: {
								file: "container.state.json",
								type: "json",
							},
							type: 'END',
							data: store.windows.container.state
						}
						sendMessage(message2)
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
						meta: {
							file: "store.json",
							type: "json",
						},
						type: 'END',
						data: storeToSend
					}
					sendMessage(message2)

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
						catch (err) {
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
