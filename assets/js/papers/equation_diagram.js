/*
 * Interactive "anatomy of an equation" diagram (CI-safe, assets/js only).
 *
 * Markup (in the page):
 *   <div class="eq-diagram" data-eq-latex="... \class{et et-KEY}{term} ...">
 *     <div class="eq-callout cb-KEY" data-term="KEY"> explanation </div>   (one per term)
 *     <div class="eq-center"></div>                                        (filled by JS)
 *   </div>
 *
 * Callouts sit in the four corners, dimmed by default. JS renders the centred
 * equation (MathJax), draws grey arrows that stop just before each term, and
 * links hover/focus so a term and its callout + arrow light up together.
 */
(function () {
  "use strict";

  var STYLE_ID = "eq-diagram-styles";
  var KEYS = ["curv", "ca", "vel", "h2"];
  // corner of each callout the arrow leaves from (the one facing the centre)
  var CORNER = { ca: "br", vel: "bl", curv: "tr", h2: "tl" };
  var GAP = 9; // px the arrowhead stops short of the term's box

  function injectStyles() {
    if (document.getElementById(STYLE_ID)) return;
    var css = [
      ".eq-diagram{position:relative;display:grid;grid-template-columns:minmax(0,1fr) auto minmax(0,1fr);grid-template-rows:auto auto auto;gap:1.1rem 1.1rem;align-items:center;justify-items:center;margin:1.6rem 0;}",
      ".eq-diagram .cb-ca{grid-column:1;grid-row:1;justify-self:start;}",
      ".eq-diagram .cb-vel{grid-column:3;grid-row:1;justify-self:end;}",
      ".eq-diagram .eq-center{grid-column:2;grid-row:2;}",
      ".eq-diagram .cb-curv{grid-column:1;grid-row:3;justify-self:start;}",
      ".eq-diagram .cb-h2{grid-column:3;grid-row:3;justify-self:end;}",
      ".eq-center{font-size:1.15rem;padding:.3rem .6rem;text-align:center;}",
      // keep the equation static — override the theme's scrollable display-math box
      '.eq-center mjx-container[jax="CHTML"][display="true"]{overflow-x:visible;margin:0;}',
      ".eq-callout{max-width:250px;font-size:.84rem;line-height:1.35;opacity:.5;color:var(--global-text-color);border:1px solid var(--global-divider-color);border-radius:9px;padding:.5rem .7rem;background:var(--global-card-bg-color,transparent);transition:opacity .15s ease,border-color .15s ease;cursor:default;}",
      ".eq-callout:focus-visible{outline:2px solid var(--global-theme-color);}",
      ".eq-callout.is-active{opacity:1;border-color:var(--global-theme-color);}",
      ".et{transition:color .15s ease;border-radius:4px;cursor:pointer;}",
      ".et.is-active{color:var(--global-theme-color);}",
      "svg.eq-arrows{position:absolute;inset:0;width:100%;height:100%;pointer-events:none;overflow:visible;}",
      ".eq-arrow{fill:none;stroke:var(--global-divider-color);stroke-width:1.5;opacity:.55;transition:stroke .15s ease,opacity .15s ease;}",
      ".eq-arrow.is-active{stroke:var(--global-theme-color);opacity:1;}",
      ".eq-arrowhead{fill:var(--global-divider-color);opacity:.55;transition:fill .15s ease,opacity .15s ease;}",
      ".eq-arrowhead.is-active{fill:var(--global-theme-color);opacity:1;}",
      "@media (max-width:640px){.eq-diagram{grid-template-columns:1fr;}.eq-diagram .cb-ca,.eq-diagram .cb-vel,.eq-diagram .eq-center,.eq-diagram .cb-curv,.eq-diagram .cb-h2{grid-column:1;justify-self:stretch;}.eq-diagram .eq-center{grid-row:1;}.eq-diagram .cb-ca{grid-row:2;}.eq-diagram .cb-vel{grid-row:3;}.eq-diagram .cb-curv{grid-row:4;}.eq-diagram .cb-h2{grid-row:5;}.eq-callout{opacity:.78;max-width:none;}svg.eq-arrows{display:none;}}",
    ].join("");
    var s = document.createElement("style");
    s.id = STYLE_ID;
    s.textContent = css;
    document.head.appendChild(s);
  }

  function typeset(node) {
    if (window.MathJax && MathJax.typesetPromise) return MathJax.typesetPromise([node]);
    return new Promise(function (resolve) {
      var tries = 0;
      (function wait() {
        if (window.MathJax && MathJax.typesetPromise) MathJax.typesetPromise([node]).then(resolve);
        else if (tries++ < 25) setTimeout(wait, 200);
        else resolve();
      })();
    });
  }

  function setup(diagram) {
    injectStyles();
    var center = diagram.querySelector(".eq-center");
    var latex = diagram.getAttribute("data-eq-latex") || "";
    center.innerHTML = "\\[" + latex + "\\]";

    var svgNS = "http://www.w3.org/2000/svg";
    var svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("class", "eq-arrows");
    var paths = {}, heads = {};
    KEYS.forEach(function (k) {
      var p = document.createElementNS(svgNS, "path");
      p.setAttribute("class", "eq-arrow");
      p.setAttribute("data-arrow", k);
      var head = document.createElementNS(svgNS, "polygon");
      head.setAttribute("class", "eq-arrowhead");
      head.setAttribute("data-arrow", k);
      svg.appendChild(p);
      svg.appendChild(head);
      paths[k] = p;
      heads[k] = head;
    });
    diagram.insertBefore(svg, diagram.firstChild);

    function callout(k) { return diagram.querySelector('[data-term="' + k + '"]'); }
    function term(k) { return diagram.querySelector(".et-" + k); }

    function activate(k, on) {
      [callout(k), term(k), paths[k], heads[k]].forEach(function (el) {
        if (el) el.classList.toggle("is-active", on);
      });
    }

    function corner(rect, which, base) {
      var x = which[1] === "r" ? rect.right : rect.left;
      var y = which[0] === "b" ? rect.bottom : rect.top;
      return [x - base.left, y - base.top];
    }

    function draw() {
      var base = diagram.getBoundingClientRect();
      KEYS.forEach(function (k) {
        var c = callout(k), t = term(k);
        if (!c || !t) {
          paths[k].setAttribute("d", "");
          heads[k].setAttribute("points", "");
          return;
        }
        var start = corner(c.getBoundingClientRect(), CORNER[k], base);
        var tr = t.getBoundingClientRect();
        var tc = [tr.left + tr.width / 2 - base.left, tr.top + tr.height / 2 - base.top];
        var dx = tc[0] - start[0], dy = tc[1] - start[1];
        var len = Math.hypot(dx, dy) || 1;
        var ux = dx / len, uy = dy / len;
        // distance from term centre to its box edge along the arrow direction
        var ex = ux !== 0 ? Math.abs(tr.width / 2 / ux) : Infinity;
        var ey = uy !== 0 ? Math.abs(tr.height / 2 / uy) : Infinity;
        var back = Math.min(ex, ey) + GAP;
        var end = [tc[0] - ux * back, tc[1] - uy * back];
        paths[k].setAttribute("d", "M" + start[0] + "," + start[1] + " L" + end[0] + "," + end[1]);
        var w = 4.5;
        var tip = (end[0] + ux * 7) + "," + (end[1] + uy * 7);
        var l = (end[0] - uy * w) + "," + (end[1] + ux * w);
        var rr = (end[0] + uy * w) + "," + (end[1] - ux * w);
        heads[k].setAttribute("points", tip + " " + l + " " + rr);
      });
    }

    typeset(center).then(function () {
      KEYS.forEach(function (k) {
        [term(k), callout(k)].forEach(function (el) {
          if (!el) return;
          el.setAttribute("tabindex", "0");
          el.addEventListener("mouseenter", function () { activate(k, true); });
          el.addEventListener("mouseleave", function () { activate(k, false); });
          el.addEventListener("focus", function () { activate(k, true); });
          el.addEventListener("blur", function () { activate(k, false); });
        });
      });
      draw();
    });

    var rt;
    window.addEventListener("resize", function () {
      clearTimeout(rt);
      rt = setTimeout(draw, 120);
    });
  }

  function init() {
    document.querySelectorAll(".eq-diagram[data-eq-latex]").forEach(setup);
  }
  if (document.readyState !== "loading") init();
  else document.addEventListener("DOMContentLoaded", init);
})();
