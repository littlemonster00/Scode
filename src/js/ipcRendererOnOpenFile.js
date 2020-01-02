const { ipcRenderer, remote } = require("electron");
const myModeSpec = require("../../spec-mode/index");
const { addSaveStateListener } = require("./addEventListener");

function ipcRendererOnOpenFile() {
  ipcRenderer.on("file-open", (event, args) => {
    if (args.text && args.filePath) {
      const [welcome] = document.getElementsByClassName("welcome");
      if (welcome) welcome.parentNode.removeChild(welcome);
      const textArea = document.getElementById("text-editor");
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
        lineNumbers: true,
        theme: "monokai"
      });
      myEditor.focus();
      myEditor.on("change", function(instance, changeObj) {
        const oldTitle = document.title;
        if (oldTitle.split(" ")[0] !== "*") {
          document.title = "* " + oldTitle + "- Scabin";
        }
      });
    }
  });
}

module.exports = { ipcRendererOnOpenFile };
