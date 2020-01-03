const { BrowserWindow, Menu, app, shell, dialog } = require("electron");
const electron = require("electron");
const { ipcMain } = require("electron");
const path = require("path");
const url = require("url");
const fs = require("fs");
const { openDir } = require("../system/opendir");

const loadDirs = dirPath => {
  try {
    filesName = fs.readdirSync(dirPath, { encoding: "utf-8" });
    const files = filesName.map(fileName => {
      let file = {};
      let pathFile = path.join(dirPath, fileName);
      file.path = pathFile;
      file.name = pathFile.split("/").pop();
      fs.existsSync(pathFile) && fs.statSync(pathFile).isDirectory()
        ? (file.type = "folder")
        : (file.dir = "file");
      return file;
    });
    return files;
  } catch (error) {
    console.log(error);
    return error;
  }
};

ipcMain.on("load-dirs", (event, args) => {
  if (args) {
    const files = loadDirs(args.dirPath);
    if (!files.length) {
      event.returnValue = { error: files };
    } else {
      event.returnValue = { files };
    }
  }
});
