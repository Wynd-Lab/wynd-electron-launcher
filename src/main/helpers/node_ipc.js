const ipc = require('node-ipc').default;

module.exports = function nodeIpcConnect(name, version) {

	return new Promise((resolve, reject) => {

		ipc.connectTo(
			'api-updater',
			function () {
				resolve()
				ipc.of["api-updater"].on(
					'register',
					function (data) {
						ipc.of["api-updater"].emit('register', {
							name: name,
							version: version
						})
					}
				)

				ipc.of["api-updater"].on(
					'message',
					function (data) {
						console.log("message", data)
					}
				)

				ipc.of["api-updater"].on(
					'connect',
					function (data) {
						console.log("connect", data)
						//if data was a string, it would have the color set to the debug style applied to it
					}
				)

				ipc.of["api-updater"].on(
					'disconnect',
					function (data) {
						console.log("disconnect", data)
					}
				)

				ipc.of["api-updater"].on(
					'error',
					function (error) {
						reject(error)
						console.log("error", error)
					}
				)
			}
			);
	})
}
