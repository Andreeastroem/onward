/* Faction comparison for potential-factions.html.
   Reads the document's own sections (no duplicated data):
     <section data-faction="ID" data-faction-name="...">              faction contract (h3 subsections)
     <section data-matchup="A B">                                      interaction matrix entry
     <section data-exception-for="ID">                                 production/connectivity exceptions
   Without JS the same content is available in the sections below. */
(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    var root = document.getElementById("faction-compare");
    if (!root) return;

    var factions = [];
    var byId = {};
    document.querySelectorAll("section[data-faction]").forEach(function (sec) {
      var f = {
        id: sec.getAttribute("data-faction"),
        name: sec.getAttribute("data-faction-name"),
        section: sec,
        rows: readRows(sec),
        exception: null
      };
      factions.push(f); byId[f.id] = f;
    });
    document.querySelectorAll("section[data-exception-for]").forEach(function (sec) {
      var f = byId[sec.getAttribute("data-exception-for")];
      if (f) f.exception = sec;
    });
    var matchups = {};
    document.querySelectorAll("section[data-matchup]").forEach(function (sec) {
      var ids = sec.getAttribute("data-matchup").split(" ");
      matchups[ids.slice().sort().join("|")] = sec;
    });
    if (!factions.length) return;

    var selA = root.querySelector("[data-pick='a']"), selB = root.querySelector("[data-pick='b']");
    var table = root.querySelector("[data-compare-table]"), match = root.querySelector("[data-compare-matchup]");
    var grid = root.querySelector("[data-matchup-grid]");
    root.hidden = false;
    var fallback = document.getElementById("faction-compare-static");
    if (fallback) fallback.hidden = true;

    function readRows(sec) {
      var rows = [], current = null;
      Array.prototype.forEach.call(sec.children, function (node) {
        if (node.tagName === "H3") {
          current = { title: node.firstChild.textContent.trim(), nodes: [] };
          rows.push(current);
        } else if (current) {
          current.nodes.push(node);
        }
      });
      return rows;
    }

    [selA, selB].forEach(function (sel) {
      factions.forEach(function (f) {
        var o = document.createElement("option"); o.value = f.id; o.textContent = f.name; sel.appendChild(o);
      });
      sel.addEventListener("change", render);
    });
    selA.value = factions[0].id;
    selB.value = (factions[1] || factions[0]).id;

    function cell(nodes) {
      var td = document.createElement("td");
      nodes.forEach(function (n) { if (n.tagName !== "HR") td.appendChild(n.cloneNode(true)); });
      return td;
    }

    function render() {
      var a = byId[selA.value], b = byId[selB.value];
      table.textContent = "";
      var thead = document.createElement("thead"), hr = document.createElement("tr");
      ["Aspect", a.name, b.name].forEach(function (t) {
        var th = document.createElement("th"); th.scope = "col"; th.textContent = t; hr.appendChild(th);
      });
      thead.appendChild(hr); table.appendChild(thead);

      var tbody = document.createElement("tbody");
      var titles = [];
      a.rows.concat(b.rows).forEach(function (r) { if (titles.indexOf(r.title) === -1) titles.push(r.title); });
      function add(title, nodesA, nodesB) {
        var tr = document.createElement("tr");
        var th = document.createElement("th"); th.scope = "row"; th.textContent = title; tr.appendChild(th);
        [nodesA, nodesB].forEach(function (nodes) {
          if (nodes && nodes.length) tr.appendChild(cell(nodes));
          else { var td = document.createElement("td"); td.className = "muted"; td.textContent = "Not defined for this faction"; tr.appendChild(td); }
        });
        tbody.appendChild(tr);
      }
      titles.forEach(function (title) {
        function find(f) { var r = f.rows.filter(function (x) { return x.title === title; })[0]; return r && r.nodes; }
        add(title, find(a), find(b));
      });
      function exc(f) {
        if (!f.exception) return null;
        return Array.prototype.filter.call(f.exception.children, function (n) { return !/^(H[1-6]|HR)$/.test(n.tagName); });
      }
      add("Production/connectivity exception candidates", exc(a), exc(b));
      table.appendChild(tbody);

      match.textContent = "";
      var h = document.createElement("h3");
      if (a.id === b.id) {
        h.textContent = "Pick two different factions to see their matchup";
        match.appendChild(h);
      } else {
        var sec = matchups[[a.id, b.id].sort().join("|")];
        h.textContent = a.name + " vs " + b.name;
        match.appendChild(h);
        if (sec) {
          Array.prototype.forEach.call(sec.children, function (n) { if (n.tagName !== "H2" && n.tagName !== "HR") match.appendChild(n.cloneNode(true)); });
        } else {
          var p = document.createElement("p"); p.className = "muted";
          p.textContent = "The interaction matrix does not define this matchup.";
          match.appendChild(p);
        }
      }

      grid.querySelectorAll("button").forEach(function (btn) {
        var pair = [btn.getAttribute("data-a"), btn.getAttribute("data-b")];
        btn.classList.toggle("active", pair.indexOf(a.id) !== -1 && pair.indexOf(b.id) !== -1);
      });
    }

    // Matrix of the defined matchups; clicking a cell loads that pair.
    var ids = factions.map(function (f) { return f.id; }).filter(function (id) {
      return Object.keys(matchups).some(function (k) { return k.split("|").indexOf(id) !== -1; });
    });
    var headRow = document.createElement("tr");
    headRow.appendChild(document.createElement("td"));
    ids.forEach(function (id) { var th = document.createElement("th"); th.scope = "col"; th.textContent = byId[id].name; headRow.appendChild(th); });
    var gtable = document.createElement("table"); gtable.className = "matrix"; gtable.setAttribute("data-no-sort", "");
    var gt = document.createElement("thead"); gt.appendChild(headRow); gtable.appendChild(gt);
    var gb = document.createElement("tbody");
    ids.forEach(function (rid) {
      var tr = document.createElement("tr");
      var th = document.createElement("th"); th.scope = "row"; th.textContent = byId[rid].name; tr.appendChild(th);
      ids.forEach(function (cid) {
        var td = document.createElement("td");
        if (rid !== cid) {
          var btn = document.createElement("button");
          btn.type = "button"; btn.textContent = "Compare";
          btn.setAttribute("data-a", rid); btn.setAttribute("data-b", cid);
          btn.setAttribute("aria-label", "Compare " + byId[rid].name + " with " + byId[cid].name);
          btn.addEventListener("click", function () { selA.value = rid; selB.value = cid; render(); });
          td.appendChild(btn);
        }
        tr.appendChild(td);
      });
      gb.appendChild(tr);
    });
    gtable.appendChild(gb);
    grid.appendChild(gtable);

    render();
  });
})();
