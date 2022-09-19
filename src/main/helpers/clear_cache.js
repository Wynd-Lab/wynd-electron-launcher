const { webFrame, session } = require('electron')

module.exports = function clearCache() {
	webFrame.clearCache()
	return session.defaultSession.clearCache()
		.then(() => {
			return session.defaultSession.clearStorageData()
		})
		.then(() => {
			return session.defaultSession.clearAuthCache()
		})
}
