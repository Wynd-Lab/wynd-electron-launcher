
const path = require('path')
const log = require("electron-log")

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
			console.log('timeout', wptPid)
			if (wptPid) {
				process.kill(wptPid)
			}
			timeout = null
			reject(new Error("Cannot create Wyndpostools"))
		}, 1000 * 20)
		// cannot use fork same node version of nw used
		const spawn = require('child_process').spawn

		const options = {
			stdio: ['pipe', 'pipe', 'pipe', 'ipc']
		};
		const args = [
			'--experimental-worker',
			'--no-warnings',
			path.resolve(wptPath, 'lib', 'main.js')
		]
		const child = spawn('node', args, options)

		child.on("message", (message) => {

			log.info('wpt.send', message)
			if (typeof message === "object" && message.pid) {
				wptPid = message.pid
				if (callback) {
					callback('get_wpt_pid', wptPid)
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
			reject(data)
		});
		// child.once('exit', () => {
		// 	console.log('exit')
		// })

		child.once('error', (err) => {
			// console.log("error", err)
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
