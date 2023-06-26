const Stream = require("stream")
const autoUpdater = require("./auto_updater")

class StreamLogger extends Stream.Duplex {
  constructor(log) {
    super();
		// log.level = process.env.EL_DEBUG ? 'silly' : 'info'
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
		if (!this) {
			autoUpdater.logger.emitMessages("DEBUG", messages)
		} else {
			this.log.debug(...messages);
			this.emitMessages("DEBUG", messages);
		}
  }

  warn(...messages) {
		if (!this) {
			autoUpdater.logger.emitMessages('WARN', messages)
		} else {
			this.log.warn(...messages);
			this.emitMessages('WARN', messages);
		}
  }

  info(...messages) {
		if (!this) {
			autoUpdater.logger.emitMessages("INFO", messages)
		} else {
			this.log.info(...messages);
			this.emitMessages("INFO", messages);
		}
  }

	error(...messages) {
		if (!this) {
			autoUpdater.logger.emitMessages("ERROR", messages)
		} else {
			this.emitMessages("ERROR", messages);
			this.log.error(...messages);
		}
  }

};

module.exports = (log) => {
	const tmp = new StreamLogger(log)
	autoUpdater.logger = tmp
	return tmp
}

