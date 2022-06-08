const CustomError = require('../../helpers/custom_error')

module.exports =  function requestWPT(socket, request, delay) {
	return new Promise((resolve, reject) => {

		let timeout = setTimeout(() => {
			timeout = null
			socket.removeEventListener(error_event, callbackError)
			socket.removeEventListener(response_event, callbackResponse)
			reject(new CustomError(500, CustomError.CODE.WPT_TIMEOUT, ``))
		}, 1000 * (delay || 3))

		const emit_event = request.emit
		const response_event = request.response || emit_event
		const error_event = request.error || `${emit_event}.error`

		const innerClearTimeout = () => {
			if (timeout) {
				clearTimeout(timeout)
				timeout = null
			}
		}

		const callbackResponse = (data) => {
			// console.log('response', data)
			innerClearTimeout()
			// socket.removeEventListener
			// socket.removeListener
			socket.removeEventListener(error_event, callbackError)
			resolve(data)
		}

		const callbackError = (err) => {
			innerClearTimeout()
			socket.removeEventListener(response_event, callbackResponse)
			reject(err)
		}

		socket.once(error_event, callbackError)
		socket.once(response_event, callbackResponse)
		if (request.datas && Array.isArray(request.datas)) {
			socket.emit(emit_event, ...request.datas)
		} else if (request.datas) {
			socket.emit(emit_event, request.datas)
		} else {
			socket.emit(emit_event)
		}
	})
}
