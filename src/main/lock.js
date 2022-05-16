const { app } = require('electron')

const gotTheLock = app.requestSingleInstanceLock()

if (!gotTheLock) {
	app.quit()
}
