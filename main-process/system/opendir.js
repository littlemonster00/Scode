const { BrowserWindow, Menu, app, shell, dialog } = require("electron");
const electron = require("electron");
const { ipcMain } = require("electron");
const path = require("path");
const url = require("url");
const fs = require("fs");

const openDir = dirPath => {
  if (!fs.existsSync(dirPath)) {
    return [];
  }
  const dirs = fs.readdirSync(dirPath);
  const paths = [];
  for (let i = 0; i < dirs.length; i++) {
    paths.push({
      path: path.join(dirPath, dirs[i]),
      type:
        fs.existsSync(path.join(dirPath, dirs[i])) &&
        fs.lstatSync(path.join(dirPath, dirs[i])).isDirectory()
          ? "dir"
          : "file"
    });
  }
  return paths;
};

ipcMain.on("openDir", (event, args) => {
  const dirPath = args.dirPath;
  const paths = openDir(dirPath);
  event.returnValue = {
    dirPaths: paths
  };
});

module.exports = { openDir };
