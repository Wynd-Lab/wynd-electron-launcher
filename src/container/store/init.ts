import { IRootState } from '../interface'
import { reportZ, reportX } from "./fake"

const debug = !!sessionStorage.getItem("debug") || process.env.DEBUG

export const initialState: IRootState = {
	display: {
		ready: false,
		switch: debug === 'REPORT' ? 'REPORT' : 'CONTAINER'
	},
	app:  {
		version: "",
		name: ""
	},
	menu: {
		open: false || !!debug,
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
	report: {
		env: null,
		start_date: null,
		end_date:null,
		reports: debug === 'REPORT' ? reportZ : [],
		report_z: null,
		report_x: debug === 'REPORT' ? reportX : null
	},
	api: {
		token: null
	}
}
