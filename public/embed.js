(function () {
  const currentScript = document.currentScript;
  const scriptOrigin = new URL(currentScript.src).origin;
  const iframe = document.createElement("iframe");

  iframe.src = `${scriptOrigin}/?iframe`;
  iframe.classList.add("tyler-smith-resume-embed");
  iframe.style.maxWidth = "8.5in";
  iframe.style.width = "100%";
  iframe.frameBorder = 0;

  window.addEventListener("message", function (message) {
    if (message.origin !== scriptOrigin) return;
    const pageHeight = message.data;
    iframe.style.height = `${pageHeight}px`;
  });

  document.currentScript.after(iframe);
})();
