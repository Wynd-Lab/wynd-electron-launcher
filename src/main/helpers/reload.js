import killWPT from './kill_wpt'
import clearCache from './clear_cache'
import launchWpt from './launch_wpt'


export default function reload(wptPath, child) {
	clearCache()
	return (child ? killWPT(child) : Promise.resolve())
	.then(() => {
		return wptPath ?  launchWpt(wptPath) : Promise.resolve()
	})
}
