const Validation = require("../src/main/helpers/validate_config")

const data = {
	url: "./remote",
	wpt: {
		url: "http://localhost:9963"
	},
	update: {
		enable: "1",
	}
}

const validation = new Validation("/home/ppetit/.config/electron-container")

const [valid, errors] = validation.validate(data)
console.log(data)
if (!valid) console.log(errors)
