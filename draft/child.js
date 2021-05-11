const launchWpt = require("../src/main/helpers/launch_wpt")
const killWpt = require("../src/main/helpers/kill_wpt")

const programPath = '/home/nekran/nodeJS/wyndpostools'

launchWpt(programPath).then((child) => {
	return killWpt(child)
})
.catch((err) => {
	console.log(err.toString())
})
