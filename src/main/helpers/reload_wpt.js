
const killWPT = require('./kill_wpt')
const clearCache = require('./clear_cache')
const launchWpt = require('./launch_wpt')

module.exports = function reloadWPT(wpt, child) {
	clearCache()
	return (child ? killWPT(child) : Promise.resolve())
	.then(() => {
		return wpt.path ?  launchWpt(wpt) : Promise.resolve()
	})
}
