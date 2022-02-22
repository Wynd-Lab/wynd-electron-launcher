const Stream = require("stream")
const log = require("electron-log")
const { autoUpdater } = require("electron-updater")

class StreamLogger extends Stream.Duplex {
  constructor() {
    super();
  }

  _read() {
  }
	_write(chunk, toto, next) {
	}

  emitMessages(level, messages) {
    for (let i = 0; i < messages.length; i++) {
      const message = messages[i];
      const buf = Buffer.from(JSON.stringify({level, message}), "utf-8");
			this.push(buf)
    }
  }

  debug(...messages) {
		log.debug(...messages);
		if (!this) {
			autoUpdater.logger.emitMessages("DEBUG", messages)
		} else {
			this.emitMessages("DEBUG", messages);
		}
  }

  warn(...messages) {
		log.warn(...messages);
		if (!this) {
			autoUpdater.logger.emitMessages('WARN', messages)
		} else {
			this.emitMessages('WARN', messages);
		}
  }

  info(...messages) {
		log.info(...messages);

		if (!this) {
			autoUpdater.logger.emitMessages("INFO", messages)
		} else {
			this.emitMessages("INFO", messages);
		}
  }

	error(...messages) {
		log.error(...messages);
		if (!this) {
			autoUpdater.logger.emitMessages("ERROR", messages)
		} else {
			this.emitMessages("ERROR", messages);
		}
  }

};

log.transports.console.level = process.env.DEBUG ? 'silly' : 'info'
autoUpdater.logger = new StreamLogger()

