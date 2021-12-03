document.addEventListener("DOMContentLoaded", function () {
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get("transparent-background") === null) return;
  document.body.style.backgroundColor = "transparent";
});
