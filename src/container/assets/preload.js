// const remote = require('@electron/remote')

// const path = require("path")
// try {
//   if (remote) {
//     const Hooks = require(path.join(remote.app.getPath("userData"), 'hooks'))
//     const hooks = new Hooks()
//     window.hooks = hooks
//   }

// }
// catch(err) {
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
			sources.push("../dist/index.js");
		}
		if (process && process.env && process.env.NODE_ENV !== "development") {
			const link = document.createElement('link');
			link.rel = 'stylesheet';
			link.href = '../dist/index.css';
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

