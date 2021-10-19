
import React from 'react'

import Section from './Section'

import { IReportProduct, IReportProductByDivision, TFetch } from '../../../interface'
import { formatNumber } from '../../../helpers/format'
import { ExpandableConfig } from 'rc-table/lib/interface'
import { Table } from 'antd'


export interface IProductDetailsReportComponentProps {
	fetch: TFetch<IReportProductByDivision>
}

const ProductDetailsReport: React.FunctionComponent<IProductDetailsReportComponentProps> = (props) => {

	const columns = [
		{
      title: 'Produits',
      dataIndex: 'label',
      key: 'label',
			width: '52%%',
      render: (text: any, record: IReportProductByDivision, index: number) => {
        return (
          <div id={`report-details-product-label-${index}`} key={`report-details-product-label-${index}`}>
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
      render: (text: any, record: IReportProductByDivision, index: number) => {
        return (
          <div id={`report-details-product-quantity-${index}`} key={`report-details-product-quantity-${index}`}>
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
      render: (text: any, record: IReportProductByDivision, index: number) => {
        return (
          <div id={`report-details-product-quantity-percent-${index}`} key={`report-details-product-quantity-percent-${index}`}>
						{formatNumber(record.quantity_percent)}
          </div>
        )
      },
    },
		{
      title: '€',
      dataIndex: 'amount',
      key: 'amount',
			width: '12%',
      render: (text: any, record: IReportProductByDivision, index: number) => {
        return (
					<div id={`report-details-product-amount-${index}`} key={`report-details-product-amount-${index}`}>
						{formatNumber(record.amount)}
					</div>
        )
      },
    },
		{
      title: '€ (%)',
      dataIndex: 'amount_percent',
      key: 'amount_percent',
			width: '12%',
      render: (text: any, record: IReportProductByDivision, index: number) => {
        return (
					<div id={`report-details-product-price-percent-${index}`} key={`report-details-product-price-percent-${index}`}>
						{formatNumber(record.amount_percent)}
					</div>
        )
      },
    },
	]

	const nestedColumns = [
		{
      title: 'Produits',
      dataIndex: 'label',
      key: 'label',
			width: '52%',
      render: (text: any, record: IReportProduct, index: number) => {
        return (
          <div id={`report-details-nested-product-label-${index}`} className="report-details-nested-product-label" key={`report-details-nested-product-label-${index}`}>
						{record.product_label}
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
          <div id={`report-details-nested-product-quantity-${index}`} className="report-details-nested-product-quantity" key={`report-details-nested-product-quantity-${index}`}>
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
          <div id={`report-details-nested-quantity-percent-${index}`} className="report-details-nested-product-quantity-percent" key={`report-details-nested-quantity-percent-${index}`}>
						{formatNumber(record.quantity_percent)}
          </div>
        )
      },
    },
		{
      title: '€',
      dataIndex: 'amount',
      key: 'amount',
			width: '12%',

      render: (text: any, record: IReportProduct, index: number) => {
        return (
					<div id={`report-details-nested-product-amount-${index}`} className="report-details-nested-product-amount" key={`report-details-nested-product-amount-${index}`}>
						{formatNumber(record.amount)}
					</div>
        )
      },
    },
		{
      title: '€ (%)',
      dataIndex: 'amount_percent',
      key: 'amount_percent',
			width: '12%',
      render: (text: any, record: IReportProduct, index: number) => {
        return (
					<div id={`report-details-nested-product-amount-percent-${index}`} key={`report-details-nested-product-amount-percent-${index}`}>
						{formatNumber(record.amount_percent)}
					</div>
        )
      },
    },
	]

	const getRowKey = (record: IReportProduct) => {
		return `nested-product-${record.uuid}`
	}


	const expandable: ExpandableConfig<IReportProductByDivision> = {
		expandedRowRender: (record: IReportProductByDivision) => {

			return <Table<IReportProduct>
				className="report-details-table report-details-table-nested-products"
				key={`product-label-${record.label}`}
				columns={nestedColumns}
				dataSource={record.products}
				pagination={false}
				size="middle"
				sticky={true}
				rowKey={getRowKey}
			/>
		},
		indentSize: 0,
		expandIconColumnIndex: 1
		// fixed: 'right'
	}

	return (
		<Section<IReportProductByDivision>
			name="products"
			columns={columns}
			fetch={props.fetch}
			fetchOnUserChange={true}
			expandable={expandable}
		/>
	)
}


export default ProductDetailsReport
