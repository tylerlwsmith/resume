const path = require("path");
const fse = require("fs-extra");
const generateAssets = require("./generate-assets");
const { homepage } = require("./templates");

(async function build() {
  console.log("Clearing directory folder if it exists ...");
  fse.emptyDirSync(path.resolve(__dirname, "../build"));

  console.log("Creating directory for generated assets ...");
  fse.emptyDirSync(path.resolve(__dirname, "../build/generated"));
  fse.copySync(
    path.resolve(__dirname, "../public"),
    path.resolve(__dirname, "../build")
  );

  console.log("Generating assets ...");
  await generateAssets();

  console.log("Copying rendered homepage into build directory ...");
  fse.writeFileSync(path.resolve(__dirname, "../build/index.html"), homepage());
})();
