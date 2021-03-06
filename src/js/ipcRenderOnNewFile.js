const { ipcRenderer } = require("electron");
const { addSaveStateListener } = require("./addEventListener");

function ipcRendererOnNewFile() {
  ipcRenderer.on("new-file", (event, args) => {
    if (args) {
      const [welcome] = document.getElementsByClassName("welcome");
      if (welcome) welcome.parentNode.removeChild(welcome);
      const textArea = document.getElementById("text-editor");
      if (textArea) {
        textArea.parentNode.removeChild(textArea);
      }

      const div = document.createElement("div");
      div.id = "text-editor";
      div.innerHTML = `<textarea class="codemirror-textarea" name="" id="textArea"></textarea>`;
      document.getElementsByClassName("workspace")[0].appendChild(div);

      // document.getElementById("textArea").value = args.text;

      addSaveStateListener();

      myEditor = CodeMirror.fromTextArea(document.getElementById("textArea"), {
        lineNumbers: true,
        theme: "monokai"
      });
      // myEditor.setSize("100%", "100%");
      myEditor.focus();
      myEditor.on("change", function(instance, changeObj) {
        const oldTitle = document.title;
        if (oldTitle.split(" ")[0] !== "*") {
          document.title = "* " + oldTitle + "- Scabin";
        }
      });
      document.title = "Untitled";
    }
  });
}

module.exports = {
  ipcRendererOnNewFile
};
