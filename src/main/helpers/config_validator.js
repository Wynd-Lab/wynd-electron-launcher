const Ajv = require("ajv").default
const fs = require("fs")
const path = require("path")
const CustomError = require("../../helpers/custom_error")

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

function setData(root, parents, value) {
	let parent = root
	for (let index = 0; index < parents.length; index++) {
		parent = parent[parents[index]];
	}
	parent = value
}

const addKeyWorld = function (confPath) {
	this.ajv.addKeyword({
		keyword: "local",
		modifying: true,
		validate: function validate(metaData, data, parentSchema, it) {
			if (!data) {

				if(fs.existsSync(__dirname, "..", 'src', "local", "index.html")) {
					it.rootData.url = null
					return true
				}
					const params = {
						ref: data
					}
					const message =  `Missing required parameter config.url`
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
			catch(err) {
				let remotePath = path.isAbsolute(data) ? data : path.join(confPath, "./remote")
					if (fs.existsSync(path.join(remotePath, 'index.html'))) {
					it.rootData.url = remotePath
					return true
					}
					const params = {
						ref: data
					}
					const message =  `Missing ${remotePath}/index.html in config.url path `
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
			try {
				const url = convertUrl(data)
				it.parentData[it.parentDataProperty] = url
				return true
			}
			catch(err) {
				return false
			}
		},
		errors: true,
		metaSchema: {
			type: "boolean",
		},
	})

	this.ajv.addKeyword({
		keyword: "mandatory",
		modifying: true,
		validate: function validate(metaData, data, parentSchema, it) {

				if (data === false) {
					for (let i = 0; i < metaData.length; i++) {
						const key = metaData[i];
						it.parentData[key] = null
					}
					return true
				}

				const ref = it.instancePath.substring(1).split("/")
				ref.pop()
				const missingElements = checkExist(it.parentData, metaData, ref)
				const valid = missingElements.length === 0
				if (!valid) {

					const params = {
						parentPath: ref.join("."),
						missingElements: missingElements
					}
					const message = `Missing parameters in ${params.parentPath} if ${params.parentPath}.enable is set, expected: [${params.missingElements}] to be present`
					validate.errors =
						[
							{
								keyword: 'mandatory',
								schemaPath: '#/mandatory',
								params,
								message: message,
								err: new CustomError(400, CustomError.CODE.MISSING_PARAMETER, message)

							},
						]
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
		wpt: {
			type: "object",
			properties: {
				enable: {
					allOf: [
						{
							coerce_boolean: true,

						},
						{
							mandatory: ['path'],
						}
					]
				},
				path: {
					type: ["string", "null"]
				},
				url: {
					type: "string",
					check_url: true
				}
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
							mandatory: ['port']
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
		theme: {
			type: 'object',
			properties: {
			},
			additionalProperties: true
		}
	},
	// required: ["url"],
	additionalProperties: false
}


class Validation {

	constructor(confPath) {
		this.ajv = new Ajv({ coerceTypes: true })
		this.confPath = confPath
		addKeyWorld.bind(this)(confPath)
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
