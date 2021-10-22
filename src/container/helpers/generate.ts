import { IReportCA, IReportPayment, IReportProductByDivision, IReportStat, IReportZ, IUserReport, TReportType } from '../interface'
import { formatDate, formatDate3, formatNumber } from './format'

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
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
export const generateXML = (data0: IReportZ, data1: IReportCA[], data2: IUserReport[], data3: IReportPayment[], data4: IReportStat[], data5: IReportProductByDivision[], params: IGenerateParams): string => {

	const maxLineSize = params.max_line_size
	const columnDataSize12 = 12
	const columnDataSize10 = 10
	const columnDataSize9= 9
	const columnDataSize8 = 8
	const columnDataSize7 = 7
	const columnDataSize6 = 6
	const columnDataSize5= 5
	const xml = []
	const dotLine = '<dotline/>'

	const firstColumnSize = maxLineSize - (columnDataSize6 + columnDataSize7 + columnDataSize8 + columnDataSize7)

	const headerColumn = `	<line bold="true">
	<space size="${firstColumnSize}"></space>
	<text align="right" size="${columnDataSize6}">Qte</text>
	<text align="right" size="${columnDataSize7}">Qte(%)</text>
	<text align="right" size="${columnDataSize8}">Montant</text>
	<text align="right" size="${columnDataSize7}">Mnt(%)</text>
</line>`

	const row = (label: string, data1: number, data2: number, data3: number, data4: number) => {
		return `<line>
		<text size="${firstColumnSize}">${label}</text>
		<text align="right" size="${columnDataSize6}">${formatNumber(data1)}</text>
		<text align="right" size="${columnDataSize7}">${formatNumber(data2)}</text>
		<text align="right" size="${columnDataSize8}">${formatNumber(data3)}</text>
		<text align="right" size="${columnDataSize7}">${formatNumber(data4)}</text>
	</line>`
	}

	xml.push('<?xml version="1.0" encoding="utf-8"?><ticket>')
	let header = `<block>
	<line align="center">${data0.entity.name}</line>
	<line align="center">${data0.entity.address}</line>
	<line align="center">${data0.entity.zipcode}, ${data0.entity.town}</line>`
	header += data0.entity.phone ?  `<line align="center">${data0.entity.phone}</line>` : ''
	header += data0.entity.code_siret ?  `<line align="center">${data0.entity.code_siret}</line>` : ''
	header += data0.entity.vat_number ?  `<line align="center">${data0.entity.vat_number}</line>` : ''
	header +=`<line bold="true" align="center">${params.type === 'report_x' ? 'Rapport X' : 'Rapport Z'}</line>
	<line bold="true" align="center">${formatDate(params.date)}</line>
</block>`

	let globalCA = `<block>
		<line bold="true" align="center">Chiffre d'affaire (Global)</line>
		<line><space size="${maxLineSize}"></space></line>
		<line bold="true">
			<space size="${maxLineSize - 3 * columnDataSize10}"></space>
			<text align="right" size="${columnDataSize10}">HT</text>
			<text align="right" size="${columnDataSize10}">TVA</text>
			<text align="right" size="${columnDataSize10}">TTC</text>
		</line>
		<line bold="true">
			<text size="${maxLineSize - 3 * columnDataSize10}">CA brut</text>
			<text align="right" size="${columnDataSize10}">${formatNumber(data1[0].gross.total_ht)}</text>
			<text align="right" size="${columnDataSize10}">${formatNumber(data1[0].gross.total_vat)}</text>
			<text align="right" size="${columnDataSize10}">${formatNumber(data1[0].gross.total_ttc)}</text>
		</line>`

	for (let i = 0; i < data1[0].gross.rates.length; i++) {
		const rate = data1[0].gross.rates[i]
		globalCA += `<line>
			<text size="${maxLineSize - 3 * columnDataSize10}">${rate.rate_vat}</text>
			<text align="right" size="${columnDataSize10}">${formatNumber(rate.total_ht)}</text>
			<text align="right" size="${columnDataSize10}">${formatNumber(rate.total_vat)}</text>
			<text align="right" size="${columnDataSize10}">${formatNumber(rate.total_ttc)}</text>
		</line>`
	}
	globalCA+= '<line></line>'
	globalCA += `<line bold="true">
		<text size="${maxLineSize - 3 * columnDataSize10}">CA net</text>
		<text align="right" size="${columnDataSize10}">${formatNumber(data1[0].net.total_ht)}</text>
		<text align="right" size="${columnDataSize10}">${formatNumber(data1[0].net.total_vat)}</text>
		<text align="right" size="${columnDataSize10}">${formatNumber(data1[0].net.total_ttc)}</text>
	</line>`

	for (let i = 0; i < data1[0].net.rates.length; i++) {
		const rate = data1[0].net.rates[i]
		globalCA += `<line>
			<text size="${maxLineSize - 3 * columnDataSize10}">${rate.rate_vat}</text>
			<text align="right" size="${columnDataSize10}">${formatNumber(rate.total_ht)}</text>
			<text align="right" size="${columnDataSize10}">${formatNumber(rate.total_vat)}</text>
			<text align="right" size="${columnDataSize10}">${formatNumber(rate.total_ttc)}</text>
		</line>`
	}
	globalCA += '</block>'


	let teams = `<block>
	<line bold="true" align="center">Equipier</line>
	<line><space size="${maxLineSize}"></space></line>
	${headerColumn}`

	for (let i = 0; i < data2.length; i++) {
		const user = data2[i]
		teams += row(`${user.user.firstname} ${user.user.lastname}`, user.sales, user.sales_percent, user.amount, user.amount_percent)
	}

	teams += '</block>'

	let payments = `<block>
	<line bold="true" align="center">Mode de paiement</line>
	<line><space size="${maxLineSize}"></space></line>
	${headerColumn}`

	for (let i = 0; i < data3.length; i++) {
		const payment = data3[i]
		payments += row(payment.default_label, payment.quantity, payment.quantity_percent, payment.amount, payment.amount_percent)
	}
	payments += '</block>'

	let statReport = `<block>
	<line bold="true" align="center">Statistiques</line>
	<line><space size="${maxLineSize}"></space></line>
	${headerColumn}`

	for (let i = 0; i < data4.length; i++) {
		let prefixStat = 'Nombres de ventes'
		const stat = data4[i]

		if (i ==2) {
			statReport +=`<line><text size="${maxLineSize}">${prefixStat}</text></line>`
			statReport +=`<line><text size="${maxLineSize}">annulés</text></line>`
			prefixStat += ' annulés'
			statReport +=`<line><text size="${firstColumnSize}">${stat.default_label.substr(prefixStat.length, stat.default_label.length + 1)}</text>`
		} else if (i !== 3) {
			statReport +=`<line><text size="${maxLineSize}">${prefixStat}</text></line>`
			statReport +=`<line><text size="${firstColumnSize}">${stat.default_label.substr(prefixStat.length, stat.default_label.length + 1)}</text>`
		} else {
			statReport +=`<line><text size="${firstColumnSize}">${stat.default_label}</text>`
		}
		statReport += stat.quantity === null ? `<space size="${columnDataSize5}"></space>` : `<text align="right" size="${columnDataSize5}">${formatNumber(stat.quantity)}</text>`
		statReport += stat.quantity_percent === null ? `<space size="${columnDataSize7}"></space>` : `<text align="right" size="${columnDataSize7}">${formatNumber(stat.quantity_percent)}</text>`
		statReport += stat.amount === null ? `<space size="${columnDataSize8}"></space>` : `<text align="right" size="${columnDataSize8}">${formatNumber(stat.amount)}</text>`
		statReport += stat.amount_percent === null ? `<space size="${columnDataSize7}"></space>` : `<text align="right" size="${columnDataSize7}">${formatNumber(stat.amount_percent)}</text>`
		statReport += '</line>'
	}

	statReport += '</block>'


	let products = `<block>
	<line bold="true" align="center">Produits</line>
	<line><space size="${maxLineSize}"></space></line>
	${headerColumn}`

	for (let i = 0; i < data5.length; i++) {
		const product = data5[i]
		products += row(product.label, product.quantity, product.quantity_percent, product.amount, product.amount_percent)
		// `<line bold="true">
		// 	<text size="${maxLineSize - (columnDataSize4 + columnDataSize + columnDataSize4 + columnDataSize5)}">${product.label}</text>
		// 	<text align="right" size="${columnDataSize4}">${formatNumber(product.quantity)}</text>
		// 	<text align="right" size="${columnDataSize}">${formatNumber(product.quantity_percent)}</text>
		// 	<text align="right" size="${columnDataSize4}">${formatNumber(product.amount)}</text>
		// 	<text align="right" size="${columnDataSize5}">${formatNumber(product.amount_percent)}</text>
		// </line>`
		for (let j = 0; j < product.products.length; j++) {
			const innerProduct = product.products[j]
			products += row(innerProduct.product_label, innerProduct.quantity, innerProduct.quantity_percent, innerProduct.amount, innerProduct.amount_percent)
			// `<line>
			// 	<text size="${maxLineSize - (columnDataSize4 + columnDataSize + columnDataSize4 + columnDataSize5)}">${innerProduct.product_label}</text>
			// 	<text align="right" size="${columnDataSize4}">${formatNumber(innerProduct.quantity)}</text>
			// 	<text align="right" size="${columnDataSize}">${formatNumber(innerProduct.quantity_percent)}</text>
			// 	<text align="right" size="${columnDataSize4}">${formatNumber(innerProduct.amount)}</text>
			// 	<text align="right" size="${columnDataSize5}">${formatNumber(innerProduct.amount_percent)}</text>
			// </line>`
		}
	}
	products += '</block>'

	let footer = '<block>'
	footer += params.entity ? 	`<line align="center">Caisse n°${params.entity}</line>` : ''
	footer += `<line align="center">Serial ${params.serial}</line>
	<line align="center">${formatDate3(null)}</line>
	<line><space size="${maxLineSize}"></space></line>
	<line><space size="${maxLineSize}"></space></line>
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


