import { WebFrame } from 'electron'
import { Theme, TThemeColorTypes } from 'react-antd-cssvars'

export interface Hooks {

}
export interface ICustomWindow extends Window{
	store: any
	theme: Theme<TThemeColorTypes>
	modules?: any
	webFrame?: WebFrame
	log: any
	main?: {
		send?: any
		receive?: any
		sendLog?: any
	}
}
