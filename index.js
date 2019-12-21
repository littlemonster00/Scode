const { ipcRenderer, remote } = require("electron");
const editor = document.getElementById("editor");
ipcRenderer.on("new-file", (event, args) => {
  const textArea = document.getElementById("text-editor");
  if (textArea) {
    if (document.title.split(" ")[0] === "*") {
      alert("Please save this file before open new windows");
      return;
    }
    textArea.parentNode.removeChild(textArea);
  }
  if (args) {
    const div = document.createElement("div");
    div.id = "text-editor";
    div.innerHTML = `
    <textarea name="" id="textArea" cols="120" rows="40"></textarea>
  `;
    document.getElementById("editor").appendChild(div);
    document.title = "Untitled";
    addSaveStateListener();
  }
});
function addSaveStateListener() {
  const textArea = document.getElementById("textArea");
  textArea.addEventListener("keydown", logKey => {
    const oldTitle = document.title;
    if (oldTitle.split(" ")[0] !== "*") {
      document.title = "* " + oldTitle;
    }
  });
}
ipcRenderer.on("save-file", (event, args) => {
  if (args) {
    const textArea = document.getElementById("textArea");
    const reply = ipcRenderer.sendSync("file-saved", {
      text: textArea.value,
      win: remote.getCurrentWindow(),
      filePath: textArea.name
    });
    if (reply.filePath) {
      textArea.setAttribute("name", reply.filePath);
      document.title = reply.fileName + " - " + "scabin";
    }
  }
});

ipcRenderer.on("file-open", (event, args) => {
  if (args) {
    const textArea = document.getElementById("text-editor");
    if (textArea) {
      // if (document.title.split(" ")[0] === "*") {
      //   alert("Please save this file before open new windows");
      //   return;
      // }
      textArea.parentNode.removeChild(textArea);
    }
    document.title = args.filePath.split("/").pop();
    const div = document.createElement("div");
    div.id = "text-editor";
    div.innerHTML = `<textarea name=${args.filePath} id="textArea" cols="120" rows="40">${args.text}</textarea>`;
    document.getElementById("editor").appendChild(div);
    addSaveStateListener();
  }
});
