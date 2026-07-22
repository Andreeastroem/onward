# Ant RTS Resource Ownership And Logistics Specification (v0)

## Purpose

Define deterministic ownership, theft, denial, and logistics resolution for biomass resources across dropped corpses, carriers, banks, and core deposit.

## Scope

- Applies to AI and multiplayer skirmish.
- Covers ownership and transfer rules for resource interactions.
- Does not define combat balance, map generation, or matchmaking rules.

## Ownership Model

- Core-credit authoritative model is locked for v0.
- Biomass is spendable only after credit at colony core.
- Banks are pass-through caches and raid targets, not final spend authorities.
- Bank inventory is universally visible to the owning player but remains uncredited until core deposit.

## Resource State Machine

Resource states:

1. `DroppedUnclaimed`
2. `ClaimedInTransit`
3. `BankCachedRaw`
4. `BankCachedProcessed`
5. `CoreCredited`
6. `DestroyedDenied`

Allowed transitions:

1. `DroppedUnclaimed -> ClaimedInTransit`
   - Trigger: pickup lock resolved

2. `ClaimedInTransit -> DroppedUnclaimed`
   - Trigger: carrier death, interruption, or forced drop

3. `ClaimedInTransit -> BankCachedRaw`
   - Trigger: corpse delivered to bank
   - Exception: small single-carrier corpses auto-convert directly to `BankCachedProcessed`

4. `BankCachedRaw -> BankCachedProcessed`
   - Trigger: processing complete at bank

5. `BankCachedProcessed -> ClaimedInTransit`
   - Trigger: withdraw by friendly carrier up to carrier capacity

6. `ClaimedInTransit -> CoreCredited`
   - Trigger: carrier reaches core and deposit resolves

7. `BankCachedRaw|BankCachedProcessed -> DestroyedDenied`
   - Trigger: successful deny action during raid

## Deterministic Tie-Break Rules

### Same-Frame Pickup Conflicts

If multiple players attempt pickup in the same frame window, resolve ownership by this priority tuple:

1. Earliest simulation tick/substep interaction
2. Shortest path-distance to resource at lock tick
3. Lower unit id

No split payout and no no-winner lock state in v0.

### Near-Simultaneous Death And Deposit

Use an atomic position check at resolution tick:

- If carrier is alive and within valid deposit radius at resolution tick, deposit succeeds.
- Otherwise biomass drops at death position.

## Bank Raid Semantics

- Fortified bank contents support both steal and deny actions.
- Steal transfers biomass to attacker carriers (subject to channel and carry limits).
- Deny destroys target biomass from the bank cache.
- Bank cannot be instantly emptied by a single discrete action; channeling and throughput limits apply.

## Anti-Exploit Handling Times (v0 Baseline)

- Pickup lock: 0.35s
- Handoff lock between carriers: 0.50s
- Bank steal channel: 1.00s per chunk
- Bank deny channel: 1.50s per chunk

Values are baseline tuning defaults and may be adjusted through balance passes.

## Corpse Conversion And Processing

- Small corpses (single-carrier class) auto-convert on bank arrival.
- Medium and larger corpses require processing duty.
- Processing time uses logarithmic scaling with deterministic clamps:

`process_time_seconds = clamp(min_process_seconds, max_process_seconds, base_process_seconds + k * ln(1 + corpse_mass / mass_ref))`

This preserves high payoff for large creatures without linear runaway processing time.

## Replay And Dispute Audit Logging (Audit Grade)

Required events:

- Pickup attempts, including losing contenders
- Ownership lock resolution tuple outcome
- Drop events with cause and position
- Core deposit events with credited amounts
- Bank withdraw events with amounts
- Bank steal/deny channel start, cancel, complete
- Bank processing queue enqueue, start, complete
- Relay/handoff events
- Interruption reasons (death, stun, command cancel, out-of-range)

## Versioning

- Initial release: `resource_ownership_spec_version = 1`.
- Any change to tie-break priority, ownership authority, or channel timing requires version increment.
