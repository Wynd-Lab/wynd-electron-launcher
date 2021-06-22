const log = process.env.NODE_ENV !== "test" ? require("electron-log") : null

const CustomError = require("../../helpers/custom_error")
const validateConfig = require('./validate_config')

// const convertBoolean = function (conf, sections, defaultValue = false) {
// 	let value = getValue(conf, sections)

// 	value = value || defaultValue

// 	if (typeof value === "boolean") {
// 		return value
// 	}
// 	if (value === "1" || value === "true") {
// 		return true
// 	} else	if (value === "0" || value === "false") {
// 		return false
// 	} else {
// 		throw new CustomError(
// 			400,
// 			CustomError.CODE.INVALID_PARAMETER_VALUE,
// 			`${sections.join('.')} invalid parameter value (expected: [0, 1, true, false], get: ${section.enable})`
// 		)
// 	}
// }
// const convertEnable = function (conf, sections, defaultValue = false) {

// 	sections.push('enable')
// 	return convertBoolean(conf, sections, defaultValue)
// }

// const getValue = function(conf, sections) {
// 	let value = conf
// 	for (let i = 0; i < sections.length; i++) {
// 		const sub = sections[i];
// 		value = value[sub]
// 	}
// 	return value

// }

// const convertFloat = function (conf, sections) {

// 	const value = getValue(conf, sections)
// 	if (typeof value === "integer") {
// 		return value
// 	}

// 	const convertedValue = Number.parseFloat(value)
// 	if (Number.isNaN(convertedValue)) {
// 		throw new CustomError(
// 			400,
// 			CustomError.CODE.INVALID_PARAMETER_VALUE,
// 			`${sections.join('.')} invalid parameter value (expected: number, get: ${value})`
// 		)
// 	} else {
// 		return convertedValue
// 	}

// }

// const convertInteger = function (conf, sections, defaultValue = null) {
// 	let value = getValue(conf, sections)
// 	if (typeof value === "integer") {
// 		return value
// 	}

// 	value = value || defaultValue

// 	const convertedValue = Number.parseInt(value)
// 	if (Number.isNaN(convertedValue)) {
// 		throw new CustomError(
// 			400,
// 			CustomError.CODE.INVALID_PARAMETER_VALUE,
// 			`${sections.join(".")}.enable invalid parameter value (expected: integer, get: ${value})`
// 		)
// 	} else {
// 		return convertedValue
// 	}
// }

// const convertUrl = function checkUrl(url) {
// 	const aUrl =  new URL(url)

// 	return {
// 		href : aUrl.href,
// 		host: aUrl.host,
// 		hostname: aUrl.hostname,
// 		port: aUrl.port,
// 		protocol: aUrl.protocol
// 	}
// }

module.exports =  function  checkConfig(config) {
	if (!config.url) {
		config.url = null
	//  throw new CustomError(404, CustomError.CODE.MISSING_MANDATORY_PARAMETER, null, ["url"])
	}
	// else {
	// 	config.url = convertUrl(config.url)
	// }
	// if (!config.screen) {
	// 	config.screen = 0
	// }
	// else {
	// 	config.screen = convertInteger(config, ["screen"])
	// }

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

	const [valid, errors] = validateConfig.validate(config)
	if (!valid) {
		log && log.error("parsed config", config)
		if (errors.length === 0) {
			throw new CustomError(400, CustomError.CODE.INVALID_CONFIG, 'config.ini is not valid')
		}
		if (errors[0].err) {
			errors[0].err.api_code += "CONFIG_"
			throw errors[0].err
		}
		const errConfig = new CustomError(400, CustomError.CODE.CONFIG_INVALID_PARAMETERS, errors[0].message)
		errConfig.setData('key', errors[0].instancePath ? errors[0].instancePath.substring(1).replace(/\//g, '.') : "unknown")
		errConfig.setData('params', errors[0].params)
		throw errConfig
	}

	if (config.url === "local") {
		config.http.enable = true
		if (!config.http.port) {
			config.http.port = process.env.HTTP_PORT || 1212
		}
		config.url = validateConfig.convertUrl(`http://localhost:${config.http.port}`)
	}
}
