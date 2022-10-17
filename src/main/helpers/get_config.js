const fs = require("fs").promises
const ini = require('ini')
const {extname} = require('path')
const CustomError = require("../../helpers/custom_error")
const default_config = require("./default_config")
const set_config = require("./set_config")

module.exports =  function getConfig(path, raw) {

	return fs.lstat(path).then((stats) => {
		if (!stats.isFile()) {
			return Promise.reject(new CustomError(400, CustomError.CODE.INVALID_$$_PATH, `invalid config path (${path})`, ["CONFIG"]))
		}
		if (extname(path) !== '.ini') {
			return Promise.reject(new CustomError(400, CustomError.CODE.INVALID_$$_PATH, `invalid config path. Required .ini file (${path})`, ["CONFIG"]))
		}
		return fs.readFile(path).then((data) => {
			return raw ? data : ini.parse(data.toString())
		})

	})
	.catch((err) => {
		if (err.code === "ENOENT") {
			const defaultConfig = {
				url: '%%_APP_URL_%%',
				wpt: {
					url: '%%_WPT_URL_%%'
				}
			}
			default_config(defaultConfig)
			const data = ini.stringify(defaultConfig)
			return set_config(path, data).then(() => {

				const message = `Default config file generated. Set correct values in\r\r config path: ${path}`
				const ce = new CustomError(400, CustomError.CODE.INVALID_PARAMETER_VALUE, message, ["config"])
				throw ce
			})
			// TODO create a defaultConfig
		}
		throw err

	})
}
