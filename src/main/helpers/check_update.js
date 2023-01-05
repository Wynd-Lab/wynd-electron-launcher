const { app } = require('electron')
const autoUpdater = require('./auto_updater');
const CustomError = require("../../helpers/custom_error")

module.exports = checkUpdate = (params, callback) => {
	autoUpdater.forceDevUpdateConfig = !app.isPackaged
	autoUpdater.allowPrerelease = Boolean(params.allowPrerelease)

	const url ={}
	if (params.provider) {
		url.provider = params.provider
	}

	if (params.owner) {
		url.owner = params.owner
	}

	if (params.repo) {
		url.repo = params.repo
	}

	if (params.url) {
		url.url = params.url
	}

	if (params.token) {
		url.token = params.token
	}

	if (params.host) {
		url.host = params.host
	}

	if (params.channel) {
		url.channel = params.channel
	}

	if (params.releaseType) {
		url.releaseType = params.releaseType
	}

	const currentVersion = app.getVersion()

	autoUpdater.setFeedURL(url)

	return new Promise((resolve, reject) => {
		const onUpdateNotAvailable = (data) => {
			autoUpdater.logger.info(`Current app version ${currentVersion}. Found remote version ${data.version}`)
			autoUpdater.removeListener('update-available', onUpdateAvailable)
			const err = new CustomError(451, CustomError.CODE.$$_NOT_AVAILABLE, 'update is not available', ["UPDATE"])
			err.data = data
			if (callback) {
				callback('check_update_skip', err)
			}
			if (currentVersion !== data.version) {
				reject(err)
			} else {
				resolve()
			}
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
