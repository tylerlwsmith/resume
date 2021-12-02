const path = require("path");
const express = require("express");
const { homepage, openGraphImage } = require("./templates");
const app = express();

app.get("/", function (req, res) {
  res.send(homepage());
});

app.get("/open-graph-image", function (req, res) {
  res.send(openGraphImage());
});

app.use(express.static(path.join(__dirname, "../public")));
app.use(express.static(path.join(__dirname, "../build")));

module.exports = app;
