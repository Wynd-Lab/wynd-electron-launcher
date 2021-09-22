import axios from "axios";
import { type } from "os";
import { Dispatch } from "redux";
import { TAppActionTypeKeys } from ".";
import { IAppAction, IEnvInfo, IRootState } from "../../interface";

export const fetchReports = () => (dispatch: Dispatch, getState: () => IRootState) => {
	const { report, api } = getState()

	console.log("fetchReports")
	const headers = {
		"Authorization" : `Bearer ${api.token}`
	}
	return axios.get(`${report.env?.API_URL}/pos/reports/report_z/${report.env?.API_CENTRAL_ENTITY}?month=${report.start_date}`, {headers}).then((response) => {
		dispatch(setReports(response.data))
		return response.data
	})

}

export const fetchReportX = () => (dispatch: Dispatch, getState: () => IRootState) => {
	const { report, api } = getState()

	const headers = {
		"Authorization" : `Bearer ${api.token}`
	}
	return axios.get(`${report.env?.API_URL}/pos/reports/report_x/${report.env?.API_CENTRAL_ENTITY}?month=${report.start_date}`, {headers}).then((response) => {
		dispatch(setReportX(response.data))
		return response.data
	})

}

export const fetchReportZ = () => (dispatch: Dispatch, getState: () => IRootState) => {
	const { report, api } = getState()

	const headers = {
		"Authorization" : `Bearer ${api.token}`
	}
	return axios.get(`${report.env?.API_URL}/pos/reports/report_z/${report.env?.API_CENTRAL_ENTITY}?start=${report.start_date}&end_date=${report.end_date}`, {headers}).then((response) => {
		dispatch(setReportZ(response.data))
		return response.data
	})

}

export function setToken(token: String) : IAppAction<TAppActionTypeKeys> {
	return {
		type: TAppActionTypeKeys.SET_API_TOKEN,
		payload: token
	}
}


export function setReportEnvInfo(envInfo: IEnvInfo) : IAppAction<TAppActionTypeKeys> {
	return {
		type: TAppActionTypeKeys.SET_REPORT_ENV,
		payload: envInfo
	}
}

export function setReportDates(startDate: string, endDate: string) : IAppAction<TAppActionTypeKeys> {
	return {
		type: TAppActionTypeKeys.SET_REPORT_DATES,
		payload: {
			start: startDate,
			end: endDate
		}
	}
}



export function resetReport() : IAppAction<TAppActionTypeKeys> {
	return {
		type: TAppActionTypeKeys.RESET_REPORTS
	}
}

export function setReports(report: any) : IAppAction<TAppActionTypeKeys> {
	return {
		type: TAppActionTypeKeys.SET_REPORTS,
		payload: report
	}
}

export function setReportX(report: any) : IAppAction<TAppActionTypeKeys> {
	return {
		type: TAppActionTypeKeys.SET_REPORT_X,
		payload: report
	}
}

export function setReportZ(report: any) : IAppAction<TAppActionTypeKeys> {
	return {
		type: TAppActionTypeKeys.SET_REPORT_Z,
		payload: report
	}
}
