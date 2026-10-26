/*
 * Make each publication entry's preview thumbnail a link to that entry's
 * "Website" button (the interactive project page), instead of a zoom target.
 * CI-safe: lives in assets/js, no gem template changes. Load on pages that
 * render a bibliography (publications, homepage selected papers).
 */
(function () {
  "use strict";

  function wire() {
    document.querySelectorAll("ol.bibliography > li").forEach(function (li) {
      var img = li.querySelector("img.preview");
      if (!img) return;

      var href = null;
      li.querySelectorAll("a").forEach(function (a) {
        if (a.textContent.trim().toLowerCase() === "website") href = a.getAttribute("href");
      });
      if (!href) return;

      var fig = img.closest("figure") || img;
      if (fig.parentNode && fig.parentNode.classList && fig.parentNode.classList.contains("pub-preview-link")) return;

      var link = document.createElement("a");
      link.href = href;
      link.className = "pub-preview-link";
      link.setAttribute("aria-label", "Open the interactive page for this paper");
      fig.parentNode.insertBefore(link, fig);
      link.appendChild(fig);

      // Stop the medium-zoom lightbox from taking over the click.
      img.removeAttribute("data-zoomable");
      img.style.cursor = "pointer";
      link.addEventListener(
        "click",
        function (e) {
          e.preventDefault();
          e.stopPropagation();
          window.location.href = href;
        },
        true
      );
    });
  }

  if (document.readyState !== "loading") wire();
  else document.addEventListener("DOMContentLoaded", wire);
})();
