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
			autoConnect: true,
			rejectUnauthorized: true
		});

		generateTimeout()

		if (callback) {
			callback('wpt_connect')
		}
		socket.on('connect', () => {
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
			if (callback) {
				callback('wpt_plugins')
			}
			setTimeout(() => {
				if (callback) {
					callback('wpt_infos')
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
				callback('wpt_plugins_done', plugins)
			}
			if(!resolved) {
				resolved = true
				setTimeout(() => {
					resolve(socket)
				}, 300)
			}
		});


	})


}
