const checkUpdate = require("./check_update")
const downloadUpdate = require("./download_update")
const quitAndInstall = require("./quit_and_install")

module.exports = downloadUpdateInstall = (currentVersion, callback) => {

	if(callback) {
		callback("show_loader", 'update', 'start')
	}
	return checkUpdate(currentVersion, callback).then((checkUpdatedResult) => {
		if (checkUpdatedResult) {
			return downloadUpdate(checkUpdatedResult.cancellationToken, callback)
			.then(() => {
				return quitAndInstall(callback)
			})
		}
	})
	.then(() => {
		return true
	})
	.finally(() => {
		setTimeout(() => {
			if(callback) {
				callback("show_loader", 'update', 'end')
			}
		}, 1000)
	})

}
