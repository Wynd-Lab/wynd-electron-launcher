const forceKill = require("../src/main/helpers/force_kill")
const killWpt = require("../src/main/helpers/kill_wpt")


forceKill().then(() => {
	console.log("done")
})
.catch((err) => {
	console.log(err.toString())
})
