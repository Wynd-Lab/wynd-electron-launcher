const checkUpdate = require("./check_update")
const downloadUpdate = require("./download_update")
const quitAndInstall = require("./quit_and_install")

module.exports = updateDownloadInstall = (callback) => {

	if (callback) {
		callback('check_update')
	}
	return checkUpdate().then((checkUpdatedResult) => {
		console.log("checkUpdate finished")
		return downloadUpdate(checkUpdatedResult.cancellationToken, callback)
	})
	.then(() => {
		return quitAndInstall(callback)
	})
	.then(() => {
		console.log("quit and install done")
		if (callback) {
			callback('check_update_done')
		}	})
	.catch((err) => {
		if (callback) {
			callback('check_update_skip')
		}
		if (err && err.api_code !== 'UPDATE_NOT_AVAILABLE') {
			throw err
		}
	})
}
