(function () {
  const currentScript = document.currentScript;
  const scriptOrigin = new URL(currentScript.src).origin;

  const wrapper = document.createElement("div");
  wrapper.classList.add("tyler-smith-resume-wrapper");
  wrapper.style.boxSizing = "content-box";
  wrapper.style.width = "100%";
  wrapper.style.maxWidth = "8.5in";
  wrapper.style.minHeight = "11in";
  wrapper.style.background = "#fff";
  wrapper.style.position = "relative";
  document.currentScript.after(wrapper);

  const loader = document.createElement("div");
  wrapper.appendChild(loader);
  setTimeout(function showLoadingState() {
    loader.innerHTML = `<p style="text-align: center; padding: 20px;">Loading...</p>`;
  }, 100);

  fetch(scriptOrigin)
    .then((res) => res.text())
    .then((html) => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, "text/html");

      // We're grabbing the entire body instead of [data-resume-container] to
      // ensure we grab the Cloudflare email deobfuscation script.
      const htmlBody = doc.querySelector("body");
      const styles = doc.querySelectorAll('link[rel="stylesheet"]');
      const attributesWithOrigins = ["href", "src"];

      for (attr of attributesWithOrigins) {
        const elements = doc.querySelectorAll(`[${attr}]`);
        for (const element of elements) {
          try {
            new URL(element.getAttribute(attr));
          } catch (e) {
            element.setAttribute(
              attr,
              scriptOrigin + element.getAttribute("href")
            );
          }
        }
      }

      const styleLoadPromises = [];
      for (const style of styles) {
        const promise = new Promise((resolve) => {
          style.addEventListener("load", resolve);
        });
        styleLoadPromises.push(promise);
        wrapper.appendChild(style);
      }

      Promise.all(styleLoadPromises).then(() => {
        wrapper.removeChild(loader);

        for (node of htmlBody.children) {
          wrapper.appendChild(node);
        }

        // Spreading keeps the array stable as we remove elements.
        const scripts = [...wrapper.querySelectorAll("script, [onclick]")];
        for (const originalElement of scripts) {
          console.log(originalElement);
          const newScript = document.createElement(originalElement.tagName);
          newScript.innerHTML = originalElement.innerHTML;
          for (const attr of [...originalElement.attributes]) {
            newScript.setAttribute(attr.name, attr.value);
          }

          originalElement.after(newScript);
          originalElement.remove();
        }
      });
    })
    .catch((e) => {
      console.error(e);
      const error = document.createElement("p");

      error.style.padding = "20px";
      error.style.textAlign = "center";
      error.innerText = "There was an error loading the resume.";

      wrapper.removeChild(loader);
      wrapper.appendChild(error);
    });
})();
