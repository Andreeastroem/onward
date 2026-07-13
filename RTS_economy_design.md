# Ant RTS Economy Design

## Purpose

Define a complete economy model that is deep enough to drive strategy and simple enough to read at RTS speed. This document is intended to be the baseline for later ant-species asymmetry design.

## Economy Goals

- Keep one primary resource for clarity.
- Make map control and supply lines matter as much as combat power.
- Reward good macro with compounding growth, but prevent runaway snowball.
- Create frequent battlefield contact points through reclaimable biomass.
- Support match lengths from 15 to 60+ minutes.

## Core Resource Model

### Main Resource

- Biomass is the only spendable strategic resource.

### What Generates Biomass

- Corpses from enemy ant units.
- Corpses from friendly ant units.
- Corpses from neutral creatures.
- Secondary regenerative map objectives such as aphid farms.

### Why Single Resource

- Reduces player bookkeeping.
- Keeps attention on map movement, scouting, and logistics.
- Makes balance easier early in development.

## Economy Loop

1. Scout and identify biomass opportunities.
2. Secure or contest the area.
3. Assign gatherers and transport biomass toward drop-off.
4. Protect carriers and routes.
5. Deposit biomass into colony stockpile.
6. Convert stockpile into workers, military, and tech.
7. Pay ongoing food upkeep on army size.

This creates continuous economy-combat coupling: fights generate resources, and resources enable the next fight.

## Biomass Objects

### Corpse Value

Each dead unit creates a corpse object with:

- Biomass value.
- Mass class.
- Decay timer.

### Mass Classes

- Small corpse: one gatherer can carry.
- Medium corpse: multiple gatherers required.
- Large corpse: team carry or staged harvesting at site.

### Decay Rules

- Corpse biomass decays over time.
- Decay starts after a short grace period.
- Remaining value is visible to both players.

Decay forces decision speed and creates tactical pressure after every engagement.

## Collection And Logistics Rules

### Core Hook

- The main hook is supply-line mastery: simple to understand, hard to master.
- Biomass is only real when it reaches the hive.
- Every stage between source and hive is raidable.

### Gatherer Roles

- All units can gather biomass, but hauling strength differs by unit type.
- Worker units are cheap, scout-like, and low hauling strength when used en masse.
- Combat units generally haul more per trip, but committing them to logistics weakens frontline pressure.
- This creates a deliberate economy-vs-frontline tension where strong hauling choices can open tactical vulnerability.

### Delivery Rules

- Biomass is not credited until delivered to the colony core.
- If a carrier dies, carried biomass is dropped at death position.
- Dropped biomass can be reclaimed by either side.

### Transfer Chain Rules

- Biomass can pass through intermediate storage, but ownership is not finalized there.
- Any intermediate stock can be stolen, destroyed, or interrupted before final hive delivery.
- Long routes increase throughput potential but also increase raid exposure.

### Drop-off Structures

- Colony core hive is the only final deposit point.
- Forward structures are fortified banks, not final drop-offs.
- Fortified banks act as pass-through caches and must be emptied by logistics workers.
- Fortified banks reduce front-line congestion but increase total route complexity.
- Fortified banks and bank-to-core routes are high-value raid targets.

## Regenerative Economy Sites

### Intent

Provide stable, contestable income without replacing corpse economy.

### Site Types

- Aphid farm nodes.
- Neutral nest grounds.
- Biome-specific feeding patches.

### Site Behavior

- Produce biomass in pulses.
- Require occupancy or worker assignment.
- Stop producing while contested.
- Biomass from sites must be physically transported through the supply line.
- No biomass from sites is credited until delivered to the hive.

### Friction Role

- Early game: clear and visible points of first conflict.
- Mid to late game: predictable, raidable economic arteries.
- They are intended to teach and reinforce supply-line play.

Recommended frequency:

- Regenerative sites should be rare map features rather than common background income.
- They should feel like strategic anomalies when present, not a second baseline economy.

Recommended share of total biomass over a match:

- Corpses and reclaimed battlefield mass: primary share.
- Regenerative sites: secondary stabilizer.

## Upkeep And Population Pressure

### Hard Upkeep

- Every non-worker military unit consumes food upkeep per second.
- Upkeep is paid in biomass equivalent.

### Goal

- Cap unchecked exponential growth.
- Make oversized armies expensive to idle.
- Reward map control and active pressure.

### Failure State

- If upkeep cannot be paid, penalties apply in stages:

1. Production speed penalty.
2. Unit regeneration disabled.
3. Combat efficiency reduction.

This avoids instant army deletion while still enforcing macro discipline.

## Suggested Baseline Formulas

These are placeholder balance formulas for prototyping.

- Corpse biomass value:
  - biomass_value = unit_cost_biomass x reclaim_ratio
  - starting reclaim_ratio target: 0.4 to 0.7

- Carry requirement:
  - carriers_required = ceil(corpse_mass / carrier_capacity)

- Corpse decay:
  - remaining_value(t) = initial_value x e^(-decay_rate x t)

- Upkeep:
  - upkeep_per_second = unit_supply_weight x upkeep_factor

Initial tuning ranges:

- decay_rate: low enough to allow contest play, high enough to prevent infinite stockpiles.
- upkeep_factor: light early game impact, meaningful late-game pressure.

## Match Phase Behavior

### Early Game (0 to 8 min)

- Starting stockpile funds first worker and scout setup.
- Neutral creature hunting is a key opener.
- First skirmishes produce critical early biomass spikes.

### Mid Game (8 to 25 min)

- Supply line warfare becomes central.
- Fortified pass-through banks and raid routes matter.
- Control of regenerative sites stabilizes army tech transition.

### Late Game (25+ min)

- Large corpse fights and route denial dominate macro.
- Upkeep pressure punishes passive maxed armies.
- Tactical wins near enemy territory can produce decisive swing income.

## Snowball Control Toolkit

Use these levers in order before adding more resource types:

- Increase corpse decay speed.
- Reduce reclaim ratio on cheap expendable units.
- Raise upkeep_factor at high population tiers.
- Increase vulnerability and theft risk of fortified banks.
- Reduce income from over-saturated regenerative sites.

## Anti-Turtle And Anti-Rush Safeguards

### Anti-Turtle

- Local corpse fields near defenders decay if not converted quickly.
- Bank-to-hive lanes remain raidable and cannot be bypassed by instant deposit.
- Upkeep pressures static max-pop armies.

### Anti-Rush

- Starting stockpile and neutral creature hunting provide recovery options.
- Core drop-off remains safe even if outer routes are denied.
- Early military upkeep is intentionally modest.

## Visibility And UX Requirements

- Every biomass object displays remaining value and decay state.
- Carrier units visually show when loaded.
- Route lines or flow overlays show logistic throughput.
- Economy panel shows:
  - Income by source (corpses, neutral sites, regen sites).
  - In-transit and banked-but-uncredited biomass.
  - Upkeep drain.
  - Net biomass per second.

Without these signals, economy depth becomes hidden complexity.

## AI Requirements For Skirmish

- AI must prioritize reclaiming nearby corpses after battles.
- AI must raid exposed carrier routes.
- AI must pressure fortified banks and bank-to-hive corridors.
- AI must retask workers when upkeep pressure rises.
- AI should contest a regenerative site when one is present and strategically relevant, but the map must not assume one exists.

These are required for economy mechanics to feel meaningful in single-player skirmish.

## Metrics To Track During Prototyping

- Average biomass income per minute by phase.
- Percent of total biomass from corpses vs regenerative sites.
- Average carrier travel time.
- Carrier death rate while loaded.
- Upkeep share of total spending.
- Comeback rate from 20 percent army value deficit.

Target outcome: high interaction and comeback potential without nullifying good macro play.

## Economy Rules To Lock Before Faction Design

1. Final reclaim ratio range for unit corpses.
2. Final decay model and timer visibility.
3. Large corpse handling method: team carry or onsite dismantle.
4. Upkeep penalty curve and thresholds.
5. Final frequency target for regenerative sites: rare.
6. Regenerative site share target of total income.

These constants define the strategic foundation that faction bonuses should modify, not replace.

## Open Questions: Locked Decisions (Grill Session)

### 1) Worker upkeep

- Workers are not exempt from upkeep.
- A baseline count `X` workers is free.
- Workers above `X` incur progressive upkeep.

Prototype formula:

- paid_workers = max(0, workers - X)
- worker_upkeep_per_sec = k \* (paid_workers ^ C), with 1 < C < 2

Notes:

- Use `C` as the primary curve-shape tuning knob.
- Starting test range for `C`: 1.25 to 1.6.

### 2) Corpse terrain interaction

- Corpses do not hard-block movement.
- Corpses create temporary friction zones (movement slow), marked as a nice-to-have feature.
- If performance budget is tight, friction zones can be disabled without breaking core economy rules.

### 3) Aerial logistics and survivability

- No special economic or survivability bonus is granted for aerial carriers.
- Flying ants are planned as later-tier flexible raiders, not tanky logistics units.

Related locked combat verb (cross-system note):

- Universal anti-air action is `Latch and Grab`.
- Intended effect: short-range latch stacks that can force a temporary landing window.

### 4) Water-edge biomass routes

- Water-edge routes use conditional, volatile high-yield biomass patterns.
- They should create "something is happening" contest moments.
- Design goal: increase scouting pressure and force selective unit commitment to contest windows.
