const app = require("./app");

const server = app.listen(process.env.PORT || 3000, function () {
  console.log(`Listening on http://localhost:${server.address().port}`);
});
