const { ipcRenderer, remote } = require("electron");
const myModeSpec = require("../../spec-mode/index");
const { addSaveStateListener } = require("./addEventListener");
