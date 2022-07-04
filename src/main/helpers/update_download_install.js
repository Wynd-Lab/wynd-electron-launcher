const checkUpdate = require("./check_update")
const downloadUpdate = require("./download_update")
const quitAndInstall = require("./quit_and_install")

module.exports = downloadUpdateInstall = (params, callback) => {

	if(callback) {
		callback("show_loader", 'update', 'start')
	}
	return checkUpdate(params, callback).then((checkUpdatedResult) => {
		if (checkUpdatedResult) {
			return downloadUpdate(checkUpdatedResult.cancellationToken, callback)
			.then(() => {
				return quitAndInstall(callback)
			})
		}
		return false
	})
	.finally(() => {
		if(callback) {
			setTimeout(() => {
					callback("show_loader", 'update', 'end')
				}, 1000)
		}
	})

}
