import { Theme, TThemeColorTypes } from 'react-antd-cssvars'

export interface ICustomWindow extends Window {
	store: any
	theme: Theme<TThemeColorTypes>
}
