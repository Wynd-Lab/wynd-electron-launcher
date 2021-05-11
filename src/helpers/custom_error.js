const { error_messages, httpcodes, CODE } = require('./error_code')

class CustomError extends Error {

	/**
	 *
	 * @param {integer} status http status code
	 * @param {string} code code error see CustomError.CODE
	 * @param {string} message message of the error
	 * @param {object} error_values to custom the code and message error
	 */

	constructor(status, api_code, message, error_values = []) {
		super(
			message || (api_code && error_messages[api_code] ? error_messages[api_code] : CustomError.DEFAULT_MESSAGE),
		)

		this.status = status || 500
		this.api_code = api_code || CustomError.CODE.GENERIC
		this.code = (status && httpcodes.get(status)) || CustomError.CODE.GENERIC
		this.errors = []
		this.data = null

		if (this.message && error_values) {
			for (let i = 0; i < error_values.length; i++) {
				this.message = this.message.replace(`$${i}`, function messageReplace(replace, ...others) {
					if (replace === `$${i}` && others && others[2]) {
						return others[2]
					}
					return error_values[i]
				})
				this.api_code = this.api_code.replace('$$', String(error_values[i]).toUpperCase())
			}
		}
	}

	format() {
		const format = {
			status: this.status,
			code: httpcodes.get(this.status),
			api_code: this.api_code ? this.api_code : CustomError.CODE.GENERIC,
			message: this.message,
		}
		if (this.errors.length) {
			format.errors = this.errors
		}
		if (this.data) {
			format.data = this.data
		}
		return format
	}

	addSubError(field, code, message, data) {
		const subError = CustomError.generateSubError(field, code, message, data)
		this.errors.push(subError)
	}

	static generateMessage(code, error_values) {
		let message = code && error_messages[code] ? error_messages[code] : CustomError.DEFAULT_MESSAGE
		if (message && error_values) {
			for (let i = 0; i < error_values.length; i++) {
				message = message.replace(/(\$[0-9])(\[(.+)\])?/, function replaceMessage(replace, ...other) {
					const k = Number.parseInt(replace[1], 10)
					if (!error_values[k] && other && other[2]) {
						return other[2]
					}
					return error_values[k] ? error_values[k] : error_values[i]
				})
			}
		}

		return message
	}

	static generateSubError(field, subcodeRaw, message, value) {
		subcodeRaw = subcodeRaw || CustomError.CODE.GENERIC
		const subcode = subcodeRaw.replace('$$', String(field).toUpperCase())
		return {
			field,
			code: subcode,
			message: message || CustomError.generateMessage(subcodeRaw, [value]),
			value,
		}
	}

	setData(key, value) {
		if (!this.data) {
			this.data = {}
		}

		this.data[key] = value

		return this
	}

	convert(err) {
		for (const key in err.data) {
			const error = err.data[key][0]
			if (error.keyword === 'required' && error.params.missingProperty) {
				this.api_code = 'MISSING_KEYS'
				this.errors.push({
					field: error.params.missingProperty,
					code: `MISSING_KEY_${error.params.missingProperty.toUpperCase()}`,
					message: `${error.params.missingProperty} ${error.message}`,
				})
			}
		}
	}
	// const errFormat = {
	//     status: 400,
	//     error: "Bad Request",
	//     code: "INVALID_PARAMETER",
	//     message: "Validation failed. See the list of errors ",
	//     errors : [
	//         {
	//             field: "name",
	//             code: "MISSING_PARAM",
	//             message:""
	//         }
	//     ]
	// }
}

CustomError.DEFAULT_MESSAGE = 'Something went INVALID'
CustomError.CODE = CODE

module.exports = CustomError
