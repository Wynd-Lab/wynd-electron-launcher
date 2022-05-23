const log = require("../helpers/electron_log")
const CustomError = require('../../helpers/custom_error')

module.exports =  function killWPT(port) {
	return new Promise((resolve, reject) => {
		let command = null
		if (process.platform === "linux") {
			command = `netstat -ltnp | grep -w ':${port}' | awk '{split($7,a, \"/\"); print  a[1]}'`
		} else if (process.platform === "win32") {
			command =  `netstat -a -n -o -p tcp | findstr 0.0.0.0:${9963}`
		}

		if (command) {
			let timeout = setTimeout(() => {
				timeout = null
				reject(new CustomError(500, CustomError.CODE.CANNOT_KILL_WPT, "The process does not respond"))
			}, 1000 * 3)
			const exec = require('child_process').exec
			const regexPID = /\d+/
			log.debug("Execute command:", command)
			exec(command, (error, stdout) => {
				if (error) {
					return reject(error);
				}
				if (timeout) {
					clearTimeout(timeout)
				}
				if (process.platform === "win32") {
					stdout = stdout.split(' ').filter((chunk) => {
						return chunk !== ''
					})
					stdout = stdout[4]
				}
				if (regexPID.test(stdout)) {

					const result = process.kill(Number.parseInt(stdout), 'SIGKILL')
					if (result) {
						return resolve()
					} else {
						reject(new CustomError(500,  CustomError.CODE.KILL_WPT_NOT_CONFIRMED, "The process kill has not confirmed"))
					}
				}
				resolve()
			});
		}
		else {
			reject(new CustomError(500,  CustomError.CODE.KILL_WPT_WRONG_PLATFORM, "Cannot kill wpt on platform " + process.platform))
		}
	})
}
