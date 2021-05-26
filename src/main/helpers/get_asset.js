const path = require('path')

const { app } = require('electron')

module.exports = getAssetPath = (file) => {
	const RESOURCES_PATH = app.isPackaged
		? path.join(process.resourcesPath)
		: path.join(__dirname, '..', '..', '..')

return path.join(RESOURCES_PATH,'assets', file)
}
