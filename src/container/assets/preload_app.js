const {
	ipcRenderer, contextBridge
} = require("electron");

ipcRenderer.on('parent.action', (event, data) => {
	data.origin = window.origin
	window.postMessage(data, window.origin)
})

contextBridge.exposeInMainWorld(
  'electron',
  {
	sendToHost: (data) => ipcRenderer.sendToHost("app.action", data),
	openBrowserView: (url, opts) => ipcRenderer.invoke("app.open_browserview", url, opts),
	closeBrowserView: () =>  ipcRenderer.invoke("app.close_browserview"),
	getSize: () => {
		return ipcRenderer.invoke("app.screen_size")
	},
	openBrowserWindow: (url, opts) => ipcRenderer.invoke("app.open_browserwindow", url, opts),
	closeBrowserWindow: () =>  ipcRenderer.invoke("app.close_browserwindow"),
  }
)

