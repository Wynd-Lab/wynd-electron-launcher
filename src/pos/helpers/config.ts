export interface IUrl {
	href: string
	host: string
	hostname: string
	port: string
	protocol: string
}

export interface IConfig {
	url: IUrl
	wpt: IConfigWpt
	menu: IConfigMenu
	chrome: IConfigChrome
	emergency: IConfigEmergency
}
export interface IConfigWpt {
	enable: boolean
	path: string | null
	url: IUrl
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
