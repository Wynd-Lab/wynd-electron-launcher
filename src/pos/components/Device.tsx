
import React from 'react'
import { Status } from 'react-antd-cssvars'
import { Tooltip } from 'antd'

import { useSelector } from 'react-redux'
import { IRootState, IWPT } from '../interface'

const Device: React.FunctionComponent<{}> = () => {
	const wpt = useSelector<IRootState, IWPT>(state => state.wpt as IWPT)
	return (
		<div id="wyndpos-device">
			<Tooltip title="Wyndpostool">
				<div id="wpt">

					<Status size="large" color={wpt.connect ? "success" : "error"} />
				</div>
			</Tooltip>
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
