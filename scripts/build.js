const path = require("path");
const fse = require("fs-extra");
const generateAssets = require("./generate-assets");
const { homepage } = require("./templates");

(async function build() {
  console.log("Clearing directory folder if it exists ...");
  fse.emptyDirSync(path.join(__dirname, "../build"));

  console.log("Creating directory for generated assets ...");
  fse.emptyDirSync(path.join(__dirname, "../build/generated"));
  fse.copySync(
    path.join(__dirname, "../assets"),
    path.join(__dirname, "../build")
  );

  console.log("Generating assets ...");
  await generateAssets();

  console.log("Copying rendered homepage into build directory ...");
  fse.writeFileSync(path.join(__dirname, "../build/index.html"), homepage());
})();
