const { Tray, Menu , ipcMain } = require('electron')
const path = require("path")

module.exports = (store) => {
	appIcon = new Tray(path.join(__dirname,'../../assets/icons/png/16x16.png'))
	const onClick = (e, focusedWindow, focusedWebContents) => {
		if (store.windows.container.current) {
			store.windows.container.current.webContents.send("menu.action", e.label.toUpperCase())
		} else {
			ipcMain.emit("main.action", null,  e.label.toLowerCase())
		}
	}

	const contextMenu = Menu.buildFromTemplate([
    { label: 'Reload', type: 'normal', click: onClick },
    { label: 'Close', type: 'normal', click: onClick }
  ])

  // Make a change to the context menu

  // Call this again for Linux because we modified the context menu
  appIcon.setContextMenu(contextMenu)

	return appIcon
}
