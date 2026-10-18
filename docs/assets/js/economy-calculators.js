/* Economy calculators for economy-design.html.
   Constants come from <script id="economy-constants"> on the same page, which mirrors the
   locked v0 values in the prose (economy_constants_version = 1). Nothing here is required to
   read the rules; the reference tables on the page show the same results for sample inputs. */
(function () {
  "use strict";

  var SVG_NS = "http://www.w3.org/2000/svg";

  document.addEventListener("DOMContentLoaded", function () {
    var source = document.getElementById("economy-constants");
    if (!source || !document.getElementById("decay-widget")) return;
    var C = JSON.parse(source.textContent);
    ["decay-widget", "upkeep-widget"].forEach(function (id) { document.getElementById(id).hidden = false; });
    initDecay(C);
    initUpkeep(C);
  });

  function $(id) { return document.getElementById(id); }
  function fmt(n, digits) { return Number(n).toLocaleString(undefined, { maximumFractionDigits: digits === undefined ? 2 : digits }); }
  function clampNum(input, min, max, fallback) {
    var v = parseFloat(input.value);
    if (isNaN(v)) v = fallback;
    return Math.min(max, Math.max(min, v));
  }
  function svgEl(name, attrs) {
    var el = document.createElementNS(SVG_NS, name);
    Object.keys(attrs || {}).forEach(function (k) { el.setAttribute(k, attrs[k]); });
    return el;
  }

  /* remaining_value(t) per the locked decay model */
  function remaining(initial, t, decay) {
    if (t <= decay.grace_period_seconds) return initial;
    return initial * Math.pow(0.5, (t - decay.grace_period_seconds) / decay.half_life_seconds);
  }
  function timeToFraction(p, decay) {
    return decay.grace_period_seconds + decay.half_life_seconds * Math.log(1 / p) / Math.LN2;
  }

  function initDecay(C) {
    var cost = $("decay-cost"), cls = $("decay-class"), time = $("decay-time"), timeOut = $("decay-time-out");
    var out = $("decay-output"), chart = $("decay-chart");
    var MAX_T = 200;

    function draw(initial, t) {
      var W = 520, H = 220, L = 46, R = 12, T = 12, B = 32;
      var pw = W - L - R, ph = H - T - B;
      var x = function (s) { return L + (s / MAX_T) * pw; };
      var y = function (v) { return T + ph - (initial ? (v / initial) : 0) * ph; };
      chart.textContent = "";
      var title = svgEl("title", { id: "decay-chart-title" });
      title.textContent = "Corpse biomass remaining over time";
      chart.appendChild(title);
      chart.appendChild(svgEl("rect", { x: x(0), y: T, width: x(C.corpse_decay.grace_period_seconds) - x(0), height: ph, style: "fill:var(--surface-2)" }));
      [0, 0.25, 0.5, 0.75, 1].forEach(function (p) {
        chart.appendChild(svgEl("line", { x1: L, x2: W - R, y1: T + ph - p * ph, y2: T + ph - p * ph, style: "stroke:var(--border)" }));
        var lab = svgEl("text", { x: L - 6, y: T + ph - p * ph + 4, "text-anchor": "end", "font-size": 11, style: "fill:var(--muted)" });
        lab.textContent = Math.round(p * 100) + "%";
        chart.appendChild(lab);
      });
      [0, 50, 100, 150, 200].forEach(function (s) {
        var lab = svgEl("text", { x: x(s), y: H - 10, "text-anchor": "middle", "font-size": 11, style: "fill:var(--muted)" });
        lab.textContent = s + "s";
        chart.appendChild(lab);
      });
      var pts = [];
      for (var s = 0; s <= MAX_T; s += 2) pts.push(x(s).toFixed(1) + "," + y(remaining(initial, s, C.corpse_decay)).toFixed(1));
      chart.appendChild(svgEl("polyline", { points: pts.join(" "), fill: "none", "stroke-width": 2.5, style: "stroke:var(--accent)" }));
      chart.appendChild(svgEl("line", { x1: x(t), x2: x(t), y1: T, y2: T + ph, "stroke-dasharray": "4 3", style: "stroke:var(--warn)" }));
      chart.appendChild(svgEl("circle", { cx: x(t), cy: y(remaining(initial, t, C.corpse_decay)), r: 5, style: "fill:var(--warn)" }));
    }

    function update() {
      var unitCost = clampNum(cost, 0, 100000, 10);
      var t = clampNum(time, 0, MAX_T, 0);
      var ratio = C.reclaim_ratio[cls.value];
      var initial = unitCost * ratio;
      var now = remaining(initial, t, C.corpse_decay);
      timeOut.textContent = fmt(t, 0) + " s";
      out.innerHTML = "";
      [
        ["Reclaim ratio (" + cls.value + ")", fmt(ratio)],
        ["Initial biomass value", fmt(initial)],
        ["Remaining at " + fmt(t, 0) + " s", fmt(now) + " (" + fmt(initial ? now / initial * 100 : 0, 1) + "%)"],
        ["Time to 50% / 25% / 10%", [0.5, 0.25, 0.1].map(function (p) { return fmt(timeToFraction(p, C.corpse_decay), 1) + " s"; }).join(" / ")]
      ].forEach(function (row) {
        var dt = document.createElement("dt"), dd = document.createElement("dd");
        dt.textContent = row[0]; dd.textContent = row[1];
        out.appendChild(dt); out.appendChild(dd);
      });
      draw(initial, t);
    }
    [cost, cls, time].forEach(function (el) { el.addEventListener("input", update); });
    update();
  }

  /* Worker bracket upkeep: marginal reading. Each worker above the free baseline adds its
     bracket's step to the worker upkeep multiplier total. */
  function workerBrackets(count, W) {
    return W.brackets.map(function (b) {
      var upper = b.to === null ? Infinity : b.to;
      var inBracket = Math.max(0, Math.min(count, upper) - b.from + 1);
      return { from: b.from, to: b.to, step: b.step, workers: inBracket, subtotal: inBracket * b.step };
    });
  }
  function militaryFactor(supply, M) {
    var tier = null;
    M.tiers.forEach(function (t) { if (supply >= t.at_supply) tier = t; });
    return { factor: M.base_factor + (tier ? tier.increment : 0), tier: tier };
  }

  function initUpkeep(C) {
    var workers = $("upkeep-workers"), supply = $("upkeep-supply"), base = $("upkeep-base");
    var body = $("upkeep-worker-rows"), out = $("upkeep-output");

    function update() {
      var n = Math.floor(clampNum(workers, 0, 500, 0));
      var s = clampNum(supply, 0, 1000, 0);
      var baseUpkeep = clampNum(base, 0, 1000, 1);
      var rows = workerBrackets(n, C.worker_upkeep);
      var total = rows.reduce(function (a, r) { return a + r.subtotal; }, 0);
      body.textContent = "";
      rows.forEach(function (r) {
        var tr = document.createElement("tr");
        [r.from + (r.to === null ? " and above" : " to " + r.to), "+" + fmt(r.step, 2), r.workers, fmt(r.subtotal, 2)].forEach(function (v) {
          var td = document.createElement("td"); td.textContent = v; tr.appendChild(td);
        });
        body.appendChild(tr);
      });
      var mil = militaryFactor(s, C.military_upkeep);
      out.textContent = "";
      [
        ["Free workers", Math.min(n, C.worker_upkeep.free_workers) + " of " + C.worker_upkeep.free_workers],
        ["Worker upkeep multiplier total", fmt(total, 2)],
        ["Worker upkeep (x base worker upkeep)", fmt(total * baseUpkeep, 3) + " biomass/s"],
        ["Military upkeep factor", fmt(mil.factor, 2) + (mil.tier ? " (tier at " + mil.tier.at_supply + " supply, +" + fmt(mil.tier.increment, 2) + ")" : " (base, below first tier)")],
        ["Military upkeep_per_second", fmt(s * mil.factor, 2)]
      ].forEach(function (row) {
        var dt = document.createElement("dt"), dd = document.createElement("dd");
        dt.textContent = row[0]; dd.textContent = row[1];
        out.appendChild(dt); out.appendChild(dd);
      });
    }
    [workers, supply, base].forEach(function (el) { el.addEventListener("input", update); });
    update();
  }
})();
