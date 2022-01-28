const path = require("path");
const chromium = require("chrome-aws-lambda");
const puppeteer = require("puppeteer-core");
const app = require("./app");

async function generateAssets() {
  /** Set the script to crash on unhandled promise rejections. */
  process.on("unhandledRejection", (error) => {
    throw error;
  });

  /** Kill the process if it is still active after approximately thirty sec. */
  const timeout = setTimeout(function () {
    throw new Error("Process timed out after one minute.");
  }, 30_000);

  /** Wait for the server to start on a random available port. */
  const server = await new Promise(function (resolve) {
    const server = app.listen(0, function () {
      console.log(`Listening on http://localhost:${server.address().port}`);
      resolve(server);
    });
  });

  /** Set up Puppeteer, navigate to the server and generate a screenshot. */
  console.log("Launching Puppeteer");
  const executablePath =
    process.env.NODE_ENV === "development"
      ? "/usr/bin/chromium"
      : await chromium.executablePath;

  browser = await puppeteer.launch({
    headless: true,
    executablePath: executablePath,
    args: ["--no-sandbox"],
  });
  const page = await browser.newPage();

  console.log("Generating resume PDF and PNG");
  // Width must be set so we don't hit the mobile breakpoint on png.
  await page.setViewport({ width: 1056, height: 0, deviceScaleFactor: 2 });
  await page.goto(`http://localhost:${server.address().port}`, {
    waitUntil: "networkidle2",
  });

  await page.pdf({
    path: path.join(__dirname, "../build/generated/tyler-smith-resume.pdf"),
  });

  const pageBody = await page.$("body");
  pageBody.evaluate(function (el) {
    const border = document.createElement("div");
    // border.style.border = "1px solid #ccc";
    border.style.inset = "0px";
    border.style.position = "absolute";

    el.appendChild(border);
  });
  await pageBody.screenshot({
    path: path.join(__dirname, "../build/generated/tyler-smith-resume.png"),
  });

  console.log("Generating open graph PNG");
  await page.goto(
    `http://localhost:${server.address().port}/open-graph-image`,
    {
      waitUntil: "networkidle2",
    }
  );
  const openGraphImage = await page.$("#open-graph-image");
  await page.setViewport({ height: 630, width: 1200, deviceScaleFactor: 1 });
  await openGraphImage.screenshot({
    path: path.join(__dirname, "../build/generated/open-graph-image.png"),
  });

  await browser.close();

  /** Close the server. */
  console.log("Shutting down server");
  await new Promise(function (resolve) {
    server.close(() => resolve());
  });

  /** Clear the timeout to prevent Node from hanging. */
  clearTimeout(timeout);
}

module.exports = generateAssets;
