const { join } = require('path')
const {transports, createLogger, format} = require('winston');
require('winston-daily-rotate-file');

const { app } = require('electron')


	const mainTransport = new transports.DailyRotateFile({
		dirname: join(app.getPath('userData'), 'logs'),
		filename: 'main-%DATE%.log',
		datePattern: 'YYYY-MM-DD',
		zippedArchive: true,
		maxSize: '20m',
	});

	mainTransport.on('rotate', function(oldFilename, newFilename) {
		// do something fun
	});

	const logger = createLogger({
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

module.exports = logger
