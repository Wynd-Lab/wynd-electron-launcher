const fs = require("fs").promises
const ini = require('ini')

module.exports =  function setConfig(path, data) {
	return fs.writeFile(path, data)
}
