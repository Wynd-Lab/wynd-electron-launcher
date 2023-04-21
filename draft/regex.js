const data = "%%_APP_URL_%%"
const envRegex = new RegExp(/%%_(.+)_%%/)
const result = envRegex.exec(data)

if (result && result[1] && process.env[result[1]]) {
	console.log("je passe par la")

}
