
import { PageHeader } from 'antd'
import React, {  } from 'react'

import SaleSection from './Sales'
import TeamSection from './Teams'
import DiscountSection from './Discounts'
import PaymentSection from './Payments'
import StatSection from './Stat'
import ProductSection from './Products'
import { formatDate2 } from '../../../helpers/format'

export interface IDetailsComponentProps {
	fiscal_date: string
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
				/>
				<TeamSection
					fiscal_date={props.fiscal_date}
				/>
				<PaymentSection
					fiscal_date={props.fiscal_date}
				/>
				<DiscountSection
					fiscal_date={props.fiscal_date}
				/>
				<StatSection
					fiscal_date={props.fiscal_date}
				/>
				<ProductSection
					fiscal_date={props.fiscal_date}
				/>
			</PageHeader>

		</div>
	)
}


export default DetailsReport
