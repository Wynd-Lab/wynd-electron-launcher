import { Card, Col, Row } from 'antd'
import React, { Dispatch, useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import log from 'electron-log'

import { IRootState, IApi, IMinReport, IApiError } from '../../interface'
import StatGrid from './grid'
import SaleIcon from '../../icons/sale'
import BasketIcon from '../../icons/basket'
import ChartIcon from '../../icons/chart'
import Loader from '../../icons/loader'
import { ReloadOutlined } from '@ant-design/icons'

import { AppDispatch } from '../../store'
import { formatNumber } from '../../helpers/format'

import {fakeReportX, fakeReportX2} from '../../store/fake'
import { ICustomWindow } from '../../../helpers/interface'
import { Theme, Button } from 'react-antd-cssvars'

export interface IReportsComponentProps {
	title: String
	description: String
	fetch: () => (dispatch: Dispatch<any>, getState: () => IRootState) => Promise<any>
}

const { Meta } = Card;

declare let window: ICustomWindow


const ReportComponent: React.FunctionComponent<IReportsComponentProps> = (props) => {
	const [report, dispatchReport] = useState<IMinReport | null>(null)
	const [loading, dispatchLoading] = useState<boolean>(false)
	const api = useSelector<IRootState, IApi>((state) => state.api)
	const dispatch: AppDispatch = useDispatch()
	const [color2, setColor2] = useState<string>(window.theme.get('primary-color'))
	const [color3, setColor3] = useState<string>(window.theme.get('primary-color'))
	const [apiError, setApiError] = useState<IApiError | null>(null)

	useEffect(() => {
		setColor2(Theme.tint(window.theme.get('primary-color'), 15))
		setColor3(Theme.tint(window.theme.get('primary-color'), 25))
		if (api.token && (!process.env.DEBUG || process.env.DEBUG !== 'REPORT')) {
			reInit()
		} else if (process.env.DEBUG || process.env.DEBUG === 'REPORT') {
			dispatchReport(props.title === 'Rapport X' ? fakeReportX : fakeReportX2 )
			}
	}, [])

	const reInit = () => {
		dispatchLoading(true)
		dispatch(props.fetch())
		.then((report) => {
			dispatchReport(report)
		})
		.catch((err) => {
			log.info('[WINDOW CONTAINER] Click', err.response.data)
			setApiError(err.response.data)
		})
		.finally(() => {
			dispatchLoading(false)
		})
	}

	const onReloadClick = () => {
		reInit()
	}

	return (
		<Card
			className="report-card"
			bordered={true}
		>
			<Meta
				className="report-card-meta"
				title={props.title}
				description={props.description}
			/>
		<div className="report-stat-container">
			<Row className="report-stat-container-row" gutter={[12, 0]}>
				{ !loading && !apiError && report && <React.Fragment><Col span={8}>
							<StatGrid
								icon={<ChartIcon />}
								style={{background: color3}}
								title="Chiffre d'affaire Net"
								value={formatNumber(report.total_net)} />
						</Col>
					<Col span={8}>
							<StatGrid
								icon={<SaleIcon />}
								style={{background: color2}}
								title="Nombre de ventes Net"
								value={formatNumber(report.nb_net)} />
						</Col>
						<Col span={8}>
							<StatGrid
								icon={<BasketIcon />}
								title="Panier moyen Net"
								value={formatNumber(report.average_basket)} />
						</Col>
					</React.Fragment>
				}
				{ loading && <div className="report-stat-loader"><Loader/></div>
				}
				{ !!apiError && <Col className="report-error-container">
						<div className="report-error-code">
							{apiError.error}
						</div>
						<div className="report-error-reload">
								<Button type="link" icon={<ReloadOutlined />} onClick={onReloadClick}></Button>
						</div>
						<div className="report-error-message">
							{apiError.message}
						</div>
				</Col>
				}
			</Row>
		</div>
		</Card>
	)
}

export default ReportComponent
