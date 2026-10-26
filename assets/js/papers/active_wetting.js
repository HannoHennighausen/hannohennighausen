/*
 * Active wetting — interactive spreading velocity V(L), Eq. (C7) of
 * arXiv:2608.28912 (Appendix C). Direct port of the author's
 * spreading_velocity() routine, verified to machine precision.
 *
 * Internal unit system (self-consistent, gives V in µm/h directly):
 *   lengths µm · time h · T_a [Pa] · ξ [Pa·h/µm] · η [Pa·h·µm] · γ,ζ [Pa·µm]
 * Slider display units are converted to these below.
 *
 * Fixed parameters (Table C1): η = 1e4 Pa·h·µm, L_c = 25 µm, 𝒱 = 1e5 µm³.
 * θ(L) is the contact angle from the fixed-volume spherical cap.
 * Fixed points are zeros of V(L); stable (filled ●) = negative slope,
 * unstable (open ○) = positive slope.
 */
(function () {
  "use strict";

  var ETA = 1e4; // Pa·h·µm
  var LC = 25; // µm
  var VOL = 1e5; // µm³  (droplet volume 𝒱)

  // Start the grid just above 0: V(L) → 0 linearly as L → 0 (eq C10), but the
  // formula is 0/0 at L = 0 exactly, so we evaluate from LMIN and pin the
  // analytic origin (0, 0) onto the plotted curve. L = 0 is never a fixed point.
  var LMIN = 0.5,
    LMAX = 150,
    NGRID = 450;

  // --- θ(L): fixed-volume spherical cap, base half-width L, height h ---
  // solve π h (3 L² + h²)/6 = 𝒱 for h (monotone in h), then contact angle.
  function thetaOfL(L) {
    var f = function (h) {
      return (Math.PI * h * (3 * L * L + h * h)) / 6 - VOL;
    };
    var lo = 1e-6,
      hi = 1e4;
    for (var i = 0; i < 80; i++) {
      var mid = 0.5 * (lo + hi);
      if (f(mid) > 0) hi = mid;
      else lo = mid;
    }
    var h = 0.5 * (lo + hi);
    var R = (L * L + h * h) / (2 * h);
    var asin = Math.asin(Math.min(1, L / R));
    return h > R ? Math.PI - asin : asin;
  }

  // Precompute the L grid and θ(L) once — 𝒱 is fixed, so θ(L) never changes.
  var Lgrid = new Array(NGRID),
    THgrid = new Array(NGRID);
  for (var i = 0; i < NGRID; i++) {
    var L = LMIN + ((LMAX - LMIN) * i) / (NGRID - 1);
    Lgrid[i] = L;
    THgrid[i] = thetaOfL(L);
  }

  // --- Eq. (C7): spreading velocity in µm/h ---
  function Vs(L, theta, Ta, xi, gamma, zeta) {
    var lam = Math.sqrt((2 * ETA) / xi);
    if (Math.abs(lam - LC) < 0.05) lam = LC + 0.05; // removable singularity at λ = L_c
    var tLlam = Math.tanh(L / lam);
    var tLLc = Math.tanh(L / LC);
    var sLLc = Math.sinh(L / LC);
    var d1 = lam * lam - LC * LC;
    var d2 = 4 * lam * lam - LC * LC;
    var term1 = (tLlam * (lam / d1) * (LC / xi) * (1 / tLLc) - (LC * LC) / xi / d1) * Ta;
    var term2 = -(lam / (2 * ETA)) * Math.cos(theta) * tLlam * gamma;
    var term3 =
      zeta *
      ((tLlam * lam) / (2 * ETA) +
        (LC / d2 / xi) * (Math.sinh((2 * L) / LC) / (sLLc * sLLc)) -
        (Math.cosh((2 * L) / LC) / (xi * sLLc * sLLc)) * ((2 * lam) / d2) * tLlam);
    return term1 + term2 + term3;
  }

  // --- find zeros of V(L) on the grid and classify stability by slope ---
  function fixedPoints(Vfun) {
    var stable = [],
      unstable = [];
    for (var i = 0; i < NGRID - 1; i++) {
      var va = Vfun(Lgrid[i]),
        vb = Vfun(Lgrid[i + 1]);
      if (va === 0 || va * vb < 0) {
        var lo = Lgrid[i],
          hi = Lgrid[i + 1];
        for (var k = 0; k < 60; k++) {
          var mid = 0.5 * (lo + hi);
          if (Vfun(mid) * Vfun(lo) <= 0) hi = mid;
          else lo = mid;
        }
        var Lstar = 0.5 * (lo + hi);
        var d = 0.1;
        var slope = (Vfun(Lstar + d) - Vfun(Lstar - d)) / (2 * d);
        (slope < 0 ? stable : unstable).push(Lstar);
      }
    }
    return { stable: stable, unstable: unstable };
  }

  document.addEventListener("DOMContentLoaded", function () {
    if (!window.PaperInteractive) return;

    PaperInteractive.create("#aw-explore", {
      plotAria: "Spreading velocity versus cluster half-width; stable and unstable steady states are marked as the sliders change.",
      params: [
        { key: "Ta", symbol: "T_\\mathrm{a}", label: "active traction", unit: "Pa", min: 0, max: 150, step: 1, value: 100, digits: 0 },
        { key: "gamma", symbol: "\\gamma", label: "surface tension", unit: "mN/m", min: 0, max: 2.5, step: 0.05, value: 1.5, digits: 2 },
        { key: "zeta", symbol: "\\zeta", label: "contractility", unit: "kPa·µm", min: -15, max: 0, step: 0.1, value: -2, digits: 1 },
        { key: "xi", symbol: "\\xi", label: "friction", unit: "Pa·h/µm", min: 0.1, max: 50, step: 0.01, value: 3, digits: 2, scale: "log" },
      ],
      plot: { xtitle: "cluster half-width L (µm)", ytitle: "spreading velocity V (µm/h)", xrange: [0, LMAX], showlegend: false },
      model: function (s, colors) {
        // convert display units -> internal units
        var Ta = s.Ta; // Pa
        var xi = s.xi; // Pa·h/µm
        var gamma = s.gamma * 1000; // mN/m -> Pa·µm
        var zeta = s.zeta * 1000; // kPa·µm -> Pa·µm

        var Vfun = function (L) {
          return Vs(L, thetaOfL(L), Ta, xi, gamma, zeta);
        };

        // Pin the exact analytic limit V(0) = 0 so the curve meets the origin.
        var x = [0],
          y = [0];
        for (var i = 0; i < NGRID; i++) {
          x.push(Lgrid[i]);
          y.push(Vs(Lgrid[i], THgrid[i], Ta, xi, gamma, zeta));
        }

        var fp = fixedPoints(Vfun); // detector runs on Lgrid only — never L = 0
        var zeros = function (a) {
          return a.map(function () {
            return 0;
          });
        };

        return {
          traces: [
            { x: x, y: y, mode: "lines", name: "V(L)", line: { color: colors.accent, width: 2.5 }, hovertemplate: "L=%{x:.0f} µm<br>V=%{y:.2f} µm/h<extra></extra>" },
            { x: fp.stable, y: zeros(fp.stable), mode: "markers", showlegend: false, hovertemplate: "stable: L=%{x:.1f} µm<extra></extra>", marker: { symbol: "circle", size: 11, color: colors.accent } },
            { x: fp.unstable, y: zeros(fp.unstable), mode: "markers", showlegend: false, hovertemplate: "unstable: L=%{x:.1f} µm<extra></extra>", marker: { symbol: "circle-open", size: 11, color: colors.accent, line: { width: 2 } } },
          ],
          layout: {
            margin: { l: 58, r: 16, t: 12, b: 74 },
            shapes: [{ type: "line", xref: "paper", x0: 0, x1: 1, yref: "y", y0: 0, y1: 0, line: { color: colors.grid, dash: "dash", width: 1 } }],
            annotations: [
              {
                xref: "paper",
                yref: "paper",
                x: 0.5,
                y: -0.32,
                xanchor: "center",
                showarrow: false,
                font: { color: colors.text, size: 12.5 },
                text: "●  stable (partial wetting)      ○  unstable",
              },
            ],
          },
        };
      },
    });
  });
})();
