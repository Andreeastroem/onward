/* Combat calculators for combat-spec.html.
   Constants come from <script id="combat-constants"> on the same page, which mirrors the
   v0 armor floor and TTK envelopes in the prose. Nothing here is required to read the rules;
   the reference tables on the page show the same results for sample inputs. */
(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    var source = document.getElementById("combat-constants");
    var widget = document.getElementById("ttk-widget");
    if (!source || !widget || !window.OnwardWidgets) return;
    widget.hidden = false;
    init(JSON.parse(source.textContent));
  });

  function init(C) {
    var U = window.OnwardWidgets, $ = U.$, fmt = U.fmt, svgEl = U.svgEl;
    var raw = $("ttk-raw"), armor = $("ttk-armor"), hp = $("ttk-hp"), attackers = $("ttk-attackers");
    var interval = $("ttk-interval"), phase = $("ttk-phase");
    var out = $("ttk-output"), envelope = $("ttk-envelope"), armorChart = $("armor-chart");

    /* final_hit_damage = max(1, raw_hit_damage - flat_armor) */
    function finalDamage(rawDamage, flatArmor) { return Math.max(C.armor_floor, rawDamage - flatArmor); }

    function drawArmor(rawDamage, flatArmor) {
      var W = 520, H = 240, L = 40, R = 14, T = 12, B = 48, pw = W - L - R, ph = H - T - B;
      var maxArmor = Math.max(10, Math.ceil(rawDamage * 1.5), flatArmor + 2);
      var x = function (a) { return L + (a / maxArmor) * pw; };
      var y = function (d) { return T + ph - (d / Math.max(rawDamage, 1)) * ph; };
      armorChart.textContent = "";
      armorChart.appendChild(svgEl("title", { id: "armor-chart-title" }, "Final hit damage against flat armor"));
      [0, 0.5, 1].forEach(function (p) {
        var d = p * rawDamage;
        armorChart.appendChild(svgEl("line", { x1: L, x2: W - R, y1: y(d), y2: y(d), style: "stroke:var(--border)" }));
        armorChart.appendChild(svgEl("text", { x: L - 6, y: y(d) + 4, "text-anchor": "end", "font-size": 11, style: "fill:var(--muted)" }, fmt(d, 1)));
      });
      for (var a = 0; a <= maxArmor; a += Math.max(1, Math.round(maxArmor / 5))) {
        armorChart.appendChild(svgEl("text", { x: x(a), y: H - 28, "text-anchor": "middle", "font-size": 11, style: "fill:var(--muted)" }, String(a)));
      }
      armorChart.appendChild(svgEl("text", { x: L + pw / 2, y: H - 8, "text-anchor": "middle", "font-size": 11, style: "fill:var(--muted)" }, "flat armor"));
      armorChart.appendChild(svgEl("line", { x1: L, x2: W - R, y1: y(C.armor_floor), y2: y(C.armor_floor), "stroke-dasharray": "4 3", style: "stroke:var(--warn)" }));
      armorChart.appendChild(svgEl("text", { x: W - R - 4, y: y(C.armor_floor) - 5, "text-anchor": "end", "font-size": 11, style: "fill:var(--warn)" }, "floor " + C.armor_floor));
      var pts = [];
      for (var i = 0; i <= maxArmor; i += 0.5) pts.push(x(i).toFixed(1) + "," + y(finalDamage(rawDamage, i)).toFixed(1));
      armorChart.appendChild(svgEl("polyline", { points: pts.join(" "), fill: "none", "stroke-width": 2.5, style: "stroke:var(--accent)" }));
      armorChart.appendChild(svgEl("circle", { cx: x(flatArmor), cy: y(finalDamage(rawDamage, flatArmor)), r: 5, style: "fill:var(--warn)" }));
    }

    function drawEnvelope(ttk, selected) {
      var W = 520, H = 150, L = 60, R = 14, T = 10, B = 28, pw = W - L - R, ph = H - T - B;
      var names = Object.keys(C.ttk_targets_seconds);
      var maxT = Math.max(4, Math.ceil(ttk * 1.1));
      var x = function (s) { return L + (Math.min(s, maxT) / maxT) * pw; };
      var rowH = ph / names.length;
      envelope.textContent = "";
      envelope.appendChild(svgEl("title", { id: "ttk-envelope-title" }, "Computed time-to-kill against the target envelope per phase"));
      names.forEach(function (name, i) {
        var range = C.ttk_targets_seconds[name], rowY = T + i * rowH;
        envelope.appendChild(svgEl("text", { x: L - 8, y: rowY + rowH / 2 + 4, "text-anchor": "end", "font-size": 12, style: "fill:var(--fg);font-weight:" + (name === selected ? 700 : 400) }, name.charAt(0).toUpperCase() + name.slice(1)));
        envelope.appendChild(svgEl("rect", { x: x(range[0]), y: rowY + 4, width: x(range[1]) - x(range[0]), height: rowH - 8, rx: 3, style: "fill:" + (name === selected ? "var(--accent)" : "var(--surface-2)") + ";stroke:var(--border)" }));
      });
      for (var s = 0; s <= maxT; s += 1) {
        envelope.appendChild(svgEl("text", { x: x(s), y: H - 8, "text-anchor": "middle", "font-size": 11, style: "fill:var(--muted)" }, s + "s"));
      }
      envelope.appendChild(svgEl("line", { x1: x(ttk), x2: x(ttk), y1: T, y2: T + ph, "stroke-width": 2.5, style: "stroke:var(--warn)" }));
    }

    function update() {
      var rawDamage = U.clampNum(raw, 0, 100000, 12);
      var flatArmor = U.clampNum(armor, 0, 100000, 0);
      var hitPoints = U.clampNum(hp, 1, 1000000, 100);
      var n = Math.round(U.clampNum(attackers, 1, 1000, 1));
      var secs = U.clampNum(interval, 0.05, 60, 0.5);
      var range = C.ttk_targets_seconds[phase.value];

      var dmg = finalDamage(rawDamage, flatArmor);
      var hits = Math.ceil(hitPoints / dmg);
      var volleys = Math.ceil(hits / n);
      var ttk = volleys * secs;
      var status;
      if (ttk < range[0]) status = "Faster than the envelope by " + fmt(range[0] - ttk) + " s";
      else if (ttk > range[1]) status = "Slower than the envelope by " + fmt(ttk - range[1]) + " s";
      else status = "Within the envelope";

      U.renderOutput(out, [
        ["Final hit damage", fmt(dmg) + (rawDamage - flatArmor < C.armor_floor ? " (floor applied)" : "")],
        ["Damage lost to armor", fmt(rawDamage > 0 ? (1 - dmg / rawDamage) * 100 : 0, 1) + "%"],
        ["Hits to kill", fmt(hits, 0)],
        ["Volleys needed", fmt(volleys, 0) + " (" + n + " attacker" + (n === 1 ? "" : "s") + ")"],
        ["Time to kill", fmt(ttk) + " s"],
        ["Target for " + phase.value + " game", fmt(range[0], 1) + " to " + fmt(range[1], 1) + " s"],
        ["Result", status]
      ]);
      drawArmor(rawDamage, flatArmor);
      drawEnvelope(ttk, phase.value);
    }

    [raw, armor, hp, attackers, interval, phase].forEach(function (el) {
      el.addEventListener("input", update);
      el.addEventListener("change", update);
    });
    update();
  }
})();
