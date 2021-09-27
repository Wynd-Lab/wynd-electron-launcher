import { IRootState } from '../interface'
import { fakeReports, fakeReportX, fakeReportX2 } from "./fake"

const debug = !!sessionStorage.getItem("debug") || process.env.DEBUG

export const initialState: IRootState = {
	display: {
		ready: false,
		switch: debug === 'REPORT' ? 'REPORT' : 'CONTAINER'
	},
	loader: {
		active: false
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
		reports: debug === 'REPORT' ? fakeReports : [],
		report_z: debug === 'REPORT' ? fakeReportX2 : null,
		report_x: debug === 'REPORT' ? fakeReportX : null
	},
	api: {
		token: null
	}
}
