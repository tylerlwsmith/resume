const fs = require("fs");
const path = require("path");
const fse = require("fs-extra");
const generateAssets = require("./generate-assets");
const { homepage } = require("./templates");

(function build() {
  fse.emptyDirSync(path.resolve(__dirname, "../build"));
  fse.emptyDirSync(path.resolve(__dirname, "../build/generated"));
  fse.copySync(
    path.resolve(__dirname, "../public"),
    path.resolve(__dirname, "../build")
  );
  generateAssets();

  fs.writeFileSync(path.resolve(__dirname, "../build/index.html"), homepage());
})();
