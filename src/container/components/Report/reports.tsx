import { PageHeader } from "antd";
import Table, { ColumnsType } from "antd/lib/table";
import { GetRowKey } from "antd/lib/table/interface";
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { IApi, IReportZ, IRootState, ITableReport } from "../../interface";
import { fetchReports } from "../../store/actions";

export interface IReportsComponentProps {
	// reports: ITableReport[]
}

const ReportsComponent: React.FunctionComponent<IReportsComponentProps> = (props) => {

	const reports = useSelector<IRootState, IReportZ[]>((state) => state.report.reports)
	const api = useSelector<IRootState, IApi>((state) => state.api)
	const dispatch = useDispatch()

	useEffect(() => {
		if (api.token && (!process.env.DEBUG || process.env.DEBUG !== "REPORT")) {
			dispatch(fetchReports())
		}
	}, [])

	const data: ITableReport[] = reports ? reports?.map((report: IReportZ) => {
		return {
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
		},
		{
			title: 'CA net',
			dataIndex: 'ca_net',
			key: 'ca_net',
		},
		{
			title: 'CA brut',
			dataIndex: 'ca_brut',
			key: 'ca_net',
		},
		{
			title: 'Nbres ventes Net',
			dataIndex: 'nb_net',
			key: 'nb_net',
		},
		{
			title: 'Panier moyen Net',
			dataIndex: 'nb_net',
			key: 'nb_net',
		},

	];

	const generateTableRowUID: GetRowKey<ITableReport> = (row: ITableReport, index?: number ) => {
		return `reports-row-${index}`
	}

	return(
		<PageHeader
				className="site-page-header"
				onBack={() => null}
				title="Rapports Z"
			>
			<Table<ITableReport>
				rowKey={generateTableRowUID}
				columns={columns}
				dataSource={data}
			/>
		</PageHeader>
	)
}

export default ReportsComponent
