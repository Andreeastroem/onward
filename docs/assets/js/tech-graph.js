/* Interactive tech graph for tech-tree-operational-spec.html.
   The graph is a hand-written inline SVG (readable without JS). Every node is
   <g class="tech-node" data-node="ID"> and every edge is <path data-from data-to>.
   This script only adds selection, highlighting, and a detail panel from those attributes. */
(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    var svg = document.getElementById("tech-graph");
    var panel = document.getElementById("tech-detail");
    if (!svg || !panel) return;

    var nodes = {};
    svg.querySelectorAll(".tech-node").forEach(function (g) {
      nodes[g.getAttribute("data-node")] = {
        el: g,
        label: g.getAttribute("data-label"),
        kind: g.getAttribute("data-kind"),
        note: g.getAttribute("data-note") || ""
      };
    });
    var edges = Array.prototype.map.call(svg.querySelectorAll("path[data-from]"), function (p) {
      return { el: p, from: p.getAttribute("data-from"), to: p.getAttribute("data-to") };
    });

    function walk(start, direction) {
      var seen = {}, queue = [start];
      while (queue.length) {
        var id = queue.shift();
        edges.forEach(function (e) {
          var next = direction === "up" ? (e.to === id ? e.from : null) : (e.from === id ? e.to : null);
          if (next && !seen[next]) { seen[next] = true; queue.push(next); }
        });
      }
      return seen;
    }

    function name(id) { return id + " " + nodes[id].label; }

    function select(id) {
      var up = walk(id, "up"), down = walk(id, "down");
      Object.keys(nodes).forEach(function (k) {
        var cls = nodes[k].el.classList;
        cls.remove("dim", "up", "down", "selected");
        if (k === id) cls.add("selected");
        else if (up[k]) cls.add("up");
        else if (down[k]) cls.add("down");
        else cls.add("dim");
        nodes[k].el.setAttribute("aria-pressed", String(k === id));
      });
      edges.forEach(function (e) {
        var inPath = (e.to === id || up[e.to]) && (e.from === id || up[e.from]) ||
                     (e.from === id || down[e.from]) && (e.to === id || down[e.to]);
        e.el.classList.toggle("dim", !inPath);
      });

      var direct = edges.filter(function (e) { return e.to === id; }).map(function (e) { return name(e.from); });
      var leads = edges.filter(function (e) { return e.from === id; }).map(function (e) { return name(e.to); });
      panel.textContent = "";
      var h = document.createElement("h3"); h.textContent = name(id); panel.appendChild(h);
      var kind = document.createElement("p"); kind.textContent = "Type: " + nodes[id].kind; panel.appendChild(kind);
      function list(title, items, empty) {
        var p = document.createElement("p"); p.textContent = title; p.className = "tech-detail-title"; panel.appendChild(p);
        var ul = document.createElement("ul");
        (items.length ? items : [empty]).forEach(function (t) { var li = document.createElement("li"); li.textContent = t; ul.appendChild(li); });
        panel.appendChild(ul);
      }
      list("Requires (all of):", direct, "Nothing listed in the spec");
      list("Directly unlocks:", leads, "Nothing listed in the spec");
      var allUp = Object.keys(up).map(name);
      if (allUp.length > direct.length) list("Full prerequisite chain:", allUp, "");
      if (nodes[id].note) { var n = document.createElement("p"); n.className = "tech-note"; n.textContent = nodes[id].note; panel.appendChild(n); }
    }

    function reset() {
      Object.keys(nodes).forEach(function (k) {
        nodes[k].el.classList.remove("dim", "up", "down", "selected");
        nodes[k].el.setAttribute("aria-pressed", "false");
      });
      edges.forEach(function (e) { e.el.classList.remove("dim"); });
      panel.textContent = "Select a node to see what it requires and what it unlocks.";
    }

    Object.keys(nodes).forEach(function (k) {
      var g = nodes[k].el;
      g.setAttribute("tabindex", "0");
      g.setAttribute("role", "button");
      g.setAttribute("aria-pressed", "false");
      g.addEventListener("click", function () { select(k); });
      g.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); select(k); }
      });
    });
    var resetBtn = document.getElementById("tech-reset");
    if (resetBtn) resetBtn.addEventListener("click", reset);
    reset();
  });
})();
