const path = require('path')
const log = require('electron-log')
const fs = require('fs')
const CustomError = require('../../helpers/custom_error')

module.exports = function launchWpt(wpt, callback) {
	// var started = /\[HTTPS? Server] started/;
	let wptPid = null
	let messages = ''

	return new Promise((resolve, reject) => {
		let timeout = setTimeout(() => {
			if (child.stdout) {
				child.stdout.removeAllListeners()
			}
			if (child.stderr) {
				child.stderr.removeAllListeners()
			}
			child.removeAllListeners()
			if (child && !child.killed) {
				child.kill('SIGKILL')
			}
			if (wptPid) {
				process.kill(wptPid)
			}
			timeout = null
			reject(
				new CustomError(
					500,
					CustomError.CODE.WPT_CANNOT_BE_CREATED,
					'Cannot create Wyndpostools (timeout: 20 sec)'
				)
			)
		}, 1000 * 20)
		// cannot use fork same node version of nw used
		const spawn = require('child_process').spawn

		const isScript =
			path.extname(wpt.path) === '.sh' || path.extname(wpt.path) === '.bat'
		let isJs = path.extname(wpt.path) === '.js'

		const exePath =
			isScript || isJs ? wpt.path : path.join(wpt.path, 'lib', 'main.js')
		isJs = path.extname(exePath) === '.js'
		const exe = isScript ? wpt.path : wpt.cwd ? wpt.cwd : 'node'
		const args = isScript
			? []
			: [exePath]

		if (!fs.existsSync(exePath)) {
			reject(
				new CustomError(
					400,
					CustomError.CODE.INVALID_$$_PATH,
					'wrong wpt path in config: ' + wpt.path,
					['WPT']
				)
			)
		}
<<<<<<< HEAD:src/main/helpers/create_wpt.js
=======

>>>>>>> 622c4d7059f57d401bbc2a6b2382a1fb04b60174:src/main/helpers/launch_wpt.js

		if (!isJs && path.extname(exePath) === '.bat') {
			wpt.wait_on_ipc = false
		}

		const options = {
<<<<<<< HEAD:src/main/helpers/create_wpt.js
			stdio: wpt.wait_on_ipc ? ['pipe', 'pipe', 'pipe']:  undefined,
			// windowsHide: true,
=======
			stdio: wpt.wait_on_ipc ? ['pipe', 'pipe', 'pipe']: undefined,
			windowsHide: true,
>>>>>>> 622c4d7059f57d401bbc2a6b2382a1fb04b60174:src/main/helpers/launch_wpt.js
			shell:wpt.shell,
			detached: wpt.detached,
		}

<<<<<<< HEAD:src/main/helpers/create_wpt.js
		if (wpt.wait_on_ipc && (isScript && path.extname(exePath) === '.sh' || isJs)) {
=======
		if (wpt.wait_on_ipc && options.stdio && isScript && (path.extname(exePath) === '.sh' || isJs)) {
>>>>>>> 622c4d7059f57d401bbc2a6b2382a1fb04b60174:src/main/helpers/launch_wpt.js
			// not working on Windows with .bat ...
			options.stdio.push('ipc')
		}

		const child = spawn(exe, args, options)
<<<<<<< HEAD:src/main/helpers/create_wpt.js
=======

>>>>>>> 622c4d7059f57d401bbc2a6b2382a1fb04b60174:src/main/helpers/launch_wpt.js
		if (wpt.wait_on_ipc) {
			child.on('message', message => {
				log.info('wpt.send', message)
				if (typeof message === 'object' && message.pid) {
					wptPid = message.pid
					if (callback) {
						callback('get_wpt_pid_done', wptPid)
					}
				} else if (
					typeof message === 'string' &&
					message.toUpperCase().indexOf('READY') >= 0
				) {
					if (timeout) {
						clearTimeout(timeout)
						timeout = null
					}
					if (child.stdout) {
						child.stdout.removeAllListeners()
					}
					if (child.stderr) {
						child.stderr.removeAllListeners()
					}
					child.removeAllListeners()
					resolve(child)
				}
			})
		}

		if (
			child.stdout && (!wpt.wait_on_ipc ||
			(process.env.DEBUG && process.env.DEBUG === 'wpt'))
		) {
			child.stdout.on('data', function (data) {
				if (process.env.DEBUG && process.env.DEBUG === 'wpt') {
					// eslint-disable-next-line no-console
					console.log('WPT ->', data.toString())
				}
				if (messages.length > 0) {
					messages.length = ""
				}

				if (!wpt.wait_on_ipc && data.indexOf('[pid] ') >= 0) {
					let pid = typeof data === "object" ? data.toString().split("\n") : data.split("\n")

					for (let i = 0; i < pid.length; i++) {
						if (pid[i].indexOf('[pid]' >= 0)) {
							pid = pid[i]
							break
						}
					}
<<<<<<< HEAD:src/main/helpers/create_wpt.js
					pid = pid.split(" ")
					if (pid.length > 0) {
						pid = pid.pop()
						pid = Number.parseInt(pid, 10)
						if (Number.isNaN(pid)) {
							pid = pid.pop()
							pid = Number.parseInt(pid, 10)
						}

						if (!Number.isNaN(pid) && callback) {
=======
					const pids = pid.split(" ")
					if (pid.length > 0) {
						pid = pids.pop()
						pid = Number.parseInt(pid, 10)
						if (Number.isNaN(pid)) {
							if (pids.length > 0) {
								pid = pids.pop()
								pid = Number.parseInt(pid, 10)
							} else {
								pid = null
							}
						}

						if (pid && !Number.isNaN(pid) && callback) {
>>>>>>> 622c4d7059f57d401bbc2a6b2382a1fb04b60174:src/main/helpers/launch_wpt.js
							callback('get_wpt_pid_done', pid)
						}
					}

				}

				if (
					!wpt.wait_on_ipc &&
					(data.indexOf('[HTTP Server] started on port') >= 0 ||
						data.indexOf('[HTTPS Server] started on port') >= 0)
				) {
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
		}
		if (child.stderr) {
			child.stderr.on('data', function (data) {
				messages += data.toString()
			})
		}

		child.once('exit', reason => {
			setTimeout(() => {
				if (child.stdout) {
					child.stdout.removeAllListeners()
				}
				if (child.stderr) {
					child.stderr.removeAllListeners()
				}
				child.removeAllListeners()
				reject(
					new CustomError(
						500,
						CustomError.CODE.WPT_CANNOT_BE_CREATED,
						messages
							? messages
							: 'Cannot create Wyndpostools. Exit(' + reason + ')'
					)
				)
			}, 1000)
		})

		child.once('error', err => {
			if (timeout) {
				clearTimeout(timeout)
				timeout = null
			}
			if (!child.killed) {
				child.kill('SIGKILL')
				if (child.stdout) {
					child.stdout.removeAllListeners()
				}
				if (child.stderr) {
					child.stderr.removeAllListeners()
				}
				child.removeAllListeners()
			}
			err.messages = messages
			reject(err)
		})

<<<<<<< HEAD:src/main/helpers/create_wpt.js
		// child.stdout.removeAllListeners()
		// child.stderr.removeAllListeners()
		// resolve(child)
=======
		if (child && wpt.shell) {
			if (timeout) {
				clearTimeout(timeout)
				timeout = null
			}
			setTimeout(() => {
				if (child.stdout) {
					child.stdout.removeAllListeners()
				}
				if (child.stderr) {
					child.stderr.removeAllListeners()
				}
				child.removeAllListeners()
				resolve(child)
			}, 3000)
		}
>>>>>>> 622c4d7059f57d401bbc2a6b2382a1fb04b60174:src/main/helpers/launch_wpt.js
	})
}
