# Design Review: Grill Checklist

Purpose: turn review findings into focused grill sessions so each gap can be resolved independently and folded into a publish-ready GDD.

Status updates from author:

- Target quality is publish-ready GDD (Game Design Document), not prototype-only notes.
- Multiplayer skirmish is a product target and must be reflected in the GDD.
- AI skirmish remains critical path for playtesting quality.
- No separate combat spec exists yet and should be created.

---

## 1) Match Termination And Victory Rules (High)

Status: Resolved in v0 ruleset. See [RTS_match_termination_spec.md](RTS_match_termination_spec.md).

Why this matters:

- The current victory condition is clear at a headline level, but edge cases are not fully specified.
- Missing resolution rules will create ambiguous outcomes in multiplayer and unstable QA coverage.

What to flesh out:

- Simultaneous colony-core destruction resolution.
- Time-limit behavior and tie-breaker hierarchy.
- Surrender, disconnect, reconnection, and rematch flow.
- Observer/replay end-state semantics.
- Stalemate detection and anti-stall rules.

Grill questions:

- What is the exact winner selection if both cores die in the same simulation tick?
- If match timer expires, what are tie-breakers in order (core HP, army value, biomass, map control)?
- Is voluntary surrender always immediate, and does it differ in ranked/unranked?
- What happens on network disconnect in multiplayer skirmish (pause, AI takeover, grace timer, forfeit)?
- What replay metadata is required to verify final outcome deterministically?

Definition of done:

- One deterministic match termination state machine with explicit priority order for all outcomes.

Resolution locked:

- Same-tick dual core destruction resolves to draw.
- Timer expiry resolves to draw with no tie-breakers.
- Voluntary surrender uses a 3-second countdown before loss is committed.
- Disconnect pauses match with a 90+ second reconnect window; timeout causes forfeit.
- Disconnect triggers deterministic resume snapshot creation.
- Authoritative resume is enabled for friend/custom contexts and can be disabled for competitive contexts.
- Same-tick priority order is: core destruction, surrender completion, disconnect forfeit, timer expiry.
- No separate stalemate detector in v0.
- Replay output requires audit-grade termination metadata including trigger trace and snapshot hash.

---

## 2) Economy Constants Lock Table (High)

Status: Resolved in v0 constants ruleset. See [RTS_economy_design.md](RTS_economy_design.md).

Why this matters:

- Economy model is strong, but several values are still ranges/placeholders.
- Faction bonuses, AI tuning, and multiplayer fairness all depend on fixed baseline constants.

What to flesh out:

- Initial reclaim ratio by unit category.
- Decay curve constants and grace period.
- Worker free baseline X and progressive upkeep curve constants.
- Military upkeep factor and tier scaling policy.
- Regenerative-site expected share target and cap behavior.

Grill questions:

- What exact reclaim ratio values ship in v0 for cheap, standard, and elite units?
- What is the maximum acceptable corpse decision window before decay creates no meaningful contest?
- At what worker count does progressive upkeep begin to feel like discipline instead of punishment?
- How should upkeep scale in late game to avoid passive max-pop stalemates?
- What is the acceptable income split target over full matches (corpse vs regenerative)?

Definition of done:

- A single versioned table of locked numbers plus allowed tuning bands for patches.

Resolution locked:

- Economy classes are `Worker` and `Warrior` only, with explicit per-unit class tags.
- Reclaim ratios are locked at Worker 0.40 and Warrior 0.65.
- Corpse decay is locked at 12-second grace period and 40-second half-life.
- Worker upkeep baseline is 10 free workers; progressive bracket upkeep starts at worker 11.
- Worker bracket rule is explicit: only workers inside each bracket get that bracket's increased upkeep.
- Military upkeep is aggressive profile: base factor 0.90 with scaling increments +0.20, +0.25, +0.30 at 120, 180, and 230 supply.
- Regenerative sites target 20% to 30% match income share with 35% rolling 5-minute cap guideline.
- Regenerative cap enforcement in v0 is telemetry-driven balancing (design-time), not runtime clamping.
- Allowed tuning bands are locked for patching; out-of-band changes require constants-version increment.

---

## 3) Resource Ownership, Theft, And Logistics Edge Cases (High)

Why this matters:

- Deposit and pass-through rules are good, but contested interactions need deterministic ownership logic.
- Without this, players will discover exploit loops and disputes.

What to flesh out:

- Ownership transitions for dropped biomass, cached biomass, and in-transit biomass.
- Priority and timing rules when multiple players interact with the same resource object.
- Raid/destruction semantics for fortified banks.
- Anti-exploit guardrails for relay chains and grief loops.

Grill questions:

- Who owns dropped biomass if both players issue pickup in the same frame window?
- Can fortified bank contents be partially stolen, fully denied, or both?
- What is the interruption rule if carrier death and deposit occur in near-simultaneous timing?
- Are there minimum handling times to prevent instant chain-relay abuse?
- Which events must be logged for post-match dispute analysis?

Definition of done:

- A resource state machine document with deterministic tie-breaking and anti-exploit constraints.

---

## 4) Faction Scope And Asymmetry Budget (High)

Why this matters:

- Species-led identity is clear, but publish-ready GDD needs concrete launch faction contracts.
- Multiplayer balance and onboarding rely on explicit strengths, weaknesses, and counters.

What to flesh out:

- Launch faction count and exact roster per faction.
- One macro hook per faction with strict boundaries.
- Required hard weakness and counterplay windows per faction.
- Shared baseline rules that cannot be faction-bypassed.

Grill questions:

- What are the non-negotiable identity verbs for each launch faction?
- Which mechanics are globally shared to preserve readability?
- What hard weakness keeps each faction from solving all map states?
- What is the first 8-minute gameplan each faction should naturally incentivize?
- Which mirror-match and cross-matchups are highest risk for degenerate play?

Definition of done:

- One-page contract per launch faction: identity, roster, macro hook, counters, and no-go rules.

---

## 5) Tech Tree Operational Spec (High)

Why this matters:

- Building-gated approach is directionally good, but not yet operational for implementation.
- Missing prerequisites/cost windows will produce dominant build orders by accident.

What to flesh out:

- Explicit building and unit unlock graph.
- Upgrade costs and timings by phase.
- Branch exclusivity or opportunity cost rules.
- Recovery paths after failed tech investments.

Grill questions:

- Which tier transitions are intended to be power spikes versus utility unlocks?
- What are acceptable earliest timestamps for key techs in balanced play?
- Where are deliberate forks that prevent all-in-one "best tree" behavior?
- How much economic delay should a failed tech rush impose?
- What anti-snowball tech options exist for a trailing player?

Definition of done:

- Publishable tech graph with costs, prerequisites, expected timing windows, and counterplay notes.

---

## 6) AI Design For Playtesting And Productization (High)

Why this matters:

- AI is a critical path for practical iteration and remains necessary even with multiplayer goals.
- Behavior goals exist, but measurable skill-tier targets are still needed.

What to flesh out:

- Difficulty tier definitions (reaction time, macro quality, raid frequency, reclaim priority).
- Strategic profiles (aggressive, economic, opportunistic, adaptive).
- Recovery behavior from deficits and anti-throw safeguards.
- Instrumentation and benchmark pass/fail criteria.

Grill questions:

- What does "Beginner/Standard/Hard" mean quantitatively, not just behaviorally?
- How often should AI perform route raids at each difficulty?
- How should AI reprioritize under upkeep stress?
- What comeback capability should AI demonstrate from 20% army value deficit?
- What exploit patterns must AI detect and counter by release?

Definition of done:

- AI specification with measurable KPIs and regression test scenarios per tier.

---

## 7) Technical Readability And Performance Budgets (High)

Why this matters:

- Technical constraints are documented, but publish-ready GDD requires measurable budgets.
- Multiplayer plus high-unit skirmish needs deterministic, testable performance targets.

What to flesh out:

- FPS and frametime targets at population caps.
- Pathfinding budget and unit-order responsiveness thresholds.
- Rendering readability thresholds (minimum silhouette contrast, selection clarity).
- Determinism requirements for multiplayer simulation outcomes.

Grill questions:

- What are min/target FPS thresholds at 200 soft cap and 260 hard cap per player?
- What is the max acceptable command-to-action latency under heavy load?
- What objective readability tests define "legible swarm combat"?
- Which systems must be deterministic for lockstep or replay integrity?
- What is the fallback quality strategy if budget is exceeded?

Definition of done:

- A technical budget table with validation methods and acceptance criteria.

---

## 8) Map Generation And Fairness Constraints (Medium)

Why this matters:

- Water/chokepoint philosophy is good, but map fairness requires explicit generation constraints.
- Multiplayer integrity depends on spawn parity and route symmetry/asymmetry intent.

What to flesh out:

- Spawn fairness metrics and safe-harvest opening windows.
- Route-count minimums between starting regions.
- Shoreline event spawn rules (frequency, value, telegraphing).
- Biome variance bounds and map pool validation checks.

Grill questions:

- What makes a generated map tournament-legal versus casual-only?
- How many viable early expansion routes must each spawn have?
- How much resource asymmetry is acceptable before map veto?
- How often can shoreline high-yield events appear without deciding matches by RNG?
- What static and runtime checks validate map fairness before release?

Definition of done:

- A map specification with fairness metrics, event rules, and validation pipeline.

---

## 9) New Required Document: Combat Specification (High)

Why this matters:

- No combat spec exists yet, creating a major gap between economy/tech intent and actual gameplay feel.
- Combat details are required for balance, AI behavior, and multiplayer determinism.

What to include in combat spec:

- Damage model (types, resistances, armor interactions, hit resolution).
- Engagement verbs and counter-verbs (including anti-air interactions).
- Unit role taxonomy and target priorities.
- Morale/status effects, regeneration, and retreat mechanics (if any).
- Time-to-kill targets by phase and role matchup.
- Micro ceiling rules and readability constraints.

Grill questions:

- What is the intended TTK envelope for worker, skirmisher, tank, and specialist roles?
- Which interactions are hard counters versus soft counters?
- How much micro should flip expected outcomes in equal-cost fights?
- Which combat effects are disallowed due to readability or determinism risk?
- What combat telemetry is required to balance patches safely?

Definition of done:

- A dedicated combat spec document with role matrix, formulas, TTK targets, and test scenarios.

---

## 10) Multiplayer Skirmish Requirements To Add To GDD (High)

Why this matters:

- Multiplayer is now explicitly in scope and needs first-class requirements in the GDD.
- Networking decisions affect combat, pathing, timing, and replay architecture.

What to flesh out:

- Supported match sizes and team modes.
- Simulation model assumptions (deterministic lockstep or alternative).
- Reconnect, pause, and desync handling policy.
- Matchmaking/lobby requirements (if applicable for release scope).
- Anti-cheat and authoritative validation boundaries.

Grill questions:

- What is the first shippable multiplayer mode (1v1, 2v2, custom lobbies)?
- What networking model best matches deterministic RTS needs and team size goals?
- What are desync detection and recovery workflows?
- What offline/AI parity is required for training before queue play?
- Which multiplayer features are required for v1 versus post-launch?

Definition of done:

- A multiplayer requirements section in the GDD with explicit out-of-scope list for v1.

---

## Suggested Grill Order

1. Match termination and victory rules.
2. Economy constants lock table.
3. Resource ownership and theft edge cases.
4. Combat specification creation.
5. Faction asymmetry contracts.
6. Tech tree operational spec.
7. AI measurable tier design.
8. Technical performance/readability budgets.
9. Map generation and fairness constraints.
10. Multiplayer skirmish requirements and v1 scope gates.

Rationale:

- This order resolves deterministic rules first, then balance foundations, then content asymmetry, then implementation constraints, and finally release-scope packaging.
