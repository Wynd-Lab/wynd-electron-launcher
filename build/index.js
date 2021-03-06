"use strict"

const builder = require("electron-builder")
const Platform = builder.Platform

// Promise is returned
builder.build({
  targets: Platform.LINUX.createTarget(),
  config: {
		buildVersion: "1.0.0",
		"appId": "eu.wynd.wyndpos",
    "productName": "wyndpos",
		"target": [
			{
				"target": "AppImage"
			}
		]

  }
})
  .then(() => {
    // handle result
  })
  .catch((error) => {
    // handle error
  })
