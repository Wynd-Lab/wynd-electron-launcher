const axios = require('axios')
const { app, ipcMain } = require('electron')
const { autoUpdater } = require('electron-updater')

const getConfig = require("./get_config")
const checkConfig = require("./check_config")
const launchWpt = require("./launch_wpt")
const connectToWpt = require("./connect_to_wpt")
const getScreens = require("./get_screens")
const forceKill = require("./force_kill")
const downloadUpdateInstall = require("./update_download_install")
const createHttp = require('./create_http')
const CustomError = require('../../helpers/custom_error')

module.exports =  async function initialize(params, callback) {
	if (callback) {
		callback('get_conf')
	}

	const conf = await getConfig(params.conf)

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
			await downloadUpdateInstall(params.versions.app, callback)
		} catch(err) {
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
		let request = null
		try {
			request = await axios.options(conf.wpt.url.href,null , {timeout: 1000})
		}
		catch(err) {
			// log.error(err.message)
		}
		if (request) {
			await forceKill(conf.wpt.url.port)
		}
		if (callback) {
			callback('launch_wpt')
		}
		const wpt = await launchWpt(conf.wpt, callback)
		if (callback) {
			callback('launch_wpt_done', wpt)
		}
	} else if (callback) {
		callback('launch_wpt_skip')
	}

	if (conf.wpt && conf.wpt.enable) {
		const socket = await connectToWpt(conf.wpt.url.href, callback)

		if (conf.socket && conf.socket.enable) {
			socket.on('central.custom.push', (event, timestamp, params) => {
				socket.emit("central.custom", event, timestamp)
				if (event === '@wel/update' && conf.update.enable) {

					const onLog = (data) => {
						socket.emit("central.custom",event + '.data', timestamp, data.toString())
					}

					if (autoUpdater.logger) {
						autoUpdater.logger.on("data", onLog)
					}
					if(callback) {
						callback("show_loader", 'update', 'start')
					}
					downloadUpdateInstall(params && params.version && params.version.app ? params.version.app : "latest", callback).then(() => {
						socket.emit("central.custom", event + '.end',  timestamp)
					})
					.catch((err) => {
						socket.emit("central.custom", event + '.error', timestamp, err)
					})
					.finally(() => {
						if (autoUpdater.logger) {
							autoUpdater.logger.removeListener("data", onLog)
						}
						if(callback) {
							callback("show_loader", 'update', 'end')
						}
					})
				} else if (event === '@wel/update' && !conf.update.enable) {

					const disableError = new CustomError(422, CustomError.CODE.$$_NOT_AVAILABLE, 'the update is disable', ['UPDATE'])
					socket.emit("central.custom", event + '.error', timestamp, disableError)
				} else if (event === '@wel/notification') {
					callback('action.notification', params[0])
					// new Notification({
					// 	title: params[0].header,
					// 	body: params[0].message,
					// }).show()
				} else if (event === '@wel/reload') {
					ipcMain.emit('action.reload')
				}
			})


		}
	} else if (callback) {
		callback('wpt_connect_skip')
	}

	if (conf.http && conf.http.enable) {
		await createHttp(conf.http, {update: !!(conf.update && conf.update.enable), proxy: conf.url.protocol !== "file", version: params.versions.app}, callback)
	} else if (callback) {
		callback('create_http_skip')

	}

	if (callback) {
		callback('finish')
	}
}
