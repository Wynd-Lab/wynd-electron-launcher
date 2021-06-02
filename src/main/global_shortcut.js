const { globalShortcut } = require("electron")

module.exports = function (store) {
	globalShortcut.register('Control+Shift+I', () => {
		if (store.windows.pos.current && store.windows.pos.current.isVisible()) {
			store.windows.pos.current.webContents.openDevTools();
		}
		if (store.windows.loader.current && store.windows.loader.current.isVisible()) {
			store.windows.loader.current.setResizable(true)
			store.windows.loader.current.setMovable(true)
			store.windows.loader.current.setFullScreen(true)
			store.windows.loader.current.setSize(store.choosen_screen.width -40, store.choosen_screen.height- 40)

			store.windows.loader.current.webContents.openDevTools();
			store.windows.loader.current.center()
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
