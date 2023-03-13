
const path = require('path')

const {
	ipcRenderer
} = require("electron")

const createRenderLog = require('../../helpers/create_renderer_log')

ipcRenderer.once("user_path", (event, userPath) => {
	window.log = createRenderLog(userPath)
})

// contextBridge.exposeInMainWorld(
// 	"main", {
// 			send: (channel, data) => {
// 					// whitelist channels
// 					let validChannels = ["ready"];
// 					if (validChannels.includes(channel)) {
// 							ipcRenderer.send(channel, data);
// 					}
// 			},
// 			receive: (channel, func) => {
// 					let validChannels = ['request_wpt.error', 'app_infos', 'request_wpt.done', 'conf', 'notification', 'ask_password', 'wpt_connect', 'ready', 'screens', 'menu.action'];
// 					if (validChannels.includes(channel)) {
// 							// Deliberately strip event as it includes `sender`
// 							ipcRenderer.on(channel, (event, ...args) => func(...args));
// 					}
// 			},
// 			sendLog: (level, message) => {
// 				ipcRenderer.send(
// 					'child.action',
// 					'log',
// 					level,
// 					message
// 				)
// 			}
// 	}
// );

// if (remote) {
// 	const hooksPath = path.join(remote.app.getPath("userData"), 'modules')
// 	fs.promises.readdir(hooksPath)
// 		.then((files) => {
// 			window.modules = {}
// 			for (let i = 0; i < files.length; i++) {
// 				const file = files[i];
// 				const name = file.split('.')[0]
// 				const hookPath = path.join(hooksPath, name)

// 				const Module = require(hookPath)
// 				window.modules[name] = new Module()
// 			}
// 		})
// 		.catch((err) => {
// 			// eslint-disable-next-line no-console
// 			// console.error(err)
// 		})
// }

window.addEventListener('DOMContentLoaded', () => {
	const sources = [];
	if (document.getElementById("electron-launcher-root")) {
		if (process.env.NODE_ENV === "development") {
			// Dynamically insert the DLL script in development env in the
			// renderer process
			// Dynamically insert the bundled app script in the renderer process
			const port = process.env.PORT || 5000;
			sources.push(`http://localhost:${port}/dist/container.js`);
		} else {
			sources.push("../../container/dist/index.js");
		}
		if (process && process.env && process.env.NODE_ENV !== "development") {
			window.__STATIC__ = `file://${path.resolve(__dirname, './preload_app.js')}`
			const link = document.createElement('link');
			link.rel = 'stylesheet';
			link.href = '../../container/dist/index.css';
			// HACK: Writing the script path should be done with webpack
			document.getElementsByTagName('head')[0].appendChild(link);
		} else {
			window.__STATIC__ = `file://${path.resolve('/home/ppetit/electron/wynd-electron-launcher/src/container/assets/preload_app.js')}`
		}

		if (sources.length) {

			for (let i = 0; i < sources.length; i++) {
				const scriptNode = document.createElement('script')
				const src = sources[i];
				scriptNode.src = src
				document.body.appendChild(scriptNode);

			}
		}
	}
})

