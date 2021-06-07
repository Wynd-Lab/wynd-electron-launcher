const {URL} = require("url")

const CustomError = require("../../helpers/custom_error")

const convertBoolean = function (conf, sections, defaultValue = false) {
	let value = getValue(conf, sections)

	value = value || defaultValue

	if (typeof value === "boolean") {
		return value
	}
	if (value === "1" || value === "true") {
		return true
	} else	if (value === "0" || value === "false") {
		return false
	} else {
		throw new CustomError(
			400,
			CustomError.CODE.INVALID_PARAMETER_VALUE,
			`${sections.join('.')} invalid parameter value (expected: [0, 1, true, false], get: ${section.enable})`
		)
	}
}
const convertEnable = function (conf, sections, defaultValue = false) {

	sections.push('enable')
	return convertBoolean(conf, sections, defaultValue)
}

const getValue = function(conf, sections) {
	let value = conf
	for (let i = 0; i < sections.length; i++) {
		const sub = sections[i];
		value = value[sub]
	}
	return value

}

const convertFloat = function (conf, sections) {

	const value = getValue(conf, sections)
	if (typeof value === "integer") {
		return value
	}

	const convertedValue = Number.parseFloat(value)
	if (Number.isNaN(convertedValue)) {
		throw new CustomError(
			400,
			CustomError.CODE.INVALID_PARAMETER_VALUE,
			`${sections.join('.')} invalid parameter value (expected: number, get: ${value})`
		)
	} else {
		return convertedValue
	}

}

const convertInteger = function (conf, sections, defaultValue = null) {
	let value = getValue(conf, sections)
	if (typeof value === "integer") {
		return value
	}

	value = value || defaultValue

	const convertedValue = Number.parseInt(value)
	if (Number.isNaN(convertedValue)) {
		throw new CustomError(
			400,
			CustomError.CODE.INVALID_PARAMETER_VALUE,
			`${sections.join(".")}.enable invalid parameter value (expected: integer, get: ${value})`
		)
	} else {
		return convertedValue
	}
}

const convertUrl = function checkUrl(url) {
	const aUrl =  new URL(url)

	return {
		href : aUrl.href,
		host: aUrl.host,
		hostname: aUrl.hostname,
		port: aUrl.port,
		protocol: aUrl.protocol
	}
}

module.exports =  function  checkConfig(config) {
	if (!config.url) {
	 throw new CustomError(404, CustomError.CODE.MISSING_MANDATORY_PARAMETER, null, ["url"])
	}
	else {
		config.url = convertUrl(config.url)
	}
	if (!config.screen) {
		config.screen = 0
	}
	else {
		config.screen = convertInteger(config, ["screen"])
	}

	if (!config.menu) {
		config.menu = {
			enable: true,
			phone_number: null,
			password: null
		}
	} else {
		config.menu.enable = convertEnable(config, ["menu"], true)
	}

	if (!config.emergency) {
		config.emergency = {
			enable: true
		}

	}
	else {
		config.emergency.enable = convertEnable(config, ["emergency"],  true)
	}

	if (!config.wpt) {
		config.wpt = {
			enable: false,
			path: null,
			url: convertUrl('http://localhost:9963')
		}
	} else {
		config.wpt.enable = convertEnable(config, ["wpt"])
		if (!config.wpt.url) {
			config.wpt.url = convertUrl('http://localhost:9963')
		}
		if (config.wpt.enable && !config.wpt.path) {
			throw new CustomError(400, CustomError.CODE.MISSING_MANDATORY_PARAMETER, null, ["wpt.path"])
		}
	}
	if (!config.chrome) {
		config.chrome = {
			enable: false,
			margin: 2
		}

	} else {
		config.chrome.enable = convertEnable(config, ["chrome"], false)
		if (config.chrome.margin) {
			config.chrome.margin = convertFloat(config, ['chrome', 'margin'])
		} else {
			config.chrome.margin = 1.0
		}
	}


	if (!config.start_update) {
		config.start_update = {
			enable: false
		}
	} else {
		config.start_update.enable =  convertEnable(config, ["start_update"], false)
	}

	if (!config.http_update) {
		config.http_update = {
			enable: false,
			port: null
		}
	} else {
		config.http_update.enable =  convertEnable(config, ["http_update"], false)
		config.http_update.port = convertInteger(config, ['http_update', 'port'], null)
	}

	if (!config.socket_update) {
		config.socket_update = {
			enable: false,
		}
	} else {
		config.socket_update.enable =  convertEnable(config, ["socket_update"], false)
	}
}
