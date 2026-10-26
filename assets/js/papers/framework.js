/*
 * Reusable engine for interactive paper pages (Option A — CI-safe, no gem-owned dirs).
 *
 * Usage (classic script, no build step):
 *   <div id="my-explore"></div>
 *   <script defer src="/assets/js/papers/_framework.js"></script>
 *   <script defer src="/assets/js/papers/<paper>.js"></script>
 * and in <paper>.js:
 *   PaperInteractive.create("#my-explore", { params, model, plot, presets });
 *
 * Plotly is loaded by the al_charts gem when the page front matter sets
 * `chart: { plotly: true }`. Colors follow the theme via CSS variables and
 * re-theme automatically on the light/dark toggle.
 */
(function () {
  "use strict";

  var STYLE_ID = "paper-interactive-styles";

  function injectStyles() {
    if (document.getElementById(STYLE_ID)) return;
    var css = [
      ".paper-explore{border:1px solid var(--global-divider-color);border-radius:8px;padding:1rem 1.1rem;margin:1.5rem 0;}",
      ".pe-controls{display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:.6rem 1.4rem;margin-bottom:.4rem;}",
      ".pe-param{display:flex;flex-direction:column;}",
      ".pe-label{font-size:.9rem;margin-bottom:.2rem;color:var(--global-text-color);}",
      ".pe-name{color:var(--global-text-color-light,#777);margin-left:.3rem;}",
      ".pe-row{display:flex;align-items:center;gap:.7rem;}",
      ".pe-row input[type=range]{flex:1;min-width:0;accent-color:var(--global-theme-color);height:1.5rem;touch-action:none;}",
      ".pe-readout{font-variant-numeric:tabular-nums;min-width:5rem;text-align:right;font-size:.9rem;color:var(--global-text-color);}",
      ".pe-toggles{display:flex;flex-wrap:wrap;gap:1rem;margin:.1rem 0 .5rem;}",
      ".pe-toggle{display:inline-flex;align-items:center;gap:.4rem;font-size:.9rem;color:var(--global-text-color);cursor:pointer;}",
      ".pe-toggle input{accent-color:var(--global-theme-color);width:1.05rem;height:1.05rem;}",
      ".pe-plot{width:100%;height:clamp(280px,46vh,430px);}",
      ".pe-actions{display:flex;flex-wrap:wrap;gap:.5rem;margin-top:.6rem;}",
      ".pe-btn{min-height:40px;padding:.3rem .95rem;border-radius:6px;border:1px solid var(--global-divider-color);background:transparent;color:var(--global-text-color);cursor:pointer;font-size:.85rem;}",
      ".pe-btn:hover{border-color:var(--global-theme-color);color:var(--global-theme-color);}",
      ".pe-reset{margin-left:auto;}",
      "@media (max-width:576px){.pe-reset{margin-left:0;}.pe-readout{min-width:4rem;}}",
    ].join("");
    var s = document.createElement("style");
    s.id = STYLE_ID;
    s.textContent = css;
    document.head.appendChild(s);
  }

  function cssVar(name, fallback) {
    var v = getComputedStyle(document.body).getPropertyValue(name);
    return (v && v.trim()) || fallback;
  }

  function themeColors() {
    return {
      text: cssVar("--global-text-color", "#212529"),
      accent: cssVar("--global-theme-color", "#b509ac"),
      grid: cssVar("--global-divider-color", "#e8e8e8"),
      muted: cssVar("--global-text-color-light", "#828282"),
    };
  }

  function baseLayout(config, colors) {
    var p = config.plot || {};
    var axis = function (title, range) {
      return {
        title: { text: title || "" },
        color: colors.text,
        gridcolor: colors.grid,
        zerolinecolor: colors.grid,
        linecolor: colors.grid,
        automargin: true,
        range: range,
      };
    };
    return {
      margin: { l: 58, r: 16, t: 12, b: 46 },
      paper_bgcolor: "rgba(0,0,0,0)",
      plot_bgcolor: "rgba(0,0,0,0)",
      font: { color: colors.text, size: 13 },
      showlegend: p.showlegend !== false,
      legend: { orientation: "h", y: 1.14, x: 0, font: { color: colors.text } },
      xaxis: axis(p.xtitle, p.xrange),
      yaxis: axis(p.ytitle, p.yrange),
      hovermode: "closest",
    };
  }

  function formatValue(val, p) {
    var digits = p.digits != null ? p.digits : p.step && p.step < 1 ? 2 : 0;
    var s = Number(val).toFixed(digits);
    return p.unit ? s + " " + p.unit : s;
  }

  function typeset(node, attempt) {
    attempt = attempt || 0;
    if (window.MathJax && MathJax.typesetPromise) {
      MathJax.typesetPromise([node]).catch(function () {});
    } else if (attempt < 25) {
      setTimeout(function () {
        typeset(node, attempt + 1);
      }, 200);
    }
  }

  function create(mount, config) {
    injectStyles();
    var el = typeof mount === "string" ? document.querySelector(mount) : mount;
    if (!el) return;

    var params = config.params || [];
    var state = {};
    params.forEach(function (p) {
      state[p.key] = p.value;
    });

    el.classList.add("paper-explore");
    el.innerHTML = "";

    var controls = document.createElement("div");
    controls.className = "pe-controls";
    var inputs = {};
    var outputs = {};

    params.forEach(function (p) {
      var wrap = document.createElement("div");
      wrap.className = "pe-param";

      var label = document.createElement("label");
      label.className = "pe-label";
      label.setAttribute("for", "pe-" + p.key);
      label.innerHTML = "\\(" + p.symbol + "\\) <span class='pe-name'>" + p.label + "</span>";

      var row = document.createElement("div");
      row.className = "pe-row";

      var isLog = p.scale === "log";
      var toSlider = function (v) {
        return isLog ? Math.log10(v) : v;
      };
      var fromSlider = function (v) {
        return isLog ? Math.pow(10, v) : v;
      };

      var input = document.createElement("input");
      input.type = "range";
      input.id = "pe-" + p.key;
      input.min = toSlider(p.min);
      input.max = toSlider(p.max);
      input.step = p.step;
      input.value = toSlider(p.value);
      input.setAttribute("aria-label", p.label + (p.unit ? " in " + p.unit : ""));

      var out = document.createElement("output");
      out.className = "pe-readout";
      out.textContent = formatValue(p.value, p);

      input.addEventListener("input", function () {
        state[p.key] = fromSlider(parseFloat(input.value));
        out.textContent = formatValue(state[p.key], p);
        scheduleUpdate();
      });
      p._toSlider = toSlider;

      row.appendChild(input);
      row.appendChild(out);
      wrap.appendChild(label);
      wrap.appendChild(row);
      controls.appendChild(wrap);
      inputs[p.key] = input;
      outputs[p.key] = out;
    });
    el.appendChild(controls);

    // Optional boolean toggles (e.g. show an overlay).
    if ((config.toggles || []).length) {
      var togglesRow = document.createElement("div");
      togglesRow.className = "pe-toggles";
      config.toggles.forEach(function (t) {
        state[t.key] = t.value;
        var label = document.createElement("label");
        label.className = "pe-toggle";
        var cb = document.createElement("input");
        cb.type = "checkbox";
        cb.checked = !!t.value;
        cb.addEventListener("change", function () {
          state[t.key] = cb.checked;
          scheduleUpdate();
        });
        label.appendChild(cb);
        label.appendChild(document.createTextNode(t.label));
        togglesRow.appendChild(label);
      });
      el.appendChild(togglesRow);
    }

    var plot = document.createElement("div");
    plot.className = "pe-plot";
    plot.setAttribute("role", "img");
    plot.setAttribute("aria-label", config.plotAria || "Interactive plot that updates as you move the sliders.");
    el.appendChild(plot);

    var actions = document.createElement("div");
    actions.className = "pe-actions";
    (config.presets || []).forEach(function (preset) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "pe-btn pe-preset";
      b.textContent = preset.label;
      b.addEventListener("click", function () {
        applyValues(preset.values);
      });
      actions.appendChild(b);
    });
    var reset = document.createElement("button");
    reset.type = "button";
    reset.className = "pe-btn pe-reset";
    reset.textContent = "Reset";
    reset.addEventListener("click", function () {
      var defs = {};
      params.forEach(function (p) {
        defs[p.key] = p.value;
      });
      applyValues(defs);
    });
    actions.appendChild(reset);
    el.appendChild(actions);

    function applyValues(vals) {
      params.forEach(function (p) {
        if (vals[p.key] === undefined) return;
        state[p.key] = vals[p.key];
        inputs[p.key].value = p._toSlider ? p._toSlider(vals[p.key]) : vals[p.key];
        outputs[p.key].textContent = formatValue(vals[p.key], p);
      });
      scheduleUpdate();
    }

    var inited = false;
    var rafPending = false;

    function render() {
      var colors = themeColors();
      var result = config.model(state, colors) || {};
      var layout = Object.assign(baseLayout(config, colors), result.layout || {});
      var traces = result.traces || [];
      var opts = { responsive: true, displayModeBar: false };
      if (!inited) {
        Plotly.newPlot(plot, traces, layout, opts);
        inited = true;
      } else {
        Plotly.react(plot, traces, layout, opts);
      }
    }

    function scheduleUpdate() {
      if (!inited || rafPending) return;
      rafPending = true;
      requestAnimationFrame(function () {
        rafPending = false;
        render();
      });
    }

    function initWhenReady() {
      if (typeof Plotly === "undefined") {
        setTimeout(initWhenReady, 120);
        return;
      }
      render();
    }

    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (e) {
            if (e.isIntersecting) {
              io.disconnect();
              initWhenReady();
            }
          });
        },
        { rootMargin: "120px" }
      );
      io.observe(plot);
    } else {
      initWhenReady();
    }

    // Re-theme the plot when the user toggles light/dark.
    var mo = new MutationObserver(function () {
      if (inited) setTimeout(render, 0);
    });
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

    typeset(controls);
  }

  window.PaperInteractive = { create: create, themeColors: themeColors };
})();
