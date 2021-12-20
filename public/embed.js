(function () {
  const currentScript = document.currentScript;
  const scriptOrigin = new URL(currentScript.src).origin;
  const iframe = document.createElement("iframe");

  const wrapper = document.createElement("div");
  wrapper.classList.add("tyler-smith-resume-wrapper");
  wrapper.style.boxSizing = "content-box";
  wrapper.style.border = "1px solid transparent";
  wrapper.style.maxWidth = "8.5in";
  wrapper.style.minHeight = "11in";
  wrapper.style.background = "#fff";
  document.currentScript.after(wrapper);

  iframe.src = `${scriptOrigin}/?iframe`;
  iframe.classList.add("tyler-smith-resume-embed");
  iframe.style.display = "block";
  iframe.style.width = "100%";
  iframe.frameBorder = 0;
  iframe.hidden = true;
  wrapper.appendChild(iframe);

  iframe.addEventListener("load", function () {
    iframe.hidden = false;
  });

  window.addEventListener("message", function (message) {
    if (message.origin !== scriptOrigin) return;
    const pageHeight = message.data;
    iframe.style.height = `${pageHeight}px`;
  });
})();
