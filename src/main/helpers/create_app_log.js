const { join } = require('path')
const {transports, createLogger, format} = require('winston');
require('winston-daily-rotate-file');

module.exports = function createAppLog(app) {

	const mainTransport = new transports.DailyRotateFile({
		filename: 'app-%DATE%.log',
		dirname: join(app.getPath('userData'), 'logs'),
		datePattern: 'YYYY-MM-DD-HH',
		zippedArchive: true,
		maxSize: '20m',
		maxFiles: '14d'
	});
	// join(app.getPath('userData'), 'logs/app.log'

	mainTransport.on('rotate', function(oldFilename, newFilename) {
		// do something fun
	});

	const appLog = createLogger({
		level: "info",
		format: format.combine(
			format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
			format.printf(info => `[${info.timestamp}] [${info.level}] ${info.message}`)
		),
		transports: [
			new transports.Console(),
			mainTransport
		]
	});

	return appLog

}
