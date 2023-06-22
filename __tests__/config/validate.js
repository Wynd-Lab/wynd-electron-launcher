const Validator = require('../../src/main/helpers/config_validator')

const cv = new Validator(__dirname)
let config = null

beforeAll(() => {

})

beforeEach(() => {
	config = null
})

describe("Validation config", () => {
	test('1_1: with url only', (done) => {
		config = {
			url: 'http://localhost:3000'
		}

		const expectedConfig = {
			url: {
				href: 'http://localhost:3000/',
				host: 'localhost:3000',
				hostname: 'localhost',
				port: '3000',
				protocol: 'http:'
			}
		}
		const [valid, errors] = cv.validate(config)

		expect(valid).toEqual(true)
		expect(errors).toBeNull()
		expect(config).toEqual(expectedConfig)
		done()
	})

	test('1_2_1 : complete config with boolean as digit', (done) => {

		config = {
			url: null,
			screen: '1',
			wpt: {
				enable: '1',
				path: '/home/nekran/nodeJS/wyndpostools',
				url: 'http://localhost:9963/'
			},
			menu: {
				enable: '1',
				phone_number: '+33 (0)1.76.44.03.53',
				password: '1111'
			},
			update: {
				enable: '0',
				on_start: '0',
			},
			http: {
				enable: '1',
				port: '1122'
			},
			theme: {}

		}

		const expectedConfig = {
			url: {
				"host": "",
				"hostname": "",
				"href": "/home/ppetit/electron/wynd-electron-launcher/src/local",
				"port": "",
				"protocol": "file",
			},
			screen: 1,
			wpt: {
				enable: true,
				path: '/home/nekran/nodeJS/wyndpostools',
				url: {
					href: 'http://localhost:9963/',
					host: 'localhost:9963',
					hostname: 'localhost',
					port: '9963',
					protocol: 'http:'
				}
			},
			menu: { enable: true, phone_number: '+33 (0)1.76.44.03.53', password: '1111' },
			update: { enable: false, on_start: false },
			http: { enable: true, port: 1122 },
			theme: {}
		}

		const [valid, errors] = cv.validate(config)

		expect(valid).toEqual(true)
		expect(errors).toBeNull()
		expect(config).toEqual(expectedConfig)

		done()
	})

	test('1_2_2: complete config with boolean as string', (done) => {

		config = {
			url: null,
			screen: '1',
			wpt: {
				enable: 'true',
				path: '/home/nekran/nodeJS/wyndpostools',
				url: 'http://localhost:9963/'
			},
			menu: {
				enable: 'true',
				phone_number: '+33 (0)1.76.44.03.53',
				password: '1111'
			},
			update: {
				enable: 'true',
				on_start: 'false',
			},
			http: {
				enable: 'true',
				port: '1122'
			},
			theme: {}
		}

		const expectedConfig = {
			url: {
				"host": "",
				"hostname": "",
				"href": "/home/ppetit/electron/wynd-electron-launcher/src/local",
				"port": "",
				"protocol": "file",

			},
			screen: 1,
			wpt: {
				enable: true,
				path: '/home/nekran/nodeJS/wyndpostools',
				url: {
					href: 'http://localhost:9963/',
					host: 'localhost:9963',
					hostname: 'localhost',
					port: '9963',
					protocol: 'http:'
				}
			},
			menu: { enable: true, phone_number: '+33 (0)1.76.44.03.53', password: '1111' },
			update: { enable: true, on_start: false },
			http: { enable: true, port: 1122 },
			theme: {}
		}

		const [valid, errors] = cv.validate(config)

		expect(valid).toEqual(true)
		expect(errors).toBeNull()
		expect(config).toEqual(expectedConfig)

		done()
	})

	test('1_3: validate mandatory', (done) => {
		config = {
			url: 'http://localhost:3000',
			wpt: { enable: "false", path: 'toto', url: 'http://localhost:9963' },
			http: { enable: "false", port: 1212 },
		}

		const expectedConfig = {
			url: {
				href: 'http://localhost:3000/',
				host: 'localhost:3000',
				hostname: 'localhost',
				port: '3000',
				protocol: 'http:'
			},
			wpt: {
				enable: false,
				path: "toto",
				url: {
					href: 'http://localhost:9963/',
					host: 'localhost:9963',
					hostname: 'localhost',
					port: '9963',
					protocol: 'http:'
				}
			},
			http: { enable: false, port: null },

		}
		const [valid, errors] = cv.validate(config)
		expect(valid).toEqual(true)
		expect(errors).toBeNull()
		expect(config).toEqual(expectedConfig)
		done()
	})

	describe("Validation config url", () => {

		test("2_1: local url", (done) => {
			config = {
				url: null,
			}

			const expectedConfig = {
				url: {
					"host": "",
					"hostname": "",
					"href": "/home/ppetit/electron/wynd-electron-launcher/src/local",
					"port": "",
					"protocol": "file",
				},
			}

			const [valid, errors] = cv.validate(config)

			expect(valid).toEqual(true)
			expect(errors).toBeNull()
			expect(config).toEqual(expectedConfig)

			done()
		})

		test("2_2: valid url", (done) => {
			config = {
				url: "http://www.google.com",
			}

			const expectedConfig = {
				url: {
					"host": "www.google.com",
					"hostname": "www.google.com",
					"href": config.url + "/",
					"port": "",
					"protocol": "http:",
				},
			}

			const [valid, errors] = cv.validate(config)

			expect(valid).toEqual(true)
			expect(errors).toBeNull()
			expect(config).toEqual(expectedConfig)

			done()
		})

		test("2_3: valid remote path", (done) => {
			config = {
				url: "../../__mocks__",
			}

			const expectedConfig = {
				url: {
					"host": "",
					"hostname": "",
					"href": "/home/ppetit/electron/wynd-electron-launcher/__mocks__",
					"port": "",
					"protocol": "file",
				},
			}

			const [valid, errors] = cv.validate(config)

			expect(valid).toEqual(true)
			expect(errors).toBeNull()
			expect(config).toEqual(expectedConfig)

			done()
		})

		test("2_4: invalid url with no external index.html", (done) => {
			config = {
				url: './',
			}

			const expected = {
				keyword: 'local',
				schemaPath: '#/properties/url/allOf/1/local',
				params: { ref: config.url },
				message: 'Missing /home/ppetit/electron/wynd-electron-launcher/__tests__/config//index.html in config.url path',
				err: {
					message: 'Missing /home/ppetit/electron/wynd-electron-launcher/__tests__/config//index.html in config.url path',
					status: 400,
					api_code: 'INVALID_PARAMETER_VALUE',
					code: 'Bad Request',
					errors: [],
					data: null
				},
				instancePath: '/url'
			}
			const [valid, errors] = cv.validate(config)

			expect(valid).toEqual(false)
			expect(errors.length).toEqual(1)
			const error = errors[0]

			expect(error.keyword).toEqual(expected.keyword)
			expect(error.schemaPath).toEqual(expected.schemaPath)
			expect(error.params).toEqual(expected.params)
			expect(error.message).toEqual(expected.message)
			expect(error.instancePath).toEqual(expected.instancePath)
			expect(error.err.message).toEqual(expected.err.message)
			expect(error.err.status).toEqual(expected.err.status)
			expect(error.err.api_code).toEqual(expected.err.api_code)
			expect(error.err.code).toEqual(expected.err.code)
			expect(error.err.errors).toEqual(expected.err.errors)
			expect(error.err.data).toEqual(expected.err.data)
			done()
		})

		test("2_5: invalid url with placeholder", (done) => {
			config = {
				url: '%%_APP_URL2_%%',
			}

			const expected = {
				keyword: 'replace_env',
				schemaPath: '#/properties/url/allOf/0/replace_env',
				params: { ref: 'url', value: '%%_APP_URL2_%%' },
				message: 'Unknown env variable APP_URL2 for config.url',
				err: {
					message: 'Unknown env variable APP_URL2 for config.url',
					status: 400,
					api_code: 'INVALID_PARAMETER_VALUE',
					code: 'Bad Request',
					errors: [],
					data: null
				},
				instancePath: '/url'
			}
			const [valid, errors] = cv.validate(config)

			expect(valid).toEqual(false)
			expect(errors.length).toEqual(1)
			const error = errors[0]

			expect(error.keyword).toEqual(expected.keyword)
			expect(error.schemaPath).toEqual(expected.schemaPath)
			expect(error.params).toEqual(expected.params)
			expect(error.message).toEqual(expected.message)
			expect(error.instancePath).toEqual(expected.instancePath)
			expect(error.err.message).toEqual(expected.err.message)
			expect(error.err.status).toEqual(expected.err.status)
			expect(error.err.api_code).toEqual(expected.err.api_code)
			expect(error.err.code).toEqual(expected.err.code)
			expect(error.err.errors).toEqual(expected.err.errors)
			expect(error.err.data).toEqual(expected.err.data)
			done()
		})
	});

	describe("Validation config wpt", () => {

		test("3_1: wpt.cwd file not exist", (done) => {
			config = {
				url: null,
				wpt: {
					enable: false,
					path: null,
					cwd: 'toto'
				}
			}

			const expected = {
				keyword: 'local',
				schemaPath: '#/properties/wpt/properties/cwd/allOf/1/file_exist',
				params: { ref: 'toto' },
				message: 'file toto does not exist. config.wpt.cwd',
				err: {
					message: "file toto does not exist. config.wpt.cwd",
					status: 400,
					api_code: 'INVALID_PARAMETER_VALUE',
					code: 'Bad Request',
					errors: [],
					data: null
				},
				instancePath: '/wpt/cwd'
			}


			const [valid, errors] = cv.validate(config)

			expect(valid).toEqual(false)
			expect(errors.length).toEqual(1)
			const error = errors[0]

			expect(error.keyword).toEqual(expected.keyword)
			expect(error.schemaPath).toEqual(expected.schemaPath)
			expect(error.params).toEqual(expected.params)
			expect(error.message).toEqual(expected.message)
			expect(error.instancePath).toEqual(expected.instancePath)
			expect(error.err.message).toEqual(expected.err.message)
			expect(error.err.status).toEqual(expected.err.status)
			expect(error.err.api_code).toEqual(expected.err.api_code)
			expect(error.err.code).toEqual(expected.err.code)
			expect(error.err.errors).toEqual(expected.err.errors)
			expect(error.err.data).toEqual(expected.err.data)
			done()
		})

		test("3_2: wpt.cwd path not set ", (done) => {
			config = {
				url: null,
				wpt: {
					enable: false,
					path: null,
					cwd: __dirname
				}
			}

			const expected = {
				keyword: 'depend_on',
				schemaPath: '#/properties/wpt/properties/cwd/allOf/1/depend_on',
				params: { parentPath: 'wpt', missingElements: ["wpt.path"] },
				message: 'Missing parameters in wpt if [wpt.cwd] is set, expected: [wpt.path] to be present',
				err: {
					message: 'Missing parameters in wpt if [wpt.cwd] is set, expected: [wpt.path] to be present',
					status: 400,
					api_code: 'MISSING_PARAMETER',
					code: 'Bad Request',
					errors: [],
					data: null
				},
				instancePath: '/wpt/cwd'
			}

			const [valid, errors] = cv.validate(config)

			expect(valid).toEqual(false)
			expect(errors.length).toEqual(1)
			const error = errors[0]
			expect(error.keyword).toEqual(expected.keyword)
			expect(error.schemaPath).toEqual(expected.schemaPath)
			expect(error.params).toEqual(expected.params)
			expect(error.message).toEqual(expected.message)
			expect(error.instancePath).toEqual(expected.instancePath)
			expect(error.err.message).toEqual(expected.err.message)
			expect(error.err.status).toEqual(expected.err.status)
			expect(error.err.api_code).toEqual(expected.err.api_code)
			expect(error.err.code).toEqual(expected.err.code)
			expect(error.err.errors).toEqual(expected.err.errors)
			expect(error.err.data).toEqual(expected.err.data)
			done()
		})

		test("3_3: wpt.shell path not set ", (done) => {
			config = {
				url: null,
				wpt: {
					enable: 'true',
					path: null,
					shell: 'true'
				}
			}

			const expected = {
				keyword: 'must_exist',
				schemaPath: '#/properties/wpt/properties/shell/allOf/1/must_exist',
				params: { parentPath: 'wpt', missingElements: ['wpt.path'] },
				message: 'Missing parameters in wpt if [wpt.shell] is set, expected: [wpt.path] to be present',
				err: {
					message: 'Missing parameters in wpt if [wpt.shell] is set, expected: [wpt.path] to be present',
					status: 400,
					api_code: 'MISSING_PARAMETER',
					code: 'Bad Request',
					errors: [],
					data: null
				},
				instancePath: '/wpt/shell'
			}

			const [valid, errors] = cv.validate(config)

			expect(valid).toEqual(false)
			expect(errors.length).toEqual(1)
			const error = errors[0]
			expect(error.keyword).toEqual(expected.keyword)
			expect(error.schemaPath).toEqual(expected.schemaPath)
			expect(error.params).toEqual(expected.params)
			expect(error.message).toEqual(expected.message)
			expect(error.instancePath).toEqual(expected.instancePath)
			expect(error.err.message).toEqual(expected.err.message)
			expect(error.err.status).toEqual(expected.err.status)
			expect(error.err.api_code).toEqual(expected.err.api_code)
			expect(error.err.code).toEqual(expected.err.code)
			expect(error.err.errors).toEqual(expected.err.errors)
			expect(error.err.data).toEqual(expected.err.data)
			done()
		})

		test("3_4: wpt.wait on ipc conflict with string", (done) => {
			config = {
				url: null,
				wpt: {
					enable: 'true',
					path: '/home/nekran/nodeJS/wyndpostools',
					wait_on_ipc: "true",
					shell: 'true'
				}
			}

			const expected = {
				keyword: 'wpt.wait_on_ipc',
				schemaPath: '#/properties/wpt/properties/wait_on_ipc/allOf/2/conflict',
				message: 'Invalid config conflict. If [wpt.wait_on_ipc] is true, expect [wpt.shell] to be false',
				err: {
					message: 'Invalid config conflict. If [wpt.wait_on_ipc] is true, expect [wpt.shell] to be false',
					status: 400,
					api_code: 'INVALID_PARAMETER_VALUE',
					code: 'Bad Request',
					errors: [],
					data: null
				},
				instancePath: '/wpt/wait_on_ipc'
			}

			const [valid, errors] = cv.validate(config)
			expect(valid).toEqual(false)
			expect(errors.length).toEqual(1)
			const error = errors[0]

			expect(error.keyword).toEqual(expected.keyword)
			expect(error.schemaPath).toEqual(expected.schemaPath)
			expect(error.params).toEqual(expected.params)
			expect(error.message).toEqual(expected.message)
			expect(error.instancePath).toEqual(expected.instancePath)
			expect(error.err.message).toEqual(expected.err.message)
			expect(error.err.status).toEqual(expected.err.status)
			expect(error.err.api_code).toEqual(expected.err.api_code)
			expect(error.err.code).toEqual(expected.err.code)
			expect(error.err.errors).toEqual(expected.err.errors)
			expect(error.err.data).toEqual(expected.err.data)
			done()
		})

		test("3_5: wpt.wait on ipc conflict with boolean", (done) => {
			config = {
				url: null,
				wpt: {
					enable: 'true',
					path: '/home/nekran/nodeJS/wyndpostools',
					wait_on_ipc: true,
					shell: true
				}
			}

			const expected = {
				keyword: 'wpt.wait_on_ipc',
				schemaPath: '#/properties/wpt/properties/wait_on_ipc/allOf/2/conflict',
				message: 'Invalid config conflict. If [wpt.wait_on_ipc] is true, expect [wpt.shell] to be false',
				err: {
					message: 'Invalid config conflict. If [wpt.wait_on_ipc] is true, expect [wpt.shell] to be false',
					status: 400,
					api_code: 'INVALID_PARAMETER_VALUE',
					code: 'Bad Request',
					errors: [],
					data: null
				},
				instancePath: '/wpt/wait_on_ipc'
			}

			const [valid, errors] = cv.validate(config)
			expect(valid).toEqual(false)
			expect(errors.length).toEqual(1)
			const error = errors[0]

			expect(error.keyword).toEqual(expected.keyword)
			expect(error.schemaPath).toEqual(expected.schemaPath)
			expect(error.params).toEqual(expected.params)
			expect(error.message).toEqual(expected.message)
			expect(error.instancePath).toEqual(expected.instancePath)
			expect(error.err.message).toEqual(expected.err.message)
			expect(error.err.status).toEqual(expected.err.status)
			expect(error.err.api_code).toEqual(expected.err.api_code)
			expect(error.err.code).toEqual(expected.err.code)
			expect(error.err.errors).toEqual(expected.err.errors)
			expect(error.err.data).toEqual(expected.err.data)
			done()
		})

		test("3_6: wpt.wait on ipc no conflict with string", (done) => {
			config = {
				url: null,
				wpt: {
					enable: 'true',
					path: '/home/nekran/nodeJS/wyndpostools',
					wait_on_ipc: false,
					shell: true
				}
			}

			const [valid, errors] = cv.validate(config)
			expect(valid).toEqual(true)
			expect(errors).toBeNull()
			done()
		})

		test("3_7: wpt.wait on ipc no conflict with string", (done) => {
			config = {
				url: null,
				wpt: {
					enable: 'true',
					path: '/home/nekran/nodeJS/wyndpostools',
					wait_on_ipc: 'false',
					shell: 'true'
				}
			}

			const [valid, errors] = cv.validate(config)
			expect(valid).toEqual(true)
			expect(errors).toBeNull()
			done()
		})
	})

	describe("Validation config central", () => {

		test("4_1: wpt must be enable", (done) => {
			config = {
				url: null,
				wpt: {
					enable: false,
				},
				central: {
					enable: true
				}
			}

			const expected = {
				keyword: 'central.enable',
				schemaPath: '#/properties/central/properties/enable/allOf/1/must_be_enable',
				message: 'Invalid config dependance. If [central.enable] is true, expect [wpt.enable] set to true',
				err: {
					message: 'Invalid config dependance. If [central.enable] is true, expect [wpt.enable] set to true',
					status: 400,
					api_code: 'INVALID_PARAMETER_VALUE',
					code: 'Bad Request',
					errors: [],
					data: null
				},
				instancePath: '/central/enable'
			}


			const [valid, errors] = cv.validate(config)

			expect(valid).toEqual(false)
			expect(errors.length).toEqual(1)
			const error = errors[0]
			expect(error.keyword).toEqual(expected.keyword)
			expect(error.schemaPath).toEqual(expected.schemaPath)
			expect(error.params).toEqual(expected.params)
			expect(error.message).toEqual(expected.message)
			expect(error.instancePath).toEqual(expected.instancePath)
			expect(error.err.message).toEqual(expected.err.message)
			expect(error.err.status).toEqual(expected.err.status)
			expect(error.err.api_code).toEqual(expected.err.api_code)
			expect(error.err.code).toEqual(expected.err.code)
			expect(error.err.errors).toEqual(expected.err.errors)
			expect(error.err.data).toEqual(expected.err.data)
			done()
		})

	})

	describe("Validation config http", () => {

		test("5_1: http port must be set", (done) => {
			config = {
				url: null,
				wpt: {
					enable: false,
				},
				http: {
					enable: true,
					port: null
				}
			}

			const expected = {
				keyword: 'depend_on',
				schemaPath: '#/properties/http/properties/enable/allOf/1/depend_on',
				params: { parentPath: 'http', missingElements: [ 'http.port' ] },
				message: 'Missing parameters in http if [http.enable] is set, expected: [http.port] to be present',
				err: { message: 'Missing parameters in http if [http.enable] is set, expected: [http.port] to be present',
					status: 400,
					api_code: 'MISSING_PARAMETER',
					code: 'Bad Request',
					errors: [],
					data: null
				},
				instancePath: '/http/enable'
			}



			const [valid, errors] = cv.validate(config)

			expect(valid).toEqual(false)
			expect(errors.length).toEqual(1)
			const error = errors[0]
			expect(error.keyword).toEqual(expected.keyword)
			expect(error.schemaPath).toEqual(expected.schemaPath)
			expect(error.params).toEqual(expected.params)
			expect(error.message).toEqual(expected.message)
			expect(error.instancePath).toEqual(expected.instancePath)
			expect(error.err.message).toEqual(expected.err.message)
			expect(error.err.status).toEqual(expected.err.status)
			expect(error.err.api_code).toEqual(expected.err.api_code)
			expect(error.err.code).toEqual(expected.err.code)
			expect(error.err.errors).toEqual(expected.err.errors)
			expect(error.err.data).toEqual(expected.err.data)
			done()
		})

	})

	describe("Validation config proxy", () => {

		test("6_1: proxy.url parsed", (done) => {
			config = {
				url: "http://www.google.com",
				wpt: {
					enable: false,
				},
				http: {
					enable: true,
					port: 3000
				},
				proxy: {
					enable: 'true',
					url: "http://www.proxy.com"
				}
			}

			const expected = {
				url: {
					href: 'http://www.google.com/',
					host: 'www.google.com',
					hostname: 'www.google.com',
					port: '',
					protocol: 'http:'
				},
				wpt: { enable: false },
				http: { enable: true, port: 3000 },
				proxy: {
					enable: true,
					url: {
						href: 'http://www.proxy.com/',
						host: 'www.proxy.com',
						hostname: 'www.proxy.com',
						port: '',
						protocol: 'http:'
					}
				}
			}

			const [valid, errors] = cv.validate(config)

			expect(valid).toEqual(true)
			expect(config).toEqual(expected)
			done()
		})

		test("6_2: url must be set", (done) => {
			config = {
				url: null,
				wpt: {
					enable: false,
				},
				proxy: {
					enable: 'true',
					url: null
				}
			}

			const expected = {
				keyword: 'must_exist',
				schemaPath: '#/properties/proxy/properties/enable/allOf/1/must_exist',
				params: { parentPath: 'proxy', missingElements: [ 'proxy.url' ] },
				message: 'Missing parameters in proxy if [proxy.enable] is set, expected: [proxy.url] to be present',
				err: { message: 'Missing parameters in proxy if [proxy.enable] is set, expected: [proxy.url] to be present',
					status: 400,
					api_code: 'MISSING_PARAMETER',
					code: 'Bad Request',
					errors: [],
					data: null
				},
				instancePath: '/proxy/enable'
			}



			const [valid, errors] = cv.validate(config)

			expect(valid).toEqual(false)
			expect(errors.length).toEqual(1)
			const error = errors[0]
			expect(error.keyword).toEqual(expected.keyword)
			expect(error.schemaPath).toEqual(expected.schemaPath)
			expect(error.params).toEqual(expected.params)
			expect(error.message).toEqual(expected.message)
			expect(error.instancePath).toEqual(expected.instancePath)
			expect(error.err.message).toEqual(expected.err.message)
			expect(error.err.status).toEqual(expected.err.status)
			expect(error.err.api_code).toEqual(expected.err.api_code)
			expect(error.err.code).toEqual(expected.err.code)
			expect(error.err.errors).toEqual(expected.err.errors)
			expect(error.err.data).toEqual(expected.err.data)
			done()
		})

	})
})
