const path = require('path')
const { autoUpdater } = require("electron-updater")
const log = require("electron-log")

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


		const localPath = httpConf.static.href
		const containerAssetsPath = path.join(__dirname, '..', '..', 'container', 'assets')
		const containerDistPath = path.join(__dirname, '..', '..', 'container', 'dist')

		app.register(fastifyStatic, {
			root: containerDistPath,
			prefix: '/container/dist',
			decorateReply: false // the reply decorator has been added by the first plugin registration
		})

		app.register(fastifyStatic, {
			root: containerAssetsPath,
			prefix: '/container/',
			decorateReply: false // the reply decorator has been added by the first plugin registration
		})

		if (opt && opt.proxy) {
			app.register(proxy, {
				upstream: localPath,
				prefix: '/', // optional
				http2: false // optional
			})
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
				updateDownLoadInstall(opt.versions.app, callback).then(() => {
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
			log.debug(`http server on localhost:${port}`)
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
