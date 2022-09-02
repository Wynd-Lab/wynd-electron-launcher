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

module.exports = async function initialize(params, callback, opts) {

	if (!opts) {
		opts = {}
	}

	if (!opts.keep_wpt && opts.keep_socket_connection) {
		opts.keep_socket_connection = false
	}

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

	if (conf.wpt && conf.wpt.enable && conf.wpt.path && !opts.keep_wpt) {

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

	if (conf.wpt && conf.wpt.enable && !opts.keep_socket_connection) {

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

	} else if (callback) {
		callback('wpt_connect', null)
		callback('wpt_connect_skip')
	}

	if (callback) {
		callback('finish')
	}
}
