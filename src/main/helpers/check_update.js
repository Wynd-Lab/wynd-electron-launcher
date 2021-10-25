const { autoUpdater } = require('electron-updater')
const CustomError = require("../../helpers/custom_error")

module.exports = checkUpdate = (callback) => {

	autoUpdater.allowDowngrade = true
	autoUpdater.autoDownload = false
	// autoUpdater.channel = "decath-latest"
	autoUpdater.setFeedURL({
		provider: "github", "owner": "Wynd-Lab",	"repo": "wynd-electron-launcher"
	})

	// autoUpdater.setFeedURL({
	// 	provider: 'generic',
	// 	url: "https://github.com/Wynd-Lab/wynd-electron-launcher/releases/download/v1.3.7/y"
	// })

	// autoUpdater.setFeedURL({
	// 	provider: 'generic',
	// 	url: "http://localhost:5000/update/" + Platform.current()/latest-decathlon-linux.yml
	// })

	return new Promise((resolve, reject) => {
		const onUpdateNotAvailable = (data) => {
			autoUpdater.removeListener('update-available', onUpdateAvailable)
			const err = new CustomError(451, CustomError.CODE.$$_NOT_AVAILABLE, 'update is not available', ["UPDATE"])
			if (callback) {
				callback('check_update_skip', err)
			}
			reject(err)
		}
		const onUpdateAvailable = (data) => {
			autoUpdater.removeListener('update-not-available', onUpdateNotAvailable)
			if (callback) {
				callback('check_update_done')
			}
			resolve(data)
		}
		autoUpdater.once('update-not-available', onUpdateNotAvailable)
		autoUpdater.once('error', (err) => {
			if (callback) {
				callback('check_update_skip', err)
			}
			reject(new CustomError(500, CustomError.CODE.$$_ERROR, err.message, ["UPDATE"]))
		})
		autoUpdater.once('update-available', (onUpdateAvailable))
		if (callback) {
			callback('check_update')
		}
		autoUpdater.checkForUpdates()
	})
}
