
const path = require('path')
const log = require("electron-log")
const fs = require("fs")
const CustomError = require('../../helpers/custom_error')
const { message } = require('antd')
module.exports = function launchWpt(wptPath, callback) {
	// var started = /\[HTTPS? Server] started/;
	let wptPid = null
	let messages = ""

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

		const isScript = path.extname(wptPath) === ".sh" ||  path.extname(wptPath) === ".bat"
		const isJs = path.extname(wptPath) === ".js"

		const exePath = isScript || isJs ? wptPath : path.join(wptPath, 'lib', 'main.js')
		const exe = isScript ? wptPath : "node"
		const args = isScript ? [] : [
			'--experimental-worker',
			'--no-warnings',
			wptPath
		]

		if (!fs.existsSync(exePath)) {
			reject(new CustomError(400, CustomError.CODE.INVALID_$$_PATH, "wrong wpt path in config: " + wptPath, ["WPT"]))
		}

		const child = spawn(exe, args,  options)

		child.on("message", (message) => {

			log.debug('wpt.send', message)
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
			if (messages.length === 0) {
				setTimeout(() => {
					child.kill("SIGKILL")
					if (wptPid) {
						try {
							process.kill(wptPid)
						}
						catch(err2) {
							// console.log(err2)
						}
					}
					child.stdout.removeAllListeners()
					child.stderr.removeAllListeners()
					child.removeAllListeners()
					const err = new CustomError(400, CustomError.CODE.WPT_CREATION_FAILED, wptPath, [])
					err.messages = messages
					reject(err)

				}, 1000)
			}
			messages += data.toString()

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
			err.messages = messages
			reject(err)
		})

	})

}
