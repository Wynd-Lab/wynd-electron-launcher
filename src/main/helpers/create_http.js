const express = require('express')
const updateDownLoadInstall = require("./update_download_install")
module.exports =  function createHttp(httpConf, callback) {

	return new Promise((resolve, reject) => {
	const port = httpConf.port

	if (callback) [
		callback('create_http', port)
	]
	const app = express()

	app.all("/update/:version", async (req, res) => {
		const version = req.params.version
		await updateDownLoadInstall(callback)
		res.status(200)
		res.end()
	})

	server = app.listen(port, () => {
		if (callback) {
			callback('create_http_done', server)
		}
		resolve()
	})

	})
}
