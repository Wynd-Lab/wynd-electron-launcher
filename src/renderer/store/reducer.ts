import { Reducer } from 'redux'

import { IAppAction, IRootState } from '../interface'
import { TAppActionTypeKeys } from '../store/actions'
import { initialState } from './init'

const appReducer: Reducer<IRootState, IAppAction<TAppActionTypeKeys>>  = (state = initialState, action)  => {
	const data = action.payload?.data

	const newState = {...state}
	switch (action.type) {

		case TAppActionTypeKeys.OPEN_MENU:
			newState.menu = {
				...newState.menu,
				open: true
			}
			return newState
		case TAppActionTypeKeys.CLOSE_MENU:
			newState.menu = {
				...newState.menu,
				open: false
			}
			return newState

		case TAppActionTypeKeys.OPEN_MODAL:
			newState.modal = {
				...newState.modal,
				open: true
			}
			return newState
		case TAppActionTypeKeys.CLOSE_MODAL:
			newState.modal = {
				...newState.modal,
				open: false
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
					nextAction: data
				}
				return newState
			}
			break
		case TAppActionTypeKeys.CLOSE_PINPAD:
			newState.pinpad = {
				open: false,
				nextAction: null
			}
			return newState
		case TAppActionTypeKeys.WPT_CONNECTED:
			newState.wpt = {
				...newState.wpt,
				connect: true,
			}
			return newState
		case TAppActionTypeKeys.WPT_DISCONNECTED:
			newState.wpt = {
				...newState.wpt,
				connect: false,
			}
			return newState
		default:
			break;
	}
	return state
}

export default appReducer
