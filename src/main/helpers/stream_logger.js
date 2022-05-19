const Stream = require("stream")
const { autoUpdater } = require("electron-updater")

class StreamLogger extends Stream.Duplex {
  constructor(log) {
    super();
		// console.log(log)
		// log.level = process.env.DEBUG ? 'silly' : 'info'
		this.log = log
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
		this.log.debug(...messages);
		if (!this) {
			autoUpdater.logger.emitMessages("DEBUG", messages)
		} else {
			this.emitMessages("DEBUG", messages);
		}
  }

  warn(...messages) {
		this.log.warn(...messages);
		if (!this) {
			autoUpdater.logger.emitMessages('WARN', messages)
		} else {
			this.emitMessages('WARN', messages);
		}
  }

  info(...messages) {
		this.log.info(...messages);

		if (!this) {
			autoUpdater.logger.emitMessages("INFO", messages)
		} else {
			this.emitMessages("INFO", messages);
		}
  }

	error(...messages) {
		this.log.error(...messages);
		if (!this) {
			autoUpdater.logger.emitMessages("ERROR", messages)
		} else {
			this.emitMessages("ERROR", messages);
		}
  }

};

module.exports = (log) => {
	const tmp = new StreamLogger(log)
	autoUpdater.logger = tmp
	return tmp
}

