const createHttp = require('../src/main/helpers/create_http')

const httpConf ={
  enable: true,
  port: 7000,
  static: {
    href: 'http://posmock.pizza.demomkt.xyz/',
    host: 'posmock.pizza.demomkt.xyz',
    hostname: 'posmock.pizza.demomkt.xyz',
    port: '',
    protocol: 'http:'
  }
}

const opts = { update: false, proxy: true, version: '1.3.10' }
createHttp(httpConf, opts).then(() => {

})
