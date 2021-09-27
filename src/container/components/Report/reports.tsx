import { PageHeader, SpinProps } from "antd";
import Table, { ColumnsType } from "antd/lib/table";
import { GetRowKey } from "antd/lib/table/interface";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import { IApi, IReportZ, IRootState, ITableReport } from "../../interface";
import { AppDispatch } from "../../store";
import { fetchReports, iFrameDisplayAction } from "../../store/actions";
import { formatNumber, formatDate } from '../../helpers/format'
import Loader from '../../icons/loader'
import Icon from "@ant-design/icons";
export interface IReportsComponentProps {
	// reports: ITableReport[]
}

const ReportsComponent: React.FunctionComponent<IReportsComponentProps> = (props) => {

	const reports = useSelector<IRootState, IReportZ[]>((state) => state.report.reports)
	const api = useSelector<IRootState, IApi>((state) => state.api)
	const dispatch: AppDispatch = useDispatch()
	const [loading, setLoading] = useState<boolean>(false)

	useEffect(() => {
		if (api.token && (!process.env.DEBUG || process.env.DEBUG !== "REPORT")) {
			setLoading(true)
			dispatch(fetchReports())
				.catch((err) => {
				})
				.finally(() => {
					setLoading(false)
			})
		}
	}, [])

	const data: ITableReport[] = reports ? reports?.map((report: IReportZ) => {
		return {
			id: report.uuid,
			date: report.fiscal_date,
			ca_net: report.total_net,
			ca_brut: report.total_gross,
			nb_net: report.nb_net,
			average_basket: report.average_basket
		}
	}).reverse() : []

	const columns: ColumnsType<ITableReport> = [
		{
			title: 'Date',
			dataIndex: 'date',
			key: 'date',
			render: (text: any, record: ITableReport, index: number) => {
				return (
					<div id={`report-date-${index}`} key={`report-date-${index}`}>
						{formatDate(record.date)}
					</div>
				)
			}
		},
		{
			title: 'CA net',
			dataIndex: 'ca_net',
			key: 'ca_net',
			render: (text: any, record: ITableReport, index: number) => {
				return (
					<div id={`report-ca-net-${index}`} key={`report-ca-net-${index}`}>
						{formatNumber(record.ca_net)}
					</div>
				)
			}
		},
		{
			title: 'CA brut',
			dataIndex: 'ca_brut',
			key: 'ca_brut',
			render: (text: any, record: ITableReport, index: number) => {
				return (
					<div id={`report-ca-brut-${index}`} key={`report-ca-brut-${index}`}>
						{formatNumber(record.ca_brut)}
					</div>
				)
			}
		},
		{
			title: 'Nbres ventes Net',
			dataIndex: 'nb_net',
			key: 'nb_net',
			render: (text: any, record: ITableReport, index: number) => {
				return (
					<div id={`report-nb-net-${index}`} key={`report-nb-net-${index}`}>
						{formatNumber(record.nb_net)}
					</div>
				)
			}
		},
		{
			title: 'Panier moyen Net',
			dataIndex: 'average_basket',
			key: 'average_basket',
			render: (text: any, record: ITableReport, index: number) => {
				return (
					<div id={`report-average-basket-${index}`} key={`report-average-basket-${index}`}>
						{formatNumber(record.average_basket)}
					</div>
				)
			}
		},
	];

	const generateTableRowUID: GetRowKey<ITableReport> = (row: ITableReport, index?: number ) => {
		return `reports-row-${index}`
	}

	const tableLoading: SpinProps= {
		spinning: loading,
		indicator: Loader(),
		size: "large"
	}

	const onBack = () => {
		dispatch(iFrameDisplayAction('CONTAINER'))
	}

	return(
		<PageHeader
				className="site-page-header"
				onBack={onBack}
				title="Rapports Z"
			>
			<Table<ITableReport>
				loading={tableLoading}
				rowKey='id'
				columns={columns}
				dataSource={loading? [] : data}
			/>
		</PageHeader>
	)
}

export default ReportsComponent
