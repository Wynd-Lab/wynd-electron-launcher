const { screen } = require('electron')

module.exports =  function getScreens() {
	const screens = screen.getAllDisplays()
	return screens.map((aScreen) => {
		return {
			width: aScreen.size.width,
			height: aScreen.size.height,
			x: aScreen.bounds.x,
			y: aScreen.bounds.y
		}
	})
}
