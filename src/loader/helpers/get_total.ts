import { EActionKeys } from '../interface'

export function getTotal(action: EActionKeys): number{
	switch (action) {
		case 'update':
		case 'close':
			return 3
		case 'reload':
			return 7
		case 'initialize':
			return 10
		default:
			return 0
	}
}
