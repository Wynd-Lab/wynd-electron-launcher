const path = require('path')
const { autoUpdater } = require("electron-updater")

const fastify = require('fastify')

const fastifyStatic = require('fastify-static')
const proxy = require('fastify-http-proxy')

fastify.fastify()
const updateDownLoadInstall = require("./update_download_install")
module.exports = function createHttp(httpConf, opt, callback) {
	return new Promise((resolve, reject) => {
		const port = httpConf.port

		if (callback) [
			callback('create_http', port)
		]
		const app = fastify.default()

		console.log(httpConf, opt)
		const localPath = path.join(__dirname, '..', '..', 'local')
		const containerPath = path.join(__dirname, '..', '..', 'container', 'assets')

		console.log(localPath)
		// app.register(fastifyStatic, {
		// 	root: containerPath,
		// 	prefix: '/container/',
		// 	decorateReply: false // the reply decorator has been added by the first plugin registration
		// })

		if (opt && opt.proxy) {
			// app.register(proxy, {
			// 	upstream: localPath,
			// 	prefix: '/', // optional
			// 	http2: false // optional
			// })
		} else {
			app.register(fastifyStatic, {
				root: localPath,
				prefix: '/',
			})

		}

		if (opt && opt.update) {
			app.all("/update/:version", async (req, res) => {
				// res.writeHead(200, {
				// 	'Content-Type': 'text/plain',
				// 	'Transfer-Encoding': 'chunked'
				// })
				res.send(autoUpdater.logger)
				updateDownLoadInstall(callback).then(() => {
					res.raw.end()
				})
					.catch((err) => {
						if (callback) {
							callback('update_error', err)
						}

						// if (err.status) {
						// 	res.status(err.status)
						// }
						// res.send(`[${err.api_code}] err.message`)
						res.raw.end()
					})

			})
		}

		app.listen(port, 'localhost', (err) => {
			if (err) {
				return reject(err)
			}
			if (callback) {
				callback('create_http_done', app)
			}
			return resolve(app)
		})

	})
}
