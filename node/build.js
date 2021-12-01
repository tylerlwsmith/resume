const path = require("path");
const chromium = require("chrome-aws-lambda");
const puppeteer = require("puppeteer-core");
const app = require("./app");

(async function build() {
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

  browser = await chromium.puppeteer.launch({
    headless: true,
    executablePath: executablePath,
    args: ["--no-sandbox"],
  });

  console.log("Generating screenshot");
  const page = await browser.newPage();
  await page.goto(`http://localhost:${server.address().port}/open-graph`);
  await page.setViewport({ width: 1200, height: 630 });
  await page.screenshot({
    path: path.resolve(__dirname, "../public/generated/og-image.png"),
    fullPage: true,
  });
  await browser.close();

  /** Close the server. */
  console.log("Shutting down server");
  await new Promise(function (resolve) {
    server.close(() => resolve());
  });

  /** Clear the timeout to prevent Node from hanging. */
  clearTimeout(timeout);

  /** Exit the app. */
  process.exit(0);
})();
