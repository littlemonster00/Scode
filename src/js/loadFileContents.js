const { ipcRenderer, remote } = require("electron");
const myModeSpec = require("../../spec-mode/index");
const { addSaveStateListener } = require("./addEventListener");

function loadFileContents(filePath) {
  const { fileContents } = ipcRenderer.sendSync("loadFileContents", {
    filePath
  });

  ipcRenderer.sendSync("queue-file-open", { path: filePath });
  const [welcome] = document.getElementsByClassName("welcome");
  if (welcome) welcome.parentNode.removeChild(welcome);
  let textArea = document.getElementById("text-editor");
  if (textArea) {
    textArea.parentNode.removeChild(textArea);
  }

  document.title = filePath.split("/").pop();
  const div = document.createElement("div");
  div.id = "text-editor";
  textArea = document.createElement("textarea");
  textArea.classList.add("codemirror-textarea");
  textArea.id = "textArea";
  textArea.name = filePath;
  textArea.value = fileContents;
  div.appendChild(textArea);
  // div.innerHTML = `<textarea class="codemirror-textarea" name=${filePath} id="textArea">${fileContents}</textarea>`;
  document.getElementsByClassName("workspace")[0].appendChild(div);

  addSaveStateListener();
  myEditor = CodeMirror.fromTextArea(document.getElementById("textArea"), {
    ...myModeSpec(filePath),
    lineNumbers: true,
    theme: "monokai"
  });
  myEditor.focus();

  let queueChanges = [];
  const doc = myEditor.getDoc();

  myEditor.on("change", function(instance, changeObj) {
    let operator = changeObj.origin;
    let lineNumber = changeObj.from.line;
    const content = doc.getLine(lineNumber);
    const indexExisted = queueChanges.findIndex(
      line => line.lineNumber === lineNumber
    );
    if (indexExisted >= 0) {
      queueChanges[indexExisted] = {
        lineNumber,
        content,
        origin: changeObj.origin
      };
    } else {
      queueChanges.push({
        lineNumber,
        content,
        origin: changeObj.origin
      });
    }
    console.log(changeObj);
    const oldTitle = document.title;
    if (oldTitle.split(" ")[0] !== "*") {
      document.title = "* " + oldTitle + "- Scabin";
    }
  });
  ipcRenderer.on("save-file", (event, args) => {
    ipcRenderer.sendSync("queue-changes", { queueChanges });
    queueChanges = [];
  });
}

module.exports = { loadFileContents };
