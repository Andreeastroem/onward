# Ant RTS Design Document

## High Concept

An RTS about ant colonies fighting for survival in a living ecosystem. The game should feel like a classic RTS: build economy, scout the map, expand tech, field armies, and win through macro and micro decisions rather than through a campaign structure.

The intended tone is emergent and self-directed. Players should be able to invent their own narrative through skirmishes, regional conquest, and ecosystem conflict.

## Design Pillars

- Classic RTS pacing and readability.
- Logistics-driven economy with dangerous supply lines.
- Organic battlefield contact points created by dead ants, neutral creatures, and resource hauling.
- Distinct faction identity built around ant species with room for movement and logistics specialization.
- Strong skirmish play first; campaign later if ever.

## Project Frame

This document records the long-form vision of the project, not a versioned release plan. Implementation slices will be created later from the locked vision, mechanics, and technical constraints in these design documents.

## Technical Requirements

- See [RTS_technical_requirements.md](RTS_technical_requirements.md) for locked presentation and scale decisions.
- The current baseline is full 2D with a high-angle oblique top-down camera.
- The game uses individual-unit control rather than squad-based control.
- The current per-player unit scale target is 200 soft cap and 260 hard cap.

## Terrain And Chokepoints

- Water is impassable in the baseline map rules.
- Impassable water should create the first obvious chokepoints and route constraints on a map.
- Water-adjacent biomass events can act as narrative background and high-value supply drops, such as small fish carcasses or similar shoreline gains.

## Faction Model

The current direction is ant-species-led faction identity, with biomes shaping map pressure and strategic options.

Recommended structure:

- Factions are read primarily as ant species.
- Biomes define map identity and unit access pressure, not the whole faction identity.
- Each faction can have a small amount of macro asymmetry in addition to different unit rosters.
- Launch examples include black ants, fire ants, and weaver ants.

This preserves clarity for players while still letting geography matter. Pure geography is still useful for movement and terrain distinctions, but works best as strategic context rather than primary faction identity.

## Core Gameplay Loop

1. Start with a small base, a queen or equivalent colony core, and a limited number of workers.
2. Scout the map to identify corpses, neutral creatures, chokepoints, and resource routes.
3. Build economy structures and unlock higher-tier production buildings.
4. Expand production and logistics so more biomass can be hauled home.
5. Field military units, protect supply lines, and raid enemy harvesters.
6. Win by destroying the enemy colony core.

This keeps the game anchored in a classic RTS loop: economy, scouting, tech, military, micro, and macro.

## Tech Tree

The recommended tech structure is a classic building-gated tree.

Reasoning:

- It is easier to read than a more abstract age-up system.
- It creates clear strategic checkpoints.
- It fits the colony-building fantasy well.
- It allows faction-specific branches without forcing a hard global reset.

Possible pattern:

- Basic hatchery / nest unlocks early worker and combat basics.
- Advanced brood / chamber / nest structures unlock specialized roles.
- Higher-tier structures unlock aerial, ground, and water-adapted lines, plus stronger logistics or combat options.

## Economy

Detailed economy mechanics are specified in RTS_economy_design.md.
Resource ownership, theft, and logistics edge-case resolution is specified in RTS_resource_ownership_spec.md.

v0 economy constants are now locked in the same document under the baseline formulas section (`economy_constants_version = 1`).

### Primary Resource

Use one main resource: biomass.

Biomass comes from dead ants and other ecosystem creatures, including:

- Enemy ant units.
- Neutral bugs.
- The player’s own dead harvesters, if they can be reclaimed.

The larger the corpse, the more biomass it contains, but the more carrying capacity it requires.

### Harvesting Model

The best current version is corpse hauling with risk.

Recommended behavior:

- Corpses are visible resource objects on the map.
- Workers or specialized collectors must physically carry biomass back to the base.
- If the carrier dies, the resource is lost or dropped.
- Some corpses require multiple gatherers to move, creating logistics pressure around bigger kills.
- Dead harvesters are harvestable, so economic raiding matters.

This creates the tug-of-war effect you want because killing near enemy lines matters even before the fight is fully resolved.

### Regenerative Hotspots

The economy can also support map-based regenerative hotspots, but these should be rare, not common, and they should never become a second full economy.

Good candidates:

- Aphid farms.
- Neutral creature nests.
- Favorable breeding grounds.
- Region-specific biomass nodes.

These work best as strategic anomalies that stabilize income rather than as a separate parallel system.

## Resource Split Decision

The current recommendation is not to split the main economy into vegetation and meat as equally important resources.

Instead:

- Keep one main resource: biomass.
- Allow some biomass to come from plant-adjacent sources if needed for thematic variety.
- Use neutral creatures or regenerative hotspots to create strategic map control.

This avoids bookkeeping while still supporting interesting economy hotspots.

## Supply Lines And Tension

The hauling model is the main source of battlefield tension.

The ideal friction points are:

- Corpses must be physically moved.
- All unit types can gather, but with different hauling strength and opportunity cost.
- Carriers can be intercepted on the way back.
- Raiding the enemy economy is as meaningful as fighting their army.

This creates a natural RTS tug-of-war where territory is valuable because it protects logistics.

## Upkeep And Snowball Control

The economy is intended to grow quickly at first, but not without limits.

Recommended brake:

- Hard food upkeep on every unit produced.

Purpose:

- Prevent runaway exponential snowballing.
- Keep army size tied to economic health.
- Make overproduction a real strategic risk.

If needed, upkeep can be softened later with colony upgrades or faction traits, but the baseline should be strict enough to keep macro interesting.

## Unit Layers

The map and faction system should support classic RTS unit strata:

- Ground units for standard combat and harvesting support.
- Mobile specialists for scouting, harassment, and mobility.
- Water-adapted specialists for water-heavy maps and shoreline control.

Geography should mainly influence which of these layers are strong or available.

## Faction Asymmetry

Factions should differ in both roster and a small macro hook.

Examples:

- Weaver ants may excel at mobility and map traversal but be weaker in direct sieges.
- Fire ants may control aggressive frontline pressure and floodplain logistics better.
- Black ants may be stronger in territorial defense and corpse hauling.

The asymmetry should remain readable and not turn into a full ruleset per faction.

## Game Modes

### Initial Focus

Skirmish versus basic AI is the first priority.

### Not In Scope Yet

- Campaign.
- Narrative progression.

### Future Possibility

Region-control or world-domination mode remains a later expansion direction rather than an immediate implementation target. Playtesting may reveal that it becomes a faster or clearer game mode, in which case it can be prioritized earlier.

That mode would turn skirmish wins into a broader layer of territorial or ecological conquest.

## Victory Condition

Recommended default victory condition:

- Destroy the enemy colony core or queen equivalent.

This is clearer than total annihilation and works better with a future domination mode.

Match termination edge cases are locked in [RTS_match_termination_spec.md](RTS_match_termination_spec.md).

v0 termination summary:

- Same-tick dual core destruction resolves to draw.
- Timer expiry resolves to draw with no tie-breakers.
- Surrender uses a 3-second countdown before loss is committed.
- Disconnect enters paused reconnect flow (90+ second grace), then forfeit on timeout.

## Match Length And Pacing

Target pacing:

- Short skirmishes: 15 to 20 minutes.
- Standard matches: 30 to 45 minutes.
- Larger matches: 60 minutes or more.

The economy should support both early pressure and late expansion without flattening into a single dominant strategy.

## Emergent Storytelling Goals

The game should produce story through play, not through scripted narrative.

Examples:

- A desperate defense of a corpse field.
- A failed supply line raid that turns the map.
- A sudden aerial strike that steals a resource windfall.
- A local ecosystem war over a region-rich food source.

## Open Questions

These are intentionally left open for future iteration:

- Exact ant species lineup and how many factions ship first.
