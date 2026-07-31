# Ant RTS Tech Tree Operational Spec

## Purpose

Define a publishable, implementation-ready baseline for tech progression using placeholder nodes and timing windows that can later be mapped to faction-specific names, units, and exact values.

This document intentionally locks structure before final faction design.

## Scope And Status

- Status: v0 structural baseline.
- This is a shared baseline graph with faction overlays, not faction-final content.
- Launch design intent is to complete non-faction systems first, then apply faction identity as deviations from this baseline.

## Baseline Principles

- One shared tech skeleton across factions preserves readability and onboarding.
- Factions should deviate through selective node substitutions, branch emphasis, and modifier overlays.
- Tech should create both pressure opportunities and logistics scaling opportunities.
- Any unlock that strongly disrupts supply lines must be telegraphed and gated.

## Tier Model (v0)

There are three baseline progression tiers:

1. Establishing
2. Expanding
3. Thriving

Tier transitions are hybrid transitions (power plus economy):

- They unlock stronger combat pressure options.
- They also unlock units/upgrades that can process larger biomass logistics loads.

## Unlock Graph Contract (Placeholder)

Node names are placeholders and should be replaced by faction-specific names later.

### Building Nodes

- B0: Colony Core (start).
- B1: Basic Infantry Production.
- B2: Logistics/Expansion Hub (placeholder for bank-route and throughput support).
- B3: Specialist Structure (faction overlay slot).

### Upgrade Nodes

- U1: Tier 2 Access Gate.
- U2: Logistics Throughput Upgrade.
- U3: Specialist Mobility/Disruption Package.
- U4: Tier 3 Access Gate.

### Unit Class Unlock Nodes

- C1: Baseline frontline units.
- C2: Mid-tier pressure units.
- C3: Special-movement disruption units (ranged AoE, flyers, burrowers).
- C4: Behemoth-class swing units.

### Directed Dependencies (v0 Placeholder)

- B0 -> B1 -> U1 -> C2.
- B1 + economy threshold gate -> B2 -> U2.
- B1 + U1 + economy threshold gate -> B3 -> U3 -> C3.
- B3 + U4 + economy threshold gate -> C4.

Notes:

- Economy threshold gate is currently modeled as a biomass-per-minute condition.
- Exact threshold values are deferred until factions, map examples, and loop timings are more mature.

## Branching And Exclusivity Policy

- No hard branch exclusivity in v0.
- All major branches are reachable in a match.
- Opportunity cost, not lockout, is the main balancing lever.

Fork design rule:

- Choosing a branch must delay at least one alternate branch enough to create counterplay scouting windows.
- Delay is currently a placeholder band and will be set after timing calibration.

## Upgrade Economy Policy

- Preferred model: mixed scaling (cheap entry, steeper specialization).
- Allowed fallback: convex scaling for repeatable infinite-tier stat upgrades.
- Expected normal-build spend by minute 10:
  - Tech/upgrades: 15% to 20% of total biomass spend.
  - Remaining spend is intentionally left available for workers, army mass, and map pressure decisions.

## Timing Windows

Exact earliest timestamps are intentionally deferred.

Deferred timing set:

- First meaningful combat upgrade.
- First mobility/vision utility unlock.
- First siege or base-break option.
- First anti-air answer.
- First endgame-cap swing unit/effect.

Reason for deferment:

- Current project phase lacks finalized faction roster, complete combat spec, and map fairness examples needed to set durable timing targets.

## Failed Rush Recovery And Risk Budget

### Failure Definition (v0)

A tech rush is considered failed when it produces no meaningful damage to enemy logistics (supply chain/resource-site flow), including no durable disruption to contested economy lanes.

### Intended Penalty Window (v0)

- Failed rush vulnerability target: 40 to 80 seconds.

### Recovery Rules (v0)

- Salvage/refund on canceled or destroyed in-progress tech is allowed.
- Defender-side shorter corpse-return distance is an intended soft rubber-band effect.
- Expansion semantics (including how banks are treated in this context) remain open and will be finalized with faction and map integration.

## Counterplay And Telegraphing Contract

Each major spike/disruption tech must expose scoutable and punishable windows.

Required counterplay channels:

- Visible prerequisite building scouting.
- Build-time vulnerability window.
- Counter-tech response path.

Optional channel:

- Resource-starvation denial pressure, but this should not dominate because static site income is intentionally secondary.

Information visibility policy:

- Baseline: scouting reveals building presence.
- Preferred extension: active/working structures show readable VFX state.
- Upgrade-driven model/visual changes on units are encouraged for readability.

## Gating Policy For High-Impact Unit Types

Units with high supply-line disruption or extreme positional leverage must use stronger composite gating (building + upgrade + economy gate):

- Flyers.
- Burrowers.
- Ranged AoE specialists.
- Behemoth-class units.

Rationale:

- These mechanics can bypass or invalidate normal frontline/supply-line interaction if unlocked too early or with weak telegraphing.

## AI Build Archetype Compatibility (v1)

- AI v1 targets one faction first.
- AI uses curated archetypes, not full dynamic branch search.
- Minimum archetype set for variety:
  - Economic.
  - Aggressive.
  - Balanced.
  - Raiding-focused.

## Multiplayer Balance Policy

- v1 uses one shared tech timing model across 1v1 and team modes.
- Strict competitive split-balance is not a v1 priority; fun-forward consistency is preferred.

## Determinism And Readability Guardrails

- Probabilistic combat procs are allowed in principle.
- Aura stacking is allowed in principle.
- Any probabilistic or stacking system added through tech must still satisfy replay determinism and combat readability constraints in the combat and technical specs.
- Hidden or ambiguous stacking math should be avoided unless clearly surfaced in UI.

## Publishable Artifact Checklist (v0)

The following are mandatory now as template artifacts:

- Tech graph diagram (placeholder node names allowed).
- Per-node contract table: cost field, time field, prerequisites, unlocks, counterplay notes.
- Timing-window template chart with deferred-value markers.
- Recovery and failed-rush policy notes.
- Tuning-band placeholders for future patch safety.

## Open Items To Resolve In Next Pass

- Final expansion semantics for risk/recovery language (including bank linkage).
- Exact earliest unlock timing windows.
- Exact economy threshold values used by tier gates.
- Concrete fork-by-fork opportunity-cost targets.
- Mapping placeholder nodes to faction-specific names and units.

## Related Documents

- [RTS_design_doc.md](RTS_design_doc.md)
- [RTS_economy_design.md](RTS_economy_design.md)
- [RTS_technical_requirements.md](RTS_technical_requirements.md)
- [RTS_resource_ownership_spec.md](RTS_resource_ownership_spec.md)
