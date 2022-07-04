const CustomError = require("../../helpers/custom_error")
const autoUpdater = require('./auto_updater');

module.exports = downloadUpdate = (token, callback) => {

	return new Promise((resolve, reject) => {
		const onDownloadProgress = (progressObj) => {
			if (callback) {
				callback("download_progress", progressObj)
			}
		}

		const onUpdateDownloaded = (data) => {
			autoUpdater.removeListener('download-progress', onDownloadProgress)
			autoUpdater.removeListener("update-downloaded", onUpdateDownloaded)
			if (callback) {
				callback('download_update_done')
			}
			resolve(data)
		}

		autoUpdater.on("download-progress", onDownloadProgress)

		autoUpdater.on("update-downloaded", onUpdateDownloaded)

		if (callback) {
			callback('download_update')
		}
		autoUpdater.downloadUpdate(token)
			.catch((err) => {
				autoUpdater.removeListener('download-progress', onDownloadProgress)
				autoUpdater.removeListener("update-downloaded", onUpdateDownloaded)
				if (callback) {
					callback('download_update_skip')
				}
				reject(new CustomError(400, CustomError.CODE.UPDATE_DOWNLOAD, err.message))
			})
	})

}
