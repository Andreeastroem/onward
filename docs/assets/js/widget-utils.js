/* Small helpers shared by the page widgets. Load before the widget script. */
(function () {
  "use strict";
  var SVG_NS = "http://www.w3.org/2000/svg";

  window.OnwardWidgets = {
    $: function (id) { return document.getElementById(id); },
    fmt: function (n, digits) {
      return Number(n).toLocaleString(undefined, { maximumFractionDigits: digits === undefined ? 2 : digits });
    },
    clampNum: function (input, min, max, fallback) {
      var v = parseFloat(input.value);
      if (isNaN(v)) v = fallback;
      return Math.min(max, Math.max(min, v));
    },
    svgEl: function (name, attrs, text) {
      var el = document.createElementNS(SVG_NS, name);
      Object.keys(attrs || {}).forEach(function (k) { el.setAttribute(k, attrs[k]); });
      if (text !== undefined) el.textContent = text;
      return el;
    },
    /* Fills a <dl class="widget-output"> from [label, value] pairs. */
    renderOutput: function (dl, rows) {
      dl.textContent = "";
      rows.forEach(function (r) {
        var dt = document.createElement("dt"), dd = document.createElement("dd");
        dt.textContent = r[0];
        dd.textContent = r[1];
        dl.appendChild(dt);
        dl.appendChild(dd);
      });
    }
  };
})();
