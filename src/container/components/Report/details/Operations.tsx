
import React from 'react'

import Section from './Section'

import { IReportProductByDivision, TFetch} from '../../../interface'

export interface ITeamsDetailsReportComponentProps {
	fetch: TFetch<IReportProductByDivision>
}

const TeamsDetailsReport: React.FunctionComponent<ITeamsDetailsReportComponentProps> = (props) => {

	const columns = [
		{
      title: 'Interventions',
      dataIndex: 'operations',
      key: 'operations',
			width: '60%',
      render: (text: any, record: IReportProductByDivision, index: number) => {
        return (
          <div id={`report-details-teams-${index}`} key={`report-details-teams-${index}`}>
						{/* {record.user.firstname} {record.user.lastname} */}
          </div>
        )
      },
    },
		{
      title: 'Quantité',
      dataIndex: 'quantity',
      key: 'quantity',
			width: '20%',
      render: (text: any, record: IReportProductByDivision, index: number) => {
        return (
          <div id={`report-details-teams-quantity-${index}`} key={`report-details-teams-quantity-${index}`}>
						{/* {formatNumber(record.sales)} */}
          </div>
        )
      },
    },
		{
      title: 'Quantité',
      dataIndex: 'quantity_percent',
      key: 'quantity_percent',
			width: '20%',
      render: (text: any, record: IReportProductByDivision, index: number) => {
        return (
          <div id={`report-details-teams-quantity-percent-${index}`} key={`report-details-teams-quantity-percent-${index}`}>
						{/* {formatNumber(record.sales_percent)} */}
          </div>
        )
      },
    },
	]

	return (
		<Section<IReportProductByDivision>
			name="teams"
			columns={columns}
			fetch={props.fetch}
			fetchOnUserChange={true}
		/>
	)
}


export default TeamsDetailsReport
