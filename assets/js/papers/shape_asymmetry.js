/*
 * Shape asymmetry — interactive droplet height profile h(x), perturbative
 * solution Eq. (D9) of arXiv:2610.03536 (Appendix D). Verified against Fig S4.
 *
 *   h(x) = q (r^2 - x^2)                                            [symmetric h0, Eq. D1/D2]
 *        + 3 Ca / (8 r^3 q^2) * { (r^2 - x^2) ln((r-x)/(r+x))
 *                                 + (x/x0)(r^2 - x0^2) ln((r+x0)/(r-x0)) }   [Eq. D9]
 *
 * All parameters fixed from Table I; the single slider is the (perturbation)
 * capillary number Ca. Front = +x (right), rear = -x (left): as Ca grows the
 * peak shifts rearward. Lengths in µm, height in µm.
 */
(function () {
  "use strict";

  // Fixed parameters (Table I / Fig 1d measurements).
  var X0 = 104.5; // contact line position ±x0 (µm), fixed
  var HC = 4.0; // contact height h(±x0) (µm)
  var AREA = 4209.0; // enclosed area ∫h dx (µm²)

  var Q = (3 * (AREA - 2 * HC * X0)) / (4 * Math.pow(X0, 3));
  var R = Math.sqrt(X0 * X0 + HC / Q);
  var COEF = 1 / (8 * Math.pow(R, 3) * Q * Q);

  var N = 241;
  var EXP_URL = "/assets/json/papers/shape_asymmetry_exp.json";

  function h0(x) {
    return Q * (R * R - x * x);
  }
  function dShape(x) {
    return (
      COEF *
      ((R * R - x * x) * Math.log((R - x) / (R + x)) +
        (x / X0) * (R * R - X0 * X0) * Math.log((R + X0) / (R - X0)))
    );
  }
  function height(x, Ca) {
    return h0(x) + 3 * Ca * dShape(x);
  }

  function build(exp) {
    PaperInteractive.create("#sa-explore", {
      plotAria: "Droplet height profile versus position; it becomes front–rear asymmetric as the capillary number increases.",
      params: [
        { key: "Ca", symbol: "\\mathrm{Ca}", label: "capillary number", unit: "", min: 0, max: 0.015, step: 0.0001, value: 0.0062, digits: 4 },
      ],
      toggles: exp ? [{ key: "showExp", label: "show experimental data", value: false }] : [],
      plot: { xtitle: "coordinate x (µm)", ytitle: "height h (µm)", xrange: [-110, 110], yrange: [0, 33], showlegend: true },
      model: function (s, colors) {
        var x = [], y = [], y0 = [];
        for (var i = 0; i < N; i++) {
          var xi = -X0 + (2 * X0 * i) / (N - 1);
          x.push(xi);
          y.push(height(xi, s.Ca));
          y0.push(h0(xi)); // symmetric baseline (Ca = 0)
        }

        var traces = [];

        // permanent dashed symmetric reference, so the asymmetry is obvious
        traces.push({ x: x, y: y0, mode: "lines", name: "symmetric (Ca = 0)", line: { color: colors.muted, width: 1.5, dash: "dash" }, hoverinfo: "skip" });

        if (exp && s.showExp) {
          // grey ±SEM band as a filled polygon, then the mean profile.
          var bx = exp.x_um.concat(exp.x_um.slice().reverse());
          var by = exp.x_um
            .map(function (_, i) {
              return exp.h_um[i] + exp.sem_um[i];
            })
            .concat(
              exp.x_um
                .map(function (_, i) {
                  return exp.h_um[i] - exp.sem_um[i];
                })
                .reverse()
            );
          traces.push({ x: bx, y: by, fill: "toself", fillcolor: "rgba(128,128,128,0.25)", line: { width: 0 }, hoverinfo: "skip", showlegend: false });
          traces.push({ x: exp.x_um, y: exp.h_um, mode: "lines", name: "experiment", line: { color: colors.text, width: 1.5 }, hovertemplate: "x=%{x:.0f} µm<br>h=%{y:.1f} µm (exp)<extra></extra>" });
        }

        traces.push({ x: x, y: y, mode: "lines", name: "perturbation calculation", line: { color: colors.accent, width: 2.5 }, hovertemplate: "x=%{x:.0f} µm<br>h=%{y:.2f} µm<extra></extra>" });

        return {
          traces: traces,
          layout: {
            margin: { l: 56, r: 16, t: 34, b: 46 },
            shapes: [{ type: "line", xref: "x", x0: 0, x1: 0, yref: "paper", y0: 0, y1: 1, line: { color: colors.grid, dash: "dash", width: 1 } }],
            annotations: [
              { xref: "paper", yref: "paper", x: 0.02, y: 0.97, xanchor: "left", showarrow: false, font: { color: colors.muted, size: 12 }, text: "← rear" },
              { xref: "paper", yref: "paper", x: 0.98, y: 0.97, xanchor: "right", showarrow: false, font: { color: colors.muted, size: 12 }, text: "front →" },
            ],
          },
        };
      },
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    if (!window.PaperInteractive) return;
    fetch(EXP_URL)
      .then(function (r) {
        return r.ok ? r.json() : null;
      })
      .then(function (exp) {
        build(exp);
      })
      .catch(function () {
        build(null);
      });
  });
})();
