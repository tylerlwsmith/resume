# Resume (Work in Progress)

This repo contains my resume that I send to prospective employers. It is also a mobile responsive website that uses semantic HTML. The project uses several media queries for screen and print that allow it to serve both of these purposes well.

You can check it out at [raspberrytyler.com](https://raspberrytyler.com/). If you're visiting from a desktop device, click the print button to preview how the resume looks when printed.

There is a container for development: downloading a random precompiled Chromium via NPM and running it on my host machine feels like a security risk. To keep myself from running it on my own machine accidentally, I use a `NOT_HOST_MACHINE` environment variable that is required to get the dependencies to install, the app to start, or assets to build. I wrote a [blog post](https://dev.to/tylerlwsmith/prevent-npm-from-installing-packages-outside-of-a-docker-container-akh) outlining the general approach I took.
