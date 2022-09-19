const { protocol } = require("electron")


module.exports = function configureProtocol(store) {
	protocol.registerFileProtocol('image', (request, cb) => {
		console.log(request.url)
		console.log(__dirname)
		const url = request.url.substr(basePath.length + 1);
		cb({ path: path.normalize(`${__dirname}/${url}`) });
	});

}
