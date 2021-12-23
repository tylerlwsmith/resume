document.addEventListener("DOMContentLoaded", function () {
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get("iframe") === null) return;

  document.addEventListener("load", messageHeight);
  const resizeObserver = new ResizeObserver(messageHeight);
  resizeObserver.observe(document.body, { box: "border-box" });

  function messageHeight() {
    const height = document.body.scrollHeight;
    window.top.postMessage(height, "*");
  }

  // Needed so for correct resizing from mobile to desktop.
  const styleTag = document.createElement("style");
  styleTag.innerHTML = `
    body {
      height: initial;
    }
  `;
  document.head.appendChild(styleTag);

  // Needed so the download button doesn't load the PDF inside the iframe.
  document
    .querySelector("[data-download-resume]")
    .addEventListener("click", function (event) {
      this.removeAttribute("download");
      // this.setAttribute("target", "_blank");
    });
});
