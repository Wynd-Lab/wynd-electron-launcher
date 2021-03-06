import React from 'react'
import { useSelector } from 'react-redux'

import { Menu, Modal } from 'antd'

import { ReloadOutlined, PoweroffOutlined, InfoCircleOutlined, ToolOutlined, FileDoneOutlined } from '@ant-design/icons'

import { MenuInfo } from 'rc-menu/lib/interface'

import LogoMenu from './Logo'
import Device from './Device'

import { IRootState, IScreen } from '../interface'
import { IConfig } from '../helpers/config'
import { TNextAction } from '../store/actions'
import { ICustomWindow } from '../../helpers/interface'


// eslint-disable-next-line @typescript-eslint/no-unused-vars
declare let window: ICustomWindow

export interface IMenuProps {
	onMenuClick: (action: TNextAction, ...data: any) => void
}

const { info } = Modal

const CashMenu: React.FunctionComponent<IMenuProps> = (props) => {
	const conf = useSelector<IRootState, IConfig>((state) => state.conf as IConfig)
	const screens = useSelector<IRootState, IScreen[]>((state) => state.screens as IScreen[])
	const onClickReload = () => {
		window.log.info('[WINDOW CONTAINER] Click Reload Menu')
		props.onMenuClick(TNextAction.RELOAD)
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const onClickClose = (menuInfo: MenuInfo) => {
		window.log.info('[WINDOW CONTAINER] Click Close Menu')
		props.onMenuClick(TNextAction.CLOSE)
	}

	const onClickSupport = () => {
		window.log.info('[WINDOW CONTAINER] Click Support Menu')
		const modal = info({
			className: 'modal-support',
			title: 'CONTACT',
			centered: true,
			autoFocusButton: null,
			content: (
				<div>
					{conf.menu.email && <div>Email: {conf.menu.email}</div>}
					{conf.menu.phone_number && <div>Phone: {conf.menu.phone_number}</div>}
				</div>
			),
			onOk: () => {
				modal.destroy()
			},
		})
	}

	const onClickReport = () => {
		window.log.info('[WINDOW CONTAINER] Click Report Menu')
		props.onMenuClick(TNextAction.REPORT)
		// window.modules?.report?.init()

	}

	const onClickWPTStatus = () => {
		window.log.info('[WINDOW CONTAINER] Click WPT status Menu')
		props.onMenuClick(TNextAction.WPT_STATUS)
	}
	const onClickWPTPlugins = () => {
		window.log.info('[WINDOW CONTAINER] Click WPT plugins Menu')

		props.onMenuClick(TNextAction.REQUEST_WPT, 'plugins')
	}
	const onClickScreeensInfo = () => {
		window.log.info('[WINDOW CONTAINER] Click on Screens Menu')

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
			<Menu id="e-launcher-menu">
				<Menu.Item onClick={onClickReload} key="menu-item-reload">
					<ReloadOutlined style={{ fontSize: '20px' }} />
					Reload
				</Menu.Item>
				{
					conf && conf.report && conf.report.enable && <Menu.Item onClick={onClickReport} key="menu-item-report">
						<FileDoneOutlined style={{ fontSize: '20px' }} />
						Report
					</Menu.Item>
				}
				{
					conf && conf.menu && (conf.menu.phone_number || conf.menu.email) && <Menu.Item onClick={onClickSupport} key="menu-item-support">
						<ToolOutlined style={{ fontSize: '20px' }} />
						Support
					</Menu.Item>
				}
				<Menu.Item onClick={onClickScreeensInfo} key="menu-item-screens">
					<InfoCircleOutlined style={{ fontSize: '20px' }} />
					Screens
				</Menu.Item>
				<Menu.Item onClick={onClickClose} key="menu-item-close">
					<PoweroffOutlined style={{ fontSize: '20px' }} />
					Close
				</Menu.Item>
				{
					conf && (conf.wpt.enable || conf.report.enable) &&
					<Menu.Item className="device"  key="menu-item-device">
						<Device onClickPlugins={onClickWPTPlugins} onClickStatus={onClickWPTStatus} />
					</Menu.Item>
				}

			</Menu>
		</React.Fragment>
	)
}

export default CashMenu
