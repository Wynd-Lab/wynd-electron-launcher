import { Theme, TThemeColorTypes } from "react-antd-cssvars";

export interface ICustomWindow extends Window {
		socket: any;
    url_pos: string;
    url_customer_display: string
    url_api: string
    is_customer_display: number
    link_wptls: string
    printer_margin: number
    homemessage: string
    phone_number: string
    city_weather: number
    chrome_printer: number
    wyndpostools: number
		wpt_url?: string
    launcher: string
    shutdownpass: string
    panel: number
    emergencyactivation: number
		store: any
		theme: Theme<TThemeColorTypes>
}
