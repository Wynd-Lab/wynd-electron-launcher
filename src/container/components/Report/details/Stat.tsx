
import React from 'react'

import Section from './Section'

import { IReportStat, TFetch } from '../../../interface'
import { formatNumber } from '../../../helpers/format'


export interface IStatDetailsReportComponentProps {
	fetch: TFetch<IReportStat>

}

const StatDetailsReport: React.FunctionComponent<IStatDetailsReportComponentProps> = (props) => {

	const columns = [
		{
      title: 'Statistiques',
      dataIndex: 'default_label',
      key: 'default_label',
			width: '52%',
      render: (text: any, record: IReportStat, index: number) => {
        return (
          <div id={`report-details-stat-${index}`} key={`report-details-stat-${index}`}>
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
      render: (text: any, record: IReportStat, index: number) => {
        return (
          <div id={`report-details-stat-quantity-${index}`} key={`report-details-stat-quantity-${index}`}>
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
      render: (text: any, record: IReportStat, index: number) => {
        return (
          <div id={`report-details-stat-quantity-percent-${index}`} key={`report-details-stat-quantity-percent-${index}`}>
						{record.quantity_percent && formatNumber(record.quantity_percent)}
          </div>
        )
      },
    },
		{
      title: '€',
      dataIndex: 'price',
      key: 'price',
			width: '12%',
      render: (text: any, record: IReportStat, index: number) => {
        return (
					<div id={`report-details-stat-price-${index}`} key={`report-details-stat-price-${index}`}>
						{record.amount  && formatNumber(record.amount)}
					</div>
        )
      },
    },
		{
      title: '€ (%)',
      dataIndex: 'price_percent',
      key: 'price_percent',
			width: '12%',
      render: (text: any, record: IReportStat, index: number) => {
        return (
					<div id={`report-details-stat-price-percent-${index}`} key={`report-details-stat-price-percent-${index}`}>
						{record.amount_percent && formatNumber(record.amount_percent)}
					</div>
        )
      },
    },
	]

	return (
		<Section<IReportStat>
			name="statistic"
			columns={columns}
			fetch={props.fetch}
			fetchOnUserChange={true}
		/>
	)
}


export default StatDetailsReport
