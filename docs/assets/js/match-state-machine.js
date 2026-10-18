/* State machine explorer and same-tick priority resolver for match-termination-spec.html.
   All rules are read from the page itself:
   - transition table rows:   <tr data-transition data-from data-to data-causes>
   - termination cause table: <tr data-cause data-trigger data-loser>
   - priority list:           <li data-trigger> in document order (highest priority first)
   The static SVG diagram and tables carry the same facts without JavaScript. */
(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    var diagram = document.getElementById("sm-diagram");
    if (!diagram || !window.OnwardWidgets) return;
    var model = readModel();
    initExplorer(model);
    initSimulator(model);
    initResolver(model);
  });

  var U = window.OnwardWidgets;
  var PLAYERS = { A: "Player A", B: "Player B" };
  function other(p) { return p === "A" ? "B" : "A"; }

  function readModel() {
    var transitions = {};
    Array.prototype.forEach.call(document.querySelectorAll("tr[data-transition]"), function (tr) {
      var cells = tr.querySelectorAll("td");
      transitions[tr.dataset.transition] = {
        id: tr.dataset.transition,
        from: tr.dataset.from,
        to: tr.dataset.to,
        causes: (tr.dataset.causes || "").split(" ").filter(Boolean),
        trigger: cells[3].textContent.trim(),
        result: cells[4].textContent.trim(),
        sideEffect: cells[5].textContent.trim(),
        row: tr
      };
    });
    var causes = {};
    Array.prototype.forEach.call(document.querySelectorAll("tr[data-cause]"), function (tr) {
      var cells = tr.querySelectorAll("td");
      causes[tr.dataset.cause] = {
        name: tr.dataset.cause,
        trigger: tr.dataset.trigger,
        loser: tr.dataset.loser,
        outcome: cells[2].textContent.trim()
      };
    });
    var priority = Array.prototype.map.call(document.querySelectorAll("li[data-trigger]"), function (li) {
      return { trigger: li.dataset.trigger, label: li.textContent.trim() };
    });
    return { transitions: transitions, causes: causes, priority: priority };
  }

  /* Builds the match result for a cause and the player it applies to ("A", "B" or null). */
  function resolveResult(model, cause, actor) {
    var c = model.causes[cause];
    if (c.loser === "none" || !actor) return { cause: cause, outcome: "Draw", winner: null, text: "Draw (no winner)" };
    return { cause: cause, outcome: "Win/Loss", winner: other(actor), text: PLAYERS[other(actor)] + " wins, " + PLAYERS[actor] + " loses" };
  }

  function initExplorer(model) {
    var diagram = U.$("sm-diagram"), detail = U.$("sm-detail");
    var items = diagram.querySelectorAll("[data-state], [data-transition]");

    function clear() {
      Array.prototype.forEach.call(diagram.querySelectorAll(".selected"), function (n) { n.classList.remove("selected"); });
      Array.prototype.forEach.call(document.querySelectorAll("tr.current"), function (n) { n.classList.remove("current"); });
    }

    function showTransition(id) {
      var t = model.transitions[id];
      clear();
      diagram.querySelector('[data-transition="' + id + '"]').classList.add("selected");
      t.row.classList.add("current");
      detail.textContent = "";
      var h = document.createElement("h3");
      h.textContent = t.id + ": " + t.from + " to " + t.to;
      detail.appendChild(h);
      [["Trigger", t.trigger], ["Result", t.result], ["Side effect", t.sideEffect]].forEach(function (r) {
        var p = document.createElement("p");
        var b = document.createElement("strong");
        b.textContent = r[0] + ": ";
        p.appendChild(b);
        p.appendChild(document.createTextNode(r[1]));
        detail.appendChild(p);
      });
    }

    function showState(name) {
      clear();
      diagram.querySelector('[data-state="' + name + '"]').classList.add("selected");
      var out = Object.keys(model.transitions).map(function (k) { return model.transitions[k]; }).filter(function (t) { return t.from === name; });
      var inc = Object.keys(model.transitions).map(function (k) { return model.transitions[k]; }).filter(function (t) { return t.to === name; });
      detail.textContent = "";
      var h = document.createElement("h3");
      h.textContent = name;
      detail.appendChild(h);
      [["Leaves via", out], ["Entered via", inc]].forEach(function (g) {
        var p = document.createElement("p");
        var b = document.createElement("strong");
        b.textContent = g[0] + ": ";
        p.appendChild(b);
        p.appendChild(document.createTextNode(g[1].length ? g[1].map(function (t) { return t.id + " (" + t.trigger + ")"; }).join("; ") : "no transitions"));
        detail.appendChild(p);
      });
    }

    Array.prototype.forEach.call(items, function (el) {
      el.setAttribute("tabindex", "0");
      el.setAttribute("role", "button");
      var act = function () {
        if (el.dataset.transition) showTransition(el.dataset.transition);
        else showState(el.dataset.state);
      };
      el.addEventListener("click", act);
      el.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); act(); } });
    });
    Array.prototype.forEach.call(document.querySelectorAll("tr[data-transition]"), function (tr) {
      tr.classList.add("clickable");
      tr.addEventListener("click", function () { showTransition(tr.dataset.transition); });
    });
    detail.hidden = false;
  }

  function initSimulator(model) {
    var widget = U.$("sm-sim"), diagram = U.$("sm-diagram");
    var actorSel = U.$("sm-actor"), current = U.$("sm-current"), events = U.$("sm-events");
    var log = U.$("sm-log"), result = U.$("sm-result"), reset = U.$("sm-reset");
    var state, disconnected, steps;

    function start() { state = "Running"; disconnected = null; steps = []; log.textContent = ""; render(null); }

    function render(firedId) {
      current.textContent = state + (disconnected ? " (" + PLAYERS[disconnected] + " disconnected)" : "");
      Array.prototype.forEach.call(diagram.querySelectorAll("[data-state]"), function (n) { n.classList.toggle("current", n.dataset.state === state); });
      Array.prototype.forEach.call(diagram.querySelectorAll("[data-transition]"), function (n) { n.classList.toggle("fired", n.dataset.transition === firedId); });
      events.textContent = "";
      var tIds = Object.keys(model.transitions).filter(function (id) { return model.transitions[id].from === state; });
      tIds.forEach(function (id) {
        var t = model.transitions[id];
        var options = t.causes.length ? t.causes : [null];
        options.forEach(function (cause) {
          var b = document.createElement("button");
          b.type = "button";
          b.className = "btn";
          b.textContent = label(t, cause);
          b.addEventListener("click", function () { fire(t, cause); });
          events.appendChild(b);
        });
      });
      if (!tIds.length) events.textContent = "Terminal state: no outgoing transitions.";
      result.hidden = state !== "Ended";
    }

    function label(t, cause) {
      var text = t.trigger.charAt(0).toUpperCase() + t.trigger.slice(1);
      if (cause === "DualCoreKill") return text + ": both cores, same tick";
      if (cause === "CoreKill") return text + ": " + PLAYERS[actorSel.value] + "'s core";
      if (cause === "Surrender") return text + ": " + PLAYERS[actorSel.value];
      if (t.id === "T3") return text + ": " + PLAYERS[actorSel.value];
      return text;
    }

    function fire(t, cause) {
      var actor = actorSel.value, entry;
      if (t.from === "Running" && t.to === "PausedReconnect") disconnected = actor;
      if (t.to === "Ended") {
        var who = t.from === "PausedReconnect" ? disconnected : actor;
        var res = resolveResult(model, cause, who);
        entry = t.id + ": " + t.from + " to " + t.to + " (" + t.trigger + ") gives " + res.text + " [" + cause + "]";
        U.renderOutput(result, [
          ["Final outcome", res.outcome === "Draw" ? "Draw" : "Win for " + PLAYERS[res.winner] + ", Loss for " + PLAYERS[other(res.winner)]],
          ["Winner player id", res.winner ? PLAYERS[res.winner] : "null (draw)"],
          ["Termination cause", cause],
          ["Trigger", t.trigger]
        ]);
      } else if (t.to === "Running") {
        entry = t.id + ": " + t.from + " to " + t.to + " (" + t.trigger + ": " + PLAYERS[disconnected] + ")";
        disconnected = null;
      } else {
        entry = t.id + ": " + t.from + " to " + t.to + " (" + t.trigger + ", " + PLAYERS[actor] + "); " + t.sideEffect;
      }
      steps.push(entry);
      var li = document.createElement("li");
      li.textContent = entry;
      log.appendChild(li);
      state = t.to;
      render(t.id);
    }

    actorSel.addEventListener("change", function () { render(null); });
    reset.addEventListener("click", start);
    widget.hidden = false;
    start();
  }

  function initResolver(model) {
    var widget = U.$("priority-widget");
    var core = U.$("pr-core"), surrender = U.$("pr-surrender"), disc = U.$("pr-disconnect"), timer = U.$("pr-timer");
    var trace = U.$("pr-trace"), out = U.$("pr-result");

    function candidates() {
      var c = {};
      if (core.value === "both") c.core = { cause: "DualCoreKill", actor: null, note: "both colony cores destroyed this tick" };
      else if (core.value !== "none") c.core = { cause: "CoreKill", actor: core.value, note: PLAYERS[core.value] + "'s core destroyed" };
      if (surrender.value !== "none") c.surrender = { cause: "Surrender", actor: surrender.value, note: PLAYERS[surrender.value] + " surrender countdown completes" };
      if (disc.value !== "none") c.disconnect = { cause: "DisconnectForfeit", actor: disc.value, note: PLAYERS[disc.value] + " grace window times out" };
      if (timer.checked) c.timer = { cause: "TimerDraw", actor: null, note: "match timer expires" };
      return c;
    }

    function update() {
      var c = candidates(), selected = null;
      trace.textContent = "";
      model.priority.forEach(function (p, i) {
        var li = document.createElement("li");
        var cand = c[p.trigger];
        if (cand && !selected) {
          selected = { trigger: p, cand: cand };
          li.className = "selected";
          li.textContent = p.label + ": " + cand.note + ". Selected.";
        } else if (cand) {
          li.className = "superseded";
          li.textContent = p.label + ": " + cand.note + ". Superseded by a higher priority trigger.";
        } else {
          li.className = "muted";
          li.textContent = p.label + ": not triggered.";
        }
        trace.appendChild(li);
      });
      if (!selected) {
        U.renderOutput(out, [["Result", "No termination: the match continues."]]);
        return;
      }
      var res = resolveResult(model, selected.cand.cause, selected.cand.actor);
      U.renderOutput(out, [
        ["Final outcome", res.outcome === "Draw" ? "Draw" : "Win for " + PLAYERS[res.winner] + ", Loss for " + PLAYERS[other(res.winner)]],
        ["Winner player id", res.winner ? PLAYERS[res.winner] : "null (draw)"],
        ["Termination cause", res.cause],
        ["Selected trigger", selected.trigger.label],
        ["Candidate triggers", Object.keys(c).length + " of " + model.priority.length]
      ]);
    }
    [core, surrender, disc, timer].forEach(function (el) { el.addEventListener("change", update); });
    widget.hidden = false;
    update();
  }
})();
