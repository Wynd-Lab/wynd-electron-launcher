export interface IUrl {
	href: string
	host: string
	hostname: string
	port: string
	protocol: string
}


export interface IStartUpdate {
	enable :boolean
}
export interface IHttpUpdate {
	enable :boolean
	port: number | null
}

export interface ISocketUpdate {
	enable :boolean
}
export interface IConfig {
	url: IUrl
	wpt: IConfigWpt
	menu: IConfigMenu
	chrome: IConfigChrome
	emergency: IConfigEmergency
	start_update: IStartUpdate
	http_update: IHttpUpdate
	socket_update: ISocketUpdate
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
