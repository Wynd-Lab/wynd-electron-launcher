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
			child.stdout.removeAllListeners()
			child.stderr.removeAllListeners()
			child.removeAllListeners()
			if (!child.killed) {
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
		// const execFile = require('child_process').execFile



		const isScript =
			path.extname(wpt.path) === '.sh' || path.extname(wpt.path) === '.bat'
		let isJs = path.extname(wpt.path) === '.js'

		const exePath =
			isScript || isJs ? wpt.path : path.join(wpt.path, 'lib', 'main.js')
		isJs = path.extname(exePath) === '.js'
		const exe = isScript ? wpt.path : 'node'
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


		if (!isJs && path.extname(exePath) === '.bat') {
			wpt.wait_on_ipc = false
		}

		const options = {
			stdio: wpt.wait_on_ipc ? ['pipe', 'pipe', 'pipe']:  undefined,
			// windowsHide: true,
			shell:wpt.shell,
			detached: wpt.detached,
		}

		if (wpt.wait_on_ipc && isScript && path.extname(exePath) === '.sh' || isJs) {
			// not working on Windows with .bat ...
			options.stdio.push('ipc')
		}

		const child = spawn(exe, args, options)
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
					child.stdout.removeAllListeners()
					child.stderr.removeAllListeners()
					child.removeAllListeners()
					resolve(child)
				}
			})
		}

		if (
			!wpt.wait_on_ipc ||
			(process.env.DEBUG && process.env.DEBUG === 'wpt')
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
					pid = pid.split(" ")
					if (pid.length > 0) {
						pid = pid.pop()
						pid = Number.parseInt(pid, 10)
						if (Number.isNaN(pid)) {
							pid = pid.pop()
							pid = Number.parseInt(pid, 10)
						}

						if (!Number.isNaN(pid) && callback) {
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

		child.stderr.on('data', function (data) {
			//   if (messages.length === 0) {
			//     setTimeout(() => {
			//       child.kill('SIGKILL')
			//       if (wptPid) {
			//         try {
			//           process.kill(wptPid)
			//         } catch (err2) {
			//           // console.log(err2)
			//         }
			//       }
			//       child.stdout.removeAllListeners()
			//       child.stderr.removeAllListeners()
			//       child.removeAllListeners()
			//       const err = new CustomError(
			//         400,
			//         CustomError.CODE.WPT_CREATION_FAILED,
			//         wpt.path,
			//         []
			//       )
			//       err.messages = messages
			//       reject(err)
			//     }, 1000)
			//   }
			messages += data.toString()
		})

		child.once('exit', reason => {
			setTimeout(() => {
				child.stdout.removeAllListeners()
				child.stderr.removeAllListeners()
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
				child.stdout.removeAllListeners()
				child.stderr.removeAllListeners()
				child.removeAllListeners()
			}
			err.messages = messages
			reject(err)
		})

		// child.stdout.removeAllListeners()
		// child.stderr.removeAllListeners()
		// resolve(child)
	})
}
