function myModeSpec(filePath) {
  const extFile = filePath
    .split("/")
    .pop()
    .split(".")
    .pop();

  let myModeSpec;
  if (extFile === "js") {
    myModeSpec = {
      mode: "javascript"
    };
  } else if (extFile === "html") {
    myModeSpec = {
      mode: "htmlmixed"
    };
  } else if (extFile === "css") {
    myModeSpec = {
      mode: "css"
    };
  } else if (extFile === "json") {
    myModeSpec = {
      matchBrackets: true,
      autoCloseBrackets: true,
      mode: "application/ld+json",
      lineWrapping: true
    };
  }
  return myModeSpec;
}
module.exports = myModeSpec;
