export default function injectScript(data: string): Promise<void> {
	return new Promise<void>((resolve, reject) => {
		const script = document.createElement('script')
		script.text = data
		script.addEventListener('error', e => reject(e.error))
		document.head.appendChild(script)
		resolve()
	})
}
