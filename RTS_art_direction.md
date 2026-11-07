# Ant RTS Art Direction

## Purpose

Define the visual identity for the 3D fixed-isometric ant RTS. This direction supports classic RTS readability at high unit density while presenting a bright living ecosystem through low-poly geometry and flat colors rather than texture detail.

## Art Direction Statement

A bright, readable low-poly ecosystem viewed as a living miniature wilderness: biologically recognizable ants build carved-earth colonies beneath oversized vegetation, while silhouette, flat color, and animation communicate strategy at a glance.

## Visual Pillars

- **Readable at RTS distance:** Units, structures, resources, ownership, and active states must remain distinguishable at the normal fixed-isometric gameplay zoom.
- **Chunky low-poly by design:** Broad block-like forms, faceted geometry, and flat color fields are the primary visual language. Avoid sharp, needle-like profiles except where a functional silhouette requires them. Materials must not depend on painted, photoreal, or noise textures.
- **Natural but not realistic:** Anatomy, terrain, and vegetation are grounded in recognizable biology, then exaggerated where needed for silhouette and gameplay clarity.
- **Bright living ecosystem:** Daylit scenes, clear local color, and legible terrain keep the world inviting. Tension comes from strategic pressure, scale, and animation rather than persistent darkness.
- **Quiet effects, expressive motion:** Dust, debris, and restrained physical feedback support actions. Animation carries the primary communication burden for combat, hauling, and state changes.

## World And Terrain

Maps should feel like a miniature natural world shaped for clear RTS navigation.

- Terrain uses broad, faceted color planes with an earthy palette. Elevation, passability, and chokepoints must read from shape and color value before fine detail.
- Colonies are carved-earth systems: excavated chambers, packed soil, tunnels, and organic nest forms. They should not resemble constructed human settlements.
- Vegetation, leaves, stones, bark, and ecosystem landmarks are oversized low-poly forms that establish scale and function as memorable navigation anchors.
- Water remains visually distinct and impassable in the baseline rules. Shorelines and water-adjacent biomass events should be clear from gameplay zoom without relying on surface textures.
- Biome variation may shift terrain, foliage, and lighting palettes, but may not obscure resource objects, path boundaries, or unit ownership.

## Units And Creatures

### Ants

- Ants are chunky, faceted, and biologically recognizable: an oversized head and gaster frame a compact middle body, while legs, mandibles, and species-specific proportions remain readable.
- Body segments should read as broad, weighty volumes rather than pointed crystals. Keep the waist noticeably smaller than the head and gaster to preserve the characteristic ant silhouette.
- Do not use cartoon faces, human-like expressions, or toy-like proportions.
- Exaggerate role-defining anatomy at gameplay scale: workers prioritize carrying silhouettes, warriors emphasize mandibles or armored profile, and specialists expose their tactical purpose through a distinct body plan.
- Animation is the main state signal. Hauling, attacking, building, retreating, idling, and taking damage must have recognizable motion language.

### Neutral Creatures And Corpses

- Neutral fauna should share the low-poly biological language while differing enough in silhouette and scale to read as ecosystem entities rather than faction units.
- Corpses and biomass must be unmistakable resource objects. Their mass, remaining value, and whether they require multiple carriers should be visible through size, segmentation, and simple physical presentation.
- Resource readability takes priority over anatomical fidelity when an object is contested or hauled.

## Faction And Player Identification

Faction identity and player ownership use separate color responsibilities.

- The player-selected team color is the main color and appears on large carapace plates and colony banners. It must be visible at RTS distance.
- Species-specific accent colors remain stable across player colors and appear on legs, mandibles, segment boundaries, markings, and restrained ability feedback.
- Species identity also comes from silhouette, gait, proportions, nest architecture, and role-specific animation. Color alone must not carry faction differentiation.
- Player color must remain legible against all intended biomes and never be confused with neutral creatures, biomass, water, or impassable terrain.

## Structures

- Structures are organic extensions of the colony: excavated chambers, soil mounds, leaf-integrated forms, and specialized brood or processing spaces.
- Production, economy, technology, defense, and logistics structures require distinct top-down silhouettes and clear activity states.
- Banners and prominent carapace-like plates carry the player-selected main color. Species accent colors and architectural shape reinforce faction identity.
- Construction and damage states should change visible geometry, occupancy, and animation rather than introducing heavy visual effects.

## Color, Lighting, And Materials

- Use flat or near-flat colors with intentional value separation between gameplay layers. Avoid painted textures as a source of identity or legibility.
- Lighting is bright and directional enough to describe faceted form, with soft ambient fill that preserves visibility in nests, under foliage, and near terrain walls.
- Shadows should ground objects without concealing commands, selections, resources, or small units.
- Reserve high-contrast colors for player ownership, important interactions, critical state changes, and UI-integrated feedback.
- Keep the world palette natural and cohesive; species accents should enrich it rather than turn the battlefield into a full-body team-color field.

## Animation And Effects

- Use animation before particle effects to show an action's intent, timing, and outcome.
- Combat feedback is physical and restrained: contact motion, recoil, dust, displaced debris, and clear death poses. Avoid constant flashes, magical trails, or screen-filling particle bursts.
- Logistics feedback emphasizes carrying posture, visible cargo, drop-off motion, and worker flow. Movement should make supply-line vulnerability easy to perceive.
- Effects may clarify high-value events, but must remain brief, localized, and subservient to the unit silhouettes beneath them.

## RTS Readability Rules

- Every controllable unit needs a role-distinct silhouette at normal camera height and in dense formations.
- Important gameplay states must communicate through at least two channels chosen from silhouette, animation, color, UI marker, and simple physical effect.
- Ownership must be readable independently of species accent colors.
- Selection, commands, targets, and path intent must remain visible on bright terrain without permanently cluttering the battlefield.
- High-density encounters at the 200 soft-cap and 260 hard-cap target must preserve a clear distinction between friendly, enemy, neutral, resource, and terrain layers.

## Constraints And Non-Goals

- No painted, photoreal, or detail-dependent texture workflow.
- No dark, grim, or horror-led presentation as the baseline match mood.
- No cartoon faces, humanized character acting, or toy-like unit proportions.
- No effects-heavy combat language that competes with strategic readability.
- Visual fidelity must not compromise deterministic gameplay presentation, fixed-isometric usability, or high-unit-density clarity.

## Open Questions

- Define a concrete player-color palette and accessibility contrast requirements across all planned biomes.
- Establish per-faction species accents, nest-shape motifs, and role silhouette sheets once the launch faction lineup is locked.
- Specify camera zoom, terrain value ranges, selection treatment, and visual performance budgets in the technical readability requirements.
- Create a small in-engine scene to validate readability with mixed factions, contested biomass, water chokepoints, and the target unit cap.
