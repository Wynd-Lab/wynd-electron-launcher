const axios = require('axios')
const log = require("electron-log")

const getConfig = require("./get_config")
const checkConfig = require("./check_config")
const launchWpt = require("./launch_wpt")
const connectToWpt = require("./connect_to_wpt")
const getScreens = require("./get_screens")
const forceKill = require("./force_kill")
const checkUpdate = require("./check_update")
const downloadUpdate = require("./download_update")
const quitAndInstall = require("./quit_and_install")
const wait = require("./wait.js")

module.exports =  async function initialize(params, callback) {
	await wait(400)
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

	if (conf.update && conf.update.on_start) {


		try {
			if (callback) {
				callback('check_update')
			}
			const checkUpdatedResult = await checkUpdate()
			if (callback) {
				callback('check_update_done', checkUpdatedResult)
			}
			await downloadUpdate(checkUpdatedResult.cancellationToken, callback)

			await quitAndInstall(callback)
			return
		} catch(err) {
			if (err && err.api_code === 'UPDATE_NOT_AVAILABLE') {
				if (callback) {
					callback('check_update_skip')
				}
			} else {
				throw err
			}
		}


	} else if (callback) {
		callback('check_update_skip')
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
			log.error.err
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

	if (callback) {
		callback('finish')
	}
	return socket
}
