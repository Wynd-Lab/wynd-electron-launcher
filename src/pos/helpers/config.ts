export interface IConfig {
	url: string
	wpt: IConfigWpt
	menu: IConfigMenu
	chrome: IConfigChrome
	emergency: IConfigEmergency
}
export interface IConfigWpt {
	enable: boolean
	path: string | null
	url: string
}

export interface IConfigMenu {
	enable: boolean
	phone_number: string | null
	password: string | null
}

export interface IConfigChrome {
	enable: boolean
	margin: number
}

export interface IConfigEmergency {
	enable: boolean
}
