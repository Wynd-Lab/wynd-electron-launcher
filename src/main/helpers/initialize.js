const getConfig = require("./get_config")
const launchWpt = require("./launch_wpt")
const checkConfig = require("./launch_wpt")

module.exports =  async function initialize(params, callback) {

	const conf = await getConfig(params.conf)
	if (callback) {
		callback('get_conf', null)
	}

	checkConfig(conf)
	if (callback) {
		callback('check_conf', conf)
	}

	if (conf.wpt && conf.wpt.enable) {
		const wpt = await launchWpt(conf.wpt.path)
		if (callback) {
			callback('get_wpt', wpt)
		}
	}
}
