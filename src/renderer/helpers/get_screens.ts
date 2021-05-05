import { IScreen } from "../interface";
declare const nw: any

export default function getWindow() : IScreen[] {
		nw.Screen.Init();
		return nw.Screen.screens.map((screen: any) => {
			return { width: screen.bounds.width, height: screen.bounds.height}
		})

}
