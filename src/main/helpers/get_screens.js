const { screen } = require('electron')

module.exports =  function getScreens() {
	const screens = screen.getAllDisplays()

	return screens.map((aScreen) => {
		return aScreen.size
	})
}
