import { Card, Col, Row } from "antd"
import React, { useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { IRootState, IReport, IApi, IReportX } from "../../interface"
import { fetchReportX} from "../../store/actions"
import StatGrid from "./grid"
import BasketIcon from "../../icons/basket"
import ChartIcon from "../../icons/chart"

export interface IReportsComponentProps {
}

const { Meta } = Card;

const ReportXComponent: React.FunctionComponent<IReportsComponentProps> = (props) => {
	const report = useSelector<IRootState, IReportX | null>((state) => state.report.report_x)
	const api = useSelector<IRootState, IApi>((state) => state.api)
	const dispatch = useDispatch()

	useEffect(() => {
		console.log()
		if (api.token && (!process.env.DEBUG || process.env.DEBUG !== "REPORT")) {
			dispatch(fetchReportX())
		}
	}, [])

	return (
		<Card
			className="report-card"
			bordered={true}
		>
			<Meta
				className="report-card-meta"
				title="Rapport X"
				description={"2021-10-09"}
			/>
		<div className="report-stat-container">
			<Row className="report-stat-container-row" gutter={[12, 0]}>
				{ report && <React.Fragment><Col span={8}>
							<StatGrid
								icon={<ChartIcon />}
								title="Chiffre d'affaire Net"
								value={String(report.total_net)} />
						</Col>
					<Col span={8}>
							<StatGrid
								icon={<BasketIcon />}
								title="Nombre de ventes Net"
								value={String(report.nb_net)} />
						</Col>
						<Col span={8}>
							<StatGrid
								icon={<BasketIcon />}
								title="Panier moyen Net"
								value={String(report.average_basket)} />
						</Col>
					</React.Fragment>
				}
			</Row>
		</div>
		</Card>
	)
}


export default ReportXComponent
