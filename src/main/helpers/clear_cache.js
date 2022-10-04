const { webFrame, session } = require('electron')

module.exports = function clearCache() {
	if (webFrame) {
		webFrame.clearCache()
	}
	return session.defaultSession.clearCache()
		.then(() => {
			return session.defaultSession.clearStorageData()
		})
		.then(() => {
			return session.defaultSession.clearAuthCache()
		})
}
