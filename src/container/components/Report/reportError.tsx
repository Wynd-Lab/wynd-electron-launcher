
import React, { useEffect } from 'react'

import { Button, Card, Col } from 'antd'
import { ICustomWindow } from '../../../helpers/interface'
import { IApiError } from '../../interface'
import { ReloadOutlined } from '@ant-design/icons'
import StatGrid from './grid'

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
