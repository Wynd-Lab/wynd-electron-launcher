const path = require('path')
const { autoUpdater } = require("electron-updater")
const fastify = require('fastify')

const fastifyStatic = require('fastify-static')
const proxy = require('fastify-http-proxy')
var Http = require('http');

const log = require("../helpers/electron_log")
const downloadUpdateInstall = require("./update_download_install")

fastify.fastify()

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
		if (opt && opt.proxy && opt.url) {
			app.all("/*", async (req, res) => {
						// res.writeHead(200, {
				// 	'Content-Type': 'text/plain',
				// 	'Transfer-Encoding': 'chunked'
				// })
				const destPath = (localPath.endsWith('/') ? localPath.slice(0, -1) : localPath) + req.raw.url

				const proxyRequest = Http.request({
					host: opt.url.hostname,
					port: opt.url.port,
					method: req.method,
					path: destPath
					}, function (proxyResponse) {
						res.raw.writeHead(proxyResponse.statusCode, proxyResponse.headers)

						res.send(proxyResponse)
					});

				proxyRequest.end();

			})
		} else if (opt && opt.proxy) {
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
				res.send(autoUpdater.logger)

				const params = {
					...opt.publish,
					...req.params
				}
				downloadUpdateInstall(params, callback).then(() => {
					res.raw.end()
				})
					.catch((err) => {
						if (callback) {
							callback('update_error', err)
						}

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
