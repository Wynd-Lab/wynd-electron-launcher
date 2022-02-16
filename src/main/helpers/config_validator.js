const Ajv = require("ajv").default
const fs = require("fs")
const path = require("path")
const url = require('url')

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
				if (fs.existsSync(remotePath, 'index.html')) {
					it.rootData.url = {
						href: remotePath,
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
				const message = `Missing ${remotePath}/index.html in config.url path `
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


	this.ajv.addKeyword({
		keyword: "must_exist",
		modifying: true,
		validate: function validate(metaData, data, parentSchema, it) {
			// if (data === false) {
			// 	for (let i = 0; i < metaData.length; i++) {
			// 		const key = metaData[i];
			// 		it.parentData[key] = null
			// 	}
			// 	return true
			// }
			const [valid, errors ] = validExist(it, 'must_exist', metaData)
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
		keyword: "must_be_enable",
		modifying: true,
		validate: function validate(metaData, data, parentSchema, it) {
			if (data === false) {
				for (let i = 0; i < metaData.length; i++) {
					const key = metaData[i];
					it.parentData[key] = null
				}
				return true
			}

			const [valid, errors ] = validExist(it, 'must_be_enable', metaData)
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
					local: true
				}
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
					type: ["string", "null"]
				},
				url: {
					type: "string",
					check_url: true
				},
				wait_on_ipc: {
					allOf: [
						{
							coerce_boolean: true,
						},
						{
							must_exist: ['path']
						}
					]
				}
			},
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
			},
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
							must_be_enable: ['port']
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
			additionalProperties: false
		},
		socket: {
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
			additionalProperties: false
		},
		log: {
			type: "object",
			properties: {
				main: {
					"enum": ["info", "debug", "error"],
					"default": "info"
				},
				renderer: {
					"enum": ["info", "debug", "error"],
					"default": "info"
				},
				app: {
					"enum": ["info", "debug", "error"],
					"default": "info"
				}
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
							must_be_enable: ['url']
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
	required: ["url"],
	additionalProperties: false
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
