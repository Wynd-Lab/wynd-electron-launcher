const Stream = require("stream");

module.exports = class LogStream extends Stream.Readable {
  constructor(log) {
    super();
    this.log = log;
  }

  _read() {
    // nothing to do here
  }

  emitMessages(messages) {
    for (let i = 0; i < messages.length; i++) {
      const message = messages[i];
      const buf = Buffer.from(message, "utf-8");
      this.push(buf);
    }
  }

  debug(...messages) {
    this.emitMessages(messages);
    this.log.debug(...messages);
  }

  warn(...messages) {
    this.emitMessages(messages);
    this.log.warn(...messages);
  }

  info(...messages) {
    this.emitMessages(messages);
    this.log.info(...messages);
  }
};
