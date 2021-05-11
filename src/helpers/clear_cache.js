const { webFrame } = require('electron')

module.exports =  function clearCache() {
	webFrame.clearCache()
}
