const checkUpdate = require("./check_update")
const downloadUpdate = require("./download_update")
const quitAndInstall = require("./quit_and_install")

module.exports = updateDownloadInstall = (callback) => {

	if (callback) {
		callback('check_update')
	}
	return checkUpdate().then((checkUpdatedResult) => {
		return downloadUpdate(checkUpdatedResult.cancellationToken, callback)
	})
	.then(() => {
		return quitAndInstall(callback)
	})
	.then(() => {
		if (callback) {
			callback('check_update_done')
		}
		return true
	})
	.catch((err) => {
		if (err && err.api_code !== 'UPDATE_NOT_AVAILABLE') {
			if (callback) {
				callback('check_update_error')
			}
			throw err
		}
		if (callback) {
			callback('check_update_skip')
		}
		return false
	})
}
