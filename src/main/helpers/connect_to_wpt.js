const io = require('socket.io-client')
const CustomError = require('../../helpers/custom_error')

module.exports = function connectToWpt(conf, wpt_url, callback) {
	let resolved = false

	let timeout = null
	let socket = null

	return new Promise((resolve, reject) => {
		const generateTimeout = () => {
			if (timeout) {
				clearTimeout(timeout)
			}
			timeout = setTimeout(() => {

				if (socket) {
					socket.removeAllListeners()
				}
				reject(new CustomError(408, CustomError.CODE.WPT_CONNECTION_TIMEOUT, `Cannot connect to Wyndpostools (url: ${wpt_url}), (timeout: ${conf.wpt.connection_timeout})`))
			}, 1000 * conf.wpt.connection_timeout)
		}

		socket = io(wpt_url, {
			autoConnect: false,
			rejectUnauthorized: false,
			reconnection: true,
			transports: ["websocket"]
		});

		if (callback) {
			callback('wpt_connect', socket)
		}
		generateTimeout()

		socket.once('version', (version) => {
			socket.wpt_version = version
			if (callback) {
				callback('wpt_version_done', version)
			}
		})

		socket.once('connect', () => {
			generateTimeout()
			// if (callback) {
			// 	console.log("wpt_connect_done 3")
			// 	callback('wpt_connect_done', true)
			// }
			setTimeout(() => {
				if (callback) {
					callback('wpt_infos')
				}
				socket.emit('infos')
			}, 300)
		})

		socket.on('disconnect', () => {
			if (timeout) {
				clearTimeout(timeout)
				timeout = null
			}
			// if (callback) {
			// 	console.log("wpt_connect_done 4")
			// 	callback('wpt_connect_done', false)
			// }
		})
		socket.once('error', (err) => {
			if (timeout) {
				clearTimeout(timeout)
				timeout = null
			}
			reject(err)
		})
		socket.once('infos', function (infos) {
			if (callback) {
				callback('wpt_infos_done', infos)
			}
			generateTimeout()
			setTimeout(() => {
				if (callback) {
					callback('plugins')
				}
				socket.emit('plugins')
			}, 300)


		});
		socket.once('plugins', function (plugins) {
			if (timeout) {
				clearTimeout(timeout)
				timeout = null
			}

			if (conf.central && conf.central.enable) {
				const centralPlugin = plugins.find((plugin) => {
					return plugin.name.toLowerCase() === 'central'
				})
				if (!centralPlugin) {
					reject(new CustomError(404, CustomError.CODE.$$_NOT_FOUND, 'missing central wpt.plugin', ["CENTRAL PLUGIN"]))
					resolved = true
					return null
				}

				if (centralPlugin && !centralPlugin.enabled) {
					reject(new CustomError(400, CustomError.CODE.$$_NOT_AVAILABLE, 'central wpt.plugin not enable', ["CENTRAL PLUGIN"]))
					return null
				}
			}

			if (callback) {
				callback('REQUEST_WPT_done', plugins)
			}
			if(!resolved) {
				resolved = true
				setTimeout(() => {
					socket.removeListener("connect")
					socket.removeListener("disconnect")
					socket.removeListener("error")
					resolve(socket)
				}, 300)
			}
		});

		socket.connect()

	})

}
