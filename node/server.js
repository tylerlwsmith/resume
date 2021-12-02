const app = require("./app");
const generateAssets = require("./generate-assets");

const server = app.listen(process.env.PORT || 3000, function () {
  console.log(`Listening on http://localhost:${server.address().port}`);
  generateAssets();
});
