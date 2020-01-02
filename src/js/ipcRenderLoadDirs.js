const { ipcRenderer } = require("electron");

// tree view component

function loadChildNodes(dirPath) {
  let liParent = document.getElementById(dirPath);
  const ulChildNodes = document.createElement("ul");
  ulChildNodes.id = "nested";
  const { files } = ipcRenderer.sendSync("load-dirs", { dirPath });
  for (let i = 0; i < files.length; i++) {
    let li = document.createElement("li");
    li.id = files[i].path;
    li.classList.add(files[i].path.split("/").length - 5);
    if (files[i].type === "folder") {
      li.classList.add("folder");
      li.innerHTML = `<span class="caret" id=${files[i].path}>${files[i].name}</span>`;
      li.addEventListener("click", ev => {
        const classList = [...ev.target.classList];
        if (classList.includes("caret-down")) {
          const parentNode = ev.target.parentElement;
        } else {
          ev.target.classList.toggle("caret-down");
          loadChildNodes(ev.target.id);
        }
      });
    } else {
      li.classList.add("file");
      li.innerHTML = files[i].name;
    }
    ulChildNodes.appendChild(li);
  }
  liParent.appendChild(ulChildNodes);
}

function ipcRendererLoadDirs() {
  const { files } = ipcRenderer.sendSync("load-dirs", {
    dirPath: "/home/lqs/coding/scabin"
  });
  const treeViewComponent = document.createElement("ul");
  treeViewComponent.id = "myUL";
  for (let i = 0; i < files.length; i++) {
    let myLi = document.createElement("li");
    myLi.id = files[i].path;
    myLi.classList.add(files[i].path.split("/").length - 5);
    if (files[i].type === "folder") {
      myLi.classList.add("folder");
      myLi.innerHTML = `<span class="caret">${files[i].name}</span>`;
    } else {
      myLi.classList.add("file");
      myLi.innerHTML = files[i].name;
    }
    treeViewComponent.appendChild(myLi);
  }

  const explorer = document.getElementsByClassName("explorer")[0];
  explorer.appendChild(treeViewComponent);

  const toggler = document.getElementsByClassName("caret");
  for (let i = 0; i < toggler.length; i++) {
    toggler[i].addEventListener("click", function() {
      console.log(this.parentElement);
      const classList = [...this.parentElement.classList];
      if (classList.includes("caret-down")) {
      } else {
        this.classList.toggle("caret-down");
        loadChildNodes(this.parentElement.id);
      }
    });
  }
}

module.exports = { ipcRendererLoadDirs };
