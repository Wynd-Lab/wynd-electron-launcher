import { Reducer } from 'redux'

import { IAppAction, IRootState } from '../../interface'
import { TReportActionTypeKeys } from '../actions/report'
import { initialState } from '../init'


export const reportReducer: Reducer<IRootState, IAppAction<TReportActionTypeKeys>> = (
	state = initialState,
	action,
) => {
	const data = action.payload
	const newState = { ...state }

	switch (action.type) {
		case TReportActionTypeKeys.SET_REPORTS:
			newState.report.reports = data
			return newState
		// case TReportActionTypeKeys.SET_REPORT_X:
		// 	newState.report.report_x = data
		// 	return newState
		// case TReportActionTypeKeys.SET_REPORT_Z:
		// 	newState.report.report_z = data
		// 	return newState
		case TReportActionTypeKeys.RESET_REPORTS:
			newState.report.reports = []
			return newState
		case TReportActionTypeKeys.SET_REPORT_ENV:
			newState.report.env = data
			return newState

		case TReportActionTypeKeys.SET_API_TOKEN:
			newState.api.token = data
			return newState
		case TReportActionTypeKeys.SET_REPORT_DATES:
			newState.report.start_date = data.start
			newState.report.end_date = data.end
			return newState
		case TReportActionTypeKeys.SET_REPORT_USERS:
			newState.report.users = data
			return newState
		case TReportActionTypeKeys.SET_REPORT_ID_USER:
			newState.report.id_user = data
			return newState
		default:
			return state
		}
	}
