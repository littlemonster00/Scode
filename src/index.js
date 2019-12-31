const { ipcRenderer, remote } = require("electron");
const editor = document.getElementById("editor");
const myModeSpec = require("../spec-mode/index");
let myEditor;

ipcRenderer.on("new-file", (event, args) => {
  if (args) {
    const [welcome] = document.getElementsByClassName("welcome");
    if (welcome) welcome.parentNode.removeChild(welcome);
    const textArea = document.getElementById("textArea");
    if (textArea) {
      textArea.parentNode.removeChild(textArea);
    }

    const div = document.createElement("div");
    div.id = "text-editor";
    div.innerHTML = `<textarea class="codemirror-textarea" name="" id="textArea"></textarea>`;
    document.getElementById("editor").appendChild(div);

    document.getElementById("textArea").value = args.text;

    addSaveStateListener();

    myEditor = CodeMirror.fromTextArea(document.getElementById("textArea"), {
      lineNumbers: true
    });
    // myEditor.setSize("100%", "100%");
    myEditor.on("change", function(instance, changeObj) {
      const oldTitle = document.title;
      if (oldTitle.split(" ")[0] !== "*") {
        document.title = "* " + oldTitle + "- Scabin";
      }
    });
    document.title = "Untitled";
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
    const [welcome] = document.getElementsByClassName("welcome");
    if (welcome) welcome.parentNode.removeChild(welcome);
    const textArea = document.getElementById("textArea");
    if (textArea) {
      textArea.parentNode.removeChild(textArea);
    }

    document.title = args.filePath.split("/").pop();
    const div = document.createElement("div");
    div.id = "text-editor";
    const dataText = args.text.normalize("NFD");
    div.innerHTML = `<textarea class="codemirror-textarea" name=${args.filePath} id="textArea">${dataText}</textarea>`;

    document.getElementById("editor").appendChild(div);

    document.getElementById("textArea").value = args.text;
    document.getElementById("textArea").name = args.filePath;

    addSaveStateListener();
    myEditor = CodeMirror.fromTextArea(document.getElementById("textArea"), {
      ...myModeSpec(args.filePath),
      lineNumbers: true
    });
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

function openDir(parent, dirPath) {
  const { dirPaths } = ipcRenderer.sendSync("openDir", { dirPath });
  if (!dirPaths.length) return;
  let elements = [];
  for (let i = 0; i < dirPaths.length; i++) {
    const node = document.createElement("div");
    node.classList.add("file-name");
    node.classList.add(dirPaths[i].type);

    node.innerHTML = dirPaths[i].path.split("/").pop();

    node.addEventListener("click", div => {
      const target = div.target || div.srcElement;
      const className =
        target.getAttribute("class") || target.getAttribute("className");
      if (className.split(" ").includes("dir")) {
        console.log(div);
        const elements = openDir(
          document.getElementById(div.target.id),
          div.target.id
        );
      } else {
        return;
      }
    });
    elements.push(node);
  }
  for (let i = 0; i < elements.length; i++) {
    parent.appendChild(elements[i]);
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
  for (let i = 0; i < listDirs.length; i++) {
    listDirs[i].addEventListener("click", div => {
      openDir(listDirs[i], div.target.id);
    });
  }
});
