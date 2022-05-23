
const { join } = require('path')
const winston = require('winston');
require('winston-daily-rotate-file');

module.exports = function createAppLog(userData) {

	const mainTransport = new winston.transports.DailyRotateFile({
		filename: join(userData, 'logs', 'renderer-%DATE%.log'),
		datePattern: 'YYYY-MM-DD',
		zippedArchive: true,
		maxSize: '20m',
		maxFiles: '14d'
	});
	// join(app.getPath('userData'), 'logs/app.log'

	mainTransport.on('rotate', function(oldFilename, newFilename) {
		// do something fun
	});

	const appLog = winston.createLogger({
		transports: [
			mainTransport
		]
	});

	return appLog

}
