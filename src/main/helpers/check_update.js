const { autoUpdater } = require('electron-updater')
const log = require("electron-log")
const CustomError = require("../../helpers/custom_error")
module.exports = checkUpdate = (store) => {


	autoUpdater.allowDowngrade = true
	autoUpdater.autoDownload = false
	autoUpdater.logger = log;
	autoUpdater.setFeedURL({
		provider: "github", "owner": "Wynd-Lab",	"repo": "wyndpos-electron-react"
	})

	return new Promise((resolve, reject) => {
		const onUpdateNotAvailable = () => {
			autoUpdater.removeListener('update-available', onUpdateAvailable)
			reject(new CustomError(451, CustomError.CODE.$$_NOT_AVAILABLE, 'update is not available', ["UPDATE"]))
		}
		const onUpdateAvailable = (data) => {
			autoUpdater.removeListener('update-not-available', onUpdateNotAvailable)
			resolve(data)
		}
		autoUpdater.once('update-not-available', onUpdateNotAvailable)

		autoUpdater.once('update-available', (onUpdateAvailable))
		return autoUpdater.checkForUpdates()
	})
}
