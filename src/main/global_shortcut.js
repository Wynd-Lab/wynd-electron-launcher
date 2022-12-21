const { globalShortcut } = require("electron")
const openDevToolsForLoader = require('./helpers/open_loader_dev_tools')
module.exports = function (store) {

	globalShortcut.unregisterAll()
	globalShortcut.register('Control+R', () => {
		return false
	})

	globalShortcut.register('Control+Shift+I', () => {
		if (store.windows.container.current && store.windows.container.current.isVisible()) {

			if (!store.conf.menu.password) {
				store.windows.container.current.webContents.openDevTools();
				return true
			}
			if (!store.ask.request) {
				// store.ask = {
				// 	request: 'password',
				// 	next_action: 'open_dev_tool'
				// }
				store.windows.container.current.webContents.send("ask_password", "open_dev_tools")
				return true
			}
			return false
		}

		if (store.windows.loader.current && store.windows.loader.current.isVisible()) {
			openDevToolsForLoader(store)
		}

		return true;
	})

	globalShortcut.register('Control+Shift+F', () => {
		if (store.windows.loader.current && store.windows.loader.current.isVisible()) {
		  if (store.windows.loader.current.isFullScreen()) {
				store.windows.loader.current.setFullScreen(false)
				store.windows.loader.current.setSize(300, 120)
				store.windows.loader.current.center()
				store.windows.loader.current.show()
			}
		}
		return true;
	})

	globalShortcut.register('Control+Shift+O', () => {
		if (store.windows.loader.current && store.windows.loader.current.isVisible()) {
			if (store.windows.loader.current.isFullScreen()) {
				store.windows.loader.current.setFullScreen(false)
				store.windows.loader.current.setSize(300, 120)
				store.windows.loader.current.center()
				store.windows.loader.current.show()
			} else {
				openDevToolsForLoader(store)
			}
		}
		return true;
	})

}
