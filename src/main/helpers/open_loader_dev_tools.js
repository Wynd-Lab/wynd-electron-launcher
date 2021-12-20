module.exports = (store) => {
	store.windows.loader.current.setResizable(true)
	store.windows.loader.current.setMovable(true)
	store.windows.loader.current.setFullScreen(true)
	const choosenScreen = store.choosen_screen
	store.windows.loader.current.setPosition(choosenScreen.x, choosenScreen.y)
	store.windows.loader.current.setSize(choosenScreen.width - 10, choosenScreen.height- 10)

	store.windows.loader.current.center()
	store.windows.loader.current.webContents.openDevTools();
	store.windows.loader.current.center()
}
