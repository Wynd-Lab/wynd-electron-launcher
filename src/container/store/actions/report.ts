import axios, { AxiosResponse } from 'axios'
import { Dispatch } from 'redux'

import { convertReportCA, convertReportStat, convertProduct, formatUrl } from '../../helpers/format'
import {
  IAppAction,
  IEnvInfo,
  IReportZ,
  IRootState,
  IMinReport,
  IReportX,
	IUserReport,
	IReportPayment,
	IReportDiscount,
	IReportStat,
	IReportProduct,
	IReportTeam,
	IReportPaymentRaw,
	IReportDiscountRaw,
	IReportProductRaw,
	IReportCA,
	TReportType,
	IUserProfil,
	IReportProductByDivision,
} from '../../interface'
import { fakeCA, fakeDiscount, fakePayment, fakeReports, fakeReportX, fakeReportX2, fakeTeamReport, fakeProduct } from '../fake'

export enum TReportActionTypeKeys {
	'SET_REPORTS' = 'SET_REPORTS',
	'SET_REPORT_X' = 'SET_REPORT_X',
	'SET_REPORT_Z' = 'SET_REPORT_Z',
	'SET_REPORT_ENV' = 'SET_REPORT_ENV',
	'RESET_REPORTS' = 'RESET_REPORTS',
	'RESET_REPORT_X' = 'RESET_REPORT_X',
	'RESET_REPORT_Z' = 'RESET_REPORT_Z',
	'SET_API_TOKEN' = 'SET_API_TOKEN',
	'SET_REPORT_DATES' = 'SET_REPORT_DATES',
	'SET_REPORT_USERS' = 'SET_REPORT_USERS',
	'SET_REPORT_ID_USER' = 'SET_REPORT_ID_USER',
	'SET_MAX_LINE_SIZE' = 'SET_MAX_LINE_SIZE'
}

export const fetchReportOperationsUponRequest = (fiscalDate: string, reportType: TReportType) => (
  dispatch: Dispatch,
  getState: () => IRootState
	): Promise<IReportProduct[]> => {
		const { report, api } = getState()

  const headers = {
    Authorization: `Bearer ${api.token}`,
  }

	if (process.env.DEV && process.env.DEV.includes('REPORT')) {
		return Promise.resolve(fakeProduct.products)
	}

	return axios
	.get<IReportProductRaw, AxiosResponse<IReportProductRaw>>(
		`${report.env?.API_URL}/pos/reports/${reportType}/interventions/${report.env?.API_CENTRAL_ENTITY}?fiscal_date=${fiscalDate}`,
		{ headers }
	)
	.then((response) => {
		return response.data.products || []
	})
}


export const fetchReportProducts = (fiscalDate: string, reportType: TReportType) => (
  dispatch: Dispatch,
  getState: () => IRootState
	): Promise<IReportProductByDivision[]> => {
		const { report, api } = getState()

  const headers = {
    Authorization: `Bearer ${api.token}`,
  }

	if (process.env.DEV && process.env.DEV.includes('REPORT')) {
		return Promise.resolve(convertProduct(fakeProduct.products))
	}

	return axios
	.get<IReportProductRaw, AxiosResponse<IReportProductRaw>>(
		formatUrl('products', fiscalDate, reportType, report),
		{ headers }
	)
	.then((response) => {
		return convertProduct(response.data.products || [])
	})
}

export const fetchReportStat = (fiscalDate: string, reportType: TReportType) => (
  _dispatch: Dispatch,
  getState: () => IRootState
	): Promise<IReportStat[]> => {
		const { report, api } = getState()

	if (process.env.DEV && process.env.DEV.includes('REPORT')) {
		return Promise.resolve(convertReportStat(fakeReports[0]))
	}

  const headers = {
    Authorization: `Bearer ${api.token}`,
  }

  return axios
    .get<IReportZ, AxiosResponse<IReportZ>>(
			formatUrl(null, fiscalDate, reportType, report),
      { headers }
    )
    .then((response) => {
      // dispatch(setReportZ(response.data))
			const data = response.data

      const result: IReportStat[] = convertReportStat(data)

      return result
    })
}

export const fetchReportDiscounts = (fiscalDate: string, reportType: TReportType) => (
  dispatch: Dispatch,
  getState: () => IRootState
	): Promise<IReportDiscount[]> => {
		const { report, api } = getState()

  const headers = {
    Authorization: `Bearer ${api.token}`,
  }

	if (process.env.DEV && process.env.DEV.includes('REPORT')) {
		return Promise.resolve(fakeDiscount.discounts)
	}

	return axios
	.get<IReportDiscountRaw, AxiosResponse<IReportDiscountRaw>>(
		formatUrl('discounts', fiscalDate, reportType, report),
		{ headers }
	)
	.then((response) => {
		return response.data.discounts || []
	})
}

export const fetchReportPayments = (fiscalDate: string, reportType: TReportType) => (
  dispatch: Dispatch,
  getState: () => IRootState
): Promise<IReportPayment[]> => {
  const { report, api } = getState()

  const headers = {
    Authorization: `Bearer ${api.token}`,
  }

	if (process.env.DEV && process.env.DEV.includes('REPORT')) {
		return Promise.resolve(fakePayment.payments)
	}

	return axios
	.get<IReportPaymentRaw, AxiosResponse<IReportPaymentRaw>>(
		formatUrl('payments', fiscalDate, reportType, report),
		{ headers }
	)
	.then((response) => {
		return response.data.payments || []
	})
}

export const fetchReportUsers = (fiscalDate: string, reportType: TReportType) => (
  dispatch: Dispatch,
  getState: () => IRootState
	): Promise<IUserReport[]> => {
	const { report, api } = getState()

  const headers = {
    Authorization: `Bearer ${api.token}`,
  }

	const promise = process.env.DEV && process.env.DEV.includes('REPORT') ?
	  Promise.resolve(fakeTeamReport.users) :
		axios.get<IReportTeam, AxiosResponse<IReportTeam>>(
			`${report.env?.API_URL}/pos/reports/${reportType}/users/${report.env?.API_CENTRAL_ENTITY}?fiscal_date=${fiscalDate}`,
			{ headers }
		)
		.then((response) => {
			const users = response.data.users || []
			return users
		})

	return promise.then((users) => {
		const profils = users.map((user) => user.user)
		dispatch(setReportUsers(profils))
		return users
	})

}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const fetchGlobalCA = (fiscalDate: string, reportType: TReportType) => (
  dispatch: Dispatch,
  getState: () => IRootState
	): Promise<IReportCA[]> => {
  const { report, api } = getState()

  const headers = {
    Authorization: `Bearer ${api.token}`,
  }

	if (process.env.DEV && process.env.DEV.includes('REPORT')) {
		return Promise.resolve(fakeCA)
	}


	let url = `${report.env?.API_URL}/pos/reports/${reportType}/vat_rates/${report.env?.API_CENTRAL_ENTITY}?fiscal_date=${fiscalDate}`
	if (report.id_user) {
		url += `&id_user=${report.id_user}`
	}
	return axios
	.get(
		url,
		{ headers }
	)
	.then((response) => {
		return convertReportCA(response.data)
	})
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const fetchReports = () => (
  dispatch: Dispatch,
  getState: () => IRootState
) => {

  const { report, api } = getState()

	if (process.env.DEV && process.env.DEV === 'REPORT') {
		dispatch(setReports(fakeReports))
		return Promise.resolve(fakeReports)
	}

  const headers = {
    Authorization: `Bearer ${api.token}`,
  }

  dispatch(setReports([]))
  return axios
    .get(
      `${report.env?.API_URL}/pos/reports/report_z/${report.env?.API_CENTRAL_ENTITY}?month=${report.start_date}`,
      { headers }
    )
    .then((response) => {
      dispatch(setReports(response.data))
      return response.data
    })
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const fetchReportX = () => (
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  _dispatch: any,
  getState: () => IRootState
) => {

  const { report, api } = getState()

	if (process.env.DEV && process.env.DEV === 'REPORT') {
		return Promise.resolve(fakeReportX)
	}

  const headers = {
    Authorization: `Bearer ${api.token}`,
  }
  return axios
    .get(
      `${report.env?.API_URL}/pos/reports/report_x/${report.env?.API_CENTRAL_ENTITY}?month=${report.start_date}`,
      { headers }
    )
    .then((response) => {
      // dispatch(setReportX(response.data))
      return response.data
    })
}

export const fetchReportZ = () => (
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  _dispatch: Dispatch,
  getState: () => IRootState
	): Promise<IMinReport> => {
		const { report, api } = getState()

	if (process.env.DEV && process.env.DEV === 'REPORT') {
		return Promise.resolve(fakeReportX2)
	}

  const headers = {
    Authorization: `Bearer ${api.token}`,
  }

  return axios
    .get<IReportZ[], AxiosResponse<IReportZ[]>>(
      `${report.env?.API_URL}/pos/reports/report_z/${report.env?.API_CENTRAL_ENTITY}?start_date=${report.start_date}&end_date=${report.end_date}`,
      { headers }
    )
    .then((response) => {
      // dispatch(setReportZ(response.data))

      const result: IMinReport = {
        total_net: 0,
        nb_net: 0,
        average_basket: 0,
      }
      for (let i = 0; i < response.data.length; i++) {
        const report: IReportZ = response.data[i]

        result.total_net += report.total_net
        result.nb_net += report.nb_net
        result.average_basket += report.average_basket
      }

      if (result.nb_net !== 0) {
        result.average_basket = result.average_basket / result.nb_net
      }
      return result
    })
}

export function setToken(token: String): IAppAction<TReportActionTypeKeys> {
  return {
    type: TReportActionTypeKeys.SET_API_TOKEN,
    payload: token,
  }
}

export function setReportEnvInfo(
  envInfo: IEnvInfo
): IAppAction<TReportActionTypeKeys> {
  return {
    type: TReportActionTypeKeys.SET_REPORT_ENV,
    payload: envInfo,
  }
}

export function setReportDates(
  startDate: string,
  endDate: string
): IAppAction<TReportActionTypeKeys> {
  return {
    type: TReportActionTypeKeys.SET_REPORT_DATES,
    payload: {
      start: startDate,
      end: endDate,
    },
  }
}

export function resetReport(): IAppAction<TReportActionTypeKeys> {
  return {
    type: TReportActionTypeKeys.RESET_REPORTS,
  }
}



export function setReports(report: IReportZ[]): IAppAction<TReportActionTypeKeys> {
  return {
    type: TReportActionTypeKeys.SET_REPORTS,
    payload: report,
  }
}

export function setReportX(report: IReportX): IAppAction<TReportActionTypeKeys> {
  return {
    type: TReportActionTypeKeys.SET_REPORT_X,
    payload: report,
  }
}

export function setReportZ(report: IReportZ): IAppAction<TReportActionTypeKeys> {
  return {
    type: TReportActionTypeKeys.SET_REPORT_Z,
    payload: report,
  }
}

export function setReportUsers(users: IUserProfil[]): IAppAction<TReportActionTypeKeys> {
  return {
    type: TReportActionTypeKeys.SET_REPORT_USERS,
		payload: users
  }
}

export function setReportIdUser(id_user: number | null): IAppAction<TReportActionTypeKeys> {
  return {
    type: TReportActionTypeKeys.SET_REPORT_ID_USER,
		payload: id_user
  }
}


export function setReportMaLineSizeAction(maxLineSize: number): IAppAction<TReportActionTypeKeys> {
  return {
    type: TReportActionTypeKeys.SET_MAX_LINE_SIZE,
		payload: maxLineSize
  }
}
