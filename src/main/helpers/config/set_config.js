const fs = require("fs").promises

module.exports =  function setConfig(path, data) {
	return fs.writeFile(path, data)
}
