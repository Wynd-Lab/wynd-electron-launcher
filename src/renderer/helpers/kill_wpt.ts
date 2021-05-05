
export default function killWPT(child: any) : Promise<void> {

	return new Promise<void>((resolve, reject) => {
		let timeout: any
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
