const createHttp = require("../src/main/helpers/create_http")
const callback = (event, data) => {
	console.log(event, data)
}

const httpConf = {
		enable: true,
		port: 1212,
		static: '/home/ppetit/.config/electron-launcher/remote'
}
createHttp(httpConf, null,  callback).then((app) => {
})
.catch((err) => {
})
