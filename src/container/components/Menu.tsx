import React from 'react'
import { useSelector } from 'react-redux'

import log from 'electron-log'
import { Menu, Modal } from 'antd'

import { ReloadOutlined, PoweroffOutlined, InfoCircleOutlined, ToolOutlined, FileDoneOutlined } from '@ant-design/icons'

import { MenuInfo } from 'rc-menu/lib/interface'

import LogoMenu from './Logo'
import Device from './Device'

import { IRootState, IScreen } from '../interface'
import { IConfig } from '../helpers/config'
import { TNextAction } from '../store/actions'
import { session } from '@electron/remote'
import { type } from 'os'

export interface IMenuProps {
	onMenuClick: (action: TNextAction) => void
}

const { info } = Modal

const CashMenu: React.FunctionComponent<IMenuProps> = (props) => {
	const conf = useSelector<IRootState, IConfig>((state) => state.conf as IConfig)
	const screens = useSelector<IRootState, IScreen[]>((state) => state.screens as IScreen[])
	const onClickReload = () => {
		log.info('[WINDOW CONTAINER] Click Reload Menu')
		props.onMenuClick(TNextAction.RELOAD)
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const onClickClose = (menuInfo: MenuInfo) => {
		log.info('[WINDOW CONTAINER] Click Close Menu')
		props.onMenuClick(TNextAction.CLOSE)
	}

	const onClickSupport = () => {

		log.info('[WINDOW CONTAINER] Click Support Menu')
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

	const onClickReport = () => {

		const api_key = Object.keys(sessionStorage).find((key) => {
			return key.indexOf("StorageCache_https://api") === 0
		})

		if (api_key) {
			const token = sessionStorage.getItem(api_key)
			console.log(typeof token, token)
		}
	}

	const onClickWPTStatus = () => {
		props.onMenuClick(TNextAction.WPT_STATUS)
	}
	const onClickWPTPlugins = () => {
		props.onMenuClick(TNextAction.WPT_PLUGINS)
	}
	const onClickScreeensInfo = () => {
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
				<Menu.Item onClick={onClickReload}>
					<ReloadOutlined style={{ fontSize: "20px" }} />
					Reload
				</Menu.Item>
				{
					conf && conf.menu && conf.menu.phone_number && <Menu.Item onClick={onClickSupport}>
						<ToolOutlined style={{ fontSize: "20px" }} />
						Support
					</Menu.Item>
				}
				{
					conf && conf.menu && conf.menu.report && <Menu.Item onClick={onClickReport}>
						<FileDoneOutlined style={{ fontSize: "20px" }} />
						Report
					</Menu.Item>
				}
				<Menu.Item onClick={onClickScreeensInfo}>
					<InfoCircleOutlined style={{ fontSize: "20px" }} />
					Screens
				</Menu.Item>
				<Menu.Item onClick={onClickClose}>
					<PoweroffOutlined style={{ fontSize: "20px" }} />
					Close
				</Menu.Item>
				<Menu.Item className="device">
					<Device onClickPlugins={onClickWPTPlugins} onClickStatus={onClickWPTStatus} />
				</Menu.Item>
			</Menu>
		</React.Fragment>
	)
}

export default CashMenu
