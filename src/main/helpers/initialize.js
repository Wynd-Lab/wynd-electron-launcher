const { app } = require('electron')

const axios = require('axios')

const getConfig = require("./get_config")
const checkConfig = require("./check_config")
const launchWpt = require("./create_wpt")
const connectToWpt = require("./connect_to_wpt")
const getScreens = require("./get_screens")
const forceKill = require("./force_kill")
const downloadUpdateInstall = require("./update_download_install")
const createHttp = require('./create_http')

module.exports = async function initialize(params, callback) {
	if (callback) {
		callback('get_conf')
	}

	const conf = typeof params.conf === 'string' ? await getConfig(params.conf) : params.conf

	if (callback) {
		callback('get_conf_done', null)
		callback('check_conf', conf)
	}

	checkConfig(conf, app.getPath("userData"))

	if (callback) {
		callback('check_conf_done', conf)
	}

	if (conf.update.enable && conf.update.on_start) {
		try {
			const result = await downloadUpdateInstall(conf.publish, callback)
			if (result) {
				return null
			}
		} catch (err) {
			if (callback) {
				callback('update_error', err)
			}
			// throw err
		}
	}
	if (callback) {
		callback('get_screens')
	}
	const screens = getScreens()

	if (callback) {
		callback('get_screens_done', screens)
	}
	if (conf.wpt && conf.wpt.enable && conf.wpt.path) {
		try {
			request = await axios.options(conf.wpt.url.href, null, { timeout: 1000 })
			await forceKill(conf.wpt.url.port)
		}
		catch (err) {
			// log.error(err.message, "force kill wpt")
		}
		if (callback) {
			callback('create_wpt')
		}

		const wpt = await launchWpt(conf.wpt, callback)

		if (callback) {
			callback('create_wpt_done', wpt)
		}
	} else if (callback) {
		callback('create_wpt_skip')
	}

	if (conf.http && conf.http.enable) {
		await createHttp(conf.http, { update: !!(conf.update && conf.update.enable), proxy: conf.proxy.enable || conf.url.protocol !== "file", url: conf.proxy.url, publish: conf.publish }, callback)
	} else if (callback) {
		callback('create_http_skip')
	}

	if (conf.wpt && conf.wpt.enable) {
		const socket = await connectToWpt(conf.wpt.url.href, callback)

		socket.on('connect', () => {
			if (callback) {
				callback('wpt_connect_done', true)
			}
		})

		socket.on('disconnect', () => {
			if (callback) {
				callback('wpt_connect_done', false)
			}
		})
		// if (conf.central && conf.central.enable) {

			// if (conf.central.mode === "AUTO") {
			// 	const register = {
			// 		name: params.infos.name,
			// 		url: conf.http && conf.http.enable ? `http://localhost:${conf.http.port}` : null,
			// 		version: params.infos.version,
			// 		stack: params.infos.stack,
			// 		app_versions: params.infos.app_versions
			// 	}
			// 	socket.emit("central.register", register)
			// }
			// socket.on('central.custom.push', (event, timestamp, params) => {
			// 	socket.emit("central.custom", event, timestamp)
			// 	if (event === '@wel/update' && conf.update.enable) {

			// 		const onLog = (data) => {
			// 			socket.emit("central.custom", event + '.data', timestamp, data.toString())
			// 		}

			// 		if (autoUpdater.logger) {
			// 			autoUpdater.logger.on("data", onLog)
			// 		}
			// 		if (callback) {
			// 			callback("show_loader", 'update', 'start')
			// 		}
			// 		downloadUpdateInstall(params && params.version ? params.version : "latest", callback).then(() => {
			// 			socket.emit("central.custom", event + '.end', timestamp)
			// 		})
			// 			.catch((err) => {
			// 				socket.emit("central.custom", event + '.error', timestamp, err)
			// 			})
			// 			.finally(() => {
			// 				if (autoUpdater.logger) {
			// 					autoUpdater.logger.removeListener("data", onLog)
			// 				}
			// 				if (callback) {
			// 					callback("show_loader", 'update', 'end')
			// 				}
			// 			})
			// 	} else if (event === '@wel/update' && !conf.update.enable) {

			// 		const disableError = new CustomError(422, CustomError.CODE.$$_NOT_AVAILABLE, 'the update is disable', ['UPDATE'])
			// 		socket.emit("central.custom", event + '.error', timestamp, disableError)
			// 	} else if (event === '@wel/notification') {
			// 		callback('action.notification', params[0])
			// 		// new Notification({
			// 		// 	title: params[0].header,
			// 		// 	body: params[0].message,
			// 		// }).show()
			// 	} else if (event === '@wel/reload') {
			// 		ipcMain.emit('action.reload')
			// 	}
			// })

		// }

	} else if (callback) {
		callback('wpt_connect_skip')
	}

	if (callback) {
		callback('finish')
	}
}
