const { BrowserWindow, Menu, app, shell, dialog } = require("electron");
const electron = require("electron");
const { ipcMain } = require("electron");
const path = require("path");
const url = require("url");
const fs = require("fs");
const { openDir } = require("../system/opendir");
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
          const [filePath] = dialog.showOpenDialogSync(focusedWindow, {
            defaultPath: "."
          });
          const text = fs.readFileSync(filePath, { encoding: "utf-8" });
          focusedWindow.webContents.send("file-open", {
            text,
            filePath
          });
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
    label: "Open Folder",
    accelerator: process.platform == "darwin" ? "Command+K" : "Ctrl+K",
    click(event, focusedWindow) {
      const dirPaths = openDir(path.join(__dirname, "../../"));
      // Load file from current dicrectory
      focusedWindow.webContents.send("open-folder", {
        dirPaths
      });
    }
  }
  /*  {
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
  }*/
];

ipcMain.on("file-saved", (event, args) => {
  try {
    let filePath;
    if (!args.filePath) {
      filePath = dialog.showSaveDialogSync(args.win);
    } else {
      filePath = args.filePath;
    }
    fs.writeFileSync(filePath, args.text, "utf-8");
    event.returnValue = {
      filePath,
      fileName: filePath.split("/").pop()
    };
  } catch (e) {
    console.log("Failed to save the file !");
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
