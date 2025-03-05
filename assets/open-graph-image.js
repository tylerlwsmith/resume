/**
 * This script will be used to modify the page styles while programmatically
 * creating an open-graph image with Puppeteer. It transforms all text other
 * than the title into gray and blue blocks.
 */
document.addEventListener("DOMContentLoaded", function () {
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get("open-graph-image") === null) return;

  wrapWordsWithSpan(
    [".job__title", ".job__date", ".job__responsibility", ".education-detail"],
    "text-wrap--gray"
  );
  wrapWordsWithSpan(
    [".contact-list__link", ".section__title"],
    "text-wrap--blue-100"
  );
  wrapWordsWithSpan(".skills__heading", "text-wrap--blue-200");
  wrapWordsWithSpan(".skill", "text-wrap--blue-300");

  addOpenGraphStyles();
});

function addOpenGraphStyles() {
  const styleTag = document.createElement("style");
  styleTag.innerHTML = `
    /* Style overrides */
    [data-resume-container="resume"] {
      a {
        text-decoration: none;
      }

      .download-button {
        display: none;
      }

      .contact-list__item:after {
        color: transparent;
      }

      .job__responsibilities {
        list-style: none;
      }

      .job__responsibility {
        position: relative;
      }

      .job__responsibility::before {
        content: "\\2022"; 
        position: absolute;
        left: -24px;
        top: 6px;
        line-height: 0;
        font-size: 60px;
        color: #ededed;
      }

      /* Text wraps */
      [class^="text-wrap"] {
        color: transparent;
      }

      .text-wrap--gray {
        background: #ededed;
      }

      .text-wrap--blue-100 {
        background: #e0ecf5;
      }

      .text-wrap--blue-200 {
        background: #4098db;
      }

      .text-wrap--blue-300 {
        background: #2280c7;
      }
    }
  `;

  document.head.appendChild(styleTag);
}

function wrapWordsWithSpan(selectors, spanClass = "") {
  selector = Array.isArray(selectors) ? selectors.join(", ") : selectors;
  [...document.querySelectorAll(selector)].forEach(function (el) {
    el.innerHTML = `<span ${spanClass ? `class="${spanClass}"` : ``}">${
      el.innerText
    } </span>`;
  });
}
