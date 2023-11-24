import React, { useEffect, useMemo, useState } from 'react'
import { Drawer, Layout } from 'antd'
import { useSelector, useDispatch } from 'react-redux'

import {
	TNextAction,
	openPinpadAction,
	setToggleMenu,
} from './store/actions'
import Menu from './components/Menu'
import Emergency from './components/Emergency'
import PluginState from './components/PluginState'
import { IConfig } from './helpers/config'
import { IAppInfo, IDisplay, ILoader, IMenu, IPinpad, IRootState, IWPT } from './interface'
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


interface IMyWindow extends Window {
	__STATIC__: string
}

declare let window: IMyWindow

export interface IAppState { }

const App: React.FunctionComponent<IAppProps> = (props) => {
	const [urlApp, setUrlApp] = useState<string | null>(null)
	const [readyToDiplayApp, setReadyToDiplayApp] = useState<boolean | null>(false)

	const appInfo = useSelector<IRootState, IAppInfo>((state) => state.app)
	const menu = useSelector<IRootState, IMenu>((state) => state.menu)
	const wpt = useSelector<IRootState, IWPT>((state) => state.wpt)
	const display = useSelector<IRootState, IDisplay>((state) => state.display)
	const conf = useSelector<IRootState, IConfig | null>((state) => state.conf)
	const pinpad = useSelector<IRootState, IPinpad>((state) => state.pinpad)
	const loader = useSelector<IRootState, ILoader>((state: IRootState) => state.loader)
	const dispatch = useDispatch()

	const displayPluginState = useMemo(()=> {

		return conf ? conf.display_plugin_state.enable : false
	}, [conf])
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

			if (!conf.wpt.enable) {
				setReadyToDiplayApp(true)
			}
		}

	}, [conf])

	useEffect(() => {
		if (wpt.connect && !readyToDiplayApp) {
			setReadyToDiplayApp(true)
		}

	}, [wpt, readyToDiplayApp])

	useEffect(() => {
		if (urlApp) {
			const iFrame = document.getElementById('e-launcher-frame') as HTMLIFrameElement
			if (iFrame) {
				iFrame.addEventListener('dom-ready', function(){
					const webview = iFrame as any
					sendParent(webview)
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
				} else if (view === 'iframe') {
					window.addEventListener('message', receiveMessage, false)
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


	const sendParent = (webview: any) => {
		const message = {
			type: 'PARENT.AUTH',
			name: appInfo.name,
			version: appInfo.version,
		}
		if (conf?.view === 'webview') {
			webview.send('parent.action',message)
		} else if (conf?.view === 'iframe') {
			if (urlApp) {
				webview.contentWindow.postMessage(message, '*')
			}
		}
	}

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
					if (typeof data.payload === 'string' && (data.payload.startsWith('{') || data.payload.startsWith('['))) {
						try {
							data.payload = JSON.parse(data.payload)
						}
						catch(err) {
							// silent
						}
					}
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
		if (!wpt.infos) {
			props.onCallback(TNextAction.REQUEST_WPT, 'infos')
		}
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
					dispatch(openPinpadAction(action, conf.menu.password, ...data))
				} else if (action === TNextAction.WPT_STATUS && conf?.wpt.password && display.switch !== 'WPT') {
					dispatch(openPinpadAction(action, conf?.wpt.password, ...data))
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

	const onLoad = (e: any) => {
		sendParent(e.target)
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
			{readyToDiplayApp && urlApp && conf?.view === 'webview' && <webview title="wyndpos" id="e-launcher-frame" className={wyndposFrameCN} src={urlApp as string} preload={window.__STATIC__}></webview>}
			{readyToDiplayApp && urlApp && conf?.view === 'iframe' && <iframe sandbox="allow-same-origin allow-scripts" title="wyndpos" id="e-launcher-frame" className={wyndposFrameCN} src={urlApp as string} onLoad={onLoad}></iframe>}

			{conf && conf.wpt && conf.wpt.enable && conf.wpt.url.href && display.ready && display.switch === 'WPT' && <iframe className="frame" title="wyndpostools" id="wpt-frame" src={conf.wpt.url.href}></iframe>}
			{conf && conf.wpt && conf.report && conf.report.enable && display.switch === 'REPORT' && <ReportComponent onCallback={props.onCallback} />}
			<div id="el-menu-button" className={menuButtonCN} onClick={onClick} />
			{conf && conf.emergency.enable && menu.open && <Emergency visible={menu.open} onClick={onClickEmergency} />}
			{pinpad.code && (
				<PinPad code={pinpad.code} onSuccess={onPinpadSuccess} />
			)}
			{ displayPluginState && menu.open && (
				<PluginState />
			)}
		</Layout>
	)
}

export default App
