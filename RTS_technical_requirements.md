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

### Deterministic Match Termination

- Match end resolution must follow a deterministic state machine defined in [RTS_match_termination_spec.md](RTS_match_termination_spec.md).
- Same-tick termination conflicts must use explicit priority ordering rather than network receive order.
- Draw outcomes are first-class results and must be represented consistently in UI, save data, and replay output.

### Disconnect And Resume Requirements

- Multiplayer disconnect must pause simulation and open a reconnect grace window of at least 90 seconds.
- Entering reconnect grace must create a deterministic resume snapshot with stable content hashing.
- Reconnect timeout must resolve to deterministic forfeit for the disconnected player.

### Replay Audit Requirements

- End-state replay metadata must include termination cause, final tick, trigger event id(s), and same-tick priority trace.
- Disconnect and surrender timelines must be included in replay metadata for dispute/debug verification.
- Match termination ruleset version must be persisted with replay output.

### Deterministic Resource Interaction Requirements

- Resource ownership transitions and tie-break behavior must follow [RTS_resource_ownership_spec.md](RTS_resource_ownership_spec.md).
- Same-frame pickup conflicts must resolve from simulation state only, never network receive order.
- Carrier death vs deposit outcomes must use atomic resolution-tick checks to remain replay-consistent.
- Bank raid actions (steal/deny) and processing channels must use explicit timed interactions, not instant one-frame transfers.

### Resource Audit Requirements

- Replay and telemetry output must include the audit-grade resource event set defined in [RTS_resource_ownership_spec.md](RTS_resource_ownership_spec.md).
- Event payloads must be sufficient to reconstruct ownership disputes and interruption causes without relying on client logs.

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
- [RTS_match_termination_spec.md](RTS_match_termination_spec.md)
- [RTS_resource_ownership_spec.md](RTS_resource_ownership_spec.md)
