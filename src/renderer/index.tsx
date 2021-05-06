import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'

import { Theme } from 'react-antd-cssvars'

import { ipcRenderer, ipcMain } from 'electron'
import { ICustomWindow } from './helpers/window'
import { IConfig } from './helpers/config'
import computeTheme from './helpers/compute_theme'
import { SocketProvider } from './context/socket'

import { store } from './store'

import App from './App'

import './index.less'
import {
	setConfigAction,
	setWPTInfosAction,
	setScreensAction,
	setWPTPluginsAction,
	setUserIdAction,
	TNextPinpadAction,
} from './store/actions'

let socket: any

declare let window: ICustomWindow

window.store = store
window.theme = new Theme(undefined, computeTheme)

const receiveMessage = (event: any) => {
	if (event.data && event.data.userId) {
		store.dispatch(setUserIdAction(Number.parseInt(event.data.userId, 10)))
	}
}

ipcRenderer.on('get_conf', (event, args) => {
	// eslint-disable-next-line no-console
	console.log(args)
})
ipcRenderer.send('ready', 'main')
window.addEventListener('message', receiveMessage, false)
// const win = getWindow()

// const screens = getScreens()
// store.dispatch(setScreensAction(screens))

// clearCache()

// fs.readFile(
// 	process.env.NODE_ENV === 'development'
// 		? '../config.js'
// 		: path.resolve(path.dirname(process.execPath), 'config.js'),
// 	(err, data) => {
// 		if (err) {
// 			alert(err)
// 			closeApp(win)
// 		}

// 		injectScript(data.toString()).then(async () => {
// 			const conf: IConfig = {
// 				url_pos: window['url_pos'],
// 				url_customer_display: window['url_customer_display'],
// 				url_api: window['url_api'],
// 				is_customer_display: Boolean(window['is_customer_display']),
// 				link_wptls: window['link_wptls'],
// 				printer_margin: window['printer_margin'],
// 				homemessage: window['homemessage'],
// 				phone_number: window['phone_number'],
// 				city_weather: Boolean(window['city_weather']),
// 				chrome_printer: Boolean(window['chrome_printer']),
// 				wyndpostools: Boolean(window['wyndpostools']),
// 				wpt_url: window['wpt_url'] || 'http://localhost:9963',
// 				launcher: window['launcher'],
// 				shutdownpass: window['shutdownpass'],
// 				panel: Boolean(window['panel']),
// 				emergency_activation: Boolean(window['emergencyactivation']),
// 			}

// 			try {
// 				if (conf.wyndpostools) {
// 					child = await launcWpt(conf.link_wptls)
// 				}
// 				const [connexion, infos, plugins] = await connectToWpt(conf.wpt_url, store)
// 				if (conf.chrome_printer) {
// 					setPrinterMargin(win, conf.printer_margin)
// 				}
// 				store.dispatch(setWPTInfosAction(infos))
// 				store.dispatch(setWPTPluginsAction(plugins))
// 				store.dispatch(setConfigAction(conf))
// 				socket = connexion
// 			} catch (err) {
// 				alert(err)
// 				if (child) {
// 					child.kill()
// 				}
// 				win.close()
// 			}

// 		})
// 	},
// )

const onCallback = (action: TNextPinpadAction) => {
	// clearCache()
	// switch (action) {
	// 	case TNextPinpadAction.CLOSE:
	// 		// closeApp(win, child)
	// 		break
	// 	case TNextPinpadAction.RELOAD:
	// 		reload(conf.wyndpostools ? conf.wpt_url : null, child).then((newChild) => {
	// 			if (newChild) {
	// 				child = newChild
	// 			}
	// 		})
	// 		break
	// 	default:
	// 		break
	// }
}

ReactDOM.render(
	<React.Fragment>
		<Provider store={store}>
			<SocketProvider value={socket}>
				<App onCallback={onCallback} />
			</SocketProvider>
		</Provider>
	</React.Fragment>,
	document.getElementById('root'),
)

// win.fullscreen = true

// process.on('SIGTERM', () => {
// 	closeApp(win, child)
// })
