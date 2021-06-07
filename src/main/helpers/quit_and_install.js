const { autoUpdater } = require("electron-updater")

const wait = require("./wait")

module.exports = downloadUpdate = (callback) => {

		if (callback) {
			callback("update_quit")
		}

		return wait(500).then(() => {
			autoUpdater.quitAndInstall()
		})
}
