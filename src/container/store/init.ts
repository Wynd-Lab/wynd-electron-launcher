import { IRootState } from '../interface'

const debug = !!sessionStorage.getItem("debug") || !!process.env.DEBUG
export const initialState: IRootState = {
	display: {
		ready: false,
		switch: 'CONTAINER'
	},
	app:  {
		version: "",
		name: ""
	},
	menu: {
		open: false || debug,
	},
	modal: {
		open: false,
		content: '',
	},
	wpt: {
		connect: false,
		ask: false,
		infos: null,
		plugins: [],
	},
	conf: null,
	screens: [],
	user: {
		id: null,
	},
	pinpad: {
		open: false,
		nextAction: null,
	},
}
