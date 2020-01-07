var lineReader = require("readline").createInterface({
  input: require("fs").createReadStream("insert.js")
});

lineReader.on("line", function(line) {
  console.log(line.split(" "));
  console.log("Line from file:", line, "length", line.length);
});
