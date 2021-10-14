import { IReport, IReportCA, IReportPayment, IReportProduct, IReportStat, IReportZ, IUserReport, TReportType } from '../interface'
import { formatDate, formatDate3, formatNumber } from './format'

export const generateDates = () => {

	const date = new Date()
	const day = String(date.getDate()).padStart(2, '0')
	const month = String(date.getUTCMonth() + 1).padStart(2, '0') //months from 1-12
	const year = date.getUTCFullYear()

	const startDate = `${year}-${month}-01`
	const endDate = `${year}-${month}-${day}`

	return [startDate, endDate]
}


interface IGenerateParams {
	type: TReportType
	date: string
	max_line_size: number
	serial: string
	entity: string
}
export const generateXML = (data0: IReportZ, data1: IReportCA[], data2: IUserReport[], data3: IReportPayment[], data4: IReportStat[], data5: IReportProduct[], params: IGenerateParams) => {

	const maxLineSize = params.max_line_size

	const columnDataSize = 10
	const xml = []
	const dotLine = '<dotline/>'
	xml.push('<?xml version="1.0" encoding="utf-8"?><ticket>')
	const header = `<block>
	<line align="center">${data0.entity.name}</line>
	<line align="center">${data0.entity.address}></line>
	<line align="center">${data0.entity.zipcode}, ${data0.entity.town}</line>
	<line align="center">${data0.entity.phone}</line>
	<line align="center">${data0.entity.code_siret}</line>
	<line align="center">${data0.entity.vat_number}</line>
	<line align="center">${params.type === 'report_x' ? 'Rapport X' : 'Rapport Z'}</line>
	<line align="center">${formatDate(params.date)}</line>
</block>`

	let globalCA = `<block>
		<line>
			<text bold="true" align="center">Chiffre d'affaire (Global)</text>
		</line>
		<line bold="true">
			<space size="${maxLineSize - 3 * columnDataSize}"></space>
			<text size="${columnDataSize}">HT (€)</text>
			<text size="${columnDataSize}">TVA (€)</text>
			<text size="${columnDataSize}">TTC (€)</text>
		</line>
		<line>
			<text size="${maxLineSize - 3 * columnDataSize}">CA brut</text>
			<text align="right" size="${columnDataSize}">${formatNumber(data1[0].gross.total_ht)}</text>
			<text align="right" size="${columnDataSize}">${formatNumber(data1[0].gross.total_vat)}</text>
			<text align="right" size="${columnDataSize}">${formatNumber(data1[0].gross.total_ttc)}</text>
		</line>`

	for (let i = 0; i < data1[0].gross.rates.length; i++) {
		const rate = data1[0].gross.rates[i]
		globalCA += `<line>
			<text size="${maxLineSize - 3 * columnDataSize}">${rate.rate_vat}</text>
			<text align="right" size="${columnDataSize}">${formatNumber(rate.total_ht)}</text>
			<text align="right" size="${columnDataSize}">${formatNumber(rate.total_vat)}</text>
			<text align="right" size="${columnDataSize}">${formatNumber(rate.total_ttc)}</text>
		</line>`
	}
	globalCA+= '<line></line>'
	globalCA += `<line>
		<text size="${maxLineSize - 3 * columnDataSize}">CA net</text>
		<text align="right" size="${columnDataSize}">${formatNumber(data1[0].gross.total_ht)}</text>
		<text align="right" size="${columnDataSize}">${formatNumber(data1[0].gross.total_vat)}</text>
		<text align="right" size="${columnDataSize}">${formatNumber(data1[0].gross.total_ttc)}</text>
	</line>`

	for (let i = 0; i < data1[0].net.rates.length; i++) {
		const rate = data1[0].net.rates[i]
		globalCA += `<line>
			<text size="${maxLineSize - 3 * columnDataSize}">${rate.rate_vat}</text>
			<text align="right" size="${columnDataSize}">${formatNumber(rate.total_ht)}</text>
			<text align="right" size="${columnDataSize}">${formatNumber(rate.total_vat)}</text>
			<text align="right" size="${columnDataSize}">${formatNumber(rate.total_ttc)}</text>
		</line>`
	}
	globalCA += '</block>'

	let teams = `<block>
	<line bold="true" align="center">Equipier</line>
	<line bold="true">
		<space size="${maxLineSize - 4 * columnDataSize}"></space>
		<text size="${columnDataSize}">Quantité</text>
		<text size="${columnDataSize}">Quantité (%)</text>
		<text size="${columnDataSize}">€</text>
		<text size="${columnDataSize}">€ (%)</text>
	</line>
	<line>`
	for (let i = 0; i < data2.length; i++) {
		const user = data2[i]
		teams += `<line>
			<text size="${maxLineSize - 4 * columnDataSize}">${user.user.firstname} ${user.user.lastname}</text>
			<text align="right" size="${columnDataSize}">${formatNumber(user.sales)}</text>
			<text align="right" size="${columnDataSize}">${formatNumber(user.sales_percent)}</text>
			<text align="right" size="${columnDataSize}">${formatNumber(user.amount)}</text>
			<text align="right" size="${columnDataSize}">${formatNumber(user.amount_percent)}</text>
		</line>`
	}
	teams += '</block>'

	let payments = `<block>
	<line bold="true" align="center">Mode de paiement</line>
	<line bold="true">
		<space size="${maxLineSize - 4 * columnDataSize}"></space>
		<text size="${columnDataSize}">Quantité</text>
		<text size="${columnDataSize}">Quantité (%)</text>
		<text size="${columnDataSize}">€</text>
		<text size="${columnDataSize}">€ (%)</text>
	</line>
	<line>`
	for (let i = 0; i < data3.length; i++) {
		const payment = data3[i]
		payments += `<line>
			<text size="${maxLineSize - 4 * columnDataSize}">${payment.default_label}</text>
			<text align="right" size="${columnDataSize}">${formatNumber(payment.quantity)}</text>
			<text align="right" size="${columnDataSize}">${formatNumber(payment.quantity_percent)}</text>
			<text align="right" size="${columnDataSize}">${formatNumber(payment.amount)}</text>
			<text align="right" size="${columnDataSize}">${formatNumber(payment.amount_percent)}</text>
		</line>`
	}
	payments += '</block>'

	let statReport = `<block>
	<line bold="true" align="center">Statistiques</line>
	<line>
		<space size="${maxLineSize - 4 * columnDataSize}"></space>
		<text size="${columnDataSize}">Quantité</text>
		<text size="${columnDataSize}">Quantité (%)</text>
		<text size="${columnDataSize}">€</text>
		<text size="${columnDataSize}">€ (%)</text>
	</line>
	<line>`
	for (let i = 0; i < data4.length; i++) {
		const stat = data4[i]
		statReport += `<line>
			<text size="${maxLineSize - 4 * columnDataSize}">${stat.default_label}</text>
			<text align="right" size="${columnDataSize}">${formatNumber(stat.quantity)}</text>
			<text align="right" size="${columnDataSize}">${formatNumber(stat.quantity_percent)}</text>
			<text align="right" size="${columnDataSize}">${formatNumber(stat.amount)}</text>
			<text align="right" size="${columnDataSize}">${formatNumber(stat.amount_percent)}</text>
		</line>`
	}
	statReport += '</block>'


	let products = `<block>
	<line bold="true" align="center">Produits</line>
	<line>
		<space size="${maxLineSize - 4 * columnDataSize}"></space>
		<text size="${columnDataSize}">Quantité</text>
		<text size="${columnDataSize}">Quantité (%)</text>
		<text size="${columnDataSize}">€</text>
		<text size="${columnDataSize}">€ (%)</text>
	</line>
	<line>`
	for (let i = 0; i < data5.length; i++) {
		const product = data5[i]
		products += `<line>
			<text size="${maxLineSize - 4 * columnDataSize}">${product.product_label}</text>
			<text align="right" size="${columnDataSize}">${formatNumber(product.quantity)}</text>
			<text align="right" size="${columnDataSize}">${formatNumber(product.quantity_percent)}</text>
			<text align="right" size="${columnDataSize}">${formatNumber(product.amount)}</text>
			<text align="right" size="${columnDataSize}">${formatNumber(product.amount_percent)}</text>
		</line>`
	}
	products += '</block>'

	const footer = `<block>
	<line align="center">Caisse n°${params.entity}</line>
	<line align="center">Serial ${params.serial}</line>
	<line align="center">${formatDate3(null)}</line>
'</block>`
	xml.push(header)
	xml.push(dotLine)
	xml.push(globalCA)
	xml.push(dotLine)
	xml.push(teams)
	xml.push(dotLine)
	xml.push(payments)
	xml.push(dotLine)
	xml.push(statReport)
	xml.push(dotLine)
	xml.push(products)
	xml.push(dotLine)
	xml.push(footer)
	xml.push('</ticket>')

	return xml.join('')

}


