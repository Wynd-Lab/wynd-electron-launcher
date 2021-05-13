const http = require('http')

module.exports = function httpRequest(method, url) {
	return new Promise((resolve, reject) => {
		var params = {
				host: url.host,
				port: url.port,
				path: url.path,
				method: method,
		};
		const req = http.request(params, (res) => {
				res.on('data', (chunk) => {
						resolve(chunk);
				});
				res.on("error", (err) => {
						reject(err);
				});
		});
		req.end();
	});
}
