const { join } = require('path')
const {transports, createLogger, format} = require('winston');
require('winston-daily-rotate-file');

module.exports = function createAppLog(app) {

	const appLogPath =  join(app.getPath('userData'), 'logs/app')
	const mainTransport = new transports.DailyRotateFile({
		filename: '%DATE%.log',
		dirname: appLogPath,
		datePattern: 'YYYY-MM-DD-HH',
		zippedArchive: true,
		maxSize: '20m',
		maxFiles: '14d',
		format: format.combine(
			format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
			format.printf(info => `[${info.timestamp}] [${info.level}] ${info.message}`)
		),
	});
	// join(app.getPath('userData'), 'logs/app.log'

	mainTransport.on('rotate', function(oldFilename, newFilename) {
		// do something fun
	});

	const appLog = createLogger({
		level: "info",
		transports: [
			new transports.Console({
				format: format.combine(
					format.colorize(),
					format.printf(info => `APP >>> [${info.level}] ${info.message}`)
				)
			}),
			mainTransport
		]
	});

	return [appLog, appLogPath]

}
