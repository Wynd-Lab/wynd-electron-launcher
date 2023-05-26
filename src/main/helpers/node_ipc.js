const ipc = require('@achrinza/node-ipc').default;


const killWpt = require('../helpers/kill_wpt')

const restartWpt = require('./reload_wpt')

module.exports = function nodeIpcConnect(store, callback, logger) {

	const name = store.infos.name
	const version = store.infos.version

	return new Promise((resolve, reject) => {

		ipc.config.silent = true
		ipc.connectTo(
			'api-updater',
			function () {
				ipc.of["api-updater"].on(
					'register',
					function (data) {
						logger.info("[IPC] > connect to API Updater " + JSON.stringify(data))
						ipc.of["api-updater"].emit('register', {
							name: name,
							version: version
						})
					}
				)

				ipc.of["api-updater"].on(
					'request',
					function (request) {
						if (typeof request === 'object' && request.event && request.id) {
							logger.info(`[IPC] > API UPDATER request id=${request.id}" ${JSON.stringify(request)}`)
							switch (request.event) {
								case 'wpt.kill':
									killWpt(store.wpt, callback).then((data) => {
										logger.info(`[IPC] > API UPDATER response id=${request.id}" ${JSON.stringify(data)}`)
										const response = {
											id: request.id,
											code: 200,
											event: request.event,
											datas: {
												success: true,
												err: null
											}
										}
										ipc.of["api-updater"].emit('response', response)

									}).catch((err) => {
										logger.info(`[IPC] > API UPDATER response error id=${request.id}" ${JSON.stringify(err)}`)
										const response = {
											id: request.id,
											code: err.code || 400,
											event: request.event,
											datas: err
										}
										ipc.of["api-updater"].emit('response', response)
									})
									break;
								case 'wpt.restart':
									if (request.datas && request.datas.path) {
										store.conf.wpt.path = request.datas.path
									}
									restartWpt(store.wpt, store.conf.wpt, callback).then((data) => {
										logger.info(`[IPC] > API UPDATER response id=${request.id}" ${JSON.stringify(data)}`)
										const response = {
											id: request.id,
											code: 200,
											event: request.event,
											datas: data
										}
										ipc.of["api-updater"].emit('response', response)

									}).catch((err) => {
										logger.info(`[IPC] > API UPDATER response error id=${request.id}" ${JSON.stringify(err)}`)
										const response = {
											id: request.id,
											code: err.code || 400,
											event: request.event,
											datas: err
										}
										ipc.of["api-updater"].emit('response', response)
									})
									break;


								default:
									break;
							}
						}
					})
			}
		)
		resolve()
	})
}
