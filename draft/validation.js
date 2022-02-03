const Validation = require("../src/main/helpers/config_validator")

const data = {
	// url: "http://localhost:4000",
	wpt: {
		wait_on_ipc: '1',
    enable: '1',
    path: '/home/ppetit/nodejs/wyndpostools/bashs/start.sh',
	},
	central: {
		enable: '1',
		mode : "AUTO"
	}
}

const validation = new Validation("/home/ppetit/electron/wynd-electron-launcher/")

const [valid, errors] = validation.validate(data)
// console.log(valid, errors)
if (!valid) console.log(errors)
