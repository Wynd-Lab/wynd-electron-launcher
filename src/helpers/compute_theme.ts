import { Theme, TThemeColorTypes } from 'react-antd-cssvars'
import { Store } from 'redux'

import { IRootState } from '../container/interface'

export default function computeThemeContainer(store?: Store<IRootState>) {
	// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
	return function computeTheme(this: Theme<TThemeColorTypes>, key: TThemeColorTypes, value: string, luminance: number) {
		if (key === 'primary-color') {
			if (Theme.isdark(value)) {
				this.set('table-head-text-color', this.get('text-color-inv'), false)
			} else {
				this.set('table-head-text-color', this.get('text-color'), false)
			}
			// this.set('table-head-text-color', value)
			const background = value
			this.set('table-head-background', background)
			this.set('background-selected', background)
			this.set('table-head-background-hover', Theme.tint(value, 75))
			this.set('table-head-background-selected', Theme.tint(value, 15))
			this.set('table-head-background-selected-hover', value)
			this.set('box-shadow-color', value, false, 20)
		}
		if (this.has(`${key}-hover` as TThemeColorTypes)) {
			this.set(`${key}-hover` as TThemeColorTypes, Theme.tint(value, 17.5), false)
		}
		if (this.has(`${key}-background` as TThemeColorTypes)) {
			this.set(`${key}-background` as TThemeColorTypes, Theme.tint(value, 75), false)
		}
		if (this.has(`${key}-hover` as TThemeColorTypes)) {
			this.set(`${key}-hover` as TThemeColorTypes, Theme.tint(value, 17.5), false)
		}
		if (this.has(`${key}-background` as TThemeColorTypes)) {
			this.set(`${key}-background` as TThemeColorTypes, Theme.tint(value, 75), false)
		}
		if (key === 'menu-background') {
			if (luminance > 0.015) {
				this.set('submenu-background', Theme.tint(value, 40), false)
			} else {
				this.set('submenu-background', Theme.shade(value, 40), false)
			}
			if (Theme.isdark(value)) {
				this.set('menu-text-color', this.get('text-color-inv'), false, 0.65)
			} else {
				this.set('menu-text-color', this.get('text-color'), false, 0.65)
			}
		}
	}
}
