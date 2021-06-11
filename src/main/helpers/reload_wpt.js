
const killWPT = require('./kill_wpt')
const clearCache = require('./clear_cache')
const launchWpt = require('./launch_wpt')

module.exports = function reloadWPT(wptPath, child) {
	clearCache()
	return (child ? killWPT(child) : Promise.resolve())
	.then(() => {
		return wptPath ?  launchWpt(wptPath) : Promise.resolve()
	})
}
