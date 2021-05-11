const io = require('socket.io-client')
const CustomError = require('../../helpers/custom_error')

module.exports = function connectToWpt(wpt_url, callback) {
	let resolved = false
	return new Promise((resolve, reject) => {
		const socket = io(wpt_url, {
			autoConnect: true,
			rejectUnauthorized: false
		});
		let timeout = setTimeout(() => {
			socket.removeAllListeners()
			reject(new CustomError(CustomError.CODE.CONNECTION_TIMEOUT, "Cannot connect to Wyndpostools"))
		}, 1000 * 10)

		socket.on('connect', () => {
			if (timeout) {
				clearTimeout(timeout)
				timeout = null
			}
			if (callback) {
				callback('wpt_connect', true)
			}
		})

		socket.on('disconnect', () => {
			if (timeout) {
				clearTimeout(timeout)
				timeout = null
			}
			if (callback) {
				callback('wpt_connect', false)
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
				callback('wpt_infos', infos)
			}


		});
		socket.once('plugins', function (plugins) {

			if (timeout) {
				clearTimeout(timeout)
				timeout = null
			}
			if (callback) {
				callback('wpt_plugins', plugins)
			}
			if(!resolved) {
				resolved = true
				resolve(socket)
			}
		});
		socket.emit('infos')
		socket.emit('plugins')
	})


}
