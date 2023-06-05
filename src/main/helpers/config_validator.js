const Ajv = require("ajv").default
const fs = require("fs")
const path = require("path")

const CustomError = require("../../helpers/custom_error")

const convertUrl = function checkUrl(url) {
	const aUrl = new URL(url)
	return {
		href: aUrl.href,
		host: aUrl.host,
		hostname: aUrl.hostname,
		port: aUrl.port,
		protocol: aUrl.protocol
	}
}

function validExist(it, keyword, metaData) {
	const ref = it.instancePath.substring(1).split("/")
	ref.pop()
	const missingElements = checkExist(it.parentData, metaData, ref)
	const valid = missingElements.length === 0
	const errors = []
	if (!valid) {
		const params = {
			parentPath: ref.join("."),
			missingElements: missingElements
		}

		const message = `Missing parameters in ${params.parentPath} if ${params.parentPath}.${it.parentDataProperty} is set, expected: [${params.missingElements}] to be present`
		errors.push({
			keyword: `${keyword}`,
			schemaPath: `#/${keyword}`,
			params,
			message: message,
			err: new CustomError(400, CustomError.CODE.MISSING_PARAMETER, message)

		})
	}

	return [valid, errors]
}

function checkExist(parentData, elements, parentPath) {
	let missingElements = []

	for (let i = 0; i < elements.length; i++) {
		const element = elements[i];
		if (!parentData[element]) {
			missingElements.push([...parentPath, element].join("."))
		}
	}

	return missingElements
}
// function setData(root, parents, value) {
// 	let parent = root
// 	for (let index = 0; index < parents.length; index++) {
// 		parent = parent[parents[index]];
// 	}
// 	parent = value
// }

const addKeyWord = function (confPath) {
	this.ajv.addKeyword({
		keyword: "local",
		modifying: true,
		validate: function validate(metaData, data, parentSchema, it) {
			if (!data) {
				const localPath = path.join(__dirname, "..", '..', '..', 'src', "local")
				if (fs.existsSync(localPath, "index.html")) {
					it.rootData.url = {
						href: localPath,
						host: '',
						hostname: '',
						port: '',
						protocol: 'file'
					}
					return true
				}
				const params = {
					ref: data
				}
				const message = `Missing required parameter config.url`
				validate.errors = [
					{
						keyword: 'local',
						schemaPath: '#/url_local',
						params,
						message,
						err: new CustomError(400, CustomError.CODE.MISSING_MANDATORY_PARAMETER, message, ["url"])
					},
				]
				return false
			}

			try {
				const url = convertUrl(data)
				it.rootData.url = url
				return true
			}
			catch (err) {
				let remotePath = path.isAbsolute(data) ? data : path.join(confPath, data)

				if (data === "%%_APP_URL_%%") {

					const params = {
						ref: data
					}

					const message = `${err.message} '${data}' in config.url path`

					const ce = new CustomError(400, CustomError.CODE.INVALID_PARAMETER_VALUE, message, ["url"])

					validate.errors = [
						{
							keyword: 'local',
							schemaPath: '#/url_local',
							params,
							message,
							err: ce
						},
					]
					return false
				}
				if (fs.existsSync(path.join(remotePath, 'index.html'))) {
					it.rootData.url = {
						href: remotePath,
						host: '',
						hostname: '',
						port: '',
						protocol: 'file'
					}
					return true
				} else if (!data.startsWith('http')) {
					const params = {
						ref: data
					}
					const message = `Missing ${remotePath}/index.html in config.url path`
					validate.errors = [
						{
							keyword: 'local',
							schemaPath: '#/url_local',
							params,
							message,
							err: new CustomError(400, CustomError.CODE.INVALID_PARAMETER_VALUE, message, ["url"])
						},
					]
					return false
				}

				const params = {
					ref: data
				}
				const message = `${err.message} ${data} in config.url path `
				validate.errors = [
					{
						keyword: 'local',
						schemaPath: '#/url_local',
						params,
						message,
						err: new CustomError(400, err.code, message, ["url"])
					},
				]
				return false


			}
		},
		errors: true,
		metaSchema: {
			type: "boolean",
		},
	})

	this.ajv.addKeyword({
		keyword: "replace_env",
		modifying: true,
		validate: function validate(metaData, data, parentSchema, it) {
			const envRegex = new RegExp(/%%_(.+)_%%/)
			const result = envRegex.exec(data)

			if (result && result[1]) {
				if (process.env[result[1]] && it.parentData[it.parentDataProperty]) {
					it.parentData[it.parentDataProperty] = process.env[result[1]]
				} else {

					const ref = it.instancePath.substring(1).replace(/\//, ".")
					const params = {
						ref: ref,
						value: data
					}

					const message = `Unknown env variable ${result[1]} for config.${ref}`

					const ce = new CustomError(400, CustomError.CODE.INVALID_PARAMETER_VALUE, message, [it.parentDataProperty])

					validate.errors = [
						{
							keyword: 'replace_env',
							schemaPath: `#/${ref}`,
							params,
							message,
							err: ce
						},
					]
					return false
				}

			}

			return true
		},
		errors: true,
		metaSchema: {
			type: "boolean",
		},
	})

	this.ajv.addKeyword({
		keyword: "check_url",
		modifying: true,
		validate: function validate(metaData, data, parentSchema, it) {
			if (data) {
				try {
					const url = convertUrl(data)
					it.parentData[it.parentDataProperty] = url
					return true
				}
				catch (err) {
					return false
				}
			}
			return true
		},
		errors: true,
		metaSchema: {
			type: "boolean",
		},
	})

	this.ajv.addKeyword({
		keyword: "file_exist",
		modifying: true,
		validate: function validate(metaData, data, parentSchema, it) {

			if (!data) {
				return true
			}

			if (fs.existsSync(data)) {
				return true
			}
			const params = {
				ref: data
			}
			const message = `file ${data} does not exist. config.wpt.cwd`
			validate.errors = [
				{
					keyword: 'local',
					schemaPath: '#/wpt_cwd',
					params,
					message,
					err: new CustomError(400, CustomError.CODE.INVALID_PARAMETER_VALUE, message, ["wpt.cwd"])
				},
			]
			return false
		},
		errors: true,
		metaSchema: {
			type: "boolean",
		},
	})


	this.ajv.addKeyword({
		keyword: "conflict",
		modifying: true,
		validate: function validate(metaData, data, parentSchema, it) {
			// if enable is false, dependance is not needed
			let valid = true
			const errors = []
			const ref = it.instancePath.substring(1).replace(/\//, ".")
			if (metaData && Array.isArray(metaData) && data) {
				for (let i = 0; i < metaData.length; i++) {
					const element = metaData[i];
					if (it.parentData[element.name]) {
						let actualValue = it.parentData[element.name]
						if (actualValue === '1' || actualValue === 1 || actualValue === 'true') {
							actualValue = true
						} else if (actualValue === '0' || actualValue === 0 || actualValue === 'false') {
							actualValue = false
						}
						if (element.value === actualValue) {
							valid = false
							const message = `Invalid config conflict. If ${ref} is true, expect ${element.name} to be ${!element.value}`
							errors.push({
								keyword: `${ref}`,
								schemaPath: `#/${ref}`,
								message: message,
								err: new CustomError(400, CustomError.CODE.INVALID_PARAMETER_VALUE, message)
							})
						}
					}
				}
			}

			// const [valid, errors] = validExist(it, 'must_exist', metaData.keys)
			if (!valid) {
				validate.errors = errors
			}
			return valid
		},
		errors: true,
		metaSchema: {
			type: "array",
			items: {
				type: "object",
			}
		},
	})

	this.ajv.addKeyword({
		keyword: "must_exist",
		modifying: true,
		validate: function validate(metaData, data, parentSchema, it) {
			// if enable is false, dependance is not needed
			if (data === false) {
				for (let i = 0; i < metaData.keys.length; i++) {
					const key = metaData[i];
					if (!metaData.keep) {
						it.parentData[key] = null
					}
				}
				return true
			}

			const [valid, errors] = validExist(it, 'must_exist', metaData.keys)
			if (!valid) {
				validate.errors = errors
			}
			return valid
		},
		errors: true,
		metaSchema: {
			type: "object",
			properties: {
				keep: {
					type: 'boolean'
				},
				keys: {
					type: 'array',
					items: {
						type: "string"
					}
				},
			}

		},
	})

	this.ajv.addKeyword({
		keyword: "must_be_enable",
		modifying: true,
		validate: function validate(metaData, data, parentSchema, it) {
			const errors = []

			const ref = it.instancePath.substring(1).replace(/\//, ".")
			if (data === true) {
				for (let i = 0; i < metaData.length; i++) {
					const key = metaData[i];
					if (it.rootData[key] === undefined) {
						const message = `Missing parameter ${key} in config. If ${ref} is true, expect ${key} to be present`
						errors.push({
							keyword: `${ref}`,
							schemaPath: `#/${ref}`,
							message: message,
							err: new CustomError(400, CustomError.CODE.MISSING_PARAMETER, message)
						})
					} else if (it.rootData[key].enable === undefined) {
						const message = `Missing parameter ${key}.enable in config. If ${ref} is true, expect ${key}.enable to be present`
						errors.push({
							keyword: `${ref}`,
							schemaPath: `#/${ref}`,
							message: message,
							err: new CustomError(400, CustomError.CODE.MISSING_PARAMETER, message)
						})
					} else if (it.rootData[key].enable !== true) {
						const message = `Invalid config dependance. If ${ref} is true, expect ${key} to be enable`
						errors.push({
							keyword: `${ref}`,
							schemaPath: `#/${ref}`,
							message: message,
							err: new CustomError(400, CustomError.CODE.INVALID_PARAMETER_VALUE, message)
						})
					}
				}
				if (errors.length > 0) {
					validate.errors = errors
					return false
				}
			}
			return true
		},
		errors: true,
		metaSchema: {
			type: "array",
			items: {
				type: "string"
			}
		},
	})

	this.ajv.addKeyword({
		keyword: "depend_on",
		modifying: true,
		validate: function validate(metaData, data, parentSchema, it) {
			if (data === null) {
				return true
			}
			if (data === false) {
				for (let i = 0; i < metaData.length; i++) {
					const key = metaData[i];
					it.parentData[key] = null
				}
				return true
			}
			const [valid, errors] = validExist(it, 'depend_on', metaData)
			if (!valid) {
				validate.errors = errors
			}
			return valid
		},
		errors: true,
		metaSchema: {
			type: "array",
			items: {
				type: "string"
			}
		},
	})

	this.ajv.addKeyword({
		keyword: "coerce_boolean",
		modifying: true,
		validate: function validate(metaData, data, parentSchema, it) {
			const ref = it.instancePath.substring(1).replace(/\//, ".")
			const params = {
				ref: ref,
				value: data,
			}
			if (typeof data === "boolean") {
				return true
			}
			if (data === "0" || data === "1") {
				it.parentData[it.parentDataProperty] = Boolean(+data)
				return true
			}
			if (data === 'false') {
				it.parentData[it.parentDataProperty] = false
				return true
			}
			if (data === 'true') {
				it.parentData[it.parentDataProperty] = true
				return true
			}

			const message = `${params.ref} incorrect value, expected: [0, 1, true, false], get: ${params.value}`
			validate.errors = [
				{
					keyword: 'coerce_boolean',
					schemaPath: '#/coerce_boolean',
					params,
					message: message,
					err: new CustomError(400, CustomError.CODE.INVALID_FORMAT_PARAMETER, message)
				},
			]
			return false

		},

		errors: true,
		metaSchema: {
			type: "boolean"
		},
	})

}

const schema = {
	type: "object",
	properties: {
		url: {
			allOf: [
				{
					replace_env: true
				},
				{
					local: true
				},
			]
		},
		screen: {
			type: "integer"
		},
		raw: {
			allOf: [
				{
					coerce_boolean: true,
				}
			]
		},
		kiosk: {
			allOf: [
				{
					coerce_boolean: true,
				}
			]
		},
		full_screen: {
			allOf: [
				{
					coerce_boolean: true,
				}
			]
		},
		debug: {
			allOf: [
				{
					coerce_boolean: true,
				}
			]
		},
		frame: {
			allOf: [
				{
					coerce_boolean: true,
				}
			]
		},
		border: {
			allOf: [
				{
					coerce_boolean: true,
				}
			]
		},
		title: {
			type: ["string", "null"]
		},
		view: {
			"enum": ["iframe", "webview"],
			"default": "iframe"
		},
		zoom: {
			type: "object",
			properties: {
				level: {
					type: ["integer", "null"]
				},
				factor: {
					type: ["number", "null"]
				}
			},
			additionalProperties: false
		},
		wpt: {
			type: "object",
			properties: {
				enable: {
					allOf: [
						{
							coerce_boolean: true,
						},
					]
				},
				path: {
					type: ["string", "null"],
					replace_env: true
				},
				url: {
					type: "string",
					allOf: [
						{
							replace_env: true
						},
						{
							check_url: true,
						},
					]
				},
				password: {
					type: ["string", 'null']
				},
				wait_on_ipc: {
					allOf: [
						{
							coerce_boolean: true,
						},
						{
							must_exist: {
								keep: true,
								keys: ['path']
							}
						},
						{
							conflict: [{name: 'detached', value: true}, {name: 'shell', value: true}]
						}
					]
				},
				keep_listeners: {
					allOf: [
						{
							coerce_boolean: true,
						},
						{
							must_exist: {
								keep: true,
								keys: ['path']
							}
						}
					]
				},
				detached: {
					allOf: [
						{
							coerce_boolean: true,
						},
						{
							must_exist: {
								keep: true,
								keys: ['path']
							}
						}
					]
				},
				shell: {
					allOf: [
						{
							coerce_boolean: true,
						},
						{
							must_exist: {
								keep: true,
								keys: ['path']
							}
						}
					]
				},
				cwd: {
					allOf: [
						{
							replace_env: true
						},
						{
							depend_on: ["path"],
							file_exist: true,
						}
					]
				},
				connection_timeout: {
					type: "integer",
				},
				creation_timeout: {
					type: "integer",
				},
			},
			required: ["enable"],
			additionalProperties: false
		},
		central: {
			type: "object",
			properties: {
				enable: {
					allOf: [
						{
							coerce_boolean: true,
						},
						{
							must_be_enable: ['wpt']
						}
					]
				},
				mode: {
					enum: ["AUTO", "MANUAL"],
				},
				log: {
					"enum": ["debug", "info", "error"],
					"default": 'error'
				},
			},
			required: ["enable"],
			additionalProperties: false

		},
		report: {
			type: "object",
			properties: {
				enable: {
					allOf: [
						{
							coerce_boolean: true,
						},
					]
				},
			},
			required: ["enable"],
			additionalProperties: false
		},
		menu: {
			type: "object",
			properties: {
				enable: {
					allOf: [
						{
							coerce_boolean: true,
						}
					]
				},
				email: {
					type: ["string", 'null']
				},
				phone_number: {
					type: ["string", 'null']
				},
				password: {
					type: ["string", 'null']
				},
				logo: {
					type: ["string", 'null']
				},
				button_size: {
					type: "integer"
				},
				button_position: {
					type: "integer"
				},
			},
			required: ["enable"],
			additionalProperties: false
		},
		emergency: {
			type: "object",
			properties: {
				enable: {
					allOf: [
						{
							coerce_boolean: true,
						}
					]
				}
			},
			required: ["enable"],
			additionalProperties: false
		},
		update: {
			type: "object",
			properties: {
				enable: {
					allOf: [
						{
							coerce_boolean: true,
						}
					]
				},
				on_start: {
					type: "string",
					allOf: [
						{
							coerce_boolean: true,
						}
					]
				},
			},
			required: ["enable"],
			additionalProperties: false
		},
		http: {
			type: "object",
			properties: {
				enable: {
					allOf: [
						{
							coerce_boolean: true,

						},
						{
							depend_on: ['port']
						}
					]
				},
				port: {
					type: ["integer", "null"]
				},
				static: {
					type: ["string", "null"]
				}
			},
			required: ["enable"],
			additionalProperties: false
		},
		publish: {
			type: "object",
			properties: {
				provider: {
					"enum": ["github", "generic", "custom"],
					"default": "github"
				},
				url: {
					type: "string"
				},
				owner: {
					type: "string"
				},
				repo: {
					type: "string"
				},
				token: {
					type: "string"
				}
			},
			required: ["provider"],
			additionalProperties: false
		},
		log: {
			type: "object",
			properties: {
				main: {
					"enum": ["info", "debug", "error", 'warn'],
					"default": "info"
				},
				renderer: {
					"enum": ["info", "debug", "error", 'warn'],
					"default": "info"
				},
				app: {
					"enum": ["info", "debug", "error", 'warn'],
					"default": "info"
				},
			}
		},
		theme: {
			type: 'object',
			properties: {
			},
			additionalProperties: true
		},
		commandline: {
			type: 'object',
			properties: {
			},
			additionalProperties: true
		},
		proxy: {
			type: 'object',
			properties: {
				enable: {
					allOf: [
						{
							coerce_boolean: true,
						},
						{
							must_exist: {
								keep: false,
								keys: ['url']
							}
						}
					]
				},
				url: {
					allOf: [
						{
							check_url: true,
						}
					]
				},
			},
			additionalProperties: false
		}
	},
	// required: ["url"],
	additionalProperties: true
}


class Validation {

	constructor(confPath) {
		this.ajv = new Ajv({ coerceTypes: true })
		this.confPath = confPath
		addKeyWord.bind(this)(confPath)
		this.schema = schema
		this.validate = this.validate.bind(this)
		this.convertUrl = this.convertUrl.bind(this)
	}

	validate(data) {
		return [this.ajv.validate(this.schema, data), this.ajv.errors]
	}

	convertUrl(url) {
		return convertUrl(url)
	}
}


module.exports = Validation
