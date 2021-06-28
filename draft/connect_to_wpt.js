const connectToWpt = require("../src/main/helpers/connect_to_wpt")

const callback = (event, data) => {
	console.log(event, data)
}

connectToWpt("http://localhost:9963", callback)
.then((socket) => {
	socket.close()
	return connectToWpt("http://localhost:9963", callback)
})
.then((socket) => {
	socket.close()
})
