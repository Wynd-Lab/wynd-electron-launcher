import { ICustomWindow } from '../../helpers/interface'
import { generateDates } from '../helpers/generate'
import { IRootState } from '../interface'
// import { fakeReports, fakeReportX, fakeReportX2 } from './fake'

declare let window: ICustomWindow

const debug = !!sessionStorage.getItem('debug') || window.main?.env.DEBUG
const dev = window.main?.env.DEV

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
		datas: []
	},
	report: {
		env: null,
		start_date: dev === 'REPORT' ? generateDates()[0]: null,
		end_date:dev === 'REPORT' ? generateDates()[1]: null,
		reports: [],
		users: [],
		id_user: null,
		max_line_size: 48
	},
	api: {
		token: null
	}
}
