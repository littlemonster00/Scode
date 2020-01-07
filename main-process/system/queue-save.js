const { ipcMain } = require("electron");

let queueSave = [];
ipcMain.on("queue-save", (event, args) => {
  queueSave.push({ ...args });
  event.returnValue = "pong";
});

ipcMain.on("file-saved", (event, args) => {
  queueSave = queueSave.sort((e1, e2) => {
    if (e1.from.line > e2.from.line) return 1;
    if (e1.from.line < e2.from.line) return -1;
    return 0;
  });
  console.log(queueSave);
});
