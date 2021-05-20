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
import { IMenu, IPinpad, IRootState } from './interface'
import PinPad from './components/Pinpad'

export interface IAppProps {
	onCallback: (action: TNextAction) => void
}

export interface IAppState {}

const App: React.FunctionComponent<IAppProps> = (props) => {
	const menu = useSelector<IRootState, IMenu>((state) => state.menu)
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
		if (conf && conf.menu && conf.menu.password) {
			dispatch(openPinpadAction(action))
		} else {
			props.onCallback(action)
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

	return (
		<Layout id="wyndpos-layout">
			{conf && conf.menu && conf.menu.enable && (
				<Drawer
					className="wyndpos-drawer"
					placement="left"
					closable={false}
					onClose={onClose}
					visible={menu.open}
				>
					<Menu onCallBack={onMenuClick}/>
				</Drawer>
			)}
			{conf && <iframe title="wyndpos" id="wyndpos-frame" src={conf.url.href}></iframe>}
			{!menu.open && <div id="menu-button" onClick={onClick} />}
			{conf && conf.emergency.enable && <Emergency visible={menu.open} onClick={onClickEmergency}/>}
			{conf && conf.menu.password && (
				<PinPad code={conf.menu.password} onSuccess={onPinpadSuccess} />
			)}
		</Layout>
	)
}

export default App
