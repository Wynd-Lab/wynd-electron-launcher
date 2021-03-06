
import React from 'react'

import Section from './Section'

import { IUserReport, TFetch} from '../../../interface'
import { formatNumber } from '../../../helpers/format'


export interface ITeamsDetailsReportComponentProps {
	fetch: TFetch<IUserReport>
}

const TeamsDetailsReport: React.FunctionComponent<ITeamsDetailsReportComponentProps> = (props) => {

	const columns = [
		{
      title: 'Equipier',
      dataIndex: 'user',
      key: 'user',
			width: '52%',
      render: (text: any, record: IUserReport, index: number) => {
        return (
          <div id={`report-details-teams-${index}`} key={`report-details-teams-${index}`}>
						{record.user.firstname} {record.user.lastname}
          </div>
        )
      },
    },
		{
      title: 'Quantité',
      dataIndex: 'quantity',
      key: 'quantity',
			width: '12%',
      render: (text: any, record: IUserReport, index: number) => {
        return (
          <div id={`report-details-teams-quantity-${index}`} key={`report-details-teams-quantity-${index}`}>
						{formatNumber(record.sales)}
          </div>
        )
      },
    },
		{
      title: 'Quantité (%)',
      dataIndex: 'quantity_percent',
      key: 'quantity_percent',
			width: '12%',
      render: (text: any, record: IUserReport, index: number) => {
        return (
          <div id={`report-details-teams-quantity-percent-${index}`} key={`report-details-teams-quantity-percent-${index}`}>
						{formatNumber(record.sales_percent)}
          </div>
        )
      },
    },
		{
      title: '€',
      dataIndex: 'price',
      key: 'price',
			width: '12%',
      render: (text: any, record: IUserReport, index: number) => {
        return (
					<div id={`report-details-teams-price-${index}`} key={`report-details-teams-price-${index}`}>
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
      render: (text: any, record: IUserReport, index: number) => {
        return (
					<div id={`report-details-teams-price-percent-${index}`} key={`report-details-teams-price-percent-${index}`}>
						{formatNumber(record.amount_percent)}
					</div>
        )
      },
    },
	]

	return (
		<Section<IUserReport>
			name="teams"
			columns={columns}
			fetch={props.fetch}
			fetchOnUserChange={false}
		/>
	)
}


export default TeamsDetailsReport
