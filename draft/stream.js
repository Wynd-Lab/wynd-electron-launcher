const Stream = require('stream');

const StreamLogger = require("../src/main/helpers/stream_logger")


let testStream = null
let datasToTest = []
let sl = null
let messagesReceived = []

const simpleLogger = {
	debug: function(...messages) {
		messagesReceived = messages
	},
	warn: function(...messages) {
		messagesReceived = messages
	},
	info: function(...messages) {
		messagesReceived = messages
	},
}


sl = new StreamLogger(simpleLogger)
testStream = new Stream.Duplex(
	{
		write: function (chunk, encoding, next) {
			next();
		},
		read: function() {
		},
	}
)

// testStream._write = (chunk, toto, next) => {
// 	next()
// }
sl.on("data", (message) => {

	datasToTest.push(message.toString())
})

sl
.pipe(testStream)

datasToTest = []
messagesReceived = []

sl.info('test 1', 'test 2')
// console.log(sl.writable)
// console.log(testStream.readable)
setTimeout(() => {
	console.log(datasToTest)
	console.log(messagesReceived)
}, 1000)

