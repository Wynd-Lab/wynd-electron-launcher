
import React from 'react'

import { PageHeader } from 'antd'

import SaleSection from './Sales'
import TeamSection from './Teams'
import DiscountSection from './Discounts'
import PaymentSection from './Payments'
import StatSection from './Stat'
import ProductSection from './Products'

import Filters from './Filters'

import { formatDate2 } from '../../../helpers/format'
import { TInnerFetch, TReportType } from '../../../interface'
import { fetchGlobalCA, fetchReportUsers, fetchReportProducts, fetchReportPayments, fetchReportDiscounts, fetchReportStat} from '../../../store/actions/report'

export interface IDetailsComponentProps {
	fiscal_date: string
	report_type: TReportType
	onBack: () => void
	onReload?: () => void
}

const DetailsReport: React.FunctionComponent<IDetailsComponentProps> = (props) => {

	const fetch = (innerFetch: TInnerFetch<any>) => () => {
		return innerFetch(props.fiscal_date, props.report_type)
	}

	return (
		<div className="report-details">
			<PageHeader
				className="site-page-header"
				subTitle={formatDate2(props.fiscal_date)}
				onBack={props.onBack}
				title="Rapport détaillés"
				extra={<Filters/>}
			>
				<SaleSection
					fetch={fetch(fetchGlobalCA)}
					/>
				<TeamSection
					fetch={fetch(fetchReportUsers)}
					/>
				<PaymentSection
					fetch={fetch(fetchReportPayments)}
				/>
				<DiscountSection
					fetch={fetch(fetchReportDiscounts)}
				/>
				<StatSection
					fetch={fetch(fetchReportStat)}
				/>
				<ProductSection
					fetch={fetch(fetchReportProducts)}
				/>
				{/* <OperationSection
					fiscal_date={props.fiscal_date}
					report_type={props.report_type}
				/> */}
			</PageHeader>

		</div>
	)
}


export default DetailsReport
