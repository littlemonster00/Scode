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
        document.title = "* " + oldTitle + "- Scabin";
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

function openDir(dirPath) {
  const { dirPaths } = ipcRenderer.sendSync("openDir", { dirPath });
  // if (!dirPaths.length) return;
  let elements = [];
  for (let i = 0; i < dirPaths.length; i++) {
    const node = document.createElement("div");
    node.addEventListener("click", event => {
      const target = div.target || div.srcElement;
      const className =
        target.getAttribute("class") || target.getAttribute("className");
      if (className.split(" ").includes("dir")) {
        const elements = openDir(div.target.id);
        for (let j = 0; j < elements.length; j++) {
          listDirs[i].appendChild(elements[j]);
        }
      }
    });
    node.innerHTML = dirPaths[i].path.split("/").pop();
    elements.push(node);
  }
  return elements;
}

ipcRenderer.on("open-folder", (event, args) => {
  const navBar = document.getElementById("navbar");
  // give a dirPath that just return from main process on directory-open event
  let dirPaths = args.dirPaths;
  let element = "";
  for (let i = 0; i < dirPaths.length; i++) {
    element += `<div id="${dirPaths[i].path}" class="file-name ${
      dirPaths[i].type
    }">${dirPaths[i].path.split("/").pop()}</div>`;
  }
  navBar.innerHTML = element;
  let listDirs = document.getElementsByClassName("file-name");
  console.log(listDirs);

  for (let i = 0; i < listDirs.length; i++) {
    listDirs[i].addEventListener("click", div => {
      openDir(listDirs[i].path);
    });
  }
});
