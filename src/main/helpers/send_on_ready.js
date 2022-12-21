module.exports =  function sendOnReady(store) {
	if (store.windows.container.current && store.ready) {
		store.windows.container.current.webContents.send("conf", store.conf)
		if (store.conf.debug && store.conf.view === "webview") {
			store.windows.container.current.webContents.send("ask_password", "open_dev_tools")
			store.windows.container.current.webContents.openDevTools();

		}
	}
}
