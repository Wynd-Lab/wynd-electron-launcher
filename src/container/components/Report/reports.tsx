import { PageHeader, Row, SpinProps } from 'antd'
import Table, { ColumnsType } from 'antd/lib/table'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Button } from 'react-antd-cssvars'
import { RightOutlined } from '@ant-design/icons'

import ReportError from './reportError'
import { IApiError, IReportZ, IRootState, ITableReport } from '../../interface'
import { AppDispatch } from '../../store'
import { fetchReports, iFrameDisplayAction } from '../../store/actions'
import { formatNumber, formatDate } from '../../helpers/format'

import Loader from '../../icons/loader'
import MessagerContext from '../../context/message'
export interface IReportsComponentProps {
  // reports: ITableReport[]
	onDetails: (fiscalDate: string) => void
	onReload?: () => void
}

const ReportsComponent: React.FunctionComponent<IReportsComponentProps> = (
  props
) => {
  const reports = useSelector<IRootState, IReportZ[]>(
    (state) => state.report.reports
  )

  const dispatch: AppDispatch = useDispatch()
  const [loading, setLoading] = useState<boolean>(false)
	const [apiError, setApiError] = useState<IApiError | null>(null)

	const apiErrorRef = useRef(apiError)
	const messager = useContext(MessagerContext)

	useEffect(() => {
			const onReload = () => {
				if (apiErrorRef.current) {
					reInit()
				}
			}
			reInit()

			messager?.on('reload.report', onReload)

			return function clean() {
				messager?.removeListener('reaload.report', onReload)
			}
	}, [])

  const data: ITableReport[] = reports
    ? reports
        ?.map((report: IReportZ) => {
          return {
            id: report.uuid,
            date: report.fiscal_date,
            ca_net: report.total_net,
            ca_brut: report.total_gross,
            nb_net: report.nb_net,
            average_basket: report.average_basket,
          }
        })
        .reverse()
    : []

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
      },
    },
    {
      title: 'CA net',
      dataIndex: 'ca_net',
      key: 'ca_net',
      render: (text: any, record: ITableReport, index: number) => {
        return (
          <div id={`report-ca-net-${index}`} key={`report-ca-net-${index}`}>
            {formatNumber(record.ca_net) + ' €'}
          </div>
        )
      },
    },
    {
      title: 'CA brut',
      dataIndex: 'ca_brut',
      key: 'ca_brut',
      render: (text: any, record: ITableReport, index: number) => {
        return (
          <div id={`report-ca-brut-${index}`} key={`report-ca-brut-${index}`}>
            {formatNumber(record.ca_brut)  + ' €'}
          </div>
        )
      },
    },
    {
      title: 'Nbres ventes Net',
      dataIndex: 'nb_net',
      key: 'nb_net',
      render: (text: any, record: ITableReport, index: number) => {
        return (
          <div id={`report-nb-net-${index}`} key={`report-nb-net-${index}`}>
            {formatNumber(record.nb_net) + ' €'}
          </div>
        )
      },
    },
    {
      title: 'Panier moyen Net',
      dataIndex: 'average_basket',
      key: 'average_basket',
      render: (text: any, record: ITableReport, index: number) => {
        return (
          <div
            id={`report-average-basket-${index}`}
            key={`report-average-basket-${index}`}
          >
            {formatNumber(record.average_basket) + ' €'}
          </div>
        )
      },
    },
		{
      title: '',
      dataIndex: 'more_action',
      render: (text: any, record: ITableReport, index: number) => {
        return (
          <div
            id={`report-more-action-${index}`}
            key={`report-more-action-${index}`}
          >
						<Button
							icon={<RightOutlined />}
							type="link"
							onClick={onMoreClick(record)}
						>
						</Button>
          </div>
        )
      },
    },
  ]


	const onMoreClick = (record: ITableReport) => () => {
		props.onDetails(record.date)
	}

  const tableLoading: SpinProps = {
    spinning: loading,
    indicator: Loader(),
    size: 'large',
  }

  const onBack = () => {
    dispatch(iFrameDisplayAction('CONTAINER'))
  }

	const setApiErrorRef = (err: IApiError | null) => {
		setApiError(err)
		apiErrorRef.current = err
	}

	const reInit = () => {
		setApiErrorRef(null)
		setLoading(true)
		dispatch(fetchReports())
			.catch((err) => {
				setApiErrorRef(err.response.data)
				// TODO show error
			})
			.finally(() => {
				setLoading(false)
			})
	}
	const onReloadError = () => {
		props.onReload && props.onReload()
	}

  return (
    <PageHeader className="site-page-header" onBack={onBack} title="Rapports Z">
			{
				!apiError ?
      	<Table<ITableReport>
					loading={tableLoading}
					rowKey="id"
					columns={columns}
					dataSource={loading ? [] : data}
				/> :
				<Row>
					<ReportError
						err={apiError}
						onReload={onReloadError}
					/>
				</Row>
			}
    </PageHeader>
  )
}

export default ReportsComponent
