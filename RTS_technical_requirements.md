# Ant RTS Technical Requirements

## Purpose

This document locks the core presentation and simulation constraints that shape production scope, readability, and performance targets.

## Locked Decisions

### Presentation

- The game is full 2D.
- The camera uses a high-angle oblique top-down view.
- Strict art rules are required to preserve readability at scale.

### Simulation Scale

- The game does not use squad-based control as the primary abstraction.
- The recommended scale target is 200 soft cap and 260 hard cap per player.

### Readability And Performance Intent

- The visual language must remain clear under swarm density.
- Large battles should stay legible without requiring squad-level unit grouping.
- The cap exists to keep pathfinding, selection, and AI behavior within a manageable RTS budget.

### Terrain Constraints

- Water is impassable in the baseline rules.
- Impassable water should be used to create chokepoints and shape early map flow.
- Shoreline biomass events, including fish-like supply drops, are allowed as narrative map dressing and resource opportunities.

## Production Implications

- Unit silhouettes, color coding, and motion clarity must be strong enough to support dense 2D combat.
- Pathfinding and combat AI should assume individual units, not squad containers.
- Match pacing and map size should be tuned around the 200 / 260 scale target rather than around mass-squad abstraction.

## Related Design Documents

- [RTS_design_doc.md](RTS_design_doc.md)
- [RTS_economy_design.md](RTS_economy_design.md)
