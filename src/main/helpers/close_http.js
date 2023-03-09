module.exports = function (http) {
	return new Promise((resolve, reject) => {
		let timeout = setTimeout(() => {
			timeout = null
			resolve(false)
		}, 1000)
		http.close((err) => {
			if (err) {
				reject(err)
			} else {
				if (timeout) {
					clearTimeout(timeout)
				}
				resolve(true)
			}
		})
	})
}
