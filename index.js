const { ipcRenderer, remote } = require("electron");
const editor = document.getElementById("editor");
const myModeSpec = require("./spec-mode/index");
let myEditor;
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
    <textarea name="" id="textArea"></textarea>
  `;
    document.getElementById("editor").appendChild(div);
    document.title = "Untitled";
    addSaveStateListener();
  }
});
function addSaveStateListener() {
  const textArea = document.getElementById("textArea");
  textArea.addEventListener("keydown", logKey => {
    console.log("keydown");
    const oldTitle = document.title;
    if (oldTitle.split(" ")[0] !== "*") {
      document.title = "* " + oldTitle;
    }
  });
}

ipcRenderer.on("file-open", (event, args) => {
  if (args) {
    const textArea = document.getElementById("textArea");
    if (textArea) {
      textArea.parentNode.removeChild(textArea);
    }
    document.title = args.filePath.split("/").pop();
    const div = document.createElement("div");
    div.id = "text-editor";
    div.innerHTML = `<textarea class="codemirror-textarea" name=${args.filePath} id="textArea">${args.text}</textarea>`;

    document.getElementById("editor").appendChild(div);

    document.getElementById("textArea").value = args.text;
    document.getElementById("textArea").name = args.filePath;

    addSaveStateListener();

    myEditor = CodeMirror.fromTextArea(document.getElementById("textArea"), {
      mode: myModeSpec(args.filePath),
      lineNumbers: true
    });
    myEditor.setSize("100%", window.screen.height * 0.9);
    myEditor.on("change", function(instance, changeObj) {
      const oldTitle = document.title;
      if (oldTitle.split(" ")[0] !== "*") {
        document.title = "* " + oldTitle;
      }
    });
  }
});

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

ipcRenderer.on("directory-open", (event, args) => {
  const navBar = document.getElementById("navbar");
  function openFileOrFolder(fileName) {
    console.log(fileName);
  }
  let pTags = "";
  for (let i = 0; i < args.filePaths.length; i++) {
    pTags += `<button key="${args.filePaths[i].path}" class="file-name ${
      args.filePaths[i].type
    }">${args.filePaths[i].path.split("/").pop()}</button></br>`;
  }
  navBar.innerHTML = pTags;
  const listDirs = document.getElementsByClassName("file-name");
  for (let i = 0; i < listDirs.length; i++) {
    listDirs[i].addEventListener("click", button => {
      console.log(button.target.innerHTML);
    });
  }
});
