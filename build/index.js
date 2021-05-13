"use strict"

const builder = require("electron-builder")
const Platform = builder.Platform

// Promise is returned
builder.build({
  targets: Platform.LINUX.createTarget(),
  config: {
		"appId": "eu.wynd.wynpos",
    "productName": "wynpos",
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
