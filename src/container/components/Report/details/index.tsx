
import { PageHeader } from 'antd'
import React, {  } from 'react'

import SaleSection from './Sales'
import TeamSection from './Teams'
import DiscountSection from './Discounts'
import PaymentSection from './Payments'
import StatSection from './Stat'
import ProductSection from './Products'
import { formatDate2 } from '../../../helpers/format'
import { TReportType } from '../../../interface'

export interface IDetailsComponentProps {
	fiscal_date: string
	report_type: TReportType
	onBack: () => void
	onReload?: () => void

}

const DetailsReport: React.FunctionComponent<IDetailsComponentProps> = (props) => {

	return (
		<div className="report-details">
			<PageHeader
				className="site-page-header"
				subTitle={formatDate2(props.fiscal_date)}
				onBack={props.onBack}
				title="Rapport détaillés"
			>
				<SaleSection
					fiscal_date={props.fiscal_date}
					report_type={props.report_type}
				/>
				<TeamSection
					fiscal_date={props.fiscal_date}
					report_type={props.report_type}
				/>
				<PaymentSection
					fiscal_date={props.fiscal_date}
					report_type={props.report_type}
				/>
				<DiscountSection
					fiscal_date={props.fiscal_date}
					report_type={props.report_type}
				/>
				<StatSection
					fiscal_date={props.fiscal_date}
					report_type={props.report_type}
				/>
				<ProductSection
					fiscal_date={props.fiscal_date}
					report_type={props.report_type}
				/>
			</PageHeader>

		</div>
	)
}


export default DetailsReport
