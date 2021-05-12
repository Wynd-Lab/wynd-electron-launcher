import { AnyAction } from 'redux'
import { Theme, TThemeColorTypes } from 'react-antd-cssvars'

import { IConfig } from '../helpers/config'
import { TNextPinpadAction } from '../store/actions'

export interface IModal {
	open: boolean
	content: string
}
export interface IMenu {
	open: boolean
}

export interface IPinpad {
	open: boolean
	nextAction: TNextPinpadAction | null
}

export interface IUser {
	id: number | null
}

export interface IWPT {
	connect: boolean
	plugins: any
	infos: any
}

export interface IRootState {
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
