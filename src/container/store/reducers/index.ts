import { Reducer } from 'redux'

import { IAppAction, IRootState } from '../../interface'
import { TAppActionTypeKeys } from '../actions'
import { TReportActionTypeKeys } from '../actions/report'
import { initialState } from '../init'
import {reportReducer} from './report'
const appReducer: Reducer<IRootState, IAppAction<TAppActionTypeKeys | TReportActionTypeKeys>> = (
	state = initialState,
	action,
) => {

	const data = action.payload

	const newState = { ...state }
	switch (action.type) {
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
			if (data !== undefined) {
				newState.wpt = {
					...newState.wpt,
					ask: data
				}
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
					nextAction: data.nextAction,
					code: data.code,
					datas: data.datas
				}
				return newState
			}
			break

		case TAppActionTypeKeys.TOGGLE_MENU:
			newState.menu = {
				...newState.menu,
				open: data,
			}
			return newState

		case TAppActionTypeKeys.CLOSE_PINPAD:
			newState.pinpad = {
				open: false,
				nextAction: null,
				code: null,
				datas: []
			}
			return newState
		case TAppActionTypeKeys.WPT_CONNECT:
			if (newState.pluginState && data === false) {
				for (const event in newState.pluginState) {
					newState.pluginState[event].status = 'offline'
				}
			}
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
		case TAppActionTypeKeys.SET_LOADER:
			newState.loader = {
				...newState.loader,
				active: data,
			}
			return newState
		case TAppActionTypeKeys.WPT_PLUGIN_STATE:
				newState.pluginState = data || null
				return newState
			case TAppActionTypeKeys.WPT_PLUGIN_STATE_UPDATE:
				if (newState.pluginState) {
					newState.pluginState[data.event].status = data.status
					newState.pluginState = {
						...newState.pluginState ,
					}
				}
					return newState
		default:
			return reportReducer(state, action as IAppAction<TReportActionTypeKeys>)
	}
	return state
}

export default appReducer
