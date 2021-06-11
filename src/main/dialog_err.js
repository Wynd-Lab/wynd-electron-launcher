const { app, dialog } = require('electron')
const log = require("electron-log")

const CustomError = require('../helpers/custom_error')

module.exports = function dialogErr(store, err) {
	console.log("dialogErr")
	const message = err.toString ? err.toString() : err.message
	const dialogOpts = {
		type: 'error',
		buttons: ['Close'],
		title: 'Application error',
		message: err.api_code || err.code || "An error as occured",
		detail: message
	}
	err instanceof Error || err instanceof CustomError ?
		log.error(err) :
		log.error(dialogOpts.message, dialogOpts.detail)

	if ((!process.env.DEBUG || process.env.DEBUG !== "main") && store.windows.loader.current && store.windows.loader.current.isVisible()) {
		store.windows.loader.current.hide()
	}

	dialog.showMessageBox(store.windows.pos.current, dialogOpts).then((returnValue) => {
		log.error(store)

		if (!process.env.DEBUG || process.env.DEBUG !== "main") {
			app.quit()
		}
	})
}
