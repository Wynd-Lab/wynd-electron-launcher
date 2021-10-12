
import React from 'react'

import Section from './Section'

import { IReportDiscount, TFetch} from '../../../interface'
import { formatNumber } from '../../../helpers/format'


export interface IDiscountDetailsReportComponentProps {
	fetch: TFetch<IReportDiscount>
}

const DiscountDetailsReport: React.FunctionComponent<IDiscountDetailsReportComponentProps> = (props) => {

	const columns = [
		{
      title: 'Remises',
      dataIndex: 'label',
      key: 'label',
			width: '60%',
      render: (text: any, record: IReportDiscount, index: number) => {
        return (
          <div id={`report-details-discounts-${index}`} key={`report-details-discounts-${index}`}>
						{record.label}
          </div>
        )
      },
    },
		{
      title: 'Quantité',
      dataIndex: 'quantity',
      key: 'quantity',
			width: '12%',
      render: (text: any, record: IReportDiscount, index: number) => {
        return (
          <div id={`report-details-discounts-quantity-${index}`} key={`report-details-discounts-quantity-${index}`}>
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
      render: (text: any, record: IReportDiscount, index: number) => {
        return (
          <div id={`report-details-discounts-quantity-percent-${index}`} key={`report-details-discounts-quantity-percent-${index}`}>
						{formatNumber(record.quantity_percent)}
          </div>
        )
      },
    },
		{
      title: '€',
      dataIndex: 'price',
      key: 'price',
			width: '12%',
      render: (text: any, record: IReportDiscount, index: number) => {
        return (
					<div id={`report-details-discounts-price-${index}`} key={`report-details-discounts-price-${index}`}>
						{formatNumber(record.amount)}
					</div>
        )
      },
    },
		{
      title: '€ (%)',
      dataIndex: 'price_percent',
      key: 'price_percent',
			width: '12%',
      render: (text: any, record: IReportDiscount, index: number) => {
        return (
					<div id={`report-details-discounts-price-percent-${index}`} key={`report-details-discounts-price-percent-${index}`}>
						{formatNumber(record.amount_percent)}
					</div>
        )
      },
    },
	]

	return (
		<Section<IReportDiscount>
			name="Remises"
			columns={columns}
			fetch={props.fetch}
			fetchOnUserChange={true}
		/>
	)
}


export default DiscountDetailsReport
