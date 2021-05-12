const log = require("electron-log")
const CustomError = require('../../helpers/custom_error')

module.exports =  function killWPT(child, socket) {

	return new Promise((resolve, reject) => {
		let timeout = null
		if (child && child.killed) {
			resolve()
		} else {
			timeout = setTimeout(() => {
				timeout = null
				reject(new CustomError(500, "CANNOT_KILL_WPT_TIMEOUT", "The process does not respond"))
			}, 1000 * 3)
			child.on('exit', () => {
				console.log('EXIT')
				if(timeout) {
					clearTimeout(timeout)
					timeout = null
				}
				resolve()
			})
			if (socket && socket.connected) {
				log.debug("socket emit end", socket.id)
				socket.emit("end")
			}
			log.debug("kill wpt", child.pid)
			child.kill("SIGKILL")
			process.kill(child.pid)
		}
	})
}