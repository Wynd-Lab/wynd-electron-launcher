import { EAction, EActionKeys } from "../interface"

export function getTotal(action: EActionKeys){
	switch (action) {
		case "close":
			return 3
		case "reload":
			return 7
		case "initialize":
			return 8
		default:
			return 0
	}
}
