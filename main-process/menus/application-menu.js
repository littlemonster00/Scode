const { BrowserWindow, Menu, app, shell, dialog } = require("electron");
const electron = require("electron");
const { ipcMain } = require("electron");
const path = require("path");
const url = require("url");
const fs = require("fs");
const { openDir } = require("../system/opendir");

const { currentWindowsIsopened } = require("../../main");
const mainMenuTemplate = [
  {
    label: "File",
    submenu: [
      {
        label: "New File",
        accelerator: process.platform == "darwin" ? "Command+N" : "Ctrl+N",
        click: (item, focusedWindow) => {
          focusedWindow.webContents.send("new-file", "create");
        }
      },
      {
        label: "Open File",
        accelerator: process.platform == "darwin" ? "Command+O" : "Ctrl+O",
        click(item, focusedWindow) {
          const filePaths = dialog.showOpenDialogSync(
            BrowserWindow.getFocusedWindow(),
            {
              defaultPath: "."
            }
          );

          // This only allows opening one file at this time
          const filePath = filePaths ? filePaths[0] : undefined;
          if (filePath) {
            const text = fs.readFileSync(filePath, { encoding: "utf-8" });
            currentWindowsIsopened.push({
              path: filePath
            });
            focusedWindow.webContents.send("file-open", {
              text,
              filePath
            });
          } else {
            focusedWindow.webContents.send("file-open", {
              text: undefined,
              filePath: undefined
            });
          }
        }
      },
      {
        label: "Save",
        accelerator: process.platform == "darwin" ? "Command+S" : "Ctrl+S",
        click(item, focusedWindow) {
          focusedWindow.webContents.send("save-file", "save");
        }
      },
      {
        label: "Save As..."
      },
      {
        label: "Quit",
        accelerator: process.platform == "darwin" ? "Command+Q" : "Ctrl+Q",
        click() {
          app.quit();
        }
      }
    ]
  },
  {
    label: "Edit"
  },
  {
    label: "Selection"
  },
  {
    label: "View"
  },
  {
    label: "Go"
  },
  {
    label: "Debug"
  },
  {
    label: "Termial"
  },
  {
    label: "Help"
  }
];

ipcMain.on("file-saved", (event, args) => {
  try {
    let filePath;
    if (!args.filePath) {
      filePath = dialog.showSaveDialogSync(BrowserWindow.getFocusedWindow());
    } else {
      filePath = args.filePath;
    }
    if (filePath) {
      fs.writeFileSync(filePath, args.text, "utf-8");
      event.returnValue = {
        filePath,
        fileName: filePath.split("/").pop()
      };
    } else {
      event.returnValue = {
        filePath: undefined,
        fileName: undefined
      };
    }
  } catch (e) {
    console.log("Failed to save the file !", e);
  }
});

if (process.env.NODE_ENV != "production") {
  mainMenuTemplate.push({
    label: "Developer Tool",
    submenu: [
      {
        label: "Toggle DevTools",
        accelerator: process.platform == "darwin" ? "Command+I" : "Ctrl+I",
        click(item, focusedWindow) {
          focusedWindow.toggleDevTools();
        }
      },
      {
        role: "reload"
      }
    ]
  });
}
function findReopenMenuItem() {
  const menu = Menu.getApplicationMenu();
  if (!menu) return;

  let reopenMenuItem;
  menu.items.forEach(item => {
    if (item.submenu) {
      item.submenu.items.forEach(item => {
        if (item.key === "reopenMenuItem") {
          reopenMenuItem = item;
        }
      });
    }
  });
  return reopenMenuItem;
}

app.on("ready", () => {
  const menu = Menu.buildFromTemplate(mainMenuTemplate);
  Menu.setApplicationMenu(menu);
});

app.on("browser-window-created", () => {
  let reopenMenuItem = findReopenMenuItem();
  if (reopenMenuItem) reopenMenuItem.enabled = false;
});

app.on("window-all-closed", () => {
  let reopenMenuItem = findReopenMenuItem();
  if (reopenMenuItem) reopenMenuItem.enabled = true;
});
