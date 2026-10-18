/* Production calculators for production-operations-spec.html.
   Constants come from <script id="production-constants"> on the same page, which mirrors the
   v0 formulas and default k values in the prose (production_operations_spec_version = 1).
   Nothing here is required to read the rules; the reference table on the page shows the same
   values for sample builder counts. */
(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    var source = document.getElementById("production-constants");
    if (!source || !document.getElementById("builders-widget") || !window.OnwardWidgets) return;
    var C = JSON.parse(source.textContent);
    ["builders-widget", "throttle-widget", "refund-widget"].forEach(function (id) { document.getElementById(id).hidden = false; });
    initBuilders(C);
    initThrottle(C);
    initRefund();
  });

  var U = window.OnwardWidgets;

  /* S(n) = 1 + 0.55 * sqrt(n - 1) */
  function speed(n, C) { return C.speed.base + C.speed.coefficient * Math.sqrt(n - 1); }
  /* TickSurcharge(n) = k * (n - 1)^2 */
  function surcharge(n, k) { return k * (n - 1) * (n - 1); }

  function fillClassSelect(select, C) {
    Object.keys(C.k_by_class).forEach(function (name) {
      var opt = document.createElement("option");
      opt.value = name;
      opt.textContent = name + " (k = " + C.k_by_class[name] + ")";
      select.appendChild(opt);
    });
  }

  function initBuilders(C) {
    var cls = U.$("build-class"), time = U.$("build-time"), count = U.$("build-count"), countOut = U.$("build-count-out");
    var rate = U.$("build-tick-rate"), out = U.$("build-output"), chart = U.$("build-chart"), rows = U.$("build-rows");
    var max = C.max_builders_per_site;
    count.max = max;
    fillClassSelect(cls, C);

    function metrics(n, k, baseTime, ticksPerSecond) {
      var s = speed(n, C), duration = baseTime / s, perTick = surcharge(n, k);
      return { n: n, speed: s, duration: duration, perTick: perTick, total: perTick * duration * ticksPerSecond };
    }

    function draw(all, n) {
      var W = 520, H = 240, L = 48, R = 52, T = 14, B = 44, pw = W - L - R, ph = H - T - B;
      var maxTime = all[0].duration, maxCost = Math.max(all[all.length - 1].total, 1);
      var x = function (i) { return L + ((i - 1) / (max - 1)) * pw; };
      var yT = function (v) { return T + ph - (v / maxTime) * ph; };
      var yC = function (v) { return T + ph - (v / maxCost) * ph; };
      var el = U.svgEl;
      chart.textContent = "";
      chart.appendChild(el("title", { id: "build-chart-title" }, "Build time and total surcharge by builder count"));
      [0, 0.5, 1].forEach(function (p) {
        var yy = T + ph - p * ph;
        chart.appendChild(el("line", { x1: L, x2: W - R, y1: yy, y2: yy, style: "stroke:var(--border)" }));
        chart.appendChild(el("text", { x: L - 6, y: yy + 4, "text-anchor": "end", "font-size": 11, style: "fill:var(--accent)" }, U.fmt(p * maxTime, 1)));
        chart.appendChild(el("text", { x: W - R + 6, y: yy + 4, "font-size": 11, style: "fill:var(--warn)" }, U.fmt(p * maxCost, 0)));
      });
      [1, 4, 8, 12, 16, 20, 24].filter(function (i) { return i <= max; }).forEach(function (i) {
        chart.appendChild(el("text", { x: x(i), y: H - 26, "text-anchor": "middle", "font-size": 11, style: "fill:var(--muted)" }, String(i)));
      });
      chart.appendChild(el("text", { x: L + pw / 2, y: H - 8, "text-anchor": "middle", "font-size": 11, style: "fill:var(--muted)" }, "builders on the site"));
      chart.appendChild(el("text", { x: L, y: 10, "font-size": 11, style: "fill:var(--accent)" }, "build time (s)"));
      chart.appendChild(el("text", { x: W - R, y: 10, "text-anchor": "end", "font-size": 11, style: "fill:var(--warn)" }, "total surcharge"));
      chart.appendChild(el("polyline", { points: all.map(function (m) { return x(m.n).toFixed(1) + "," + yT(m.duration).toFixed(1); }).join(" "), fill: "none", "stroke-width": 2.5, style: "stroke:var(--accent)" }));
      chart.appendChild(el("polyline", { points: all.map(function (m) { return x(m.n).toFixed(1) + "," + yC(m.total).toFixed(1); }).join(" "), fill: "none", "stroke-width": 2.5, "stroke-dasharray": "5 3", style: "stroke:var(--warn)" }));
      chart.appendChild(el("line", { x1: x(n), x2: x(n), y1: T, y2: T + ph, style: "stroke:var(--muted)", "stroke-dasharray": "2 3" }));
    }

    function update() {
      var k = C.k_by_class[cls.value];
      var baseTime = U.clampNum(time, 1, 100000, 60);
      var ticksPerSecond = U.clampNum(rate, 0, 100, 1);
      var n = Math.round(U.clampNum(count, 1, max, 8));
      countOut.textContent = String(n);

      var all = [];
      for (var i = 1; i <= max; i++) all.push(metrics(i, k, baseTime, ticksPerSecond));
      var cur = all[n - 1], prev = n > 1 ? all[n - 2] : null;
      var saved = all[0].duration - cur.duration;

      U.renderOutput(out, [
        ["Speed multiplier S(" + n + ")", U.fmt(cur.speed, 3)],
        ["Build time", U.fmt(cur.duration) + " s (single builder: " + U.fmt(all[0].duration) + " s)"],
        ["Surcharge per tick", U.fmt(cur.perTick, 2)],
        ["Total surcharge for the build", U.fmt(cur.total, 1)],
        ["Time saved vs one builder", U.fmt(saved) + " s"],
        ["Surcharge paid per second saved", saved > 0 ? U.fmt(cur.total / saved, 2) : "n/a"],
        ["Marginal: builder " + n, prev ? "saves " + U.fmt(prev.duration - cur.duration) + " s for +" + U.fmt(cur.perTick - prev.perTick, 2) + " surcharge per tick" : "baseline, no surcharge"]
      ]);

      rows.textContent = "";
      all.forEach(function (m) {
        var tr = document.createElement("tr");
        if (m.n === n) tr.className = "current";
        [m.n, U.fmt(m.speed, 3), U.fmt(m.duration), U.fmt(m.perTick, 2), U.fmt(m.total, 1)].forEach(function (v) {
          var td = document.createElement("td");
          td.textContent = v;
          tr.appendChild(td);
        });
        rows.appendChild(tr);
      });
      draw(all, n);
    }

    [cls, time, count, rate].forEach(function (c) { c.addEventListener("input", update); c.addEventListener("change", update); });
    update();
  }

  function initThrottle(C) {
    var cls = U.$("throttle-class"), assigned = U.$("throttle-assigned"), budget = U.$("throttle-budget");
    var out = U.$("throttle-output"), chips = U.$("throttle-chips");
    var max = C.max_builders_per_site;
    assigned.max = max;
    fillClassSelect(cls, C);

    function update() {
      var k = C.k_by_class[cls.value];
      var n = Math.round(U.clampNum(assigned, 1, max, 16));
      var available = U.clampNum(budget, 0, 1000000, 0);
      var needed = surcharge(n, k);

      // The highest builder count whose per-tick surcharge the stockpile can pay; builder 1 is always free.
      var active = 1;
      for (var i = 2; i <= n; i++) if (surcharge(i, k) <= available + 1e-9) active = i;

      U.renderOutput(out, [
        ["Surcharge needed per tick", U.fmt(needed, 2)],
        ["Surcharge available", U.fmt(available, 2)],
        ["Shortfall", needed > available ? U.fmt(needed - available, 2) : "none"],
        ["active_builders / assigned_builders", active + " / " + n],
        ["Speed", "S(" + active + ") = " + U.fmt(speed(active, C), 3) + (active < n ? " (S(" + n + ") = " + U.fmt(speed(n, C), 3) + " unthrottled)" : "")],
        ["Surcharge charged this tick", U.fmt(surcharge(active, k), 2)],
        ["Site state", active < n ? "ConstructingThrottled" : "Constructing"]
      ]);

      chips.textContent = "";
      for (var b = 1; b <= n; b++) {
        var chip = document.createElement("li");
        chip.className = "chip" + (b <= active ? "" : " idle");
        chip.textContent = b + (b <= active ? "" : " ThrottleIdle");
        chips.appendChild(chip);
      }
    }
    [cls, assigned, budget].forEach(function (c) { c.addEventListener("input", update); c.addEventListener("change", update); });
    update();
  }

  function initRefund() {
    var cost = U.$("refund-cost"), progress = U.$("refund-progress"), progressOut = U.$("refund-progress-out");
    var paid = U.$("refund-surcharge"), mode = U.$("refund-mode"), out = U.$("refund-output");

    function update() {
      var base = U.clampNum(cost, 0, 1000000, 100);
      var p = U.clampNum(progress, 0, 100, 40) / 100;
      var surchargePaid = U.clampNum(paid, 0, 1000000, 0);
      var spent = base * p, unspent = base * (1 - p);
      var refund = mode.value === "cancel" ? unspent : 0;
      progressOut.textContent = Math.round(p * 100) + "%";
      U.renderOutput(out, [
        ["base_spent = base_cost * p", U.fmt(spent)],
        ["base_unspent = base_cost * (1 - p)", U.fmt(unspent)],
        ["Refund", U.fmt(refund) + (mode.value === "cancel" ? " (unspent base cost only)" : " (no refund when destroyed under construction)")],
        ["Surcharge refunded", "0 (never refunded)"],
        ["Not recovered", U.fmt(base + surchargePaid - refund) + " of " + U.fmt(base + surchargePaid) + " paid in total"]
      ]);
    }
    [cost, progress, paid, mode].forEach(function (c) { c.addEventListener("input", update); c.addEventListener("change", update); });
    update();
  }
})();
