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

		const expectedConfig =     {
      url: {
        href: 'http://localhost:3000/',
        host: 'localhost:3000',
        hostname: 'localhost',
        port: '3000',
        protocol: 'http:'
      },
      screen: 0,
      menu: { enable: true, phone_number: null, email: null, password: null },
      view: 'iframe',
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
        },
        keep_listeners: false,
        detached: false,
        shell: false,
        cwd: null,
        connection_timeout: 10,
        creation_timeout: 30
      },
      central: { enable: false, mode: 'AUTO' },
      report: { enable: false },
      proxy: { enable: false, url: null, undefined: null },
      http: { enable: false, port: null },
      update: { enable: false, on_start: false },
      zoom: { level: 1, factor: 0.99 },
      log: { main: 'info', renderer: 'info', app: 'info' },
      publish: {
        provider: 'github',
        owner: 'Wynd-Lab',
        repo: 'wynd-electron-launcher'
      }
    }

		try {
			checkConfig(config)
			expect(config).toEqual(expectedConfig)
			done()
		} catch (err) {
			done(err)
		}
	})

	test('1_2: url local with auto enable', (done) => {
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
				enable: "1",
				port: "3000"
			},
			theme: {}

		}
		const expectedConfig = {
      url: {
        href: '/home/ppetit/electron/wynd-electron-launcher/src/local',
        host: '',
        hostname: '',
        port: '',
        protocol: 'file'
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
        },
        connection_timeout: 10,
        creation_timeout: 30,
        wait_on_ipc: false,
        keep_listeners: true,
        detached: false,
        shell: false,
        cwd: null
      },
      menu: {
        enable: true,
        phone_number: '+33 (0)1.76.44.03.53',
        password: '1111',
        logo: 'Logo.png'
      },
      update: { enable: false, on_start: false },
      http: {
        enable: true,
        port: 3000,
        static: {
          href: '/home/ppetit/electron/wynd-electron-launcher/src/local',
          host: '',
          hostname: '',
          port: '',
          protocol: 'file'
        }
      },
      theme: {},
      view: 'iframe',
      emergency: { enable: false },
      central: { enable: false, mode: 'AUTO' },
      report: { enable: false },
      proxy: { enable: false, url: null, undefined: null },
      zoom: { level: 1, factor: 0.99 },
      log: { main: 'info', renderer: 'info', app: 'info' },
      publish: {
        provider: 'github',
        owner: 'Wynd-Lab',
        repo: 'wynd-electron-launcher'
      }
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
