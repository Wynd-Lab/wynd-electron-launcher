const path = require('path')

module.exports = function createAppLog(app, log) {
	const appLog = log.create('app');

	appLog.transports.file.resolvePath = () => {
		return path.join(app.getPath('userData'), 'logs/app.log')
	}

	return appLog

}
