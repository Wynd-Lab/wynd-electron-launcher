
import React from 'react'

import Section from './Section'

import { fetchReportPayments } from '../../../store/actions/report'
import { IReportPayment} from '../../../interface'


export interface IPaymentDetailsReportComponentProps {
	fiscal_date: string
}

const PaymentDetailsReport: React.FunctionComponent<IPaymentDetailsReportComponentProps> = (props) => {

	const columns = [
		{
      title: 'Mode de paiement',
      dataIndex: 'payment',
      key: 'default_label',
			width: '60%',
      render: (text: any, record: IReportPayment, index: number) => {
        return (
          <div id={`report-details-payments-${index}`} key={`report-details-payments-${index}`}>
						{record.default_label}
          </div>
        )
      },
    },
		{
      title: 'Quantité',
      dataIndex: 'quantity',
      key: 'quantity',
			width: '12%',
      render: (text: any, record: IReportPayment, index: number) => {
        return (
          <div id={`report-details-payments-quantity-${index}`} key={`report-details-payments-quantity-${index}`}>
						{record.quantity}
          </div>
        )
      },
    },
		{
      title: 'Quantité (%)',
      dataIndex: 'quantity_percent',
      key: 'quantity_percent',
			width: '12%',
      render: (text: any, record: IReportPayment, index: number) => {
        return (
          <div id={`report-details-payments-quantity-percent-${index}`} key={`report-details-payments-quantity-percent-${index}`}>
						{record.quantity_percent}
          </div>
        )
      },
    },
		{
      title: '€',
      dataIndex: 'price',
      key: 'price',
			width: '12%',
      render: (text: any, record: IReportPayment, index: number) => {
        return (
					<div id={`report-details-payments-price-${index}`} key={`report-details-payments-price-${index}`}>
						{record.amount}
					</div>
        )
      },
    },
		{
      title: '€ (%)',
      dataIndex: 'price_percent',
      key: 'price_percent',
			width: '12%',
      render: (text: any, record: IReportPayment, index: number) => {
        return (
					<div id={`report-details-payments-price-percent-${index}`} key={`report-details-payments-price-percent-${index}`}>
						{record.amount_percent}
					</div>
        )
      },
    },
	]

	return (
		<Section<IReportPayment>
			name="Mode de paiement"
			columns={columns}
			fetch={fetchReportPayments}
			fiscal_date={props.fiscal_date}
		/>
	)
}


export default PaymentDetailsReport
