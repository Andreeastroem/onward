# Ant RTS Combat Specification

## Purpose

Define the v0 combat contract needed to align economy, tech progression, AI behavior, readability, and multiplayer determinism.

This document is intentionally faction-agnostic at the base layer. Faction identity should be expressed through role combinations and kit design on top of this contract.

## Scope And Status

- Status: v0 baseline locked.
- Faction-final unit rosters are deferred.
- Combat values here are target envelopes and system rules, not final per-unit tuning.

## Core Combat Philosophy

- Combat should be fast, decisive, and readable under high unit density.
- Supply-line pressure is a first-class combat objective, not a side system.
- Counterplay should be mostly soft in v1, with room to introduce mixed hard anchors later.

## Time-To-Kill (TTK) Targets

Equal-cost engagement target envelopes by phase:

- Early game: 2.0 to 3.0 seconds.
- Mid game: 1.5 to 2.5 seconds.
- Late game: 0.5 to 1.0 seconds.

Notes:

- These are baseline encounter targets and will be validated against readability tests.
- If late-game readability collapses, pacing reduction takes priority over strict adherence to the lowest bound.

## Role Taxonomy Contract

### Mandatory v1 capability coverage per faction

- Worker.
- Warrior.
- Air.
- Anti-air.
- Behemoth.

### Role composition policy

- Units may carry multiple tactical roles.
- Multi-role mapping (for example, flying raider, flying artillery, flying support) is a primary faction-identity lever.

### Baseline role matrix template

| Role family | Primary function                       | Typical vulnerabilities               | Counterplay expectation                   |
| ----------- | -------------------------------------- | ------------------------------------- | ----------------------------------------- |
| Worker      | Gather, transfer, sustain routes       | Low durability, poor direct combat    | Raid, intercept, route denial             |
| Warrior     | Frontline pressure and trades          | Can be outpositioned and AoE punished | Flank, concave, anti-blob responses       |
| Air         | Mobility, bypass, disruption           | Vulnerable to dedicated anti-air      | Scout and react with anti-air             |
| Anti-air    | Deny air control and protect logistics | Lower generalist value vs ground      | Force ground pressure or split map        |
| Behemoth    | Fight-swing anchor with high upkeep    | Slow, expensive, scoutable commitment | Focused counter-tech and positional traps |

## Counter System Policy

- v1 baseline is soft countering.
- Mixed countering (some hard anchors) is an allowed future direction if faction design pressure requires it.

## Damage Model And Formulas

### Damage channels (v1)

- `physical`
- `siege`

Intent:

- Keep the model easy to reason about while still separating structure-break tools from anti-unit tools.

### Armor model (v1)

- Flat reduction.
- Minimum post-mitigation hit damage floor: `1`.

Formula:

$$
\text{final\_hit\_damage} = \max\left(1,\; \text{raw\_hit\_damage} - \text{flat\_armor}_{\text{vs damage type}}\right)
$$

### Additional effect channels

- DoT and AoE are supported as mechanics.
- Additional damage types are deferred to later passes.

## Hit Resolution And Friendly Fire

- Hit model: guaranteed hit with deterministic timing.
- Friendly fire: disabled in v1.

## AoE Policy

- AoE is a core anti-blob pillar in v1.
- AoE must have strong visual telegraphing and distinct effect identity.
- Simultaneous overlapping AoE readability limits are to be validated in test scenarios.

## Status Effects

Allowed v1 status set:

- Slow.
- Armor break.
- Damage over time.
- Stun.

Status design rule:

- Every status source must provide clear source and duration telegraphing.

## Proc Randomness Policy

- Medium proc usage is allowed if telegraphing is strong.
- Proc outcomes must be deterministic at simulation level for replay/network parity.

Deterministic proc rule:

- Any proc roll must be derived from deterministic simulation inputs (tick index, event sequence id, stable entity ids), never client-local RNG state.

## Aura Stacking Policy

- Aura stacking is additive by default.
- Aura source and stack contribution must be inspectable in debug/telemetry overlays.

## Regeneration And Retreat

- Regeneration exists.
- No automatic retreat mechanic in v1.
- Retreat remains a manual control and positioning skill expression.

## Targeting And Command Responsiveness

- A-move behavior can use role-specific default priorities.
- Direct attack-unit commands must remain highly responsive and override A-move heuristics promptly.

Default priority examples:

- Anti-air units prioritize airborne threats during A-move.
- Raider profiles prefer workers/carriers and exposed logistics targets during A-move.

## Supply-Line Disruption Verbs (Combat Linked)

- Resource-site raid.
- Bank destruction or denial pressure.
- Logistic-trail raid/intercept.
- Biomass drop-on-engage pressure.

These interactions are combat-valid objectives, not merely macro side effects.

## Structure Combat Policy

- v1 defensive structures should bias toward utility-control defense rather than high-damage turrets.
- Preferred baseline includes thematic defensive control effects (for example, snare/slow).

## Behemoth Contract

- Behemoths are upkeep-heavy fight-swing units.
- They should be able to swing a main engagement when correctly supported.
- Their commitment must be scoutable and punishable through counter-tech or positional play.

## Micro Ceiling Target

- In equal-cost mirror fights, high-skill micro should swing outcomes by roughly 15% to 25%.
- Highest-signal micro skills for v1:
  - Concave setup.
  - Flanking timing.

Macro pressure note:

- Players should be forced to balance local micro execution against simultaneous raid/defense demands elsewhere.

## Readability And Telegraphing Requirements

Hard bans:

- Invisible projectiles.
- Identical VFX language for distinct actions/effects.

Telegraph clarity tiers:

- Tier 1 (basic attacks): readable projectile or contact feedback and clear source.
- Tier 2 (status and AoE abilities): obvious area/targeting indicator and effect identity.
- Tier 3 (fight-swing abilities and behemoth actions): high-contrast pre-impact telegraph plus unmistakable impact signature.

## Determinism Non-Negotiables

The following systems must be deterministic across replay and multiplayer simulation:

- Damage roll outcomes.
- Status duration and expiration.
- Aura application and stacking order.

Implementation guidance:

- Never use wall-clock, frame-time jitter, or client-local RNG as outcome inputs.

## Test Scenarios And Telemetry Hooks (Required)

### Scenario categories

- Equal-cost mirror phase fights (early, mid, late) to validate TTK envelopes.
- Air vs anti-air response windows.
- AoE anti-blob stress tests at high population.
- Behemoth swing and punish-window tests.
- Multi-front stress tests combining frontline micro with logistics raids.

### Minimum telemetry outputs

- Effective DPS by role family and damage channel.
- Realized TTK distributions by phase and matchup archetype.
- Status uptime and stack counts by source.
- Aura stack totals and ordering traces.
- Proc trigger counts and deterministic seed/event audit traces.
- Logistics disruption outcomes (resource denied, bank loss, carrier loss during fights).

## Deferred To Next Pass

- Exact per-unit stat sheets and costs.
- Full role-matchup matrix by named faction units.
- Any additional damage types beyond `physical` and `siege`.
- Final AoE overlap readability caps with hard numeric thresholds.

## Related Documents

- [RTS_design_doc.md](RTS_design_doc.md)
- [RTS_technical_requirements.md](RTS_technical_requirements.md)
- [RTS_economy_design.md](RTS_economy_design.md)
- [RTS_tech_tree_operational_spec.md](RTS_tech_tree_operational_spec.md)
- [RTS_resource_ownership_spec.md](RTS_resource_ownership_spec.md)
