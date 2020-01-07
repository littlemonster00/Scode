const { ipcMain } = require("electron");
const fs = require("fs");

const loadFileContents = filePath => {
  return (fileContents = fs.readFileSync(filePath, { encoding: "utf-8" }));
};

ipcMain.on("loadFileContents", (event, args) => {
  fileContents = loadFileContents(args.filePath);
  event.returnValue = {
    fileContents,
    filePath: args.filePath
  };
});
module.exports = { loadFileContents };