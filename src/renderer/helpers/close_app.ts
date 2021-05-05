import getWindow from "./get_screens"
import killWPT from "./kill_wpt"

export default function closeApp(window: any | null, child?: any): Promise<void> {

	return child ? killWPT(child) : Promise.resolve()
		.finally(() => {
			console.log("FINALLY")
			if (!window) {
				window = getWindow()
			}
			window.close()
		})
}
