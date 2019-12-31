const { ipcRenderer, remote } = require("electron");

function ipcRendererOnSaveFile() {
  ipcRenderer.on("save-file", (event, args) => {
    if (args) {
      const textArea = document.getElementById("textArea");
      const text = myEditor.getValue();
      const reply = ipcRenderer.sendSync("file-saved", {
        text,
        win: remote.getCurrentWindow(),
        filePath: textArea.name
      });
      if (reply.filePath) {
        textArea.setAttribute("name", reply.filePath);
        document.title = reply.fileName + " - " + "scabin";
      }
    }
  });
}

module.exports = { ipcRendererOnSaveFile };
