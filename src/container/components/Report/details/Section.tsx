
import React, { PropsWithChildren, useContext, useEffect, useRef, useState } from 'react'

import { Dispatch } from 'redux'
import { useDispatch, useSelector } from 'react-redux'
import { Row, Table } from 'antd'
import { ColumnProps } from 'antd/lib/table'

import { IApiError, IRootState, ITableType} from '../../../interface'
import { AppDispatch } from '../../../store'
import ReportError from '../reportError'
import MessagerContext from '../../../context/message'
import { ExpandableConfig } from 'antd/lib/table/interface'
import { ICustomWindow } from '../../../../helpers/interface'

declare let window: ICustomWindow


export interface IDetailsSectionReportComponentProps<T> {
	id?: string
	// fiscal_date: string
	// report_type: TReportType
	name: string
	fetchOnUserChange: boolean
	expandable? : ExpandableConfig<any>
	onReload?: () => void
	fetch: () => (
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

	const idUser = useSelector<IRootState, number | null>((state) => state.report.id_user)


	const apiErrorRef = useRef(apiError)

	const messager = useContext(MessagerContext)

	useEffect(() => {
			const onReload = () => {
				if (apiError) {
					reInit()
				}
			}
			reInit()

			messager?.on('reload.report', onReload)

			return function clean() {
				messager?.removeListener('reaload.report', onReload)
			}
	}, [])

	useEffect(() => {
		reInit()
	}, [idUser])

	const reInit = () => {
		dispatchLoading(true)
		setApiError(null)
		dispatch(props.fetch())
		.then((data) => {
			setResult(data)
		})
		.catch((err: any) => {
			const content = err.response ? err.response.data : err.message
			// console.log(content)

			window.log?.error('[WINDOW CONTAINER] Click',err)
			setApiErrorRef(content)
		})
		.finally(() => {
			dispatchLoading(false)
		})
	}

	const setApiErrorRef = (err: IApiError | null) => {
		setApiError(err)
		apiErrorRef.current = err
	}

	const onReloadError = () => {
		props.onReload ? props.onReload() : reInit()
	}

	const getRowKey = (record: any) => {
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		if (props.id && record[props.id] ) {
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore
			return `${props.name}-${record[props.id]}`
					// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore
		} else if (record['uuid']) {
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore

			return `${props.name}-${record['uuid']}`
		}
		return `${props.name}`
	}

	const errorColumns = [
		{
      title: props.columns[0].title,
      dataIndex: props.columns[0].dataIndex,
      key: props.columns[0].key,
			width: '100%',
      render: (text: any, record: IApiError, index: number) => {
        return (
          <div id={`report-details-${props.name}-${index}`} key={`report-details-${props.name}-${index}`}>
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

	const columns = apiError ? errorColumns : props.columns
	const dataSource = apiError ? [apiError]: result

	return (

		<Table<any>
			rowKey={getRowKey}
			className={`report-details-table report-details-table-${props.name}`}
			loading={loading}
			columns={columns}
			dataSource={dataSource}
			pagination={false}
			expandable={props.expandable}
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

