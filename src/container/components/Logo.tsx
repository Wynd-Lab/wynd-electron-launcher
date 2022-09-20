
import React, { useState } from 'react'
import { Tooltip } from 'antd'
import { useSelector } from 'react-redux'

import LogoName from '../../../assets/Default.png'

import { IAppInfo, IRootState } from '../interface'

const LogoMenu: React.FunctionComponent<{}> = () => {

	const [defaultLogo, setDefaultLogo] = useState<boolean>(false)
	const app = useSelector<IRootState, IAppInfo>((state) => state.app)

	const onError = () => {
		setDefaultLogo(true)
	}
	return (

		<Tooltip title={`${app.name} ${app.version}`}>
			<div id="e-launcher-logo">
				{
					defaultLogo ?
					<img src={LogoName}/> :
					<img src='assets://Logo.png' alt='LOGO' onError={onError}/>
				}
			</div>
		</Tooltip>
	)
}


export default LogoMenu
