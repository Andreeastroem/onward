/* Onward docs - progressive enhancement only.
   Every page is fully readable without this script (no content is injected). */
(function () {
  "use strict";

  var root = document.documentElement;
  var STORAGE_KEY = "onward-docs-theme";

  function applyTheme(theme) {
    if (theme === "light" || theme === "dark") {
      root.setAttribute("data-theme", theme);
    } else {
      root.removeAttribute("data-theme");
    }
  }

  function currentTheme() {
    var explicit = root.getAttribute("data-theme");
    if (explicit) return explicit;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  try { applyTheme(localStorage.getItem(STORAGE_KEY)); } catch (e) { /* storage unavailable */ }

  document.addEventListener("DOMContentLoaded", function () {
    var toggle = document.getElementById("theme-toggle");
    if (toggle) {
      toggle.addEventListener("click", function () {
        var next = currentTheme() === "dark" ? "light" : "dark";
        applyTheme(next);
        try { localStorage.setItem(STORAGE_KEY, next); } catch (e) { /* ignore */ }
      });
    }

    initCollapsibleSections();
    initScrollSpy();
    initTables();
  });

  function initCollapsibleSections() {
    var sections = document.querySelectorAll(".doc section");
    sections.forEach(function (section) {
      var heading = section.querySelector(":scope > h2");
      if (!heading) return;
      heading.setAttribute("tabindex", "0");
      heading.setAttribute("role", "button");
      heading.setAttribute("aria-expanded", "true");
      function flip(event) {
        if (event.target.closest && event.target.closest("a")) return;
        var collapsed = section.classList.toggle("collapsed");
        heading.setAttribute("aria-expanded", String(!collapsed));
      }
      heading.addEventListener("click", flip);
      heading.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); flip(e); }
      });
    });

    function setAll(collapsed) {
      sections.forEach(function (section) {
        var heading = section.querySelector(":scope > h2");
        section.classList.toggle("collapsed", collapsed);
        if (heading) heading.setAttribute("aria-expanded", String(!collapsed));
      });
    }
    var expand = document.getElementById("expand-all");
    var collapse = document.getElementById("collapse-all");
    if (expand) expand.addEventListener("click", function () { setAll(false); });
    if (collapse) collapse.addEventListener("click", function () { setAll(true); });

    // Deep links must reveal the collapsed section that contains the target.
    function revealHash() {
      if (!location.hash) return;
      var target = document.getElementById(decodeURIComponent(location.hash.slice(1)));
      var section = target && target.closest("section.collapsed");
      if (section) section.classList.remove("collapsed");
      if (target) target.scrollIntoView();
    }
    window.addEventListener("hashchange", revealHash);
    revealHash();
  }

  function initScrollSpy() {
    var links = document.querySelectorAll(".toc a[href^='#']");
    if (!links.length || !("IntersectionObserver" in window)) return;
    var byId = {};
    links.forEach(function (a) { byId[decodeURIComponent(a.getAttribute("href").slice(1))] = a; });
    var visible = {};
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) { visible[entry.target.id] = entry.isIntersecting; });
      var first = Object.keys(byId).find(function (id) { return visible[id]; });
      if (!first) return;
      links.forEach(function (a) { a.classList.remove("active"); });
      byId[first].classList.add("active");
    }, { rootMargin: "-70px 0px -65% 0px" });
    Object.keys(byId).forEach(function (id) {
      var el = document.getElementById(id);
      if (el) observer.observe(el);
    });
  }

  function initTables() {
    document.querySelectorAll(".doc table").forEach(function (table) {
      var tbody = table.tBodies[0];
      if (!tbody) return;
      table.classList.add("sortable");

      table.querySelectorAll("thead th").forEach(function (th, index) {
        th.setAttribute("tabindex", "0");
        function sort() {
          var asc = th.getAttribute("aria-sort") !== "ascending";
          table.querySelectorAll("thead th").forEach(function (other) { other.removeAttribute("aria-sort"); });
          th.setAttribute("aria-sort", asc ? "ascending" : "descending");
          var rows = Array.prototype.slice.call(tbody.rows);
          rows.sort(function (a, b) {
            var x = a.cells[index].textContent.trim();
            var y = b.cells[index].textContent.trim();
            var nx = parseFloat(x), ny = parseFloat(y);
            var cmp = (!isNaN(nx) && !isNaN(ny)) ? nx - ny : x.localeCompare(y, undefined, { numeric: true });
            return asc ? cmp : -cmp;
          });
          rows.forEach(function (row) { tbody.appendChild(row); });
        }
        th.addEventListener("click", sort);
        th.addEventListener("keydown", function (e) {
          if (e.key === "Enter" || e.key === " ") { e.preventDefault(); sort(); }
        });
      });

      if (tbody.rows.length > 8) {
        var input = document.createElement("input");
        input.type = "search";
        input.className = "table-filter";
        input.placeholder = "Filter rows";
        input.setAttribute("aria-label", "Filter table rows");
        input.addEventListener("input", function () {
          var q = input.value.toLowerCase();
          Array.prototype.forEach.call(tbody.rows, function (row) {
            row.hidden = q && row.textContent.toLowerCase().indexOf(q) === -1;
          });
        });
        var wrap = table.closest(".table-wrap") || table;
        wrap.parentNode.insertBefore(input, wrap);
      }
    });
  }
})();
