const fs = require("fs").promises
const ini = require('ini')

module.exports =  function getConfig(path) {

	return fs.readFile(path).then((data) => {
		return ini.parse(data.toString())
	})
}
