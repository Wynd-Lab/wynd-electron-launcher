import React from 'react'
import { Drawer, Layout } from 'antd'
import { useSelector, useDispatch } from 'react-redux'

import './App.less'

import {
	closePinpadAction,
	openMenuAction,
	closeMenuAction,
	TNextPinpadAction,
} from './store/actions'
import Menu from './components/Menu'
import Emergency from './components/Emergency'
import { IConfig } from './helpers/config'
import { IMenu, IPinpad, IRootState } from './interface'
import PinPad from './components/Pinpad'

export interface IAppProps {
	onCallback: (action: TNextPinpadAction) => void
}
export interface IAppState {}
const App: React.FunctionComponent<IAppProps> = (props) => {
	const menu = useSelector<IRootState, IMenu>((state) => state.menu)
	const conf = useSelector<IRootState, IConfig | null>((state) => state.conf)
	const pinpad = useSelector<IRootState, IPinpad>((state) => state.pinpad)
	const dispatch = useDispatch()

	const onClose = (
		e:
			| React.KeyboardEvent<HTMLDivElement>
			| React.MouseEvent<HTMLDivElement | HTMLButtonElement>,
	) => {
		dispatch(closeMenuAction())
	}
	const onClick = (e: React.MouseEvent<HTMLElement>) => {
		dispatch(openMenuAction())
	}

	const onPinpadSuccess = () => {
		dispatch(closePinpadAction())
		if (pinpad.nextAction) {
			props.onCallback(pinpad.nextAction)
		}
	}

	return (
		<Layout id="wyndpos-layout">
			<Drawer
				className="wyndpos-drawer"
				placement="left"
				closable={false}
				onClose={onClose}
				visible={menu.open}
			>
				<Menu />
			</Drawer>
			{conf && <iframe title="wyndpos" id="wyndpos-frame" src={conf.url_pos}></iframe>}
			{!menu.open && <div id="menu-button" onClick={onClick} />}
			{conf && conf.emergency_activation && <Emergency visible={menu.open} />}
			{conf && conf.shutdownpass && (
				<PinPad code={conf.shutdownpass} onSuccess={onPinpadSuccess} />
			)}
		</Layout>
	)
}

export default App
