/* eslint global-require: off, no-console: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `yarn build` or `yarn build:main`, this file is compiled to
 * `./src/main.prod.js` using webpack. This gives us some performance wins.
 */

 const path = require('path')
 const { app, BrowserWindow } = require('electron')
 const { autoUpdater } = require('electron-updater')
 const log = require('electron-log')

 let mainWindow = null

//  if (process.env.NODE_ENV === 'production') {
//    const sourceMapSupport = require('source-map-support')
//    sourceMapSupport.install()
//  }


//  const installExtensions = async () => {
//    const installer = require('electron-devtools-installer')
//    const forceDownload = !!process.env.UPGRADE_EXTENSIONS
//    const extensions = ['REACT_DEVELOPER_TOOLS']

//    return installer
//      .default(
//        extensions.map((name) => installer[name]),
//        forceDownload
//      )
//      .catch(console.log)
//  }

 const createWindow = async () => {
  //  if (
  //    process.env.NODE_ENV === 'development' ||
  //    process.env.DEBUG_PROD === 'true'
  //  ) {
  //    await installExtensions()
  //  }

   const RESOURCES_PATH = app.isPackaged
     ? path.join(process.resourcesPath, 'assets')
     : path.join(__dirname, '../assets')

   const getAssetPath = (paths) => {
     return path.join(RESOURCES_PATH, ...paths)
   }

   mainWindow = new BrowserWindow({
     show: false,
     width: 1024,
     height: 728,
     icon: getAssetPath('icon.png'),
     webPreferences: {
       nodeIntegration: true,
       contextIsolation: false,
     },
   })

   mainWindow.loadURL(`file://${__dirname}/index.html`)

   // @TODO: Use 'ready-to-show' event
   //        https://github.com/electron/electron/blob/master/docs/api/browser-window.md#using-ready-to-show-event
   mainWindow.webContents.on('did-finish-load', () => {
     if (!mainWindow) {
       throw new Error('"mainWindow" is not defined')
     }
     if (process.env.START_MINIMIZED) {
       mainWindow.minimize()
     } else {
       mainWindow.show()
       mainWindow.focus()
     }
   })

   mainWindow.on('closed', () => {
     mainWindow = null
   })

   // Remove this if your app does not use auto updates
   // eslint-disable-next-line
   // new AppUpdater();
 }

 /**
  * Add event listeners...
  */

 app.on('window-all-closed', () => {
   // Respect the OSX convention of having the application in memory even
   // after all windows have been closed
   if (process.platform !== 'darwin') {
     app.quit()
   }
 })

 app.whenReady().then(createWindow).catch(console.log)

 app.on('activate', () => {
   // On macOS it's common to re-create a window in the app when the
   // dock icon is clicked and there are no other windows open.
   if (mainWindow === null) createWindow()
 })
