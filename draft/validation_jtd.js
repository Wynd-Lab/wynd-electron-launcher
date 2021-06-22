const Ajv = require("ajv/dist/jtd")
const ajv = new Ajv.default({coerceTypes: true}) // options can be passed, e.g. {allErrors: true}

const schema = {
  properties: {
    foo: {
			allOf: [
				{type: "boolean"},
				{type: "string"}
			]
		}
  },
  optionalProperties: {
    bar: {type: "string"}
  }
}


const data = {
  foo: "1",
  bar: "abc"
}

// const serialize = ajv.compileSerializer(schema)
// console.log(serialize(data))

const parse = ajv.compileParser(schema)


const json = '{"foo": 1, "bar": "abc"}'
// const invalidJson = '{"unknown": "abc"}'

console.log(parseAndLog(json)) // logs {foo: 1, bar: "abc"}
// console.log(parseAndLog(invalidJson)) // logs error and position

function parseAndLog(json) {
  const data = parse(json)
	console.log(data)
  if (data === undefined) {
    // console.log(parse.message) // error message from the last parse call
    // console.log(parse.position) // error position in string
  } else {
    console.log(data)
  }
}
