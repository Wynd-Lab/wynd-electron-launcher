

module.exports = function startMain() {
	const pm2 = require('pm2');
	pm2.connect(true, function(err) {
		if (err) {
			console.error(err);
			process.exit(2);
		}

		pm2.list((err, list) => {
			// console.log(err, list)
		})

		pm2.start({
				name: "electron main",
				script: "npx electron .",
				watch: ["src/main"],
				env: {
					"NODE_ENV": "development",
				},
		}, function(err, apps) {
			if (err) throw err
			pm2.disconnect();   // Disconnects from PM2
		});
	});
}




	// {
	// 	name: "electron main",
	// 	interpreter: 'electron',
	// 	script: ".",
	// 	watch: [],
	// 	env: {
	// 		"NODE_ENV": "development",
	// 	},
	// 	autorestart: false
	// }
