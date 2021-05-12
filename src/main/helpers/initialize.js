const getConfig = require("./get_config")
const checkConfig = require("./check_config")
const launchWpt = require("./launch_wpt")
const connectToWpt = require("./connect_to_wpt")
const getScreens = require("./get_screens")
const forceKill = require("./force_kill")
const log = require("electron-log")

module.exports =  async function initialize(params, callback) {

	const screens = getScreens()
	if (callback) {
		callback('get_screens', screens)
	}
	const conf = await getConfig(params.conf)
	if (callback) {
		callback('get_conf', null)
	}

	checkConfig(conf)
	if (callback) {
		callback('check_conf', conf)
	}

	if (conf.wpt && conf.wpt.enable) {
		try {
			const wpt = await launchWpt(conf.wpt.path, callback)
			if (callback) {
				callback('get_wpt', wpt)
			}

		}
		catch(err) {
			if (err.toString && err.toString().indexOf("EADDRINUSE") > 0) {
				console.log("force Kill")
				try {
					await forceKill('9963')
					const wpt = await launchWpt(conf.wpt.path, callback)
					if (callback) {
						callback('get_wpt', wpt)
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

	}

	return await connectToWpt(conf.wpt.url, callback)

}
