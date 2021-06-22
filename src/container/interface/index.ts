import { AnyAction } from 'redux'
import { Theme, TThemeColorTypes } from 'react-antd-cssvars'

import { IConfig } from '../helpers/config'
import { TNextAction } from '../store/actions'

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
}

export type TFrameDisplay = 'CONTAINER' | 'WPT'

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
export interface IRootState {
	display: IDisplay
	menu: IMenu
	modal: IModal
	wpt: IWPT
	conf: IConfig | null
	screens: IScreen[]
	user: IUser
	pinpad: IPinpad
}

export interface IAppAction<T> extends AnyAction {
	type: T
	payload?: any
}

export interface IScreen {
	width: number
	height: number
}
