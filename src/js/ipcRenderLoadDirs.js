const { ipcRenderer } = require("electron");
const { loadFileContents } = require("./loadFileContents");
// tree view component

function loadChildNodes(dirPath) {
  let liParent = document.getElementById(dirPath);
  const ulChildNodes = document.createElement("ul");
  ulChildNodes.classList.add("nested");
  ulChildNodes.classList.add("active");

  const { files } = ipcRenderer.sendSync("load-dirs", { dirPath });
  for (let i = 0; i < files.length; i++) {
    let li = document.createElement("li");
    li.id = files[i].path;
    li.classList.add(files[i].path.split("/").length - 5);
    if (files[i].type === "folder") {
      li.classList.add("folder");
      const span = document.createElement("span");
      span.classList.add("caret");
      span.id = files[i].path;
      span.innerHTML = `<img class="icon" src="../assets/icons/png/folder.png">${files[i].name}</img>`;
      li.appendChild(span);
      span.addEventListener("click", ev => {
        const classList = [
          ...ev.target.parentElement.querySelector(".caret").classList
        ];
        if (classList.includes("caret-down")) {
          ev.target.parentElement.removeChild(
            ev.target.parentElement.querySelector(".nested")
          );
          // close caret
          ev.target.classList.toggle("caret-down");
        } else {
          ev.target.classList.toggle("caret-down");
          loadChildNodes(ev.target.id);
        }
      });
      // li.innerHTML = `<span class="caret" id=${files[i].path}>${files[i].name}</span>`;
      // li.addEventListener("click", ev => {
      //   console.log(ev);
      //   // const classList = [...ev.target.classList];
      //   const classList = [
      //     ...ev.target.parentElement.querySelector(".caret").classList
      //   ];
      //   if (classList.includes("caret-down")) {
      //     // ev.target.parentElement
      //     //   .querySelector(".nested")
      //     //   .classList.toggle("active");
      //     // Remove a list item that closed
      //     ev.target.parentElement.removeChild(
      //       ev.target.parentElement.querySelector(".nested")
      //     );
      //     // close caret
      //     ev.target.classList.toggle("caret-down");
      //   } else {
      //     ev.target.classList.toggle("caret-down");
      //     loadChildNodes(ev.target.id);
      //   }
      // });
    } else {
      li.classList.add("file");
      li.innerHTML = `<img class="icon" src="../assets/icons/png/file.png">${files[i].name}</img>`;
      li.addEventListener("click", ev => {
        loadFileContents(ev.target.id);
        console.log(ev.target.id);
      });
    }
    ulChildNodes.appendChild(li);
  }
  liParent.appendChild(ulChildNodes);
}

function ipcRendererLoadDirs() {
  const { files } = ipcRenderer.sendSync("load-dirs", {
    dirPath: ipcRenderer.sendSync("getExcPath", "ping")
  });
  const treeViewComponent = document.createElement("ul");
  treeViewComponent.id = "myUL";
  for (let i = 0; i < files.length; i++) {
    let myLi = document.createElement("li");
    myLi.id = files[i].path;
    myLi.classList.add(files[i].path.split("/").length - 5);
    if (files[i].type === "folder") {
      myLi.classList.add("folder");
      myLi.innerHTML = `<span class="caret"><img class="icon" src="../assets/icons/png/folder.png"></img>${files[i].name}</span>`;
    } else {
      myLi.classList.add("file");
      myLi.innerHTML = `<img class="icon" src="../assets/icons/png/file.png">${files[i].name}</img>`;
      myLi.addEventListener("click", ev => {
        loadFileContents(ev.target.id);
        console.log(ev.target.id);
      });
    }
    treeViewComponent.appendChild(myLi);
  }

  const explorer = document.getElementsByClassName("explorer")[0];
  explorer.appendChild(treeViewComponent);

  const toggler = document.getElementsByClassName("caret");
  for (let i = 0; i < toggler.length; i++) {
    toggler[i].addEventListener("click", function() {
      const classList = [
        ...this.parentElement.querySelector(".caret").classList
      ];
      if (classList.includes("caret-down")) {
        this.parentElement.removeChild(
          this.parentElement.querySelector(".nested")
        );
        this.classList.toggle("caret-down");
      } else {
        this.classList.toggle("caret-down");
        loadChildNodes(this.parentElement.id);
      }
    });
  }
}

module.exports = { ipcRendererLoadDirs };
