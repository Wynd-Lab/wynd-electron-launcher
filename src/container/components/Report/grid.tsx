
import React, { useEffect } from "react"

import { Card } from "antd"
import { ICustomWindow } from "../../../helpers/interface"

export interface IStatGridComponentProps {
	icon: React.ReactNode
	title: string
	value: string
	style?: React.CSSProperties
}

const StatGrid: React.FunctionComponent<IStatGridComponentProps> = (props) => {

	return (
		<Card.Grid
			className="report-stat-grid"
			style={props.style}
		>
			<div className="report-stat-grid-header">
				<span className="report-stat-grid-icon">
					{props.icon}
				</span>
				<span className="report-stat-grid-title">
					{props.title}
				</span>
			</div>
			<div className="report-stat-grid-content">
				<div className="report-stat-grid-value">
					{props.value}
				</div>
			</div>
		</Card.Grid>
	)
}


export default StatGrid
