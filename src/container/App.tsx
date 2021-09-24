import React from 'react'
import { Drawer, Layout } from 'antd'
import { useSelector, useDispatch } from 'react-redux'

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
import { IDisplay, ILoader, IMenu, IPinpad, IRootState } from './interface'
import PinPad from './components/Pinpad'
import classNames from 'classnames'
import ReportComponent from './components/Report'
import LoaderComponent from './components/Loader'

export interface IAppProps {
	onCallback: (action: TNextAction) => void
}

export interface IAppState { }

const App: React.FunctionComponent<IAppProps> = (props) => {
	const menu = useSelector<IRootState, IMenu>((state) => state.menu)
	const display = useSelector<IRootState, IDisplay>((state) => state.display)
	const conf = useSelector<IRootState, IConfig | null>((state) => state.conf)
	const pinpad = useSelector<IRootState, IPinpad>((state) => state.pinpad)
	const loader = useSelector<IRootState, ILoader>((state: IRootState) => state.loader)
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
			case TNextAction.REPORT:

				if (conf && conf.menu && conf.menu.password && display.switch === "CONTAINER") {
					dispatch(openPinpadAction(action))
				} else {
					props.onCallback(action)
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

	let url = conf?.http.static ? `http://localhost:${conf.http.port}` : conf?.url.href

	// if (url && !url.endsWith('.html')) {
		// url = path.join(url, 'index.html')
	// }
	return (
		<Layout id="e-launcher-layout">
			{conf && conf.menu && conf.menu.enable && (
				<Drawer
					className="e-launcher-drawer"
					placement="left"
					closable={false}
					onClose={onClose}
					visible={menu.open}
				>
					<Menu onMenuClick={onMenuClick} />
					{ loader.active && <LoaderComponent />}
				</Drawer>
			)}
			{url && <iframe sandbox="allow-same-origin allow-scripts" title="wyndpos" id="e-launcher-frame" className={wyndposFrameCN} src={url as string}></iframe>}
			{conf && conf.wpt && conf.wpt.enable && conf.wpt.url.href && display.ready && display.switch === 'WPT' && <iframe className="frame" title="wyndpostools" id="wpt-frame" src={conf.wpt.url.href}></iframe>}
			{conf && conf.wpt && conf.report.enable && display.switch === 'REPORT' && <ReportComponent />}
			{!menu.open && <div id="menu-button" onClick={onClick} />}
			{conf && conf.emergency.enable && <Emergency visible={menu.open} onClick={onClickEmergency} />}
			{conf && conf.menu.password && (
				<PinPad code={conf.menu.password} onSuccess={onPinpadSuccess} />
			)}
		</Layout>
	)
}

export default App
