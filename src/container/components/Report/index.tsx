import React, { useContext, useState } from 'react'
import { Col, Row } from 'antd'
import { useDispatch, useSelector } from 'react-redux'

import ReportsComponent from './reports'
import ReportComponent from './report'
import DetailsReport from './details'

import { fetchReportX, fetchReportZ, TNextAction } from '../../store/actions'
import { IRootState, IReport, TReportType, IWPT} from '../../interface'
import { convertReportStat, formatDate } from '../../helpers/format'

import { fakeCA } from '../../store/fake'
import MessagerContext from '../../context/message'
import { AppDispatch } from '../../store'
import { fetchGlobalCA, fetchReportPayments, fetchReportProducts, fetchReportUsers } from '../../store/actions/report'
import { generateXML } from '../../helpers/generate'

export interface IReportHeaderComponentProps {
	onCallback: (action: TNextAction, ...data: any) => void
}

const ReportHeaderComponent: React.FunctionComponent<IReportHeaderComponentProps> = (props) => {
	const [fiscalDate, setFiscalDate] = useState<string | null>(process.env.DEV && process.env.DEV === 'REPORT_D' ? fakeCA[0].fiscal_date : null)
	const [reportType, setReportType] = useState<TReportType | null>(process.env.DEV && process.env.DEV === 'REPORT_D' ? 'report_z' : null)
	const report = useSelector<IRootState, IReport>((state) => state.report)
	const wpt = useSelector<IRootState, IWPT>((state) => state.wpt)

	const dispatch: AppDispatch = useDispatch()
	const messager = useContext(MessagerContext)
	const onDetails = (nFiscalDate: string, nReportType: TReportType) => {
		setReportType(nReportType)
		setFiscalDate(nFiscalDate)
	}

	const onPrint = async (nFiscalDate: string, nReportType: TReportType) => {
		// setReportType(nReportType)
		// setFiscalDate(nFiscalDate)
		try {
			const data0 = await dispatch(fetchReportX())
			const data1 = await dispatch(fetchGlobalCA(nFiscalDate, nReportType))
			const data2 = await dispatch(fetchReportUsers(nFiscalDate, nReportType))
			const data3 = await dispatch(fetchReportPayments(nFiscalDate, nReportType))
			const data4 = convertReportStat(data0)
			const data5 = await dispatch(fetchReportProducts(nFiscalDate, nReportType))
			const xml = generateXML(data0, data1, data2, data3, data4, data5, {entity: report.env?.API_CENTRAL_ENTITY as string, type: nReportType, date: nFiscalDate, max_line_size:report.max_line_size, serial: wpt.infos.hardwareserial})

			props.onCallback(TNextAction.REQUEST_WPT, 'fastprinter.printxml', xml)
		}
		catch(err) {

		}
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
			fiscalDate && reportType ?
				<DetailsReport fiscal_date={fiscalDate} report_type={reportType} onBack={onBack} onReload={onReload} />
				:
				<React.Fragment>
				<Row className="report-row-header" gutter={[20, 0]}>
					<Col span={12}>
						{
							<ReportComponent
								onReload={onReload}
								fiscal_date={report.end_date}
								onDetails={onDetails}
								onPrint={onPrint}
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
								onPrint={onPrint}
							/>
						</Col>
					</Row>
			</React.Fragment>
			}

		</div>
	)
}

export default ReportHeaderComponent
