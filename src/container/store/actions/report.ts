import axios, { AxiosResponse } from 'axios'
import { Dispatch } from 'redux'
import { TAppActionTypeKeys } from '.'
import { convertReportCA } from '../../helpers/format'
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
} from '../../interface'
import { fakeCA, fakeDiscount, fakePayment, fakeReports, fakeReportX, fakeReportX2, fakeTeamReport, fakeStat, fakeProduct } from '../fake'




export const fetchReportProducts = (fiscalDate: string) => (
  dispatch: Dispatch,
  getState: () => IRootState
	): Promise<IReportProduct[]> => {
		const { report, api } = getState()

  const headers = {
    Authorization: `Bearer ${api.token}`,
  }

	if (process.env.DEV && process.env.DEV === 'REPORT_D') {
		return Promise.resolve(fakeProduct.products)
	}

	return axios
	.get<IReportProductRaw, AxiosResponse<IReportProductRaw>>(
		`${report.env?.API_URL}/pos/reports/report_z/products/${report.env?.API_CENTRAL_ENTITY}?fiscal_date=${fiscalDate}`,
		{ headers }
	)
	.then((response) => {
		return response.data.products || []
	})
}

export const fetchReportStat = (fiscalDate: string) => (
  _dispatch: Dispatch,
  getState: () => IRootState
	): Promise<IReportStat[]> => {
		const { report, api } = getState()

	if (process.env.DEV && process.env.DEV === 'REPORT') {
		return Promise.resolve(fakeStat)
	}

  const headers = {
    Authorization: `Bearer ${api.token}`,
  }

  return axios
    .get<IReportZ, AxiosResponse<IReportZ>>(
      `${report.env?.API_URL}/pos/reports/report_z/${report.env?.API_CENTRAL_ENTITY}?fiscal_date=${fiscalDate}`,
      { headers }
    )
    .then((response) => {
      // dispatch(setReportZ(response.data))
			const data = response.data

      const result: IReportStat[] = [
				{
					'uuid': '1',
					default_label: 'Nombre de ventes Net',
					'quantity': data.nb_net,
					'quantity_percent': data.nb_net / (data.nb_net + data.nb_sales_canceled + data.nb_sales_partially_cancelled) * 100,
					'amount': null,
					'amount_percent': null
				},
				{
					'uuid': '2',
					default_label: 'Nombre de ventes annulés',
					'quantity': data.nb_sales_canceled,
					'quantity_percent': data.nb_sales_canceled / (data.nb_net + data.nb_sales_canceled + data.nb_sales_partially_cancelled) * 100,
					'amount': null,
					'amount_percent': null
				},
				{
					'uuid': '3',
					default_label: 'Nombre de ventes annulés partiellement',
					'quantity': data.nb_sales_partially_cancelled,
					'quantity_percent': data.nb_sales_partially_cancelled / (data.nb_net + data.nb_sales_canceled + data.nb_sales_partially_cancelled) * 100,
					'amount': null,
					'amount_percent': null
				},
				{
					'uuid': '4',
					default_label: 'Panier moyen Net',
					'quantity': null,
					'quantity_percent': null,
					'amount': data.average_basket,
					'amount_percent': null
				},
			]

      return result
    })
}

export const fetchReportDiscounts = (fiscalDate: string) => (
  dispatch: Dispatch,
  getState: () => IRootState
	): Promise<IReportDiscount[]> => {
		const { report, api } = getState()

  const headers = {
    Authorization: `Bearer ${api.token}`,
  }

	if (process.env.DEV && process.env.DEV === 'REPORT_D') {
		return Promise.resolve(fakeDiscount.discounts)
	}

	return axios
	.get<IReportDiscountRaw, AxiosResponse<IReportDiscountRaw>>(
		`${report.env?.API_URL}/pos/reports/report_z/discounts/${report.env?.API_CENTRAL_ENTITY}?fiscal_date=${fiscalDate}`,
		{ headers }
	)
	.then((response) => {
		return response.data.discounts || []
	})
}

export const fetchReportPayments = (fiscalDate: string) => (
  dispatch: Dispatch,
  getState: () => IRootState
): Promise<IReportPayment[]> => {
  const { report, api } = getState()

  const headers = {
    Authorization: `Bearer ${api.token}`,
  }

	if (process.env.DEV && process.env.DEV === 'REPORT_D') {
		return Promise.resolve(fakePayment.payments)
	}

	return axios
	.get<IReportPaymentRaw, AxiosResponse<IReportPaymentRaw>>(
		`${report.env?.API_URL}/pos/reports/report_z/payments/${report.env?.API_CENTRAL_ENTITY}?fiscal_date=${fiscalDate}`,
		{ headers }
	)
	.then((response) => {
		return response.data.payments || []
	})
}

export const fetchReportUsers = (fiscalDate: string) => (
  dispatch: Dispatch,
  getState: () => IRootState
	): Promise<IUserReport[]> => {
	const { report, api } = getState()

  const headers = {
    Authorization: `Bearer ${api.token}`,
  }

	if (process.env.DEV && process.env.DEV === 'REPORT_D') {
		return Promise.resolve(fakeTeamReport.users)
	}

	return axios
	.get<IReportTeam, AxiosResponse<IReportTeam>>(
		`${report.env?.API_URL}/pos/reports/report_z/users/${report.env?.API_CENTRAL_ENTITY}?fiscal_date=${fiscalDate}`,
		{ headers }
	)
	.then((response) => {
		return response.data.users || []
	})
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const fetchGlobalCA = (fiscalDate: string) => (
  dispatch: Dispatch,
  getState: () => IRootState
) => {
  const { report, api } = getState()

  const headers = {
    Authorization: `Bearer ${api.token}`,
  }

	if (process.env.DEV && process.env.DEV === 'REPORT_D') {
		return Promise.resolve(fakeCA)
	}

	return axios
	.get(
		`${report.env?.API_URL}/pos/reports/report_z/vat_rates/${report.env?.API_CENTRAL_ENTITY}?fiscal_date=${fiscalDate}`,
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
		return Promise.resolve(fakeReports)
	}

  const headers = {
    Authorization: `Bearer ${api.token}`,
  }

  setReports([])
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

export function setToken(token: String): IAppAction<TAppActionTypeKeys> {
  return {
    type: TAppActionTypeKeys.SET_API_TOKEN,
    payload: token,
  }
}

export function setReportEnvInfo(
  envInfo: IEnvInfo
): IAppAction<TAppActionTypeKeys> {
  return {
    type: TAppActionTypeKeys.SET_REPORT_ENV,
    payload: envInfo,
  }
}

export function setReportDates(
  startDate: string,
  endDate: string
): IAppAction<TAppActionTypeKeys> {
  return {
    type: TAppActionTypeKeys.SET_REPORT_DATES,
    payload: {
      start: startDate,
      end: endDate,
    },
  }
}

export function resetReport(): IAppAction<TAppActionTypeKeys> {
  return {
    type: TAppActionTypeKeys.RESET_REPORTS,
  }
}

export function setReports(report: IReportZ[]): IAppAction<TAppActionTypeKeys> {
  return {
    type: TAppActionTypeKeys.SET_REPORTS,
    payload: report,
  }
}

export function setReportX(report: IReportX): IAppAction<TAppActionTypeKeys> {
  return {
    type: TAppActionTypeKeys.SET_REPORT_X,
    payload: report,
  }
}

export function setReportZ(report: IReportZ): IAppAction<TAppActionTypeKeys> {
  return {
    type: TAppActionTypeKeys.SET_REPORT_Z,
    payload: report,
  }
}
