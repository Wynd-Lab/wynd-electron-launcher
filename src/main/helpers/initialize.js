const axios = require('axios')
const log = require("electron-log")
const { ipcMain } = require('electron')
const { ipcRenderer } = require('electron')
const { autoUpdater } = require('electron-updater')

const getConfig = require("./get_config")
const checkConfig = require("./check_config")
const launchWpt = require("./launch_wpt")
const connectToWpt = require("./connect_to_wpt")
const getScreens = require("./get_screens")
const forceKill = require("./force_kill")
const updateDownloadInstall = require("./update_download_install")
const createHttp = require('./create_http')
const wait = require("./wait.js")

module.exports =  async function initialize(params, callback) {
	await wait(300)
	if (callback) {
		callback('get_conf')
	}

	const conf = await getConfig(params.conf)

	if (callback) {
		callback('get_conf_done', null)
		callback('check_conf', conf)
	}

	checkConfig(conf)

	if (callback) {
		callback('check_conf_done', conf)
	}

	if (conf.update.enable && conf.update.on_start) {
			const updated = await updateDownloadInstall(callback)
			if (updated) {
				return null
			}
	}

	if (callback) {
		callback('get_screens')
	}
	const screens = getScreens()
	if (callback) {
		callback('get_screens_done', screens)
	}

	if (conf.wpt && conf.wpt.enable) {
		let request = null
		try {
			request = await axios.options(conf.wpt.url.href,null , {timeout: 1000})
		}
		catch(err) {
			log.error(err)
		}
		if (request) {
			await forceKill(conf.wpt.url.port)
		}
		if (callback) {
			callback('launch_wpt')
		}
		const wpt = await launchWpt(conf.wpt.path, callback)
		if (callback) {
			callback('launch_wpt_done', wpt)
		}
	} else if (callback) {
		callback('launch_wpt_skip')
	}

	const socket = await connectToWpt(conf.wpt.url.href, callback)

	if (conf.http.enable) {
		await createHttp(conf.http, conf.update.enable, callback)
	}


	if (conf.socket.enable) {
		socket.on('central.custom.push', (event, timestamp, ...params) => {
			socket.emit("central.custom", event, timestamp)
			if (event === '@wec/update' && conf.update.enable) {

				const onLog = (data) => {
					socket.emit("central.custom",event + '.data', timestamp, data.toString())
				}

				if (autoUpdater.logger) {
					autoUpdater.logger.on("data", onLog)
				}

				updateDownloadInstall(callback).then(() => {
					socket.emit("central.custom",event + '.data',  timestamp)
					if (autoUpdater.logger) {
						autoUpdater.logger.removeListener("data", onLog)
					}
					socket.emit("central.custom", event + '.end', timestamp)
				})
				.catch((err) => {
					if (autoUpdater.logger) {
						autoUpdater.logger.removeListener("data", onLog)
					}
					socket.emit("central.custom", event + '.error', timestamp, err)

				})
			} else if (event === '@wec/notification') {
				callback('action.notification', params[0])
				// new Notification({
				// 	title: params[0].header,
				// 	body: params[0].message,
				// }).show()
			} else if (event === '@wec/reload') {
				ipcMain.emit('action.reload')
			}
		})
	}

	if (callback) {
		callback('finish')
	}
	return socket
}
