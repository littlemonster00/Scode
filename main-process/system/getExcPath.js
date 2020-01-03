const { ipcMain } = require("electron");
ipcMain.on("getExcPath", (event, args) => {
  event.returnValue = process.argv.pop();
});
