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
	if (err instanceof CustomError) {
		log.error(err.api_code , err.message, err.data)
	} else {
		log.error(err.code || "", err)
	}


	if ((!process.env.DEBUG || process.env.DEBUG !== "main") && store.windows.loader.current && store.windows.loader.current.isVisible()) {
		store.windows.loader.current.hide()
	}

	dialog.showMessageBox(store.windows.container.current, dialogOpts).then((returnValue) => {
		log.error('MAIN STATE', store)

		if (!process.env.DEBUG || process.env.DEBUG !== "main") {
			app.quit()
		}
	})
}
