
const path = require('path')
const log = require("electron-log")
const fs = require("fs")
const CustomError = require('../../helpers/custom_error')

module.exports = function launchWpt(wptPath, callback) {
	// var started = /\[HTTPS? Server] started/;
	let wptPid = null
	return new Promise((resolve, reject) => {
		let timeout = setTimeout(() => {
			child.stdout.removeAllListeners()
			child.stderr.removeAllListeners()
			child.removeAllListeners()
			if (!child.killed) {
				child.kill("SIGKILL")
			}
			if (wptPid) {
				process.kill(wptPid)
			}
			timeout = null
			reject(new CustomError(500, CustomError.CODE.WPT_CANNOT_BE_CREATED, "Cannot create Wyndpostools (timeout: 20 sec)"))
		}, 1000 * 20)
		// cannot use fork same node version of nw used
		const spawn = require('child_process').spawn

		const options = {
			stdio: ['pipe', 'pipe', 'pipe', 'ipc']
		};

		const isSh = path.extname(wptPath) === ".sh"
		const isJs = path.extname(wptPath) === ".js"

		const exePath = isSh || isJS ? wptPath : path.join(wptPath, 'lib', 'main.js')
		const exe = isSh ? wptPath : "node"
		const args = isSh ? [] : [
			'--experimental-worker',
			'--no-warnings',
			wptPath
		]

		if (!fs.existsSync(exePath)) {
			reject(new CustomError(400, CustomError.CODE.INVALID_$$_PATH, "wrong wpt path in config: " + wptPath, ["WPT"]))
		}

		const child = spawn(exe, args,  options)

		child.on("message", (message) => {

			log.info('wpt.send', message)
			if (typeof message === "object" && message.pid) {
				wptPid = message.pid
				if (callback) {
					callback('get_wpt_pid_done', wptPid)
				}
			} else if (typeof message === 'string' && message.toUpperCase().indexOf('READY') >= 0) {
				if (timeout) {
					clearTimeout(timeout)
					timeout = null
				}
				child.stdout.removeAllListeners()
				child.stderr.removeAllListeners()
				child.removeAllListeners()
				resolve(child)
			}
		})

		if (process.env.DEBUG && process.env.DEBUG === "wpt") {
			child.stdout.on('data', function (data) {
				// eslint-disable-next-line no-console
				console.log(data.toString())
			})
		}

		child.stderr.on('data', function (data) {

			child.kill("SIGKILL")
			if (wptPid) {
				process.kill(wptPid)
			}
			child.stdout.removeAllListeners()
			child.stderr.removeAllListeners()
			child.removeAllListeners()
			reject(new CustomError(400, CustomError.CODE.WPT_CREATION_FAILED, data.toString(), []))

			reject(data.toString())
		});

		// child.once('exit', (reason) => {
		// 	reject(new CustomError(500, CustomError.CODE.WPT_CANNOT_BE_CREATED, "Cannot create Wyndpostools. Exit(" + reason +")"))
		// })

		child.once('error', (err) => {

			if (timeout) {
				clearTimeout(timeout)
				timeout = null
			}
			if (!child.killed) {
				child.kill("SIGKILL")
				child.stdout.removeAllListeners()
				child.stderr.removeAllListeners()
				child.removeAllListeners()
			}
			reject(err)
		})

	})

}
