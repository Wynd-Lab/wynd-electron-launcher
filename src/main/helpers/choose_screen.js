const CustomError =  require("../../helpers/custom_error")

module.exports =  function chooseScreen(choose, screens) {
	if (!screens[choose]) {
			throw new CustomError(400, CustomError.CODE.INVALID_$$_VALUE, [choose])
	} else {
		screens[choose].id = choose
		return screens[choose]
	}
}
