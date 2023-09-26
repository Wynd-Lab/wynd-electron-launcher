

module.exports = getCentralRegister = (store) => {
	return {
		name: store.infos.name,
		url: store.conf.http && store.conf.http.enable ? `http://localhost:${store.conf.http.port}` : null,
		version: store.infos.version,
		stack: store.infos.stack,
		app_versions: store.infos.app_versions,
		logs: {
			path: store.logs.main,
			secondary_path: store.logs.app
		},
		config: {
			path: store.path.conf,
			read: "config",
			update: "config/update"
		}
	}
}
