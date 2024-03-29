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

export interface IDisplayPluginState {
	enable: boolean
	_position_top?: number
	_position_right?: number
	_radius?: number
	_direction?:'row' | 'column'
}

export interface ISocketUpdate {
	enable :boolean
}
export interface IConfig {
	debug:boolean
	border: boolean
	frame?: boolean
	url: IUrl
	view: TView
	wpt: IConfigWpt
	report: IConfigReport
	menu: IConfigMenu
	chrome: IConfigChrome
	display_plugin_state: IDisplayPluginState
	emergency: IConfigEmergency
	proxy: IProxy
	http: IHttp
	socket: ISocketUpdate
	title?: string
}
export interface IConfigWpt {
	enable: boolean
	path: string | null
	url: IUrl
	password: string | null
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
