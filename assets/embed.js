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

      const resume = doc.querySelector('[data-resume-container="resume"]');
      const styles = doc.querySelectorAll('link[rel="stylesheet"]');
      const elementsWithHref = doc.querySelectorAll("[href]");

      for (element of elementsWithHref) {
        try {
          new URL(element.getAttribute("href"));
        } catch (e) {
          element.href = scriptOrigin + element.getAttribute("href");
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
        wrapper.appendChild(resume);
      });
    })
    .catch((e) => {
      console.log("error");
      const error = document.createElement("p");

      error.style.padding = "20px";
      error.style.textAlign = "center";
      error.innerText = "There was an error loading the resume.";

      wrapper.removeChild(loader);
      wrapper.appendChild(error);
    });
})();
