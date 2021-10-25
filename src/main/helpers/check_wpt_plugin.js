const requestWPT = require("./request_wpt")

module.exports =  function checkWptPlugin(socket, plugin) {

		return requestWPT(socket, { emit: "plugins", datas: null })
			.then((plugins) => {
				const foundPlugin = plugins.filter((plugin) => {
					return plugin.name === plugin
				})

				if (foundPlugin.length === 0) {
					err = {
						code: `NO_${plugin}_PLUGIN_FOUND`,
						message: `No ${plugin.toLowerCase()} plugin found`
					}
				}
				if (!foundPlugin[0].enabled) {
					if (store.windows.container.current) {
						err = {
							code: `${plugin}_PLUGIN_DISABLED`,
							message: `${plugin.toLowerCase()} plugin is disabled`
						}
					}
				}
				return foundPlugin[0]
			})

		}
