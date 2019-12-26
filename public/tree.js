const data = {
  "/root": {
    path: "/root",
    type: "folder",
    isRoot: true,
    children: ["/root/david", "/root/jslancer"]
  },
  "/root/david": {
    path: "/root/david",
    type: "folder",
    children: ["/root/david/readme.md"]
  },
  "/root/david/readme.md": {
    path: "/root/david/readme.md",
    type: "file",
    content: "Thanks for reading me me. But there is nothing here."
  },
  "/root/jslancer": {
    path: "/root/jslancer",
    type: "folder",
    children: ["/root/jslancer/projects", "/root/jslancer/vblogs"]
  },
  "/root/jslancer/projects": {
    path: "/root/jslancer/projects",
    type: "folder",
    children: ["/root/jslancer/projects/treeview"]
  },
  "/root/jslancer/projects/treeview": {
    path: "/root/jslancer/projects/treeview",
    type: "folder",
    children: []
  },
  "/root/jslancer/vblogs": {
    path: "/root/jslancer/vblogs",
    type: "folder",
    children: []
  }
};

var toggler = document.getElementsByClassName("caret");
var i;

for (i = 0; i < toggler.length; i++) {
  toggler[i].addEventListener("click", function() {
    this.parentElement.querySelector(".nested").classList.toggle("active");
    this.classList.toggle("caret-down");
  });
}

const xxx = "hello";
