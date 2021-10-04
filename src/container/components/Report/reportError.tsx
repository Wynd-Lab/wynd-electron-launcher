
import React from 'react'

import { Button, Col } from 'antd'
import { IApiError } from '../../interface'
import { ReloadOutlined } from '@ant-design/icons'

export interface IStatGridComponentProps {
	err: IApiError
	onReload: () => void
}

const ReportError: React.FunctionComponent<IStatGridComponentProps> = (props) => {

	return (
		<Col className="report-error-container">
			<div className="report-error-code">
				{props.err.error}
			</div>
			<div className="report-error-reload">
				<Button type="link" icon={<ReloadOutlined />} onClick={props.onReload}></Button>
			</div>
			<div className="report-error-message">
				{props.err.message}
			</div>
		</Col>
	)
}


export default ReportError
