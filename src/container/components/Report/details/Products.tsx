
import React from 'react'

import Section from './Section'

import { fetchReportProducts } from '../../../store/actions/report'
import { IReportProduct } from '../../../interface'
import { formatNumber } from '../../../helpers/format'


export interface IProductDetailsReportComponentProps {
	fiscal_date: string
}

const ProductDetailsReport: React.FunctionComponent<IProductDetailsReportComponentProps> = (props) => {

	const columns = [
		{
      title: 'Produits',
      dataIndex: 'label',
      key: 'label',
			width: '60%',
      render: (text: any, record: IReportProduct, index: number) => {
        return (
          <div id={`report-details-discounts-${index}`} key={`report-details-discounts-${index}`}>
						{record.product?.default_label || record.product_label}
          </div>
        )
      },
    },
		{
      title: 'Quantité',
      dataIndex: 'quantity',
      key: 'quantity',
			width: '12%',
      render: (text: any, record: IReportProduct, index: number) => {
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
      render: (text: any, record: IReportProduct, index: number) => {
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
      render: (text: any, record: IReportProduct, index: number) => {
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
      render: (text: any, record: IReportProduct, index: number) => {
        return (
					<div id={`report-details-discounts-price-percent-${index}`} key={`report-details-discounts-price-percent-${index}`}>
						{formatNumber(record.amount_percent)}
					</div>
        )
      },
    },
	]

	return (
		<Section<IReportProduct>
			name="products"
			columns={columns}
			fetch={fetchReportProducts}
			fiscal_date={props.fiscal_date}
		/>
	)
}


export default ProductDetailsReport
