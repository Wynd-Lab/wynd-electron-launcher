const path = require('path')
const fs = require('fs')

const remote = require('@electron/remote')
const log = require('electron-log')

window.log = log
if (remote) {
	const hooksPath = path.join(remote.app.getPath("userData"), 'modules')
	fs.promises.readdir(hooksPath)
		.then((files) => {
			window.modules = {}
			for (let i = 0; i < files.length; i++) {
				const file = files[i];
				const name = file.split('.')[0]
				const hookPath = path.join(hooksPath, name)

				const Module = require(hookPath)
				window.modules[name] = new Module()
			}
		})
		.catch((err) => {
			// eslint-disable-next-line no-console
			// console.error(err)
		})
}

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
			const link = document.createElement('link');
			link.rel = 'stylesheet';
			link.href = '../../container/dist/index.css';
			// HACK: Writing the script path should be done with webpack
			document.getElementsByTagName('head')[0].appendChild(link);
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

