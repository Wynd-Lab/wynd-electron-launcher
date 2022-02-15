module.exports = function onSocket(store, socket) {
	const centralConf = store.conf.central
	const centralState = store.central

	socket.on("central.register", () => {
		centralState.registered = true
	})
	socket.on("central.register.error", (err) => {
		centralState.registered = false
	})
	socket.on("central.error", (err) => {
		centralState.registered = false
	})

	socket.on("central.status", (status) => {
		centralState.status = status
		if (centralState.ready && status === 'READY' && !centralState.registered) {
			const register = {
				name: store.infos.name,
				url: store.conf.http && store.conf.http.enable ? `http://localhost:${store.conf.http.port}` : null,
				version: store.infos.version,
				stack: store.infos.stack,
				app_versions: store.infos.app_versions
			}
			store.wpt.socket.emit("central.register", register)
		}
	})
}
