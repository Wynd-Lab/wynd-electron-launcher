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
    sendToHost: (data) => ipcRenderer.sendToHost("app.action", data)
  }
)

