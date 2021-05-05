import { IConfig } from '../../helpers/config';
import { IAppAction, IScreen } from '../../interface';

export enum TAppActionTypeKeys {
	'OPEN_MENU' = 'OPEN_MENU',
	'CLOSE_MENU' = 'CLOSE_MENU',
	'SET_WPT_PLUGIN' = 'SET_WPT_PLUGIN',
	'SET_WPT_INFO' = 'SET_WPT_INFO',
	'OPEN_MODAL' = 'OPEN_MODAL',
	'CLOSE_MODAL' = 'CLOSE_MODAL',
	'SET_CONFIG' = 'SET_CONFIG',
	'SET_SCREENS' = 'SET_SCREENS',
	'SET_USER_ID' = 'SET_USER_ID',
	'OPEN_PINPAD' = 'OPEN_PINPAD',
	'CLOSE_PINPAD' = 'CLOSE_PINPAD',
	'WPT_CONNECTED' = 'WPT_CONNECTED',
	'WPT_DISCONNECTED' = 'WPT_DISCONNECTED'
}

export enum TNextPinpadAction {
	'RELOAD'= 'RELOAD',
	'CLOSE'= 'CLOSE',
}

export function openMenuAction() : IAppAction<TAppActionTypeKeys> {
	return {
		type: TAppActionTypeKeys.OPEN_MENU
	}
}

export function closeMenuAction() : IAppAction<TAppActionTypeKeys> {
	return {
		type: TAppActionTypeKeys.CLOSE_MENU
	}
}


export function setWPTPluginsAction(plugins: any[]): IAppAction<TAppActionTypeKeys> {
	return {
		type: TAppActionTypeKeys.SET_WPT_PLUGIN,
		payload: {
			data: plugins
		}
	}
}

export function setUserIdAction(id: number): IAppAction<TAppActionTypeKeys> {
	return {
		type: TAppActionTypeKeys.SET_USER_ID,
		payload: {
			data: id
		}
	}
}

export function setWPTInfosAction(infos: any): IAppAction<TAppActionTypeKeys> {
	return {
		type: TAppActionTypeKeys.SET_WPT_INFO,
		payload: {
			data: infos
		}
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
		payload: {
			data: conf
		}
	}
}

export function setScreensAction(screens: IScreen[]): IAppAction<TAppActionTypeKeys> {
	return {
		type: TAppActionTypeKeys.SET_SCREENS,
		payload: {
			data: screens
		}
	}
}

export function openPinpadAction(nextAction: TNextPinpadAction): IAppAction<TAppActionTypeKeys> {
	return {
		type: TAppActionTypeKeys.OPEN_PINPAD,
		payload: {
			data: nextAction
		}
	}
}

export function closePinpadAction(): IAppAction<TAppActionTypeKeys> {
	return {
		type: TAppActionTypeKeys.CLOSE_PINPAD
	}
}

export function wptConnectedAction() : IAppAction<TAppActionTypeKeys> {
	return {
		type: TAppActionTypeKeys.WPT_CONNECTED
	}
}

export function wptDisConnectedAction() : IAppAction<TAppActionTypeKeys> {
	return {
		type: TAppActionTypeKeys.WPT_DISCONNECTED
	}
}
