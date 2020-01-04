const { ipcMain } = require("electron");
const remote = require("electron").remote;

const path = require("path");
const excPath = process.argv[2] || ".";
ipcMain.on("getExcPath", (event, args) => {
  event.returnValue = process.argv[2] || excPath;
});
