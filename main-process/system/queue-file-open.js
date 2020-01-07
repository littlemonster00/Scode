const { ipcMain } = require("electron");

let queueFileOpen = [];
ipcMain.on("queue-file-open", (event, args) => {
  queueFileOpen.push({ ...args });
  console.log(queueFileOpen);
  event.returnValue = "pong";
});
