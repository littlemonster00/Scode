function myModeSpec(filePath) {
  const extFile = filePath
    .split("/")
    .pop()
    .split(".")
    .pop();

  let myModeSpec;
  if (extFile === "js") {
    myModeSpec = {
      name: "javascript",
      json: true
    };
  } else if (extFile === "html") {
    myModeSpec = {
      name: "htmlmixed"
    };
  } else if (extFile === "css") {
    myModeSpec = {
      name: "css"
    };
  }
  return myModeSpec;
}
module.exports = myModeSpec;
