const { ipcMain } = require("electron");
const fs = require("fs");
const loadFileContents = filePath => {
  return (fileContents = fs.readFileSync(filePath, { encoding: "utf-8" }));
};

ipcMain.on("loadFileContents", (event, arg) => {
  fileContents = loadFileContents(arg.filePath);
  event.returnValue = {
    fileContents,
    filePath: arg.filePath
  };
});
module.exports = { loadFileContents };
