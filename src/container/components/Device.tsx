
import React from 'react'
import { Status } from 'react-antd-cssvars'
import { Tooltip } from 'antd'

import { useSelector } from 'react-redux'

import { ShakeOutlined, DoubleLeftOutlined } from '@ant-design/icons'

import { IRootState, IWPT, TFrameDisplay } from '../interface'

import Button from './Button'

export interface IDeviceProps {
	onClickStatus: () => void
	onClickPlugins: () => void
}

const Device: React.FunctionComponent<IDeviceProps> = (props) => {
	const wpt = useSelector<IRootState, IWPT>(state => state.wpt as IWPT)
	const display = useSelector<IRootState, TFrameDisplay>(state => state.display.switch)
	return (
		<div id="e-launcher-device">
				{
					display === 'CONTAINER' ?
					<div id="wpt-view">
						<Tooltip title="Wyndpostool page">
							<Button disabled={!wpt.connect} id="wpt-status" shape="circle" type="ghost" size="small" data-action="view WPT page" onClick={props.onClickStatus}>
								<Status size="large" color={wpt.connect ? "success" : "error"}></Status>
							</Button>
						</Tooltip>
							<Tooltip title="Wyndpostool plugins">
								<Button disabled={!wpt.connect} id="wpt-plugins" shape="circle" type="menu" size='middle' data-action="view WPT plugins" onClick={props.onClickPlugins}><ShakeOutlined style={{ fontSize: "20px" }} /></Button>
							</Tooltip>
					</div> :

					<div id="e-launcher-view">
						<Tooltip title="app page">
							<Button id="e-launcher-page" shape="circle" type="ghost" size="small" data-action="return view app" onClick={props.onClickStatus}><DoubleLeftOutlined style={{ fontSize: "20px"}}/></Button>
						</Tooltip>
					</div>
			}

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
