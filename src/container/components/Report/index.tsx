import React, { useContext, useState } from 'react'
import { Col, Row } from 'antd'
import { useSelector } from 'react-redux'

import ReportsComponent from './reports'
import ReportComponent from './report'
import DetailsReport from './details'

import { fetchReportX, fetchReportZ } from '../../store/actions'
import { IRootState, IReport } from '../../interface'
import { formatDate } from '../../helpers/format'

import { fakeCA } from '../../store/fake'
import MessagerContext from '../../context/message'

const ReportHeaderComponent: React.FunctionComponent<{}> = () => {
	const [fiscalDate, setFiscalDate] = useState<string | null>(process.env.DEV && process.env.DEV === 'REPORT_D' ? fakeCA[0].fiscal_date : null)
	const report = useSelector<IRootState, IReport>((state) => state.report)
	const messager = useContext(MessagerContext)


	const onDetails = (nfiscalDate: string) => {
		setFiscalDate(nfiscalDate)
	}

	const onBack = () => {
		setFiscalDate(null)
	}

	const onReload = () => {
		messager?.emit('reload.report')
	}

	return (
		<div className="report-container">
			{
			!fiscalDate ?
				<>
					<Row className="report-row-header" gutter={[20, 0]}>
						<Col span={12}>
							{
								<ReportComponent
									onReload={onReload}
									fiscal_date={report.end_date}
									onDetails={onDetails}
									title="Rapport X" description={`${formatDate(report.end_date)}`} fetch={fetchReportX} />

							}
						</Col>
						<Col span={12}>
							<ReportComponent
								onReload={onReload}
								title="Rapport Z" description={`${formatDate(report.start_date)} -> ${formatDate(report.end_date)} `} fetch={fetchReportZ} />
						</Col>
					</Row>
					<Row className="report-row-table">
							<Col className="gutter-row" span={24}>
								<ReportsComponent
									onReload={onReload}
									onDetails={onDetails}
								/>
							</Col>
						</Row>
				</> :
				<DetailsReport fiscal_date={fiscalDate} onBack={onBack} onReload={onReload}
/>
			}

		</div>
	)
}

export default ReportHeaderComponent
