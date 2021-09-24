import React, { useEffect } from 'react'
import { Col, Row } from 'antd';
import { useSelector } from 'react-redux';

import ReportsComponent from './reports';
import ReportComponent from './report';
import { fetchReportX, fetchReportZ } from '../../store/actions';
import { IRootState, IReport } from '../../interface';
import { formatDate } from '../../helpers/format'

const ReportHeaderComponent: React.FunctionComponent<{}> = () => {
	const report = useSelector<IRootState, IReport>((state) => state.report)

	return (
		<div>
			<Row className="report-row-header" gutter={[20, 0]}>
				<Col span={12}>
					<ReportComponent
						title="Rapport X" description={`${formatDate(report.end_date)}`} fetch={fetchReportX}
					/>
				</Col>
				<Col span={12}>
					<ReportComponent
						title="Rapport Z" description={`${formatDate(report.start_date)} -> ${formatDate(report.end_date)} `} fetch={fetchReportZ}
					/>
				</Col>
			</Row>
			<Row className="report-row-table">
				<Col className="gutter-row" span={24}>
					<ReportsComponent />
				</Col>
			</Row>
		</div>
	)
}

export default ReportHeaderComponent
