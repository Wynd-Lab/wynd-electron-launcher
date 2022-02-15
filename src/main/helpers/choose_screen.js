const CustomError =  require("../../helpers/custom_error")

module.exports =  function chooseScreen(choose, screens) {
	if (!screens[choose]) {
		choose = 0
	}
	screens[choose].id = choose
	return screens[choose]
}
