import React, {ReactNode, useContext, useEffect, useRef, useState } from 'react'

import { useSelector, useDispatch } from 'react-redux'
import {Dispatch } from 'redux'
import { Card, Col, Row } from 'antd'

import { Theme, Button } from 'react-antd-cssvars'
import { ReloadOutlined } from '@ant-design/icons'

import { IRootState, IApi, IMinReport, IApiError, TReportType } from '../../interface'
import StatGrid from './grid'
import SaleIcon from '../../icons/sale'
import BasketIcon from '../../icons/basket'
import ChartIcon from '../../icons/chart'
import Loader from '../../icons/loader'

import { AppDispatch } from '../../store'
import { formatNumber } from '../../helpers/format'

import {fakeReportX, fakeReportX2} from '../../store/fake'
import { ICustomWindow } from '../../../helpers/interface'
import DetailsButton from './DetailsButton'
import MessagerContext from '../../context/message'
import PrintButton from './PrintButton'

export interface IReportsComponentProps {
	fiscal_date?: string | null
	title: String
	description: String
	fetch: () => (dispatch: Dispatch, getState: () => IRootState) => Promise<IMinReport>
	onDetails?: (fiscalDate: string, reportType: TReportType) => void
	onPrint?: (fiscalDate: string, reportType: TReportType) => void
	onReload?: () => void

}

const { Meta } = Card

declare let window: ICustomWindow


const ReportComponent: React.FunctionComponent<IReportsComponentProps> = (props) => {
	const [report, dispatchReport] = useState<IMinReport | null>(null)
	const [loading, dispatchLoading] = useState<boolean>(false)
	const api = useSelector<IRootState, IApi>((state) => state.api)
	const dispatch: AppDispatch = useDispatch()
	const [color2, setColor2] = useState<string>(window.theme.get('primary-color'))
	const [color3, setColor3] = useState<string>(window.theme.get('primary-color'))
	const [apiError, setApiError] = useState<IApiError | null>(null)

	const apiErrorRef = useRef(apiError)

	const messager = useContext(MessagerContext)

	useEffect(() => {
			const onReload = () => {
				if (apiError) {
					reInit()
				}
			}
			setColor2(Theme.tint(window.theme.get('primary-color'), 15))
			setColor3(Theme.tint(window.theme.get('primary-color'), 25))
			if (api.token && (!process.env.DEBUG || process.env.DEBUG !== 'REPORT')) {
				reInit()
			} else if (process.env.DEBUG || process.env.DEBUG === 'REPORT') {
				dispatchReport(props.title === 'Rapport X' ? fakeReportX : fakeReportX2 )
			}

			messager?.on('reload.report', onReload)

			return function clean() {
				messager?.removeListener('reaload.report', onReload)
			}
	}, [])

	const setApiErrorRef = (err: IApiError | null) => {
		setApiError(err)
		apiErrorRef.current = err
	}

	const reInit = () => {
		dispatchLoading(true)
		setApiErrorRef(null)
		dispatch(props.fetch())
		.then((report) => {
			dispatchReport(report)
		})
		.catch((err) => {
			window.log?.info('[WINDOW CONTAINER] Click', err.response.data)
			setApiErrorRef(err.response.data)
		})
		.finally(() => {
			dispatchLoading(false)
		})
	}

	const onReloadClick = () => {
		props.onReload ? props.onReload() : reInit()
	}

	const actions: ReactNode[] = []
	if (props.onDetails) {
		const onMoreClick = () => {
			props.onDetails && props.fiscal_date && props.onDetails(props.fiscal_date, 'report_x')
		}
		actions.push(<DetailsButton key="details" onClick={onMoreClick}/>)
	}
	if (props.onPrint) {
		const onMoreClick = () => {
			props.onPrint && props.fiscal_date && props.onPrint(props.fiscal_date, 'report_x')
		}
		actions.push(<PrintButton key="details" onClick={onMoreClick}/>)
	}

	return (
		<Card
			className="report-card"
			bordered={true}
			actions={actions}
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
								value={formatNumber(report.total_net) + ' €'} />
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
								value={formatNumber(report.average_basket) + ' €'} />
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
