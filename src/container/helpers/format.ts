import numeral from 'numeral'
import { DateTime } from "luxon";

export const formatNumber = (value: number) => {

	let format = '0,0[.]00'

	if (value >= 100000) {
		format = '0.00 a'
	}
	return (numeral(value).format(format)  + ' €').toUpperCase()
}


export const formatDate = (value : string | null) => {
	return value ? DateTime.fromISO(value).toFormat('dd/MM/yyyy') : "unknown"
}
