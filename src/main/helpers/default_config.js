
module.exports =  function defaultConfig(config) {

	if (!config.url) {
		config.url = null
	}

	if (!config.screen) {
		config.screen = 0
	}
	if (!config.raw) {
		config.raw = false
	}
	if (!config.kiosk) {
		config.kiosk = true
	}
	if (!config.full_screen) {
		config.full_screen = true
	}

	if (!config.frame) {
		config.frame = false
	}

	if (!config.border) {
		config.border = false
	}
	if (!config.view) {
		config.view = "iframe"
	}

	if (!config.menu) {
		config.menu = {
			enable: true,
			phone_number: null,
			email: null,
			password: null,
			button_size: 30,
			button_position: 0
		}

	} else if (!config.menu.logo) {
		config.menu.logo = 'Logo.png'
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
			connection_timeout: 10,
			creation_timeout: 30
		}
	} else {
		if (!config.wpt.enable) {
			config.wpt.enable = config.wpt.url ? true : false
		}
		if (!config.wpt.url) {
			config.wpt.url = 'http://localhost:9963'
		}
		if (!config.wpt.connection_timeout || config.wpt.connection_timeout <= 0) {
			config.wpt.connection_timeout = 10
		}
		if (!config.wpt.creation_timeout  || config.wpt.creation_timeout <= 0) {
			config.wpt.creation_timeout = 30
		}
		if (config.wpt.path && config.wpt.wait_on_ipc === undefined) {
			config.wpt.wait_on_ipc = false
		}
		if (config.wpt.path === undefined) {
			config.wpt.path = null
		}
		if (config.wpt.keep_listeners === undefined) {
			config.wpt.keep_listeners = config.wpt.path ? true : false
		}
		if ( config.wpt.detached === undefined) {
			config.wpt.detached = false
		}
		if (config.wpt.shell === undefined) {
			config.wpt.shell = false
		}
		if (config.wpt.cwd === undefined) {
			config.wpt.cwd = null
		}
	}

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

	return config
}
