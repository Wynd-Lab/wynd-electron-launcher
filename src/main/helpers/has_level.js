module.exports = function has_level(requiredLevel, wantedLevel) {
	function convertedLevel(level) {
		switch (level) {
			case 'DEBUG':
			case 'debug':
				return 1
			case 'INFO':
			case 'info':
				return 2
			case 'ERROR':
			case 'error':
				return 3
			default:
				return 0
		}
	}
	return convertedLevel(wantedLevel) >= convertedLevel(requiredLevel)

}
