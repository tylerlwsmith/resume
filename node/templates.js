const fs = require("fs");
const path = require("path");
const ejs = require("ejs");

function homepage() {
  const commitRef = process.env.COMMIT_REF;
  const fileContent = fs
    .readFileSync(path.join(__dirname, "../templates/index.ejs"))
    .toString();
  return ejs.render(fileContent, { commitRef });
}

function openGraphImage() {
  const fileContent = fs
    .readFileSync(path.join(__dirname, "../templates/open-graph-image.ejs"))
    .toString();
  return ejs.render(fileContent);
}

module.exports = { homepage, openGraphImage };
