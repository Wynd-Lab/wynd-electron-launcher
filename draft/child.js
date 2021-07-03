const launchWpt = require("../src/main/helpers/launch_wpt")
const killWpt = require("../src/main/helpers/kill_wpt")

const programPath = '/home/ppetit/nodejs/wyndpostools/bashs/start.sh'
let child = null
let pid = null
const callback = (event, data) => {
	console.log(event, data)
	if (event === 'get_wpt_pid') {
		pid = data
	}

}
launchWpt(programPath, callback).then((shellChild) => {
	child = shellChild
	return killWpt(child)
})
.then(() => {
	process.kill(pid, 'SIGKILL')
})
.catch((err) => {
	console.log(err.toString())
})
