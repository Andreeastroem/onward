# Ant RTS Match Termination Specification (v0)

## Purpose

Define deterministic end-of-match behavior for skirmish with explicit priority, tie handling, disconnect flow, and replay verification metadata.

## Scope

- Applies to AI skirmish and multiplayer skirmish.
- Applies to match outcome resolution only, not matchmaking, ranking, or anti-cheat policy.

## Core Outcomes

- Win
- Loss
- Draw

## Locked Outcome Rules

### Core Destruction

- A player wins when the opposing colony core is destroyed.
- If both colony cores are destroyed in the same simulation tick, the match result is `Draw`.

### Timer Expiry

- If the match timer expires before a decisive core kill, the result is `Draw`.
- No tie-breaker hierarchy is applied in v0.

### Voluntary Surrender

- Surrender uses a 3-second confirmation countdown.
- If countdown completes, surrender resolves immediately and the surrendering player loses.

### Disconnect

- On disconnect, the match enters a paused reconnect state.
- Reconnect window is 90 seconds minimum.
- If reconnect succeeds before timeout, match resumes.
- If reconnect fails by timeout, disconnected player forfeits.
- On disconnect entry, the game writes a deterministic resume snapshot.

### Resume Authority

- Dual-mode policy:
  - Friend/custom contexts may resume from the disconnect snapshot as an authoritative continuation.
  - Competitive contexts (if introduced later) can disable authoritative resume.

### Stalemate

- No separate stalemate detector in v0.
- Only core destruction, surrender, disconnect forfeit, or timer expiry can terminate a match.

## Same-Tick Priority Order

If multiple termination triggers resolve on the same simulation tick, apply this strict priority:

1. Core destruction
2. Surrender completion
3. Disconnect forfeit (grace timeout reached)
4. Timer expiry

This priority is deterministic and replay-auditable.

## Match Termination State Machine

States:

- Running
- PausedReconnect
- Ended

Transitions:

1. `Running -> Ended`
   - Trigger: core destruction event
   - Result: win/loss, or draw for same-tick dual core death

2. `Running -> Ended`
   - Trigger: surrender countdown complete
   - Result: surrendering player loses

3. `Running -> PausedReconnect`
   - Trigger: player disconnect
   - Side effect: deterministic resume snapshot saved

4. `PausedReconnect -> Running`
   - Trigger: disconnected player reconnects within grace window

5. `PausedReconnect -> Ended`
   - Trigger: grace window timeout reached
   - Result: disconnected player forfeits

6. `Running -> Ended`
   - Trigger: timer expiry
   - Result: draw

## Replay And End-State Metadata (Audit Grade)

Each finished match record must include:

- Match id
- Final simulation tick
- Final outcome (`Win`, `Loss`, `Draw`)
- Winner player id (nullable for draw)
- Termination cause (`CoreKill`, `DualCoreKill`, `Surrender`, `DisconnectForfeit`, `TimerDraw`)
- Trigger event id(s)
- Same-tick priority trace (all candidate termination triggers and final selected trigger)
- Per-player terminal state summary (connected/disconnected, surrendered flag, core alive/dead)
- Disconnect timeline (disconnect tick, reconnect tick if any, grace expiry tick)
- Surrender timeline (request tick, countdown end tick)
- Resume snapshot id and content hash when created
- Ruleset version (`match_termination_spec_version`)

## Versioning

- Initial release: `match_termination_spec_version = 1`.
- Any future change to priority, timers, or tie behavior increments this version.
