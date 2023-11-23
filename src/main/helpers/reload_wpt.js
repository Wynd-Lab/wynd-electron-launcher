
const killWPT = require('./kill_wpt')
const clearCache = require('./clear_cache')
const launchWpt = require('./create_wpt')
const CustomError = require('../../helpers/custom_error')

module.exports = async function  reloadWPT(wpt, confWpt, callback) {
	clearCache()

	const result = {
		kill_wpt: {
			success: true,
			err: null
		},
		start_wpt: {
			pid: null,
			success: true,
			err: null
		}
	}
	if (wpt.process) {
		try {
			const child = await killWPT(wpt, callback)
			result.kill_wpt.pid = child.pid
		} catch(err) {
			result.kill_wpt.success = false
			result.kill_wpt.err = err
		}
	} else {
		result.kill_wpt.success = false
		result.kill_wpt.err = new CustomError(400, CustomError.CODE.$$_NOT_AVAILABLE, null, ["PROCESS"])
	}
	if (confWpt.path && confWpt.cwd) {
		try {
			const child = await launchWpt(confWpt, callback)
			result.start_wpt.pid = child.pid
		} catch(err) {
			result.start_wpt.success = false
			result.start_wpt.err = err
		}
	} else {
		result.start_wpt.success = false
		result.kill_wpt.err = new CustomError(400, CustomError.CODE.$$_NOT_FOUND, null, ["WPT_PATH"])
	}

	return result
}
