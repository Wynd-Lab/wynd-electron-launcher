import React from "react";
import ReactDOM from "react-dom";

import { Theme } from "react-antd-cssvars";

import { ipcRenderer } from "electron";

import App from "./App";

import "./index.less";
import { ICustomWindow } from "../helpers/interface";
import computeTheme from "../helpers/compute_theme";

declare let window: ICustomWindow;

window.theme = new Theme(undefined, computeTheme());

ipcRenderer.send("ready", "loader");

ReactDOM.render(
  <React.Fragment>
    <App />
  </React.Fragment>,
  document.getElementById("root")
);

// win.fullscreen = true

// process.on('SIGTERM', () => {
// 	closeApp(win, child)
// })
