const {
	ipcRenderer, contextBridge
} = require("electron");

contextBridge.exposeInMainWorld(
  'electron',
  {
		openBrowserView: (url, opts) => ipcRenderer.send("app.open_browserview", url, opts),
		closeBrowserView: () =>  ipcRenderer.send("app.close_browserview")
  }
)

