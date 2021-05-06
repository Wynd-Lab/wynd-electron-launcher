const getConfig = require("./get_config")

module.exports =  async function initialize(params, callback) {

	const conf = await getConfig(params.conf)
	console.log(conf)
	if (callback) {
		callback('GET_CONF', conf)
	}
}
