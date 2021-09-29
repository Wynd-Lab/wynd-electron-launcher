
import React from 'react'

import Section from './Section'

import { fetchGlobalCA } from '../../../store/actions/report'
import { IReportCA } from '../../../interface'
import { formatNumber } from '../../../helpers/format'


export interface ISalesDetailsReportComponentProps {
	fiscal_date: string
}

const SalesDetailsReport: React.FunctionComponent<ISalesDetailsReportComponentProps> = (props) => {

	const columns = [
		{
      title: "Chiffre d'affaire (Global)",
      dataIndex: 'ca',
      key: 'ca',
			width: '70%',
      render: (_text: any, record: IReportCA, index: number) => {
        return (
          <div id={`report-details-sales-${index}`} key={`report-details-sales-${index}`}>
						<div className="report-details-sales-header">
							CA Brut
						</div>
						<ul className="report-details-sales-content">
							{ record && record.gross.rates.map((rate, index) => {
								return (
									<li className="report-details-sales-rate-gross-vat" key={`report-details-sales-rate-gross-vat-${index}`}>
										{rate.rate_vat}
									</li>
								)
							})}
						</ul>
						<div className="report-details-sales-footer">
							<div className="bold">
								Remises
							</div>
							<div className="bold">
								Consos employés
							</div>
							<div className="bold">
								CA net
							</div>
						</div>
						<ul className="report-details-sales-content">
						{ record && record.net.rates.map((rate, index) => {
							return (
								<li className="report-details-sales-rate-net-vat" key={`report-details-sales-rate-net-vat-${index}`}>
									{rate.rate_vat}
								</li>
							)
						})}
					</ul>
          </div>
        )
      },
    },
		{
      title: 'HT (€)',
      dataIndex: 'ht',
      key: 'ht',
			width: '12%',
      render: (text: any, record: IReportCA, index: number) => {
        return (
          <div id={`report-details-ht-${index}`} key={`report-details-sales-${index}`}>
						<div className="report-details-sales-header">
							{formatNumber(record.gross.total_ht)}
						</div>
						<ul className="report-details-sales-content">
							{ record && record.gross.rates.map((rate, index) => {
								return (
									<li className="report-details-sales-rate-gross-vat" key={`report-details-sales-rate-gross-vat-${index}`}>
										{formatNumber(rate.total_ht)}
									</li>
								)
							})}
						</ul>
						<div className="report-details-sales-footer">
							<div className="bold">
								??
							</div>
							<div className="bold">
								??
							</div>
							<div className="bold">
								{formatNumber(record.net.total_ht)}
							</div>
						</div>
						<ul className="report-details-sales-content">
						{
							record && record.net.rates.map((rate, index) => {
								return (
									<li className="report-details-sales-rate-net-vat" key={`report-details-sales-rate-net-vat-${index}`}>
										{formatNumber(rate.total_ht)}
									</li>
								)
								})
						}
						</ul>
          </div>
        )
      },
    },
		{
      title: 'TVA (€)',
      dataIndex: 'vat',
      key: 'vat',
			width: '12%',
      render: (text: any, record: IReportCA, index: number) => {
        return (
					<div id={`report-details-vat-${index}`} key={`report-details-vat-${index}`}>
					<div className="report-details-sales-header">
						{formatNumber(record.gross.total_vat)}
					</div>
					<ul className="report-details-sales-content">
						{ record && record.gross.rates.map((rate, index) => {
							return (
								<li className="report-details-sales-rate-gross-vat" key={`report-details-sales-rate-gross-vat-${index}`}>
									{formatNumber(rate.total_vat)}
								</li>
							)
						})}
					</ul>
					<div className="report-details-sales-footer">
						<div className="bold">
							??
						</div>
						<div className="bold">
							??
						</div>
						<div className="bold">
							{formatNumber(record.net.total_vat)}
						</div>
					</div>
					<ul className="report-details-sales-content">
					{
						record && record.net.rates.map((rate, index) => {
							return (
								<li className="report-details-sales-rate-net-vat" key={`report-details-sales-rate-net-vat-${index}`}>
									{formatNumber(rate.total_vat)}
								</li>
							)
							})
					}
					</ul>
				</div>
        )
      },
    },
		{
      title: 'TTC (€)',
      dataIndex: 'ttc',
      key: 'ttc',
			width: '12%',
      render: (text: any, record: IReportCA, index: number) => {
        return (
					<div id={`report-details-sales-ttc-${index}`} key={`report-details-sales-ttc-${index}`}>
					<div className="report-details-sales-header">
						{formatNumber(record.gross.total_ttc)}
					</div>
					<ul className="report-details-sales-content">
						{ record && record.gross.rates.map((rate, index) => {
							return (
								<li className="report-details-sales-rate-gross-vat" key={`report-details-sales-rate-gross-vat-${index}`}>
									{formatNumber(rate.total_ttc)}
								</li>
							)
						})}
					</ul>
					<div className="report-details-sales-footer">
						<div className="bold">
							??
						</div>
						<div className="bold">
							??
						</div>
						<div className="bold">
							{formatNumber(record.net.total_ht)}
						</div>
					</div>
					<ul className="report-details-sales-content">
					{
						record && record.net.rates.map((rate, index) => {
							return (
								<li className="report-details-sales-rate-net-vat" key={`report-details-sales-rate-net-vat-${index}`}>
									{formatNumber(rate.total_ht)}
								</li>
							)
							})
					}
					</ul>
				</div>
        )
      },
    },
	]

	return (
		<Section<IReportCA>
			name="sales"
			columns={columns}
			fetch={fetchGlobalCA}
			fiscal_date={props.fiscal_date}
		/>
	)
}


export default SalesDetailsReport
