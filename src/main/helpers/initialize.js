const getConfig = require("./get_config")
const checkConfig = require("./check_config")
const launchWpt = require("./launch_wpt")
const connectToWpt = require("./connect_to_wpt")
const getScreens = require("./get_screens")
const chooseScreen = require("./choose_screen")
const forceKill = require("./force_kill")
const log = require("electron-log")

const wait = function(timeout = 100) {
	return new Promise((resolve) => {
		setTimeout(() => {
			resolve()
		}, timeout)
	})
}

module.exports =  async function initialize(params, callback) {
	await wait(500)

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

		if (conf.update && !conf.update.on_start) {
			callback('update_skip')
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

		try {
			if (callback) {
				callback('launch_wpt')
			}
			const wpt = await launchWpt(conf.wpt.path, callback)
			if (callback) {
				callback('launch_wpt_done', wpt)
			}

		}
		catch(err) {
			if (err.toString && err.toString().indexOf("EADDRINUSE") > 0) {
				try {
					await forceKill('9963')
					const wpt = await launchWpt(conf.wpt.path, callback)
					if (callback) {
						callback('launch_wpt_done', wpt)
					}
				}
				catch(err2) {
					log.error(err2)
					throw err
				}
				// throw err
				// const wpt = await launchWpt(conf.wpt.path)
				// if (callback) {
				// 	callback('get_wpt', wpt)
				// }
			} else {
				throw err
			}
		}

	} else if (callback) {
		callback('launch_wpt_skip')
	}
	const socket = await connectToWpt(conf.wpt.url.href, callback)

	if (callback) {
		// console.log("FINISH callback")
		setTimeout(() => {
			callback('finish')
		}, 300)
	}
	return socket
}
