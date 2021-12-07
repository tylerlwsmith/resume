const path = require("path");
const express = require("express");
const livereload = require("livereload");
const connectLivereload = require("connect-livereload");

const { homepage, openGraphImage } = require("./templates");
const app = express();

// Open livereload and watch for changes
const liveReloadServer = livereload.createServer({
  port: process.env.LIVERELOAD_PORT || 35729,
  exts: ["css", "js", "ejs"],
});
liveReloadServer.watch([path.join(__dirname, "../public")]);

// Ping browser on server boot once browser has reconnected
liveReloadServer.server.once("connection", () => {
  setTimeout(() => {
    liveReloadServer.refresh("/");
  }, 100);
});

app.use(connectLivereload({}));

app.get("/", function (req, res) {
  res.send(homepage());
});

app.get("/open-graph-image", function (req, res) {
  res.send(openGraphImage());
});

app.use(express.static(path.join(__dirname, "../public")));
app.use(express.static(path.join(__dirname, "../build")));

module.exports = app;
