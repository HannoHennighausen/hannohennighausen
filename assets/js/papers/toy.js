/*
 * Toy placeholder model for the interactive paper-page template: a damped
 * harmonic oscillator x(t) with x(0)=1, x'(0)=0. This is NOT physics from any
 * paper — it only demonstrates the template (live mode, two sliders, presets).
 */
document.addEventListener("DOMContentLoaded", function () {
  if (!window.PaperInteractive) return;

  PaperInteractive.create("#toy-explore", {
    plotAria: "Displacement of a damped oscillator versus time; updates as you change the damping ratio and natural frequency.",
    params: [
      { key: "zeta", symbol: "\\zeta", label: "damping ratio", unit: "", min: 0, max: 0.95, step: 0.01, value: 0.2, digits: 2 },
      { key: "omega", symbol: "\\omega_0", label: "natural frequency", unit: "rad/s", min: 0.5, max: 6, step: 0.1, value: 2.0, digits: 1 },
    ],
    presets: [
      { label: "Light damping", values: { zeta: 0.08, omega: 3.0 } },
      { label: "Heavy damping", values: { zeta: 0.6, omega: 1.5 } },
    ],
    plot: { xtitle: "time t (s)", ytitle: "displacement x(t)", xrange: [0, 12], yrange: [-1.15, 1.15] },
    model: function (s, colors) {
      var zeta = s.zeta;
      var w0 = s.omega;
      var wd = w0 * Math.sqrt(Math.max(1e-6, 1 - zeta * zeta));
      var N = 320;
      var t = [], x = [], ep = [], em = [];
      for (var i = 0; i < N; i++) {
        var tt = (12 * i) / (N - 1);
        var env = Math.exp(-zeta * w0 * tt);
        t.push(tt);
        x.push(env * (Math.cos(wd * tt) + ((zeta * w0) / wd) * Math.sin(wd * tt)));
        ep.push(env);
        em.push(-env);
      }
      return {
        traces: [
          { x: t, y: x, mode: "lines", name: "x(t)", line: { color: colors.accent, width: 2.5 } },
          { x: t, y: ep, mode: "lines", name: "envelope", line: { color: colors.muted, width: 1, dash: "dot" }, hoverinfo: "skip" },
          { x: t, y: em, mode: "lines", name: "", showlegend: false, line: { color: colors.muted, width: 1, dash: "dot" }, hoverinfo: "skip" },
        ],
      };
    },
  });
});
