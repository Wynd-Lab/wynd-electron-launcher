import numeral from 'numeral'
import { DateTime } from 'luxon'
import { IReportCA, IReportCARaw, IReportRate } from '../interface'

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const formatNumber = (value: number) => {

	let format = '0,0[.]00'

	if (value >= 100000) {
		format = '0.00 a'
	}
	return (numeral(value).format(format)).toUpperCase()
}


// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const formatDate = (value : string | null) => {
	return value ? DateTime.fromISO(value).toFormat('dd/MM/yyyy') : 'unknown'
}


// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const convertReportCA = (value: IReportCARaw) => {

	const result: IReportCA = {
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

		if (!rates.includes(rate.rate_vat)) {
			rates.push(rate.rate_vat)
		}
		if (!tmpRate[indice][rate.rate_vat]) {
			tmpRate[indice][rate.rate_vat] = rate
		} else {
			tmpRate[indice][rate.rate_vat].total_ht += rate.total_ht
			tmpRate[indice][rate.rate_vat].total_ttc += rate.total_ttc
			tmpRate[indice][rate.rate_vat].total_vat += rate.total_vat
			tmpRate[indice][rate.rate_vat].total_vat += rate.total_vat
		}
	}


	rates.sort((a, b) => {
		return a - b
	})

	for (let i = 0; i < rates.length; i++) {
		const rateValue = rates[i]
		if (ratesGross[rateValue]) {
			result.gross.rates.push(ratesGross[rateValue])

			result.gross.total_ht += ratesGross[rateValue].total_ht
			result.gross.total_ttc += ratesGross[rateValue].total_ttc
			result.gross.total_vat += ratesGross[rateValue].total_vat
		}

		if (ratesNet[rateValue]) {

			result.net.rates.push(ratesGross[rateValue])
			result.net.total_ht += ratesGross[rateValue].total_ht
			result.net.total_ttc += ratesGross[rateValue].total_ttc
			result.net.total_vat += ratesGross[rateValue].total_vat
		}
	}

	return [result]
}
