const log = require("../helpers/electron_log")
const CustomError = require('../../helpers/custom_error')

module.exports =  function killWPT(child, socket, pid) {
	return new Promise((resolve, reject) => {
		let timeout = null
		if (child && child.killed) {
			child.removeAllListeners()
			resolve()
		} else {
			timeout = setTimeout(() => {
				timeout = null
				child.removeAllListeners()
				reject(new CustomError(500, "CANNOT_KILL_WPT_TIMEOUT", "The process does not respond"))
			}, 1000 * 3)
			child.once('exit', () => {
				if(timeout) {
					clearTimeout(timeout)
					timeout = null
				}
				if (pid && child.pid !== pid) {
					try  {
						process.kill(pid, 'SIGKILL')
					}
					catch(e) {
						// silent error
					}
				}
				child.removeAllListeners()
				resolve()
			})
			if (socket && socket.connected) {
				log.debug("socket emit end", socket.id)
				socket.emit("end")
			}
			log.debug("kill wpt", child.pid, pid)
			child.kill("SIGKILL")
			// process.kill(child.pid, 'SIGKILL')

		}
	})
}
