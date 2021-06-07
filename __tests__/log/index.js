const StreamReadable = require('stream').Readable;

const StreamLogger = require("../../src/main/helpers/stream_logger")


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


beforeAll(() => {
	sl = new StreamLogger(simpleLogger)
	testStream = new StreamReadable()
	testStream._read = () => {
	}
	testStream.on("data", (message) => {
		console.log("on data")

		datasToTest.push(message)
	})
	testStream.pipe(sl)
})

beforeEach(() => {
	datasToTest = []
	messagesReceived = []
})

describe("Stream logs", () => {
	test('adds 1 + 2 to equal 3', (done) => {
		sl.info('test 1', 'test 2')
		sl.push("toto")
		setTimeout(() => {
			console.log(datasToTest)
			console.log(messagesReceived)
			done()
		}, 1000)

	})
});
