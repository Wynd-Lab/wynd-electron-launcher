const fs = require("fs")

const someObject = fs.readFileSync('./.eslintrc')
module.exports = JSON.parse(someObject.toString())
