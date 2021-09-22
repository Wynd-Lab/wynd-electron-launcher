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

export interface IEnvInfo {
	API_CENTRAL_ENTITY: string
	API_URL: string
	DEFAULT_SERIAL: string
	MODE: string
	SOCKET_HOST: string
	SOCKET_PORT: string
	WPT_HOST: string
	WPT_PORT: string
}
export interface IReport {
	env: IEnvInfo | null
	start_date: string | null
	end_date: string | null
	reports: IReportZ[]
	report_x: IReportX | null
	report_z: any
}


export interface IEntity {
	"id": number
	"name": string
	"address": string
	"town": string
	"zipcode": string
	"phone": string
	"code_siret": string | null
	"vat_number": string | null
}

export interface IUserReport {
	id: number
	firstname: string
	lastname: string
}

export interface IReportX {
	"entity": IEntity
	"uuid": string | null,
	"account_id": string | null,
	"team_member_id": string | null,
	"average_basket": number,
	"total_net": number,
	"nb_net": number,
	"total_gross": number,
	"nb_gross": number,
	"total_discount": number,
	"nb_discount": number,
	"total_meal_voucher": number,
	"nb_meal_voucher": number,
	"nb_sales_canceled": number,
	"nb_sales_partially_cancelled": number,
	"nb_sales_refund_without_original_sale": number
}

export interface IReportZ extends IReportX {
	"user": IUserReport
	"uuid": string | null,
	"report_id": string,
	"fiscal_date": string,
	"start_date": string,
	"end_date": string,
	"account_id": string | null,
	"team_member_id": string | null,
	"average_basket": number,
	"total_net": number,
	"nb_net": number,
	"total_gross": number,
	"nb_gross": number,
	"total_discount": number,
	"nb_discount": number,
	"total_meal_voucher": number,
	"nb_meal_voucher": number,
	"nb_sales_canceled": number,
	"nb_sales_partially_cancelled": number,
	"nb_sales_refund_without_original_sale": number
}

export interface ITableReport {
	date: string
	ca_net: number
	ca_brut: number
	nb_net: number
}

export interface IDisplay {
	ready: boolean,
	switch: TFrameDisplay
}

export interface IApi {
	token: string | null
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
}

export interface IScreen {
	width: number
	height: number
}
