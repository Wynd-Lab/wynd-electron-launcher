import { Reducer } from 'redux'

import { IAppAction, IRootState } from '../interface'
import { TAppActionTypeKeys } from './actions'
import { initialState } from './init'

const appReducer: Reducer<IRootState, IAppAction<TAppActionTypeKeys>> = (
	state = initialState,
	action,
) => {
	const data = action.payload

	const newState = { ...state }
	switch (action.type) {
		case TAppActionTypeKeys.OPEN_MENU:
			newState.menu = {
				...newState.menu,
				open: true,
			}
			return newState
		case TAppActionTypeKeys.CLOSE_MENU:
			newState.menu = {
				...newState.menu,
				open: false,
			}
			return newState

		case TAppActionTypeKeys.OPEN_MODAL:
			newState.modal = {
				...newState.modal,
				open: true,
			}
			return newState
		case TAppActionTypeKeys.CLOSE_MODAL:
			newState.modal = {
				...newState.modal,
				open: false,
			}
			return newState
		case TAppActionTypeKeys.SET_CONFIG:
			if (data) {
				newState.conf = data
				return newState
			}
			break
		case TAppActionTypeKeys.SET_WPT_INFO:
			if (data) {
				newState.wpt.infos = data
				return newState
			}
			break
		case TAppActionTypeKeys.SET_WPT_PLUGIN:
			if (data) {
				newState.wpt.plugins = data
				return newState
			}
			break
		case TAppActionTypeKeys.WPT_ASK:
			if (data) {
				newState.wpt.ask = data
				return newState
			}
			break
		case TAppActionTypeKeys.SET_SCREENS:
			if (data) {
				newState.screens = data
				return newState
			}
			break

		case TAppActionTypeKeys.SET_USER_ID:
			if (data) {
				newState.user.id = data
				return newState
			}
			break
		case TAppActionTypeKeys.OPEN_PINPAD:
			if (data) {
				newState.pinpad = {
					open: true,
					nextAction: data,
				}
				return newState
			}
			break
		case TAppActionTypeKeys.CLOSE_PINPAD:
			newState.pinpad = {
				open: false,
				nextAction: null,
			}
			return newState
		case TAppActionTypeKeys.WPT_CONNECT:
			newState.wpt = {
				...newState.wpt,
				connect: data,
			}
			return newState
		case TAppActionTypeKeys.IFRAME_DISPLAY_READY:
			newState.display = {
				...newState.display,
				ready: data
			}
			return newState
		case TAppActionTypeKeys.IFRAME_DISPLAY:
			newState.display = {
				...newState.display,
				switch: data
			}
			return newState
		case TAppActionTypeKeys.APP_INFOS:
			newState.app = {
				...newState.app,
				...data
			}
			return newState
		case TAppActionTypeKeys.SET_REPORTS:
			newState.report.reports = data
			return newState
		case TAppActionTypeKeys.SET_REPORT_X:
			newState.report.report_x = data
			return newState
		case TAppActionTypeKeys.SET_REPORT_Z:
			newState.report.report_z = data
			return newState
		case TAppActionTypeKeys.RESET_REPORTS:
			newState.report.reports = []
			return newState
		case TAppActionTypeKeys.SET_REPORT_ENV:
			newState.report.env = data
			return newState

		case TAppActionTypeKeys.SET_API_TOKEN:
			newState.api.token = data
			return newState
		case TAppActionTypeKeys.SET_REPORT_DATES: {
			newState.report.start_date = data.start
			newState.report.end_date = data.end
			return newState
		}
		default:
			break
	}
	return state
}

export default appReducer
