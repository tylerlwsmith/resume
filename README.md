# Resume

This repo contains my resume, which was built using web technologies. Modern CSS is a powerful layout language that allows me to make page-wide changes much faster than I would be able to if I were using InDesign. Using web technologies also allows me to use the exact same code as a website, which you can find at [raspberrytyler.com](https://raspberrytyler.com/). The site is mobile responsive, uses semantic markup, and takes advantage of CSS's print styling capabilities.

When code is pushed to the main branch, the build process will use Puppeteer to generate an open graph image for the website, along with a PDF and PNG file of the resume.

![Tyler's resume](https://raspberrytyler.com/generated/tyler-smith-resume.png)

## Developing locally

To run the project locally, clone the repo and run the following commands from the main project directory:

```sh
docker-compose build
docker-compose run --rm npm install
docker-compose up
```

This will build a container with Chromium and its dependencies, install the Node packages, and start the development server at http://localhost:3000. The container is only intended for local development: it simply provides a runtime to mount your local installation into. On the production server, Netlify will serve the static files from the `public/` directory.

NPM will prevent the host machine from running the development server or running `npm install` by checking if a `NOT_HOST_MACHINE` environment variable is present and set to `1`. This ensures better isolation between the container and host, and prevents accidental installation of packages with non-Linux binaries bundled. You can read about how I implemented this in [my blog post](https://dev.to/tylerlwsmith/prevent-npm-from-installing-packages-outside-of-a-docker-container-akh).

If you need to install a new package, you can open a bash shell in a running container by running the following command on the host:

```sh
docker-compose exec node /bin/bash
```

Once inside the container, you can run NPM installation commands the way that you normally would.

```
npm install lodash
```

## Generating assets locally

To generate the assets locally, run the following command from the host machine while the container is up:

```sh
docker-compose exec node npm run build
```

This kicks off the `node/build.js` script, which saves the generated files to the `public/generated` directory. _Generated files are not committed into version control_.

## Generating assets with Puppeteer on Netlify

When code is committed to the main branch, Netlify will run the `npm run build` command. This command relies on three environment variables being set in `netlify.toml`:

- `NOT_HOST_MACHINE` must be set to `"1"` (with quotes) to allow the script to start.
- `NODE_ENV` must be set to `"production"` to tell `node/build.js` to use the Chromium executable provided by the `chrome-aws-lambda` package from NPM.
- `AWS_LAMBDA_FUNCTION_NAME` must be set to any value to prevent the `chrome-aws-lambda` package from emitting a `Could not find expected browser (chrome) locally` error.

The `chrome-aws-lambda` package provides a pre-compiled Chromium executable designed to run in a serverless environment without relying on system dependencies. When developing in the container, `node/build.js` uses Debian's Chromium instead.

## Open graph generation

The open graph image features a low resolution version of the resume that replaces the text blocks with solid rectangles. The code that transforms the text blocks into rectangles lives in `public/open-graph-image.js`. It works by wrapping the text blocks in solid-colored spans when the `?open-graph-image` query variable is present on the URL. You can see this in action by visiting https://raspberrytyler.com/?open-graph-image.

This low-resolution version of the resume is then pulled into `public/open-graph-image/index.html` via iframe, which Puppeteer uses as a template for generating the final open graph image.

![The resume website's open graph image](https://raspberrytyler.com/generated/open-graph-image.png)
