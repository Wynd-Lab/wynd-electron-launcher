const StreamReadable = require('stream').Readable;

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
testStream = new StreamReadable()
testStream._read = () => {
}
testStream.on("data", (message) => {
console.log("on data")

datasToTest.push(message)
})
sl.pipe(process.stdout)

datasToTest = []
messagesReceived = []

sl.info('test 1', 'test 2')
// console.log(sl.writable)
// console.log(testStream.readable)
// setTimeout(() => {
// 	console.log(datasToTest)
// 	console.log(messagesReceived)
// }, 1000)

