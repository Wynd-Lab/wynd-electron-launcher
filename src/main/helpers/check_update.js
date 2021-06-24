const { autoUpdater } = require('electron-updater')
const CustomError = require("../../helpers/custom_error")

module.exports = checkUpdate = () => {

	autoUpdater.allowDowngrade = true
	autoUpdater.autoDownload = false
	// autoUpdater.channel = "latest-decath"
	autoUpdater.setFeedURL({
		provider: "github", "owner": "Wynd-Lab",	"repo": "wyndpos-electron-react"
	})

	// autoUpdater.setFeedURL({
	// 	provider: 'generic',
	// 	url: "http://localhost:5000/update/" + Platform.current()/latest-decathlon-linux.yml
	// })

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
		autoUpdater.once('error', (err) => {

			reject(new CustomError(500, CustomError.CODE.$$_ERROR, err.message, ["UPDATE"]))
		})
		autoUpdater.once('update-available', (onUpdateAvailable))
		autoUpdater.checkForUpdates()
	})
}
