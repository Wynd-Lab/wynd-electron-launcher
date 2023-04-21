const ConfigValidator = require('../../src/main/helpers/config_validator')

let config = {
  url: '%%_APP_URL_%%',
  screen: '0',
  view: 'iframe',
  wpt: {
		enable: true,
    url: '%%_WPT_URL_%%',
    connection_timeout: '10',
    creation_timeout: '20',
		path:'%%_WPT_PATH_%%',
		cwd: '%%_WPT_CWD_%%'
  },
  menu: { enable: true, phone_number: null, email: null, password: null },
  emergency: { enable: false },
  central: { enable: false, mode: 'AUTO' },
  report: { enable: false },
  proxy: { enable: false, url: null },
  http: { enable: false, port: null },
  update: { enable: false, on_start: false },
  zoom: { level: '1', factor: '0.99' },
  log: { main: 'info', renderer: 'info', app: 'info' }
}

const cv = new ConfigValidator("/home/ppetit/electron/wynd-electron-launcher/test/config.ini")

const [valid, errors] = cv.validate(config)

console.log(config)
