import React from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { Menu, Modal } from 'antd'

import { ReloadOutlined, PoweroffOutlined, InfoCircleOutlined } from '@ant-design/icons'

import { MenuInfo } from 'rc-menu/lib/interface'

import LogoMenu from './Logo'
import Device from './Device'

import { IRootState, IScreen } from '../interface'
import { IConfig } from '../helpers/config'
import { openPinpadAction, TNextPinpadAction } from '../store/actions'

export interface IMenuProps {}

const { info } = Modal

const CashMenu: React.FunctionComponent<IMenuProps> = () => {
	const conf = useSelector<IRootState, IConfig>((state) => state.conf as IConfig)
	const screens = useSelector<IRootState, IScreen[]>((state) => state.screens as IScreen[])
	const dispatch = useDispatch()
	const onClickReload = () => {
		dispatch(openPinpadAction(TNextPinpadAction.RELOAD))
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const onClickClose = (menuInfo: MenuInfo) => {
		dispatch(openPinpadAction(TNextPinpadAction.CLOSE))
	}

	const onClickSupport = () => {
		const modal = info({
			className: 'modal-support',
			title: 'CONTACT',
			centered: true,
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
			title: 'POS Infos',
			content: <div>{content}</div>,
			onOk: () => {
				modal.destroy()
			},
		})
	}

	return (
		<React.Fragment>
			<LogoMenu />
			<Menu id="wyndpos-menu">
				<Menu.Item onClick={onClickReload}>
					<ReloadOutlined />
					Reload
				</Menu.Item>
				<Menu.Item onClick={onClickSupport}>
					<InfoCircleOutlined />
					Support
				</Menu.Item>
				<Menu.Item onClick={onClickPosInfo}>
					<InfoCircleOutlined />
					Pos info
				</Menu.Item>
				<Menu.Item onClick={onClickClose}>
					<PoweroffOutlined />
					Close
				</Menu.Item>
				<Menu.Item className="device">
					<Device />
				</Menu.Item>
			</Menu>
		</React.Fragment>
	)
}

export default CashMenu
