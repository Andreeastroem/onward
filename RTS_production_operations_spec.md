# Ant RTS Production Operations Specification (v0)

## Purpose

Define deterministic construction and unit production behavior for skirmish, including worker-assisted build acceleration, ticking surcharge rules, queue semantics, spawn resolution, and replay-grade event logging.

## Scope

- Applies to AI and multiplayer skirmish.
- Covers building construction and unit production operations.
- Does not define faction-final unit stats, combat tuning, or matchmaking.

## Locked Production Model

- Construction model is multi-worker acceleration.
- Worker 1 contributes baseline build speed and has no surcharge.
- Workers 2+ add both speed and a ticking surcharge.
- Build placement uses adjacency projection from owned structures (creep-style footprint expansion).
- No global enemy exclusion zone is used in v0.
- Connectivity is required for most factions; disconnected structures are non-functional until reconnect.
- Faction exceptions are allowed through explicit per-faction rule flags.

## Construction Placement Rules

Placement preconditions:

1. Candidate footprint must fit walkability and static occupancy rules.
2. Candidate footprint must be adjacent to at least one valid friendly projection source.
3. Candidate footprint must not overlap blocked terrain or existing permanent footprint.

Adjacency projection:

- Each completed structure projects a placement ring.
- Placement is valid if any tile in the candidate footprint intersects any friendly projection ring.
- Projection updates are evaluated on simulation ticks and are replay deterministic.

## Builder Assignment And Scaling

### Builder Count

- Per-site builder hard cap uses one global value in v0.
- Baseline default is `max_builders_per_site = 24` (mid-tens target).
- Factions may override this through explicit exception data.

### Speed Multiplier

For `n` active builders on one site:

`S(n) = 1 + 0.55 * sqrt(n - 1)`, for `n >= 1`

Where:

- `S(1) = 1.0` baseline speed.
- Additional builders give diminishing returns at every step.

### Ticking Surcharge

For `n` active builders on one site:

`TickSurcharge(n) = k * (n - 1)^2`, for `n >= 2`

Where:

- `k` is a building-specific surcharge constant.
- Worker 1 has no surcharge.
- Surcharge starts at worker 2.

## Initial Balancing Appendix (v0 Defaults)

This appendix defines default starting values for `k` by building class so tuning can begin from a consistent baseline.

### Baseline `k` Constants By Building Class

- Economy/utility structures: `k = 0.35`
- Military production structures: `k = 0.50`
- Tech/advanced unlock structures: `k = 0.70`
- Defensive/control structures: `k = 0.60`

Interpretation:

- Lower `k` values permit longer multi-builder acceleration windows before heavy economic pain.
- Higher `k` values preserve strategic commitment and make burst-build decisions more punishable.

### Sample Surcharge Multipliers Relative To `k`

Using `TickSurcharge(n) = k * (n - 1)^2`:

- `n = 1`: `0 * k`
- `n = 2`: `1 * k`
- `n = 4`: `9 * k`
- `n = 8`: `49 * k`
- `n = 12`: `121 * k`
- `n = 16`: `225 * k`
- `n = 20`: `361 * k`
- `n = 24`: `529 * k`

### Balance Safety Notes

- Keep `k` shared by class (not per individual structure) in early balancing to reduce tuning noise.
- Avoid lowering `k` and increasing `max_builders_per_site` in the same patch unless playtests explicitly require it.
- If proxy snowball appears in testing, raise `k` for military and defensive classes before changing speed curve `S(n)`.

## Cost Commitment And Refund Policy

### Base Construction Cost Commitment

- Base construction cost is committed progressively by build progress ticks.
- At progress `p` in `[0, 1]`:
  - `base_spent = base_cost * p`
  - `base_unspent = base_cost * (1 - p)`

### Cancel Refund Rule

- Cancel refunds only remaining unspent base cost.
- Spent base cost is not refunded.
- Paid ticking surcharge is never refunded.

### Under-Construction Destruction Rule

- If a structure is destroyed while under construction:
  - No refund is granted in v0.
  - Any already-paid surcharge remains sunk.

## Insolvency And Auto-Throttle Behavior

If stockpile cannot pay current tick surcharge for assigned builders:

1. The site auto-throttles to the highest affordable active builder count.
2. At least one builder remains active if builder 1 assignment is valid.
3. Construction continues at the resulting reduced speed.

Deterministic throttle selection:

1. Preserve earliest-assigned builders first.
2. If tie, preserve lowest unit id first.
3. Remaining builders enter `ThrottleIdle` state for that site.

Readability requirements:

- Site UI must display surcharge shortfall reason.
- Site UI must display `active_builders / assigned_builders`.
- Throttled builders must show an explicit suppressed/idle reason code.

## Construction Interruption And Persistence

- If all builders leave, construction progress persists indefinitely.
- Returning valid builders resume from saved progress.
- No passive decay of build progress in v0.

## Connectivity Policy

- Most factions require connected structure networks for functionality.
- Disconnected structures remain present but non-functional.
- Reconnection restores functionality on deterministic tick transition.
- Faction exceptions may allow partial or full operation while disconnected.

## Unit Production Topology

- Topology is hybrid.
- Most combat units are produced from the hive.
- Structure-local queues are primarily used for upgrades and special exceptions.
- Faction exceptions may enable additional local unit production lanes.

## Queue Semantics

- Queue model is single queue per production source.
- No parallel slots in baseline v0.
- Queue operations are deterministic FIFO unless a source-specific override is explicitly defined.

Required queue operations:

1. Enqueue request.
2. Dequeue/cancel specific entry.
3. Start production.
4. Complete production.

## Rally Behavior

- Rally supports both:
  - Rally to map point.
  - Rally to unit follow target.
- If rally-to-unit target becomes invalid, fallback is last valid map-point rally for that source.

## Spawn Resolution

- Production completion always spawns the unit.
- If spawn area is occupied, deterministic collision-push resolution is applied.

Deterministic collision-push contract:

1. Spawn unit at source spawn origin.
2. Resolve overlaps by deterministic displacement order (lowest unit id first among colliders).
3. Apply bounded push steps until no overlap or max push iterations reached.
4. If max iterations reached, mark congested state and continue deterministic push on subsequent ticks.

This keeps "always spawn" behavior while preserving replay parity.

## Forward Proxy Construction Policy

- No special anti-proxy exclusion radius is applied in v0.
- Proxy pressure is countered by combat/logistics interaction, adjacency dependency, and surcharge economics.
- Faction-specific anti-proxy or proxy-enhancing exceptions are allowed later.

## Deterministic State Machines

### Construction State Machine

States:

1. `PlacementPreview`
2. `PlacedUnstarted`
3. `Constructing`
4. `ConstructingThrottled`
5. `PausedNoBuilders`
6. `Completed`
7. `Canceled`
8. `DestroyedUnderConstruction`

Core transitions:

1. `PlacementPreview -> PlacedUnstarted`
   - Trigger: valid placement confirm

2. `PlacedUnstarted -> Constructing`
   - Trigger: at least one valid builder assigned

3. `Constructing -> ConstructingThrottled`
   - Trigger: surcharge insolvency detected

4. `ConstructingThrottled -> Constructing`
   - Trigger: surcharge affordability restored

5. `Constructing|ConstructingThrottled -> PausedNoBuilders`
   - Trigger: active builder count reaches zero

6. `PausedNoBuilders -> Constructing`
   - Trigger: builder assignment restored

7. `Constructing|ConstructingThrottled|PausedNoBuilders -> Completed`
   - Trigger: progress reaches 1.0

8. `PlacedUnstarted|Constructing|ConstructingThrottled|PausedNoBuilders -> Canceled`
   - Trigger: player cancel; refund `base_unspent`

9. `PlacedUnstarted|Constructing|ConstructingThrottled|PausedNoBuilders -> DestroyedUnderConstruction`
   - Trigger: HP reaches 0 before completion; no refund

### Production State Machine

States:

1. `Idle`
2. `Queued`
3. `Producing`
4. `ReadyToSpawn`
5. `SpawnResolving`

Core transitions:

1. `Idle -> Queued`
   - Trigger: first enqueue

2. `Queued -> Producing`
   - Trigger: queue head starts

3. `Producing -> ReadyToSpawn`
   - Trigger: production timer complete

4. `ReadyToSpawn -> SpawnResolving`
   - Trigger: spawn attempt

5. `SpawnResolving -> Idle|Queued`
   - Trigger: spawn success and dequeue next

## Replay And Telemetry Requirements (Audit Grade)

Mandatory events:

1. Build placed.
2. Builder assigned and unassigned.
3. Tick surcharge charged with stockpile delta.
4. Auto-throttle trigger and release.
5. Cancel event with refund amount.
6. Under-construction destruction with refund/salvage result.
7. Queue enqueue, dequeue, start, complete.
8. Spawn blocked/congested and resolution result.
9. Rally set and rally changed.
10. Connectivity lost/restored and functional disable/enable.

## Versioning

- Initial release: `production_operations_spec_version = 1`.
- Any change to scaling formulas, refund policy, queue semantics, or spawn resolution ordering requires version increment.

## Related Documents

- [RTS_design_doc.md](RTS_design_doc.md)
- [RTS_economy_design.md](RTS_economy_design.md)
- [RTS_resource_ownership_spec.md](RTS_resource_ownership_spec.md)
- [RTS_technical_requirements.md](RTS_technical_requirements.md)
