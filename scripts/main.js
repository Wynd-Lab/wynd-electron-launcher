const pm2 = require('pm2');

const package = require('../package.json')
const processName = package.pm2.process[0].name

function startMain() {

	return new Promise((resolve, reject) => {
		pm2.connect(true, function(err) {
			if (err) {
				return reject(err)
			}
			pm2.delete(processName, (errDelete) => {
				// eslint-disable-next-line no-console
				errDelete && console.error(`${processName}`, errDelete.message)
				pm2.start({
					name: processName,
					script: "npx electron . --config ../config.ini",
					watch: ["src/main"],
					env: {
						"NODE_ENV": "development",
					},
				}, function(err, apps) {
					if (err) return reject(err)
					pm2.disconnect();   // Disconnects from PM2

					resolve(apps)
				});
			})
		})
	})
}
module.exports = startMain

if (require.main === module) {

	startMain().catch((err) => {
		throw err
	})
}
