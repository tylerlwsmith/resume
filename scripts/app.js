const path = require("path");
const express = require("express");
const cors = require("cors");
const livereload = require("livereload");
const connectLivereload = require("connect-livereload");

const { homepage, openGraphImage, embed } = require("./templates");
const app = express();

app.use(cors());

if (process.env.ENABLE_LIVERELOAD === "1") {
  /** Open livereload and watch for changes. */
  const liveReloadServer = livereload.createServer({
    port: process.env.LIVERELOAD_PORT || 35729,
    exts: ["css", "js", "ejs"],
  });
  liveReloadServer.watch([
    path.join(__dirname, "../assets"),
    path.join(__dirname, "../templates"),
  ]);

  /** Ping browser on server boot once browser has reconnected. */
  liveReloadServer.server.once("connection", () => {
    setTimeout(() => {
      liveReloadServer.refresh("/");
    }, 100);
  });

  app.use(connectLivereload());
}

app.get("/", function (_req, res) {
  res.send(homepage());
});

app.get("/open-graph-image", function (_req, res) {
  res.send(openGraphImage());
});

app.get("/embed", function (_req, res) {
  res.send(embed());
});

app.use(express.static(path.join(__dirname, "../assets")));
app.use(express.static(path.join(__dirname, "../build")));

module.exports = app;
