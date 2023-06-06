const path = require('path')
const log = require('../helpers/electron_log')
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
					'Cannot create Wyndpostools (timeout: ' + wpt.creation_timeout + ' sec)'
				)
			)
		}, 1000 * wpt.creation_timeout)
		// cannot use fork same node version of nw used
		const spawn = require('child_process').spawn

		const isShell =
			path.extname(wpt.path) === '.sh' || path.extname(wpt.path) === '.bat'
		let isJs = path.extname(wpt.path) === '.js'

		const exePath =
			isShell || isJs ? wpt.path : path.join(wpt.path, 'lib', 'main.js')
		isJs = path.extname(exePath) === '.js'
		const exe = isShell ? wpt.path : wpt.cwd ? wpt.cwd : 'node'
		const args = isShell
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

		if (!isJs && path.extname(exePath) === '.bat') {
			wpt.wait_on_ipc = false
		} else if (isJs && wpt.wait_on_ipc === null) {
			wpt.wait_on_ipc = true
		} else if (wpt.shell && wpt.detached) {
			wpt.wait_on_ipc = false
		}

		const options = {
			stdio: wpt.wait_on_ipc ? ['pipe', 'pipe', 'pipe']: undefined,
			windowsHide: true,
			shell:wpt.shell,
			detached: wpt.detached,
		}
		if (wpt.wait_on_ipc && options.stdio && !isShell && (path.extname(exePath) === '.sh' || isJs)) {
			// not working on Windows with .bat ...
			options.stdio.push('ipc')
		}
		log.info("[WPT] exe opts: " + JSON.stringify(options))
		log.info("[WPT] exe: " + exe + " " + args)
		const child = spawn(exe, args, options)
		log.info("[WPT] child pid: " + child.pid)
		if (wpt.wait_on_ipc) {
			child.on('message', message => {
				log.info("[WPT] child message: " + (typeof message === "object" ? JSON.stringify(message) : message))
				if (typeof message === 'object' && message.pid) {
					wptPid = message.pid
					if (callback) {
						log.info("[WPT] pid: " + wptPid)
						callback('get_wpt_pid_done', wptPid)
					} else {
						wpt.pid = wptPid
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
					if (callback) {
						callback('create_wpt_done', child)
					}
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

				if (!wpt.wait_on_ipc && data.indexOf('[pid] ') >= 0 || data.indexOf('pid') >= 0) {
					let pid = typeof data === "object" ? data.toString().split("\n") : data.split("\n")
					for (let i = 0; i < pid.length; i++) {
						if (pid[i].indexOf('[pid]' >= 0) || pid[i].indexOf('pid' >= 0)) {
							pid = pid[i]
							break
						}
					}
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
							log.info("[WPT] pid: " + pid)
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
					if (callback) {
						callback('create_wpt_done', child)
					}
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
				if (callback) {
					callback('create_wpt_done', child)
				}
				resolve(child)
			}, 3000)
		}
	})
}
