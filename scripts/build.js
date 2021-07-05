
const yargs = require('yargs/yargs')
const { hideBin } = require('yargs/helpers')
const builder = require("electron-builder")

const package = require('../package.json')

const argv = yargs(hideBin(process.argv))
  .option('app_name', {
    alias: 'n',
    type: 'string',
    description: 'name of the application',
		default: process.env.APP_NAME || package.productName

  })
	.option('id', {
    alias: 'i',
    type: 'string',
    description: 'name of the application',
		default: process.env.APP_ID

  })
	.option('app_version', {
    alias: 'V',
    type: 'string',
    description: 'version of the application',
		default: process.env.APP_VERSION || package.productName
  })
  .argv;


const Platform = builder.Platform
// Promise is returned
builder.build({
  // targets: Platform.LINUX.createTarget(),
  config: {
		buildVersion: argv.app_version,
		"appId": argv.appId || `eu.wynd.${argv.name}`,
    "productName": argv.app_name
  }
})
