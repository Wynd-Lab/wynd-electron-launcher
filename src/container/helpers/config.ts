export interface IUrl {
	href: string
	host: string
	hostname: string
	port: string
	protocol: string
}


export interface IStart {
	enable :boolean
}
export interface IHttp {
	enable :boolean
	port: number | null
	static : string | null
}

export interface ISocketUpdate {
	enable :boolean
}
export interface IConfig {
	url: IUrl
	view: TView
	wpt: IConfigWpt
	report: IConfigReport
	menu: IConfigMenu
	chrome: IConfigChrome
	emergency: IConfigEmergency
	proxy: IProxy
	http: IHttp
	socket: ISocketUpdate
}
export interface IConfigWpt {
	enable: boolean
	path: string | null
	url: IUrl
}

export interface IConfigMenu {
	enable: boolean
	phone_number: string | null
	email: string | null
	password: string | null
	report: string | null
}

export interface IConfigChrome {
	enable: boolean
	margin: number
}

export interface IConfigEmergency {
	enable: boolean
}
export interface IProxy {
	enable: boolean
	url: IUrl
}

export interface IConfigReport  {
	enable: boolean
}


type TView = 'iframe' | 'webview'
