const io = require('socket.io-client')
const CustomError = require('../../helpers/custom_error')

module.exports = function connectToWpt(wpt_url, callback) {
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
				reject(new CustomError(408, CustomError.CODE.CONNECTION_TIMEOUT, `Cannot connect to Wyndpostools (url: ${wpt_url})`))
			}, 1000 * 10)
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
			if (callback) {
				callback('wpt_connect_done', true)
			}
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
			if (callback) {
				callback('wpt_connect_done', false)
			}
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
