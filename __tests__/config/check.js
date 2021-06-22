const checkConfig = require('../../src/main/helpers/check_config')

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
			},
			menu: { enable: true, phone_number: null, password: null },
			emergency: { enable: false },
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
			update: { enable: false, on_start: false }
		}

		try {
			checkConfig(config)
			expect(config).toEqual(expectedConfig)
			done()
		} catch (err) {
			done(err)
		}
	})

	test('1_2: url local with auto enable http', (done) => {
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
				enable: "0",
				port: null
			},
			socket: {
				enable: '1'
			},
			theme: {}

		}
		const expectedConfig = {
			url: {
				href: 'http://localhost:1212/',
				host: 'localhost:1212',
				hostname: 'localhost',
				port: '1212',
				protocol: 'http:'
			},
			screen: 1,
			menu: {
				enable: true,
				phone_number: '+33 (0)1.76.44.03.53',
				password: '1111'
			},
			emergency: { enable: false },
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
			http: { enable: true, port: 1212 },
			update: { enable: false, on_start: false },
			socket: {
				enable: true
			},
			theme: {}
		}

		try {
			checkConfig(config)
			expect(config).toEqual(expectedConfig)
			done()
		} catch (err) {
			done(err)
		}
	})

});
