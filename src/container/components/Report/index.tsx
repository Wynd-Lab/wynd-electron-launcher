import React from 'react'
import { Col, Row } from 'antd';
import ReportsComponent from './reports';
import ReportXComponent from './report_x';

const ReportComponent: React.FunctionComponent<{}> = () => {

	return (
		<div>
			<Row className="report-row-header">
				<Col className="gutter-row" span={12}>
					<ReportXComponent />
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

export default ReportComponent
