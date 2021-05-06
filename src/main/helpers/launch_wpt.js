
import path from 'path'

export default function launchWpt(wptPath) {
	// var started = /\[HTTPS? Server] started/;
	return new Promise((resolve, reject) => {
		let timeout = setTimeout(() => {
			child.stdout.removeAllListeners()
			child.stderr.removeAllListeners()
			child.removeAllListeners()
			if (!child.killed) {
				child.kill("SIGINT")
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
			if (message.toUpperCase().indexOf('READY') >= 0) {
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
		// child.stdout.on('data', function (data: string) {
			// console.log(data.toString())
			// child.stdout.removeAllListeners()
			// child.stderr.removeAllListeners()
			// child.removeAllListeners()
			// resolve(child)
		// });

		child.stderr.on('data', function (data) {
			// console.log('data', data.toString())
			child.kill("SIGKILL")
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
