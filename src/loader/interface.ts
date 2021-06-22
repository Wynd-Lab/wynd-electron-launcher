import { Theme, TThemeColorTypes } from 'react-antd-cssvars'

export interface ICustomWindow extends Window {
	store: any
	theme: Theme<TThemeColorTypes>
}

export interface IStore {
	status: EStatus | string
	current: number
	total: number
	version: string
	action: EAction
	download: boolean
	progress: number
}

export enum EStatus {
	"start_app" = "Start application ...",
	"get_screens" = "Retrieve screens data ...",
	"get_screens_done" = "Retrieve screens data done",
	"get_conf" = "Read config ...",
	"get_conf_done" = "Read config done",
	"get_wpt_pid" = "WPT pid",
	"check_conf" = "Check config ...",
	"check_conf_done" = "Check config done",
	"check_update" = "Check update ...",
	"check_update_done" = "Check update done",
	"check_update_skip" = "Check update skip",
	"download_update" = "Download update",
	"download_update_done" = "Download update complete",
	"download_update_skip" = "No update to download",
	"update_quit" = "Will install and restart ...",
	"launch_wpt" =  "Start WPT ...",
	"launch_wpt_done" = "Start WPT done",
	"launch_wpt_skip" = "Start WPT skip",
	"wpt_connect" = "Connect to WPT ...",
	"wpt_connect_done" = "Connect to WPT done",
	"wpt_infos" = "Retrieve WPT hardware infos ...",
	"wpt_infos_done" = "Retrieve WPT hardware infos done",
	"wpt_plugins" = "Retrieve WPT plugins ...",
	"wpt_plugins_done" = "Retrieve WPT plugins done",
	"finish" =  "Ready"
}

export type EStatusKeys = keyof typeof EStatus;

export enum EAction {
	"initialize" = "Initialize",
	"reload" = "Reload",
	'close' = "Close",
}

export type EActionKeys = keyof typeof EAction;
