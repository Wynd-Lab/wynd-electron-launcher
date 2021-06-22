const { globalShortcut } = require("electron")

module.exports = function (store) {
	globalShortcut.unregisterAll()
	globalShortcut.register('Control+Shift+I', () => {
		if (store.windows.container.current && store.windows.container.current.isVisible()) {
			store.windows.container.current.webContents.openDevTools();
		}
		if (store.windows.loader.current && store.windows.loader.current.isVisible()) {
			store.windows.loader.current.setResizable(true)
			store.windows.loader.current.setMovable(true)
			store.windows.loader.current.setFullScreen(true)
			const choosenScreen = store.screens[store.choosen_screen]
			store.windows.loader.current.setPosition(choosenScreen.x, choosenScreen.y)
			store.windows.loader.current.setSize(choosenScreen.width - 10, choosenScreen.height- 10)

			store.windows.loader.current.center()
			store.windows.loader.current.webContents.openDevTools();
			store.windows.loader.current.center()
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

}
