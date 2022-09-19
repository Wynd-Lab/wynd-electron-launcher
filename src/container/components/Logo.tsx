
import React from 'react'
import { Tooltip } from 'antd'
import { useSelector } from 'react-redux'

import LogoName from '../../../assets/Default.png'

import { IAppInfo, IRootState } from '../interface'

const LogoMenu: React.FunctionComponent<{}> = () => {

	const app = useSelector<IRootState, IAppInfo>((state) => state.app)

	return (

		<Tooltip title={`${app.name} ${app.version}`}>
			<div id="e-launcher-logo"><img src='assets://Default.png' alt={LogoName}></img></div>
		</Tooltip>
	)
}


export default LogoMenu
