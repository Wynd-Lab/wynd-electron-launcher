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
import { ItemType } from 'antd/lib/menu/hooks/useItems'


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

	const generateItems = () => {

		const items: ItemType[] = [
			{ label: 'Reload', key: 'menu-item-reload', icon: <ReloadOutlined style={{ fontSize: '20px' }} />, onClick: onClickReload}
		]
		if (conf && conf.report && conf.report.enable) {
			items.push(
				{ label: 'Report', key: 'menu-item-report', icon: <FileDoneOutlined style={{ fontSize: '20px' }} />, onClick: onClickReport}
			)
		}

		if (conf && conf.menu && (conf.menu.phone_number || conf.menu.email)) {
			items.push(
				{ label: 'Support', key: 'menu-item-support', icon: <ToolOutlined style={{ fontSize: '20px' }} />, onClick: onClickSupport}
			)
		}

		items.push(
			{ label: 'Screens', key: 'menu-item-screens', icon: <InfoCircleOutlined style={{ fontSize: '20px' }} />, onClick: onClickScreeensInfo}
		)

		items.push(
			{ label: 'Close', key: 'menu-item-close', icon: <PoweroffOutlined style={{ fontSize: '20px' }} />, onClick: onClickClose}
		)

		if (conf && (conf.wpt.enable || conf.report.enable)) {
			items.push(
				{ label: <Device onClickPlugins={onClickWPTPlugins} onClickStatus={onClickWPTStatus} />, key: 'menu-item-device'}
			)
		}
		return items
	}

	return (
		<React.Fragment>
			<LogoMenu />
			<Menu id="e-launcher-menu" items={generateItems()} />
		</React.Fragment>
	)
}

export default CashMenu
