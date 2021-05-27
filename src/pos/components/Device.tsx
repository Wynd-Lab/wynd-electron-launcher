
import React from 'react'
import { Status, Button } from 'react-antd-cssvars'
import { Tooltip } from 'antd'

import { useSelector } from 'react-redux'

import { ShakeOutlined } from '@ant-design/icons'

import { IRootState, IWPT } from '../interface'


export interface IDeviceProps {
	onClickStatus: () => void
	onClickPlugins: () => void
}

const Device: React.FunctionComponent<IDeviceProps> = (props) => {
	const wpt = useSelector<IRootState, IWPT>(state => state.wpt as IWPT)
	return (
		<div id="wyndpos-device">
			<div id="wpt-view">
			<Tooltip title="Wyndpostool page">
				<Button disabled={!wpt.connect} id="wpt-status" shape="circle" type="ghost" size="small" onClick={props.onClickStatus}>
					<Status size="large" color={wpt.connect ? "success" : "error"} ></Status>
				</Button>
			</Tooltip>
			<Tooltip title="Wyndpostool plugins">
					<Button disabled={!wpt.connect} id="wpt-plugins" shape="circle" type="menu" size='middle' onClick={props.onClickPlugins}><ShakeOutlined style={{fontSize: "20px"}}/></Button>
			</Tooltip>
			</div>
			{ wpt.infos ?
				<div className="infos">
					<Tooltip title={`hostname: ${wpt.infos.hostname}`}>
						<div>{wpt.infos.hostname}</div>
					</Tooltip>
					<Tooltip title={`hardwareserial: ${wpt.infos.hardwareserial}`}>
						<div>{wpt.infos.hardwareserial}</div>
					</Tooltip>
				</div>
				: <div className="infos">
					No information
				</div>
			}

		</div>
	)
}


export default Device
