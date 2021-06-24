import React from 'react'
import { useSelector } from 'react-redux'

import { Menu, Modal } from 'antd'

import { ReloadOutlined, PoweroffOutlined, InfoCircleOutlined, ToolOutlined } from '@ant-design/icons'

import { MenuInfo } from 'rc-menu/lib/interface'

import LogoMenu from './Logo'
import Device from './Device'

import { IRootState, IScreen } from '../interface'
import { IConfig } from '../helpers/config'
import { TNextAction } from '../store/actions'

export interface IMenuProps {
	onCallBack: (action: TNextAction) => void
}

const { info } = Modal

const CashMenu: React.FunctionComponent<IMenuProps> = (props) => {
	const conf = useSelector<IRootState, IConfig>((state) => state.conf as IConfig)
	const screens = useSelector<IRootState, IScreen[]>((state) => state.screens as IScreen[])
	const onClickReload = () => {
		props.onCallBack(TNextAction.RELOAD)
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const onClickClose = (menuInfo: MenuInfo) => {
		props.onCallBack(TNextAction.CLOSE)
	}

	const onClickSupport = () => {
		const modal = info({
			className: 'modal-support',
			title: 'CONTACT',
			centered: true,
			autoFocusButton: null,
			content: (
				<div>
					<div>Email: support@wynd.eu</div>
					<div>Phone: {conf.menu.phone_number}</div>
				</div>
			),
			onOk: () => {
				modal.destroy()
			},
		})
	}

	const onClickWPTStatus = () => {
		props.onCallBack(TNextAction.WPT_STATUS)
	}
	const onClickWPTPlugins = () => {
		props.onCallBack(TNextAction.WPT_PLUGINS)
	}
	const onClickPosInfo = () => {
		const content = screens.map((screen, index) => {
			return (
				<div key={`screen-${index}`}>
					<div>
						Screen <span className="label">{index}</span>:{' '}
						<span className="label">{screen.width}</span> x{' '}
						<span className="label">{screen.height}</span>
					</div>
				</div>
			)
		})
		const modal = info({
			className: 'modal-support',
			centered: true,
			title: 'App infos',
			autoFocusButton: null,
			content: <div>{content}</div>,
			onOk: () => {
				modal.destroy()
			},
		})
	}

	return (
		<React.Fragment>
			<LogoMenu />
			<Menu id="e-container-menu">
				<Menu.Item onClick={onClickReload}>
					<ReloadOutlined style={{ fontSize: "20px"}}/>
					Reload
				</Menu.Item>
				<Menu.Item onClick={onClickSupport}>
					<ToolOutlined style={{ fontSize: "20px"}}/>
					Support
				</Menu.Item>
				<Menu.Item onClick={onClickPosInfo}>
					<InfoCircleOutlined style={{ fontSize: "20px"}}/>
					Pos info
				</Menu.Item>
				<Menu.Item onClick={onClickClose}>
					<PoweroffOutlined style={{ fontSize: "20px"}}/>
					Close
				</Menu.Item>
				<Menu.Item className="device">
					<Device  onClickPlugins={onClickWPTPlugins} onClickStatus={onClickWPTStatus}/>
				</Menu.Item>
			</Menu>
		</React.Fragment>
	)
}

export default CashMenu
