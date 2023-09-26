const path = require('path')
const log = process.env.NODE_ENV !== "test" ? require("../electron_log") : null

const CustomError = require("../../../helpers/custom_error")
const ConfigValidator = require('./config_validator')
const defaultConfig = require('./default_config')

module.exports =  function  checkConfig(config, userPath) {
	defaultConfig(config, log)

	// separate from default config to not expose it from default config file generation
	if (!config.publish) {
		config.publish = {
			provider: "github",
			owner: "Wynd-Lab",
			repo: "wynd-electron-launcher"
		}
	}

	const cv = new ConfigValidator(userPath)

	const [valid, errors] = cv.validate(config)
	if (!valid) {
		// log && log.error("parsed config", config)
		if (errors.length === 0) {
			throw new CustomError(400, CustomError.CODE.INVALID_CONFIG, 'config.ini is not valid')
		}
		if (errors[0].err) {
			errors[0].err.api_code = "CONFIG_" + errors[0].err.api_code
			if (userPath && typeof userPath === 'string') {
				errors[0].err.message += `\r\r config path:\r\t${path.join(userPath, 'config.ini')}`
			}
			throw errors[0].err
		}
		const params =  errors[0].params
		const key = errors[0].instancePath ? errors[0].instancePath.substring(1).replace(/\//g, '.') : "config"
		let message = key + ': ' + (errors[0].keyword === 'enum' && params.allowedValues ?  errors[0].message + ' [' + params.allowedValues + ']' :  errors[0].message)

		if (params.additionalProperty) {
			message += ' ' + params.additionalProperty
		}

		const errConfig = new CustomError(400, CustomError.CODE.CONFIG_INVALID_PARAMETERS, message)
		errConfig.setData('key', key)
		errConfig.setData('params', params)
		throw errConfig
	}

	if (config.http.enable) {

		config.http.static = config.url
	}
}
