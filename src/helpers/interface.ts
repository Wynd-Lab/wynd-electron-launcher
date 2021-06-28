import { Theme, TThemeColorTypes } from 'react-antd-cssvars'



export interface Hooks {
	hello: (message: string) => void
}
export interface ICustomWindow extends Window {
	store: any
	theme: Theme<TThemeColorTypes>
	hooks?: Hooks
}
