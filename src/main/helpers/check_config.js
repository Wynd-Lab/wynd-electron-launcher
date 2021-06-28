const log = process.env.NODE_ENV !== "test" ? require("electron-log") : null

const CustomError = require("../../helpers/custom_error")
const ConfigValidator = require('./config_validator')


module.exports =  function  checkConfig(config, userPath) {
	if (!config.url) {
		config.url = null
	}

	if (!config.menu) {
		config.menu = {
			enable: true,
			phone_number: null,
			password: null
		}
	}

	if (!config.emergency) {
		config.emergency = {
			enable: false
		}

	}

	if (!config.wpt) {
		config.wpt = {
			enable: false,
			path: null,
			url: 'http://localhost:9963'
		}
	} else if (!config.wpt.url) {
		config.wpt.url = 'http://localhost:9963'
	}

	if (!config.http) {
		config.http = {
			enable: false,
			port: null
		}
	}

	if (!config.update) {
		config.update = {
			enable: false,
			on_start: false,
		}
	}

	const cv = new ConfigValidator(userPath)

	const [valid, errors] = cv.validate(config)
	if (!valid) {
		log && log.error("parsed config", config)
		if (errors.length === 0) {
			throw new CustomError(400, CustomError.CODE.INVALID_CONFIG, 'config.ini is not valid')
		}
		if (errors[0].err) {
			errors[0].err.api_code = "CONFIG_" + errors[0].err.api_code
			throw errors[0].err
		}
		const errConfig = new CustomError(400, CustomError.CODE.CONFIG_INVALID_PARAMETERS, errors[0].message)
		errConfig.setData('key', errors[0].instancePath ? errors[0].instancePath.substring(1).replace(/\//g, '.') : "unknown")
		errConfig.setData('params', errors[0].params)
		throw errConfig
	}

	if (!config.url || typeof config.url === "string") {
		config.http.enable = true
		if (!config.http.port) {
			config.http.port = process.env.HTTP_PORT || 1212
		}
		if (config.url) {
			config.http.static = config.url

		}
		config.url = cv.convertUrl(`http://localhost:${config.http.port}`)
	}
}
