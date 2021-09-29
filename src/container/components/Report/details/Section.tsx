
import React, { PropsWithChildren, useEffect, useState } from 'react'

import { Dispatch } from 'redux'
import { useDispatch } from 'react-redux'
import { Row, Table } from 'antd'
import { ColumnProps } from 'antd/lib/table'

import { ICustomWindow } from '../../../../helpers/interface'
import { IApiError, IReportCA, IRootState, IUserReport, IReportDiscount, IReportPayment, IReportStat, IReportProduct} from '../../../interface'
import { AppDispatch } from '../../../store'
import ReportError from '../reportError'

declare let window: ICustomWindow

export type ITableType = IReportCA | IUserReport | IReportPayment | IReportDiscount | IReportStat | IReportProduct

export interface IDetailsSectionReportComponentProps<T> {
	id?: string
	fiscal_date: string
	name: string
	fetch:  (fiscalDate: string) => (
		dispatch: Dispatch,
		getState: () => IRootState
	) => Promise<T[]>
	columns: Array<ColumnProps<T>>
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
function Section<T extends ITableType>(props: PropsWithChildren<IDetailsSectionReportComponentProps<T>>) {
	const [result, setResult] = useState<T[]>([])
	const [loading, dispatchLoading] = useState<boolean>(false)
  const dispatch: AppDispatch = useDispatch()
	const [apiError, setApiError] = useState<IApiError | null>(null)

	useEffect(() => {
			reInit()
	}, [])

	const reInit = () => {
		dispatchLoading(true)
		dispatch(props.fetch(props.fiscal_date))
		.then((data) => {
			setResult(data)
		})
		.catch((err: any) => {
			const content = err.response ? err.response.data : err.message
			// console.log(content)

			// window.log?.info('[WINDOW CONTAINER] Click',err)
			setApiError(content)
		})
		.finally(() => {
			dispatchLoading(false)
		})
	}

	const onReloadError = () => {
		reInit()
	}

	const getRowKey = (record: any) => {
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		if (props.id && record[props.id] ) {
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore
			return `${props.name}-${record[props.id]}`
		}
		return `${props.name}`
	}

	const errorColumns = [
		{
      title: 'Remises',
      dataIndex: 'label',
      key: 'label',
			width: '100%',
      render: (text: any, record: IApiError, index: number) => {
        return (
          <div id={`report-details-discounts-${index}`} key={`report-details-discounts-${index}`}>
						{apiError &&
							<Row>
							<ReportError
									err={apiError}
									onReload={onReloadError}
								/>
							</Row>
						}
          </div>
        )
      },
    },
	]
	return (

		<Table<any>
			rowKey={getRowKey}
			className={`report-details-table report-details-table-${props.name}`}
			loading={loading}
			columns={apiError ? errorColumns : props.columns}
			dataSource={apiError ? [apiError]: result}
			pagination={false}
			size="middle"
			sticky={true}
		/>
		// <Row>
		// 	<ReportError
		// 		err={apiError}
		// 		onReload={onReloadError}
		// 	/>
		// </Row>
	)
}


export default Section
