const { validate } = require('../../src/main/helpers/validate_config')

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
		const [valid, errors] = validate(config)

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
			socket: {
				enable: '1'
			},
			theme: {}

		}

		const expectedConfig = {
			url: 'local',
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
			socket: { enable: true },
			theme: {}
		}

		const [valid, errors] = validate(config)

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
			socket: {
				enable: 'true'
			},
			theme: {}

		}

		const expectedConfig = {
			url: 'local',
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
			socket: { enable: true },
			theme: {}
		}

		const [valid, errors] = validate(config)

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
				path: null,
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
		const [valid, errors] = validate(config)
		expect(valid).toEqual(true)
		expect(errors).toBeNull()
		expect(config).toEqual(expectedConfig)
		done()
	})
});
