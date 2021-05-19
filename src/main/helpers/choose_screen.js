const { screen } = require('electron')
const CustomError =  require("../../helpers/custom_error")

module.exports =  function chooseScreen(choose, screens) {
	if (!screens[choose]) {
			throw new CustomError(400, CustomError.CODE.INVALID_$$_VALUE, [choose])
	} else {
		return screens[choose]
	}
}
