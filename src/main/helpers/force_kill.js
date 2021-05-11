const log = require("electron-log")
const CustomError = require('../../helpers/custom_error')

module.exports =  function killWPT(port) {

	return new Promise((resolve, reject) => {
		if (process.platform === "linux") {
			let timeout = setTimeout(() => {
				timeout = null
				reject(new CustomError(500, "KILL_WPT_TIMEOUT", "The process does not respond"))
			}, 1000 * 3)
			const exec = require('child_process').exec
			const regexPID = /\d+/

			exec(`netstat -ltnp | grep -w ':${port}' | awk '{split($7,a, \"/\"); print  a[1]}'`, (error, stdout) => {
				if (error) {
					return reject(error);
				}
				if (regexPID.test(stdout)) {
					if (timeout) {
						clearTimeout(timeout)
					}
					const result = process.kill(Number.parseInt(stdout), 'SIGKILL')
					if (result) {
						return resolve()
					} else {
						reject(new CustomError(500, "KILL_WPT_NOT_CONFIRMED", "The process kill has not confirmed"))
					}
				}

			});
		}
		else {
			reject(new CustomError(500, "KILL_WPT_WRONG_PLATFORM", "Cannot kill wpt on platform " + process.platform))
		}
	})
}
