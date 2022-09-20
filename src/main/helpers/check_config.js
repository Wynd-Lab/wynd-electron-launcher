const log = process.env.NODE_ENV !== "test" ? require("./electron_log") : null

const CustomError = require("../../helpers/custom_error")
const ConfigValidator = require('./config_validator')


module.exports =  function  checkConfig(config, userPath) {

	if (!config.url) {
		config.url = null
	}

	if (!config.screen) {
		config.screen = null
	}
	if (!config.menu) {
		config.menu = {
			enable: true,
			phone_number: null,
			email: null,
			password: null
		}

	} else if (!config.menu.logo) {
		config.menu.logo = 'Logo.png'
	}

	if (!config.view) {
		config.view = "iframe"
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
			url: 'http://localhost:9963',
			keep_listeners: false,
			detached: false,
			shell: false,
			cwd: null,

		}
	} else {
		if (!config.wpt.url) {
			config.wpt.url = 'http://localhost:9963'
		}
		if (config.wpt.path && config.wpt.wait_on_ipc === undefined) {
			config.wpt.wait_on_ipc = false
		}

		if (config.wpt.path && config.wpt.keep_listeners === undefined) {
			config.wpt.keep_listeners = false
		}
		if (config.wpt.path && config.wpt.detached === undefined) {
			config.wpt.detached = false
		}
		if (config.wpt.path && config.wpt.shell === undefined) {
			config.wpt.shell = false
		}
		if (config.wpt.path && config.wpt.cwd === undefined) {
			config.wpt.cwd = null
		}
	}

	// if (!config.socket) {
	// 	config.socket = {
	// 		enable : !!config.wpt.enable
	// 	}
	// }

	if (!config.central) {
		config.central = {
			enable: false,
			mode: "AUTO"
		}
	} else {
		if (!config.central.mode) {
			config.central.mode = "AUTO"
		}
	}

	if(!config.report) {
		config.report = {
			enable: false
		}
	}
	// else if(!config.central.mode) {
	// 	config.central.mode = "AUTO"
	// }


	if(!config.report) {
		config.report = {
			enable: false
		}
	}

	if(!config.proxy) {
		config.proxy = {
			enable: false,
			url: null
		}
	}
	// else if(!config.central.mode) {
	// 	config.central.mode = "AUTO"
	// }



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

	if (!config.zoom) {
		config.zoom = {
			level: 1,
			factor: 0.99,
		}

	} else {
		if (config.zoom.level === undefined) {
			config.zoom.level = 1
		}
		if (config.zoom.factor === undefined) {
			config.zoom.factor = 0.99
		}
	}

	if (!config.log) {
		config.log = {
			main: 'info',
			renderer: 'info',
			app: 'info'
		}
	} else {
		if (!config.log.main) {
			config.log.main = 'info'
		}

		if (!config.log.renderer) {
			config.log.renderer = 'info'
		}

		if (!config.log.app) {
			config.log.app = 'info'
		}
	}

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
		log && log.error("parsed config", config)
		if (errors.length === 0) {
			throw new CustomError(400, CustomError.CODE.INVALID_CONFIG, 'config.ini is not valid')
		}
		if (errors[0].err) {
			errors[0].err.api_code = "CONFIG_" + errors[0].err.api_code
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
