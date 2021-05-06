module.exports =  function killWPT(child) {

	return new Promise((resolve, reject) => {
		let timeout = null
		if (child && child.killed) {
			resolve()
		} else {
			timeout = setTimeout(() => {
				timeout = null
				reject(new Error("Cannot kill WPT"))
			}, )
			child.on('exit', () => {
				if(timeout) {
					clearTimeout(timeout)
					timeout = null
				}
				resolve()
			})
			child.kill("SIGKILL")
		}
	})
}
