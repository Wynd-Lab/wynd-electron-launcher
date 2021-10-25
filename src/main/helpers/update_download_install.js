const checkUpdate = require("./check_update")
const downloadUpdate = require("./download_update")
const quitAndInstall = require("./quit_and_install")

module.exports = downloadUpdateInstall = (callback) => {

	if(callback) {
		callback("show_loader", 'update', 'start')
	}
	return checkUpdate(callback).then((checkUpdatedResult) => {
		return downloadUpdate(checkUpdatedResult.cancellationToken, callback)
	})
	.then(() => {
		return quitAndInstall(callback)
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
