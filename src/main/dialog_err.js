const { app, dialog } = require('electron')
const log = require("electron-log")

const CustomError = require('../helpers/custom_error')

module.exports = function dialogErr(store, err) {
	const message = err.toString ? err.toString() : err.message
	const dialogOpts = {
		type: 'error',
		buttons: ['Close'],
		title: 'Application error',
		message: err.api_code || err.code || "An error as occured",
		detail: message
	}

	if (err && err.messages && typeof err.messages === "string") {
		dialogOpts.detail = dialogOpts.detail + '\n' + err.messages
	}

	if ((!process.env.DEBUG || process.env.DEBUG !== "loader") && store.windows.loader.current && store.windows.loader.current.isVisible()) {
		store.windows.loader.current.hide()
	}
	dialog.showMessageBox(store.windows.container.current, dialogOpts).then((returnValue) => {
		if (store.http) {
			store.http = null
		}
		if (store.wpt && store.wpt.socket) {
			store.wpt.socket = null
		}

		if (store.http) {
			store.http = '...'
		}
		if (store.windows && store.windows.container.current) {
			store.windows.container.current = '...'
		}
		if (store.windows && store.windows.loader.current) {
			store.windows.loader.current = '...'
		}

		if (store.wpt && store.wpt.process) {
			store.wpt.process = '...'
		}
		log.error('STATE', store)
		if (err instanceof CustomError) {
			log.error(err.api_code , err.message, err.data)
		} else {
			log.error(err.code || "", err)
		}
		log.error(dialogOpts.detail)

		if (!process.env.DEBUG || process.env.DEBUG !== "loader") {
			app.quit()
		}
	})
}
