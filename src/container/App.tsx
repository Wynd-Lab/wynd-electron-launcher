import React, { useEffect, useState } from 'react'
import { Drawer, Layout } from 'antd'
import { useSelector, useDispatch } from 'react-redux'

import {
	TNextAction,
	openPinpadAction,
	setToggleMenu,
} from './store/actions'
import Menu from './components/Menu'
import Emergency from './components/Emergency'
import { IConfig } from './helpers/config'
import { IAppInfo, IDisplay, ILoader, IMenu, IPinpad, IRootState } from './interface'
import PinPad from './components/Pinpad'
import classNames from 'classnames'
import ReportComponent from './components/Report'
import LoaderComponent from './components/Loader'
import Title from './components/Title'
// import { ICustomWindow } from '../helpers/interface'

export interface IAppProps {
	onCallback: (action: TNextAction, ...data: any) => void
	sendChildAction: (action: string, ...data: any) => void
}

// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path')
// declare let window: ICustomWindow

export interface IAppState { }

const App: React.FunctionComponent<IAppProps> = (props) => {
	const [urlApp, setUrlApp] = useState<string | null>(null)

	const appInfo = useSelector<IRootState, IAppInfo>((state) => state.app)
	const menu = useSelector<IRootState, IMenu>((state) => state.menu)
	const display = useSelector<IRootState, IDisplay>((state) => state.display)
	const conf = useSelector<IRootState, IConfig | null>((state) => state.conf)
	const pinpad = useSelector<IRootState, IPinpad>((state) => state.pinpad)
	const loader = useSelector<IRootState, ILoader>((state: IRootState) => state.loader)
	const dispatch = useDispatch()

	useEffect(() => {

		if (conf) {
			let url = conf?.http.static ? `http://localhost:${conf.http.port}` : conf?.url.href

			if (url && conf?.url.protocol === 'file' && !url.endsWith('.html')) {
				if (!url.endsWith('/')) {
					url += '/'
				}
				url += 'index.html'
			}
			if (url) {
				setUrlApp(url)
			}
		}
	}, [conf])

	useEffect(() => {
		if (urlApp) {
			const iFrame = document.getElementById('e-launcher-frame') as HTMLIFrameElement
			if (iFrame) {
				iFrame.addEventListener('dom-ready', function(){
					const webview = iFrame as any
					const message = {
						type: 'PARENT.AUTH',
						name: appInfo.name,
						version: appInfo.version,
					}
					if (conf?.view === 'webview') {
						webview.send('parent.action',message)
					} else if (conf?.view === 'iframe') {
					window.postMessage(JSON.stringify(message), '*')
					}
				})
			}
			const view = conf?.view

			if (iFrame && view) {

				if (iFrame.contentWindow) {

					iFrame.contentWindow.onerror = function onerror(err) {
						props.sendChildAction('log', 'ERROR', err.toString())
						return false
					}
				}
				if (view === 'webview') {

					iFrame.addEventListener('ipc-message', receiveMessage)
					// iFrame.contentWindow?.postMessage(JSON.stringify(message), '*')


				} else if (view === 'iframe') {
					window.addEventListener('message', receiveMessage, false)
					// window.postMessage(JSON.stringify(message), '*')
					// iFrame.contentWindow?.postMessage(JSON.stringify(message), '*')

				}

			}
		}

		return () => {
			const iFrame = document.getElementById('e-launcher-frame') as HTMLIFrameElement
			if (iFrame) {
				iFrame.removeEventListener('ipc-message', receiveMessage)
			}
			window.removeEventListener('message', receiveMessage)
		}
	}, [urlApp])

	const receiveMessage = (event: any) => {
		let data: any = null
		if (event.type === 'message' && event.data && event.data && typeof event.data === 'string' && event.data.startsWith('{')) {
			try {
				data = JSON.parse(event.data)

			} catch (e) {
				// eslint-disable-next-line no-console
				console.error(e)
			}

		} else if (event.type === 'ipc-message' && event.channel === 'app.action' && event.args && event.args.length > 0) {
			if (typeof (event.args[0]) === 'string') {
				try {
					data = JSON.parse(event.args[0])

				} catch (e) {
					// eslint-disable-next-line no-console
					console.error(e)
				}
			} else if (typeof event.args[0] === 'object') {
				data = event.args[0]
			}
		}

		if (data && data.type && typeof data.type === 'string') {
			switch (data.type.toUpperCase()) {
				case 'LOG':
					props.sendChildAction('log', data.level || 'INFO', data.payload)
					break
				case 'CENTRAL.REGISTER':
					props.sendChildAction('central.register', data.payload)
					break
				// case 'PARENT.WHO':
				// 	const containerApp = document.getElementById('e-launcher-frame') as HTMLIFrameElement | null

				// 	if (containerApp) {
				// 		const currentState = store.getState()

				// 		const message = {
				// 			name: 'electron-launcher',
				// 			type: 'PARENT.IS',
				// 			version: currentState.app.version,
				// 		}
				// 		containerApp.contentWindow?.postMessage(JSON.stringify(message), '*')
				// 	}
				// 	break
				default:
					break
			}
		}
	}

	const onClose = () => {
		dispatch(setToggleMenu(false))
	}

	const onClick = () => {
		dispatch(setToggleMenu(true))
	}

	const onMenuClick = (action: TNextAction, ...data: any) => {
		switch (action) {
			case TNextAction.RELOAD:
			case TNextAction.CLOSE:
			case TNextAction.REQUEST_WPT:
			case TNextAction.WPT_STATUS:
			case TNextAction.REPORT:

				if (conf && conf.menu && conf.menu.password && display.switch === 'CONTAINER') {
					dispatch(openPinpadAction(action, ...data))
				} else {
					props.onCallback(action, ...data)
				}
				break

			default:
				props.onCallback(action, ...data)
				break
		}
	}

	const onClickEmergency = () => {
		props.onCallback(TNextAction.EMERGENCY)
	}

	const onPinpadSuccess = () => {
		if (pinpad.nextAction) {
			props.onCallback(pinpad.nextAction, ...pinpad.datas)
		}
	}

	const wyndposFrameCN = classNames('frame', {
		hide: display.switch !== 'CONTAINER'
	})

	const menuButtonCN = classNames({
		hide: menu.open,
		dbg: conf?.debug
	})
	const layoutCN = classNames({
		brd: conf?.border,
		dbg: conf?.debug
	})

	return (
		<Layout id="e-launcher-layout" className={layoutCN}>
			{conf && conf.menu && conf.menu.enable && (
				<Drawer
					className="e-launcher-drawer"
					placement="left"
					closable={false}
					onClose={onClose}
					open={menu.open}
				>
					<Menu onMenuClick={onMenuClick} />
					{loader.active && <LoaderComponent />}
					{
						conf && conf.title && !conf.frame && <Title title={conf.title} />
					}
				</Drawer>
			)}
			{urlApp && conf?.view === 'webview' && <webview title="wyndpos" id="e-launcher-frame" className={wyndposFrameCN} src={urlApp as string} preload={`file://${path.resolve('/home/ppetit/electron/wynd-electron-launcher/src/container/assets/preload_app.js')}`}></webview>}
			{urlApp && conf?.view === 'iframe' && <iframe sandbox="allow-same-origin allow-scripts" title="wyndpos" id="e-launcher-frame" className={wyndposFrameCN} src={urlApp as string}></iframe>}

			{conf && conf.wpt && conf.wpt.enable && conf.wpt.url.href && display.ready && display.switch === 'WPT' && <iframe className="frame" title="wyndpostools" id="wpt-frame" src={conf.wpt.url.href}></iframe>}
			{conf && conf.wpt && conf.report && conf.report.enable && display.switch === 'REPORT' && <ReportComponent onCallback={props.onCallback} />}
			<div id="menu-button" className={menuButtonCN} onClick={onClick} />
			{conf && conf.emergency.enable && <Emergency visible={menu.open} onClick={onClickEmergency} />}
			{conf && conf.menu.password && (
				<PinPad code={conf.menu.password} onSuccess={onPinpadSuccess} />
			)}
		</Layout>
	)
}

export default App
