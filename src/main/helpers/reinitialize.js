const { webFrame } = require('electron')
const showDialogError = require("../dialog_err")
const initialize = require('./initialize')

module.exports = async function reinitialize(store, initCallback) {
    if(webFrame) {
        webFrame.clearCache()
    }

    if (store.wpt.socket) {
        store.wpt.socket.close()
    }

    if(store.http) {
        store.http.close()
    }
    if(store.windows.pos.current) {
        store.windows.pos.current.reload()
    }

    try {
        store.wpt.socket = await initialize({conf: store.path.conf}, initCallback)
        store.wpt.socket.emit("central.custom", '@cdm/wyndpos-desktop', 'connected', store.version)
    }
    catch(err) {
        showDialogError(store, err)
    }
}
