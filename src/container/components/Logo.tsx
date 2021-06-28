
import React from 'react'
import { Tooltip } from 'antd'
import { useSelector, useDispatch } from 'react-redux'

import LogoName from '../../../assets/Default.svg'
import { IAppInfo, IRootState } from '../interface'

const LogoMenu: React.FunctionComponent<{}> = () => {

	const app = useSelector<IRootState, IAppInfo>((state) => state.app)

	return (

		<Tooltip title={`${app.name} ${app.version}`}>
			<div id="e-launcher-logo"><img src={LogoName}></img></div>
		</Tooltip>
	)
}


export default LogoMenu
