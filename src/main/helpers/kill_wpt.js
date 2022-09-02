const log = require("../helpers/electron_log")
const CustomError = require('../../helpers/custom_error')

module.exports =  function killWPT(child, socket, pid) {
	return new Promise((resolve, reject) => {
		let timeout = null
		if (child && child.killed) {
			child.removeAllListeners()
			log.info("[WPT] > kill: already killed")
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
						log.debug("[WPT] > kill : process.SIGKILL (child.pid=" + child.pid + ", pid=" + pid + ")")
						process.kill(pid, 'SIGKILL')
					}
					catch(e) {
						// silent error
					}
				}
				child.removeAllListeners()
				log.info("[WPT] > wpt killed")
				resolve()
			})
			if (socket && socket.connected) {
				log.debug("[WPT] > kill : socket.emit end " + socket.id)
				socket.emit("end")
			}

			child.kill("SIGKILL")
			log.debug("[WPT] > kill : child.SIGKILL (child.pid=" + child.pid + ", pid=" + pid + ")")
			// process.kill(child.pid, 'SIGKILL')

		}
	})
}
