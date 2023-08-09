import { IConfig } from '../../helpers/config'
import { IAppAction, IScreen, TFrameDisplay, IAppInfo } from '../../interface'
export {setToken, setReportEnvInfo, fetchReports, fetchReportX, fetchReportZ, setReportDates} from './report'

export enum TAppActionTypeKeys {
	'SET_WPT_PLUGIN' = 'SET_WPT_PLUGIN',
	'SET_WPT_INFO' = 'SET_WPT_INFO',
	'OPEN_MODAL' = 'OPEN_MODAL',
	'CLOSE_MODAL' = 'CLOSE_MODAL',
	'SET_CONFIG' = 'SET_CONFIG',
	'SET_SCREENS' = 'SET_SCREENS',
	'SET_USER_ID' = 'SET_USER_ID',
	'OPEN_PINPAD' = 'OPEN_PINPAD',
	'CLOSE_PINPAD' = 'CLOSE_PINPAD',
	'WPT_CONNECT' = 'WPT_CONNECT',
	'WPT_ASK' = 'WPT_ASK',
	'IFRAME_DISPLAY_READY' = 'IFRAME_DISPLAY_READY',
	'IFRAME_DISPLAY' = 'IFRAME_DISPLAY',
	'APP_INFOS' = 'APP_INFOS',
	'SET_LOADER' = 'SET_LOADER',
	'TOGGLE_MENU' = 'TOGGLE_MENU'
}

export enum TNextAction {
	'EMERGENCY' = 'EMERGENCY',
	'RELOAD' = 'RELOAD',
	'CLOSE' = 'CLOSE',
	'WPT_STATUS' = 'WPT_STATUS',
	'NOTIFICATION' = 'NOTIFICATION',
	'REQUEST_WPT' = 'REQUEST_WPT',
	'REPORT' = 'REPORT',
	'OPEN_DEV_TOOLS' = 'OPEN_DEV_TOOLS',
}

export function setWPTPluginsAction(plugins: any[]): IAppAction<TAppActionTypeKeys> {
	return {
		type: TAppActionTypeKeys.SET_WPT_PLUGIN,
		payload: plugins,
	}
}

export function setUserIdAction(id: number): IAppAction<TAppActionTypeKeys> {
	return {
		type: TAppActionTypeKeys.SET_USER_ID,
		payload: id,
	}
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function setWPTInfosAction(infos: any): IAppAction<TAppActionTypeKeys> {
	return {
		type: TAppActionTypeKeys.SET_WPT_INFO,
		payload: infos,
	}
}

export function openModalAction(): IAppAction<TAppActionTypeKeys> {
	return {
		type: TAppActionTypeKeys.OPEN_MODAL,
	}
}

export function setConfigAction(conf: IConfig): IAppAction<TAppActionTypeKeys> {
	return {
		type: TAppActionTypeKeys.SET_CONFIG,
		payload: conf,
	}
}

export function setScreensAction(screens: IScreen[]): IAppAction<TAppActionTypeKeys> {
	return {
		type: TAppActionTypeKeys.SET_SCREENS,
		payload: screens,
	}
}

export function openPinpadAction(nextAction: TNextAction, code: string, ...datas: any): IAppAction<TAppActionTypeKeys> {
	return {
		type: TAppActionTypeKeys.OPEN_PINPAD,
		payload: {nextAction, code, datas},
	}
}
export function setToggleMenu(toggle: boolean): IAppAction<TAppActionTypeKeys> {
	return {
		type: TAppActionTypeKeys.TOGGLE_MENU,
		payload: toggle,
	}
}
setToggleMenu

export function closePinpadAction(): IAppAction<TAppActionTypeKeys> {
	return {
		type: TAppActionTypeKeys.CLOSE_PINPAD,
	}
}

export function wptConnectAction(connect: boolean): IAppAction<TAppActionTypeKeys> {
	return {
		type: TAppActionTypeKeys.WPT_CONNECT,
		payload: connect,
	}
}

export function setAskAction(set: boolean): IAppAction<TAppActionTypeKeys> {
	return {
		type: TAppActionTypeKeys.WPT_ASK,
		payload: set,
	}
}

export function iFrameReadyAction(ready: boolean): IAppAction<TAppActionTypeKeys> {
	return {
		type: TAppActionTypeKeys.IFRAME_DISPLAY_READY,
		payload: ready,
	}
}

export function iFrameDisplayAction(display: TFrameDisplay): IAppAction<TAppActionTypeKeys> {
	return {
		type: TAppActionTypeKeys.IFRAME_DISPLAY,
		payload: display,
	}
}

export function setAppInfos(appInfos: IAppInfo): IAppAction<TAppActionTypeKeys> {
	return {
		type: TAppActionTypeKeys.APP_INFOS,
		payload: appInfos,
	}
}

export function setLoader(active: boolean): IAppAction<TAppActionTypeKeys> {
	return {
		type: TAppActionTypeKeys.SET_LOADER,
		payload: active,
	}
}

// export function setReportEnvInfo(envInfo: IEnvInfo) : IAppAction<TAppActionTypeKeys> {
// 	return {
// 		type: TAppActionTypeKeys.SET_REPORT_ENV,
// 		payload: envInfo
// 	}
// }



