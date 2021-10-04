import numeral from 'numeral'
import { DateTime } from 'luxon'
import { IReportCA, IReportCARaw, IReportRate, IReportStat, IReportZ } from '../interface'
import { DATE_HUGE } from 'luxon/src/impl/formats'

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const formatNumber = (value: number) => {

	let format = '0,0[.]00'

	if (value >= 100000) {
		format = '0.00 a'
	}
	return (numeral(value).format(format)).toUpperCase()
}

export const formatDate = (value : string | null) : string => {
	return value ? DateTime.fromISO(value).toFormat('dd/MM/yyyy') : 'unknown'
}

export const formatDate2 = (value: string | null) : string => {
	return value ? DateTime.fromISO(value).setLocale('fr').toLocaleString(DATE_HUGE) : 'unknown'
}

export const convertReportCA = (value: IReportCARaw): IReportCA[] => {

	const result: IReportCA = {
		type: 'GLOBAL',
		fiscal_date: value.fiscal_date,
		start_date: value.start_date,
		end_date: value.end_date,
		gross: {
			rates: [],
			total_ht: 0,
			total_ttc: 0,
			total_vat: 0
		},
		net: {
			rates: [],
			total_ht: 0,
			total_ttc: 0,
			total_vat: 0
		}
	}

	const result2: IReportCA = {
		type: 'ONSITE',
		fiscal_date: value.fiscal_date,
		start_date: value.start_date,
		end_date: value.end_date,
		gross: {
			rates: [],
			total_ht: 0,
			total_ttc: 0,
			total_vat: 0
		},
		net: {
			rates: [],
			total_ht: 0,
			total_ttc: 0,
			total_vat: 0
		}
	}

	const result3: IReportCA = {
		type: 'TAKEAWAY',
		fiscal_date: value.fiscal_date,
		start_date: value.start_date,
		end_date: value.end_date,
		gross: {
			rates: [],
			total_ht: 0,
			total_ttc: 0,
			total_vat: 0
		},
		net: {
			rates: [],
			total_ht: 0,
			total_ttc: 0,
			total_vat: 0
		}
	}

  const rates: number[] = []
	const ratesGross: {[key: number]: IReportRate} = {}
	const ratesNet: {[key: number]: IReportRate} = {}

	const tmpRate = [ratesGross, ratesNet]

	for (let i = 0; i < value.rates.length; i++) {
		const rate = value.rates[i]
		const indice = rate.type_label === 'gross' ? 0 : 1
		const tmpResult = rate.destination_label === 'ONSITE' ? result2 : result3

		if (!rates.includes(rate.rate_vat)) {
			rates.push(rate.rate_vat)
		}

		tmpResult[rate.type_label].total_ht += rate.total_ht
		tmpResult[rate.type_label].total_ttc += rate.total_ttc
		tmpResult[rate.type_label].total_vat += rate.total_vat
		tmpResult[rate.type_label].rates.push(rate)

		if (!tmpRate[indice][rate.rate_vat]) {
			tmpRate[indice][rate.rate_vat] = rate
		} else {
			tmpRate[indice][rate.rate_vat].total_ht += rate.total_ht
			tmpRate[indice][rate.rate_vat].total_ttc += rate.total_ttc
			tmpRate[indice][rate.rate_vat].total_vat += rate.total_vat
		}
	}

	rates.sort((a, b) => {
		return a - b
	})


	const sortFn = ((a: IReportRate, b: IReportRate) => {
		return a.rate_vat - b.rate_vat
	})

	result2.gross.rates.sort(sortFn)
	result2.net.rates.sort(sortFn)
	result3.gross.rates.sort(sortFn)
	result3.net.rates.sort(sortFn)

	for (let i = 0; i < rates.length; i++) {
		const rateValue = rates[i]
		if (ratesGross[rateValue]) {
			result.gross.rates.push(ratesGross[rateValue])

			result.gross.total_ht += ratesGross[rateValue].total_ht
			result.gross.total_ttc += ratesGross[rateValue].total_ttc
			result.gross.total_vat += ratesGross[rateValue].total_vat
		}

		if (ratesNet[rateValue]) {

			result.net.rates.push(ratesNet[rateValue])
			result.net.total_ht += ratesNet[rateValue].total_ht
			result.net.total_ttc += ratesNet[rateValue].total_ttc
			result.net.total_vat += ratesNet[rateValue].total_vat
		}
	}

	return [result, result2, result3]
}

export const convertReportStat = (data: IReportZ): IReportStat[] => {
	const result: IReportStat[] = [
		{
			'uuid': '1',
			default_label: 'Nombre de ventes Net',
			'quantity': data.nb_net,
			'quantity_percent': data.nb_net ? data.nb_net / (data.nb_net + data.nb_sales_canceled + data.nb_sales_partially_cancelled) * 100 : 0,
			'amount': null,
			'amount_percent': null
		},
		{
			'uuid': '2',
			default_label: 'Nombre de ventes annulés',
			'quantity': data.nb_sales_canceled,
			'quantity_percent': data.nb_sales_canceled ? data.nb_sales_canceled / (data.nb_net + data.nb_sales_canceled + data.nb_sales_partially_cancelled) * 100 : data.nb_sales_canceled,
			'amount': null,
			'amount_percent': null
		},
		{
			'uuid': '3',
			default_label: 'Nombre de ventes annulés partiellement',
			'quantity': data.nb_sales_partially_cancelled,
			'quantity_percent': data.nb_sales_partially_cancelled ? data.nb_sales_partially_cancelled / (data.nb_net + data.nb_sales_canceled + data.nb_sales_partially_cancelled) * 100 : data.nb_sales_partially_cancelled,
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
}

