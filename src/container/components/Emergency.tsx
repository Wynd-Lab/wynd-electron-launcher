import React, { useState } from 'react'

import { Modal, Tooltip } from 'antd'

import Button from './Button'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import { ICustomWindow } from '../../helpers/interface'

declare let window: ICustomWindow

export interface IEmergency {
	visible: boolean
	onClick?: () => void
}
const { confirm } = Modal

const Emergency: React.FunctionComponent<IEmergency> = (props) => {
	const [emergencyState, setEmergencyState] = useState<boolean>(true)

	// const conf = useSelector<IRootState, IConfig>((state) => state.conf as IConfig)
	// const wpt = useSelector<IRootState, IWPT>((state) => state.wpt)
	// const user = useSelector<IRootState, IUser>((state) => state.user)
	// const socket = useContext(SocketContext)

	const emergencyAction = () => {
		if (props.onClick) {
			props.onClick()
		}
		// if (socket) {
		// const fastprinter = wpt.plugins.find((plugin: any) => {
		// 	return plugin.name === 'Fastprinter' && plugin.enabled ===true
		// })

		// const cashdrawer = wpt.plugins.find((plugin: any) => {
		// 	return plugin.name === 'Cashdrawer' && plugin.enabled === true
		// })

		// socket.emit('fastprinter.cashdrawer')
		// socket.emit('cashdrawer.open')
		// }
		// const messageposlog: any = {
		// 	device: {
		// 		code: wpt.infos.hardwareserial,
		// 	},
		// 	user: {
		// 		id: user.id,
		// 	},
		// }
		// // TODO:
		// if (conf && conf.url_api) {
		// 	const options = {
		// 		method: 'POST',
		// 		body: JSON.stringify(messageposlog),
		// 		headers: {
		// 			'Content-Type': 'application/json',
		// 		},
		// 	}

		// 	return fetch(conf.url_api, options).then((res) => res.json())
		// }

		return Promise.resolve()
	}
	const onClickEmergency = () => {
		setEmergencyState(false)
		const modal = confirm({
			className: 'emergency-modal',
			title: 'Emergency button activation',
			icon: <ExclamationCircleOutlined />,
			mask: true,
			content: 'This action will open the cash-drawer. Would you like to continue ?',
			centered: true,
			okText: 'OPEN',
			okType: 'danger',
			cancelButtonProps: {
				type: 'link',
			},
			cancelText: 'No',
			onOk() {
				modal.destroy()
				window.log.info('[WINDOW CONTAINER] Click emergency OK')
				emergencyAction().finally(() => {
					setEmergencyState(true)
				})
			},
			onCancel() {
				window.log.info('[WINDOW CONTAINER] Click emergency Cancel')
				modal.destroy()
				setEmergencyState(true)
			},
		})
	}

	return (
		<React.Fragment>
			{emergencyState && (
				<div id="emergency">
					<Tooltip title="Close the Application">
						<Button
							id="emergency-button"
							size="large"
							danger={true}
							type="primary"
							onClick={onClickEmergency}
							data-action="emergency"
						>
							EMERGENCY
						</Button>
					</Tooltip>
				</div>
			)}
		</React.Fragment>
	)
}

export default Emergency
