const io = require('socket.io-client')

const killWpt = require('../helpers/kill_wpt')

const restartWpt = require('./reload_wpt')

module.exports = function nodeIpcConnect(store, callback, logger) {

	const name = store.infos.name
	const version = store.infos.version


	let port = process.env.API_UPDATER_PORT ? Number.parseInt(process.env.API_UPDATER_PORT, 10) : 3001
	if (Number.isNaN(port)) {
		port = 3001
	}
	const url = `http://localhost:${port}`
	logger.info("[IPC] > Server url " + url)
	const socket = io(url, {
		autoConnect: false,
		rejectUnauthorized: false,
		reconnection: true,
		transports: ["websocket"]
	});

	return new Promise((resolve, reject) => {

		socket.on(
			'register',
			(data) => {
				logger.info("[IPC] > register to " + JSON.stringify(data))
				socket.emit('register', {
					name: name,
					version: version
				})
			}
		)

		socket.on(
			'request',
			function (request) {
				if (typeof request === 'object' && request.event && request.id) {
					logger.info(`[IPC] > request id=${request.id}" ${JSON.stringify(request)}`)
					switch (request.event) {
						case 'wpt.kill':
							killWpt(store.wpt, callback).then((data) => {
								logger.info(`[IPC] > response id=${request.id}" ${JSON.stringify(data)}`)
								const response = {
									id: request.id,
									code: 200,
									event: request.event,
									datas: {
										success: true,
										err: null
									}
								}
								socket.emit('response', response)

							}).catch((err) => {
								logger.info(`[IPC] > response error id=${request.id}" ${JSON.stringify(err)}`)
								const response = {
									id: request.id,
									code: err.code || 400,
									event: request.event,
									datas: err.format ? err.format() : err
								}
								socket.emit('response', response)
							})
							break;
						case 'wpt.restart':
							if (request.datas && request.datas.path) {
								store.conf.wpt.path = request.datas.path
							}
							restartWpt(store.wpt, store.conf.wpt, callback).then((data) => {
								logger.info(`[IPC] > response id=${request.id}" ${JSON.stringify(data)}`)
								const response = {
									id: request.id,
									code: 200,
									event: request.event,
									datas: data
								}
								socket.emit('response', response)

							}).catch((err) => {
								logger.info(`[IPC] > response error id=${request.id}" ${JSON.stringify(err)}`)
								const response = {
									id: request.id,
									code: err.code || 400,
									event: request.event,
									datas: err.format ? err.format() : err
								}
								socket.emit('response', response)
							})
							break;
						case 'status':

						const centralState = store.central
						const datas = {
							version: store.infos.version,
							wpt: {
								connected: store.wpt.connect,
								version: store.wpt.version,
								pid: store.wpt.pid
							},
							central: {
								pending_messages: centralState.pending_messages,
								registered: centralState.registered,
								status:centralState.status,
								registering: centralState.registering
							}
						}
							const response = {
								id: request.id,
								code: 200,
								event: request.event,
								datas,
							}
							socket.emit('response', response)
							break

						default:
							break;
					}
				}
			})

		socket.connect()
		return resolve()
	})
}
