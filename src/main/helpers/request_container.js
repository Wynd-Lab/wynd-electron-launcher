const CustomError = require('../../helpers/custom_error')

module.exports = function requestContainer (store, event) {
	store.windows.container.state = null
	let timeoutInterval = null
	let count = 0
	return new Promise((resolve, reject) => {
		if (store.windows.container.current) {
			store.windows.container.current.send('container.request', event)
			timeoutInterval = setInterval(() => {
				count++
				if (count >= 10) {
					if (timeoutInterval) {
						timeoutInterval = clearInterval(timeoutInterval)
					}
				}
				resolve(store.windows.container.state)
			}, 1 * 1000)
		} else {
			if (timeoutInterval) {
				timeoutInterval = clearInterval(timeoutInterval)
			}
			reject(new CustomError(404, "CONTAINER_NOT_FOUND", "container not found"))
		}

	})
}