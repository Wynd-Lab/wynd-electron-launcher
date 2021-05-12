import {Theme, TThemeColorTypes } from 'react-antd-cssvars'

export default function computeTheme(this: Theme<TThemeColorTypes>, key: TThemeColorTypes, value: string, luminance: number) {
	if (this.has(`${key}-hover` as TThemeColorTypes)) {
		this.set(`${key}-hover` as TThemeColorTypes, Theme.tint(value, 17.5), false)
	}
	if (this.has(`${key}-background` as TThemeColorTypes)) {
		this.set(`${key}-background` as TThemeColorTypes, Theme.tint(value, 75), false)
	}
	if (key === "menu-background") {
		if (luminance < 0.015) {
			this.set("submenu-background", Theme.tint(value, 20), false)
		} else {
			this.set("submenu-background", Theme.shade(value, 20), false)
		}
		if (Theme.isdark(value)) {
			this.set("menu-text-color", this.get("text-color-inv"), false, 0.65)
		} else {
			this.set("menu-text-color", this.get("text-color"), false, 0.65)
		}
	}
}
