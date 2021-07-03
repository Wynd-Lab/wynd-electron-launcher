const path = require('path')
const { autoUpdater } = require("electron-updater")

const fastify = require('fastify')
fastify.fastify()
const updateDownLoadInstall = require("./update_download_install")
module.exports = function createHttp(httpConf, update, callback) {
	return new Promise((resolve, reject) => {
		const port = httpConf.port

		if (callback) [
			callback('create_http', port)
		]
		const app = fastify.default()
		const localPath = httpConf.static || path.join(__dirname, '..', '..', 'local')
		app.register(require('fastify-static'), {
			root: localPath,
		})

		if (update) {
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
