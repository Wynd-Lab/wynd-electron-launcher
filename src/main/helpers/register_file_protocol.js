const { protocol, app } = require("electron")
const path = require('path')

module.exports = function configureProtocol(store) {
	protocol.registerFileProtocol('assets', (request, cb) => {
		const assets = path.join(app.getPath('userData'), 'assets')
		const url = request.url.substr(assets);
		cb({ path: path.normalize(`${app.getPath('userData')}/assets/${store.conf.menu.logo}`) });
	});

}
