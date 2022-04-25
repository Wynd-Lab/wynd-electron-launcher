const { app, ipcMain } = require('electron')
const { autoUpdater } = require('electron-updater')

const axios = require('axios')
const semver = require("semver")

const getConfig = require("./get_config")
const checkConfig = require("./check_config")
const launchWpt = require("./launch_wpt")
const connectToWpt = require("./connect_to_wpt")
const getScreens = require("./get_screens")
const forceKill = require("./force_kill")
const downloadUpdateInstall = require("./update_download_install")
const createHttp = require('./create_http')
const CustomError = require('../../helpers/custom_error')

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
			await downloadUpdateInstall(params.version, callback)
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
			// log.error(err.message)
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

	if (conf.http && conf.http.enable) {
		await createHttp(conf.http, { update: !!(conf.update && conf.update.enable), proxy: conf.proxy.enable || conf.url.protocol !== "file", url: conf.proxy.url, version: params.version }, callback)
	} else if (callback) {
		callback('create_http_skip')
	}

	if (conf.wpt && conf.wpt.enable) {
		const socket = await connectToWpt(conf.wpt.url.href, callback)
		if (conf.central && conf.central.enable) {

			socket.on("central.message", (request) => {

				if (request.event === "update" && request.type === "REQUEST" && conf.update.enable) {
					const onLog = (data) => {

						try {
							data = JSON.parse(data.toString())
						}
						catch(err) {
							data = data.toString()
						}
						const message = {
							message: {
								id: request.id,
								event: request.event,
								type: 'DATA',
								data: data
							}
						}
						socket.emit("central.message", message)
					}

					if (autoUpdater.logger) {
						autoUpdater.logger.on("data", onLog)
					}

					downloadUpdateInstall(params && params.version ? params.version : "latest", callback).then(() => {
						const message = {
							message: {
								id: request.id,
								event: request.event,
								type: 'END',
								data: null
							}
						}
						socket.emit("central.message", message)
					})
						.catch((err) => {
							const message = {
								message: {
									id: request.id,
									event: request.event,
									type: 'ERROR',
									data: err.message
								}
							}

							socket.emit("central.message", message)
						})
						.finally(() => {
							if (autoUpdater.logger) {
								autoUpdater.logger.removeListener("data", onLog)
							}
							if (callback) {
								callback("show_loader", 'update', 'end')
							}
						})
				} else {
					let ignored = true
					switch (request.event) {
						case 'notification':
							callback('action.notification', request.data)
							ignored = false
							break;
						case 'reload':
							ipcMain.emit('action.reload')
							ignored = false
							break;

						default:
							break;
					}

					if (!ignored && request.type === "REQUEST") {
						const message = {
							message: {
								id: request.id,
								event: request.event,
								type: 'END',
								data: null
							}
						}
						socket.emit("central.message", message)
					}
				}

				// TODO
			})

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
			socket.on('central.custom.push', (event, timestamp, params) => {
				socket.emit("central.custom", event, timestamp)
				if (event === '@wel/update' && conf.update.enable) {

					const onLog = (data) => {
						socket.emit("central.custom", event + '.data', timestamp, data.toString())
					}

					if (autoUpdater.logger) {
						autoUpdater.logger.on("data", onLog)
					}
					if (callback) {
						callback("show_loader", 'update', 'start')
					}
					downloadUpdateInstall(params && params.version ? params.version : "latest", callback).then(() => {
						socket.emit("central.custom", event + '.end', timestamp)
					})
						.catch((err) => {
							socket.emit("central.custom", event + '.error', timestamp, err)
						})
						.finally(() => {
							if (autoUpdater.logger) {
								autoUpdater.logger.removeListener("data", onLog)
							}
							if (callback) {
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

	if (callback) {
		callback('finish')
	}
}
