const fs = require("fs").promises
const ini = require('ini')

module.exports =  function getConfig(path, raw) {

	return fs.readFile(path).then((data) => {
		return raw ? data : ini.parse(data.toString())
	})
}
