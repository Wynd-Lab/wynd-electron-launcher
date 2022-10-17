const StreamReadable = require('stream').Readable;

jest.mock('electron-updater', () => {
	return {
		autoUpdater:  {
			logger: {
				emitMessages: jest.fn(function sendMail(mode, message) {
				}),
			}
		}
	}
})

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
	sl = StreamLogger(simpleLogger)
	testStream = new StreamReadable()
	testStream._read = () => {
	}
	sl.on("data", (message) => {
		datasToTest.push(message.toString())
	})
	testStream.pipe(sl)
})

beforeEach(() => {
	datasToTest = []
	messagesReceived = []
})

describe("Stream logs", () => {
	test('info: success', (done) => {
		const messagesToSend = ['test 1', 'test 2']
		sl.info(...messagesToSend)
		expect(datasToTest).toEqual([])

		expect(messagesReceived).toEqual(messagesToSend)
		setTimeout(() => {
			expect(datasToTest).toEqual([
				'{"level":"INFO","message":"test 1"}',
				'{"level":"INFO","message":"test 2"}'
			])
			expect(messagesReceived).toEqual(messagesToSend)
			done()
		}, 1000)

	})
});
