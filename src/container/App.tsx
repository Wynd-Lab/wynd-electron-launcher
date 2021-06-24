import React from 'react'
import { Drawer, Layout } from 'antd'
import { useSelector, useDispatch } from 'react-redux'

import './App.less'

import {
	closePinpadAction,
	openMenuAction,
	closeMenuAction,
	TNextAction,
	openPinpadAction,
} from './store/actions'
import Menu from './components/Menu'
import Emergency from './components/Emergency'
import { IConfig } from './helpers/config'
import { IDisplay, IMenu, IPinpad, IRootState } from './interface'
import PinPad from './components/Pinpad'
import classNames from 'classnames'

export interface IAppProps {
	onCallback: (action: TNextAction) => void
}

export interface IAppState {}

const App: React.FunctionComponent<IAppProps> = (props) => {
	const menu = useSelector<IRootState, IMenu>((state) => state.menu)
	const display = useSelector<IRootState, IDisplay>((state) => state.display)
	const conf = useSelector<IRootState, IConfig | null>((state) => state.conf)
	const pinpad = useSelector<IRootState, IPinpad>((state) => state.pinpad)
	const dispatch = useDispatch()

	const onClose = () => {
		dispatch(closeMenuAction())
	}
	const onClick = () => {
		dispatch(openMenuAction())
	}

	const onMenuClick = (action: TNextAction) => {
		switch (action) {
			case TNextAction.RELOAD:
			case TNextAction.CLOSE:
			case TNextAction.WPT_PLUGINS:
			case TNextAction.WPT_STATUS:
				if (conf && conf.menu && conf.menu.password) {
					dispatch(openPinpadAction(action))
				}
				break
			default:
				props.onCallback(action)
				break;
		}
	}

	const onClickEmergency = () => {
		props.onCallback(TNextAction.EMERGENCY)
	}

	const onPinpadSuccess = () => {
		if (pinpad.nextAction) {
			props.onCallback(pinpad.nextAction)
		}
	}

	const wyndposFrameCN = classNames('frame', {
		hide: display.switch !== 'CONTAINER'
	})

	return (
		<Layout id="e-container-layout">
			{conf && conf.menu && conf.menu.enable && (
				<Drawer
					className="e-container-drawer"
					placement="left"
					closable={false}
					onClose={onClose}
					visible={menu.open}
				>
					<Menu onCallBack={onMenuClick}/>
				</Drawer>
			)}
			{conf && conf.url && display.ready && <iframe title="wyndpos" id="e-container-frame" className={wyndposFrameCN} src={conf.url.href}></iframe>}
			{conf && conf.wpt && conf.wpt.url.href && display.ready && display.switch === 'WPT' && <iframe className="frame" title="wyndpostools" id="wpt-frame" src={conf.wpt.url.href}></iframe>}
			{!menu.open && <div id="menu-button" onClick={onClick} />}
			{conf && conf.emergency.enable && <Emergency visible={menu.open} onClick={onClickEmergency}/>}
			{conf && conf.menu.password && (
				<PinPad code={conf.menu.password} onSuccess={onPinpadSuccess} />
			)}
		</Layout>
	)
}

export default App
