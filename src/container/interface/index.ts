import { AnyAction } from 'redux'
export * from './report'
import { IConfig } from '../helpers/config'
import { TNextAction } from '../store/actions'
import { IReport } from './report'

export interface IModal {
	open: boolean
	content: string
}
export interface IMenu {
	open: boolean
}

export interface IPinpad {
	open: boolean
	nextAction: TNextAction | null
	code: string | null
	datas: any[]
}

export type TFrameDisplay = 'CONTAINER' | 'WPT' | 'REPORT'

export interface IUser {
	id: number | null
}

export interface IPlugin {
	authors: Array<string>;
	dependencies: Array<string>;
	depends: Array<string>;
	description: string;
	enabled: boolean;
	name: string;
	version: string;
	core: boolean;
	windowsOnly: boolean;
	unmaintainable: boolean;
}
export interface IWPT {
	connect: boolean
	plugins: IPlugin[]
	ask: boolean,
	infos: any
}

export interface IDisplay {
	ready: boolean,
	switch: TFrameDisplay
}

export interface ILoader {
	active: boolean
}

export interface IApi {
	token: string | null
}

export interface IApiError  {
	message: string
	error: string
	statusCode: number
}
export interface IRootState {
	display: IDisplay
	menu: IMenu
	modal: IModal
	loader: ILoader
	wpt: IWPT
	pluginState: TWPTPluginState | null
	conf: IConfig | null
	screens: IScreen[]
	user: IUser
	pinpad: IPinpad
	app: IAppInfo
	report: IReport
	api: IApi
}

export interface IAppAction<T> extends AnyAction {
	type: T
	payload?: any
}

export interface IAppInfo {
	name: string,
	version: string
	title: string
}

export interface IScreen {
	width: number
	height: number
}


export type  TPluginStatus = 'online' | 'offline'
export  interface IWPTPluginState {
	name: string
	status: TPluginStatus
}

export type TWPTPluginState = {
	[key in string]: IWPTPluginState
}


