const { app } = require('electron')

const axios = require('axios')

const log = require("../helpers/electron_log")
const getConfig = require("./get_config")
const checkConfig = require("./check_config")
const launchWpt = require("./create_wpt")
const connectToWpt = require("./connect_to_wpt")
const getScreens = require("./get_screens")
const forceKill = require("./force_kill")
const downloadUpdateInstall = require("./update_download_install")
const createHttp = require('./create_http')

module.exports = async function initialize(params, callback, opts) {

	log.debug(`[INIT] > opt : ${opts}`)
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

		let killWPT = false
		// Case : WPT already opened and conf.wpt.path is set on app start
		try {
			request = await axios.options(conf.wpt.url.href, null, { timeout: 1000 })
			log.warn("[WPT] > URL: wpt found,  wpt.path is set, need to force kill other WPT process")
			killWPT = true
		}
		catch (err) {
			log.error(`[WPT] > KILL: ${err.code} ${err.message}`)
			if (err.code !== 'ECONNREFUSED') {
				killWPT = true
			}
		}
		if (killWPT) {
			try {
				await forceKill(conf.wpt.url.port)

			}
			catch(err) {
				log.error(`[WPT] > KILL(${killWPT}): ${err.code} ${err.message}`)
			}
		}

		if (callback) {
			callback('create_wpt')
		}

		await launchWpt(conf.wpt, callback)

	} else if (callback) {
		callback('create_wpt_skip')
	}

	if (conf.http && conf.http.enable && !opts.keep_http) {

		// let url = null
		// if (conf.proxy.enable && conf.proxy.url) {
		// 	url = conf.proxy.url
		// } else if (conf.url.protocol !== "file:") {
		// 	url = conf.url
		// }
		await createHttp(conf.http, { update: !!(conf.update && conf.update.enable), proxy: conf.proxy.enable || conf.url.protocol !== "file", url: conf.proxy.url, publish: conf.publish }, callback)
	} else if (callback) {
		callback('create_http_skip')
	}

	if (conf.wpt && conf.wpt.enable && !opts.keep_socket_connection) {

		await connectToWpt(conf, conf.wpt.url.href, callback)
		if (callback) {
			callback('wpt_connect_done', true)
		}

	} else if (callback) {
		callback('wpt_connect', null)
		callback('wpt_connect_skip')
		callback('wpt_infos_skip')
		callback('REQUEST_WPT_skip')
	}

	if (callback) {
		callback('finish')
	}
}
