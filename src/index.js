const { ipcRenderer, remote } = require("electron");
const { ipcRendererOnNewFile } = require("./js/ipcRenderOnNewFile");
const { ipcRendererOnSaveFile } = require("./js/ipcRendererOnSaveFile");
const { ipcRendererOnOpenFile } = require("./js/ipcRendererOnOpenFile");

class ScodeEditor {
  constructor() {
    this.editor;
    this.ipcRendererOnNewFile = function() {
      ipcRendererOnNewFile();
    };
    this.ipcRendererOnSaveFile = function() {
      ipcRendererOnSaveFile();
    };
    this.ipcRendererOnOpenFile = function() {
      ipcRendererOnOpenFile();
    };
  }
}
let sEditor = new ScodeEditor();
sEditor.ipcRendererOnNewFile();
sEditor.ipcRendererOnSaveFile();
sEditor.ipcRendererOnOpenFile();

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
