import { IRootState } from '../interface'
// import { fakeReports, fakeReportX, fakeReportX2 } from './fake'

const debug = !!sessionStorage.getItem('debug') || process.env.DEBUG
const dev = process.env.DEV

export const initialState: IRootState = {
	display: {
		ready: false,
		switch: dev === 'REPORT' || dev === 'REPORT_D' ? 'REPORT' : 'CONTAINER'
	},
	loader: {
		active: false
	},
	app:  {
		version: '',
		name: ''
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
		reports: [],
		users: [],
		id_user: null
	},
	api: {
		token: null
	}
}
