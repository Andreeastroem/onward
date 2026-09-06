# Onward

Onward is a design project for a 3D, fixed-isometric real-time strategy game about ant colonies competing to survive in a living ecosystem. Players build colonies, scout and contest the map, recover biomass from corpses and regenerative sites, defend vulnerable supply lines, advance through tech, and destroy the opposing colony core.

The design aims for readable classic RTS play at high unit density: individual-unit control, logistics-driven economy, distinct ant-species factions, meaningful macro and micro decisions, and deterministic behavior suitable for skirmish, multiplayer, and replay verification.

## Documentation Status

| Area | Status | Document |
| --- | --- | --- |
| Project vision, gameplay loop, factions, modes, and victory condition | Documented | [RTS_design_doc.md](RTS_design_doc.md) |
| Economy, biomass recovery, upkeep, logistics, and economy telemetry | Documented with locked v0 constants | [RTS_economy_design.md](RTS_economy_design.md) |
| Resource ownership, pickup conflicts, bank raids, processing, and audit logging | Documented and locked for v0 | [RTS_resource_ownership_spec.md](RTS_resource_ownership_spec.md) |
| Combat roles, damage model, counterplay, TTK targets, and determinism | Documented as a v0 baseline | [RTS_combat_spec.md](RTS_combat_spec.md) |
| Construction, production queues, placement, refunds, spawning, and connectivity | Documented as a v0 baseline | [RTS_production_operations_spec.md](RTS_production_operations_spec.md) |
| Tech tiers, prerequisite structure, gating, and recovery policy | Documented as a placeholder-based v0 baseline | [RTS_tech_tree_operational_spec.md](RTS_tech_tree_operational_spec.md) |
| Match outcomes, surrender, disconnects, resume flow, and replay metadata | Documented and locked for v0 | [RTS_match_termination_spec.md](RTS_match_termination_spec.md) |
| Presentation, unit scale, terrain constraints, and deterministic simulation requirements | Documented | [RTS_technical_requirements.md](RTS_technical_requirements.md) |
| Candidate factions, asymmetry directions, matchup intent, and exception candidates | Documented as design direction | [RTS_potential_factions.md](RTS_potential_factions.md) |
| Design-review decisions, gaps, and prioritization | Documented | [design_review.md](design_review.md) |

## Left To Document

The following work is explicitly deferred or still identified as a gap:

- Final launch faction count, named faction rosters, unit stats, costs, and faction-specific production or connectivity exceptions.
- Concrete tech-tree artifacts: named nodes, costs, build times, economy thresholds, earliest unlock timings, opportunity-cost targets, and a graph diagram.
- AI specification with measurable difficulty tiers, behavioral KPIs, exploit handling, and regression scenarios.
- Technical performance and readability budget with FPS, frame-time, pathfinding, command-latency, 3D rendering and asset budgets, visual-legibility, and fallback-quality acceptance criteria.
- Map-generation and fairness specification covering spawn parity, route availability, biome variance, shoreline-event rules, and validation.
- Multiplayer skirmish requirements covering initial modes and team sizes, networking and desync strategy, lobby or matchmaking scope, anti-cheat boundaries, and v1 exclusions.
- Final combat readability limits for overlapping AoE, plus balance validation using faction-specific unit data.

## Current Scope

The immediate product focus is skirmish against AI, with multiplayer skirmish treated as a product target. Campaign, narrative progression, ranked systems, and a regional-conquest mode are not part of the current v0 scope.
