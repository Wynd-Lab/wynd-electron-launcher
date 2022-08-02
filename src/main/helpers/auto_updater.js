const { autoUpdater } = require('electron-updater');
// const baseUrl = 'http://localhost:5001/download/1.6.4'
// let autoUpdater = null
// if (process.platform === 'win32') {
// 	autoUpdater = new NsisUpdater({ url: `${baseUrl}/win` });
// } else if (process.platform === 'darwin') {
// 	autoUpdater = new MacUpdater({ url: `${baseUrl}/macx64` });
// } else {
// 	autoUpdater = new AppImageUpdater({provider: "github", "owner": "Wynd-Lab",	"repo": "wynd-electron-launcher"})
// }

module.exports = autoUpdater
