# ARPG

## Style

Pixel art
Toned down colors (watered?)

## Level design

Overarching philosophy:
Wide open areas in the overworld - narrow and branching paths in dungeons/caves etc

### Technical details

Hexagonal grid system for pathing and level building.
Makes for more varied map layouts/generations. Should give more possibilities visually with layers above the base grid (vegetations etc).

## Story

A bet has been placed between gods.
Who within their ranks are strong enough to retrieve X in mount Y.

There are rules set for this competition, start on place A and do not spoil the fun by sending too strong opposition early on.

## Stats

### Elements - strengths and weaknesses

A classic X is stronger against Y but weaker against Z approach to flat improvements. So as to create some kind of initial "easy to pick up" improvements and counter logics.

blunt (chopping/bludgeoning/slashing etc)

- wood

* fire
* water

Water

- fire

* Wood

Fire

- wood

* water

Wood

- water

* fire

to be added: darkness {?}, ice (part of water?), electricity

### Attributes

Strength

- Governs damage with melee weaponry and damage reduction against blunt damage
  Dexterity
- Governs damage with ranged weaponry and movement speed/attack speed
  Intelligence
- Governs damage with elemental spells and critical chance with spells
  Vitality
- Governs total life pool and regeneration
  Mana
- Governs total mana pool and mana regeneration

Different characters have different base stats and growth (division on xp between levels).

They all have the same effect based on their stat levels.

#### Attribute effects

DISCLAIMER: no curves have been checked and need to be adjusted - only written down to have some kind of inkling of what they are doing

Strength

- Increases melee weapon damage by `(level / 1.05) * weapon damage` - FIX THIS
- Increases damage reduction against blunt damage by `log(level) * 100` - THIS IS NOT CHECKED FIX THIS

## Itemisation

Similar to Diablo, items have a tier and the legend/set tiers have special effects. No item is restricted to a certain class.

### What kind of items

Weapons or trinkets? Should spells be dropped or should their be skill trees?
If there should be skill trees, should there be archetypes or should every playable character have their own skill tree? That could be a rather large undertaking

## End game

When you reach a specific point in the game, you are approached by the god of the opposing faction. Inviting you to join their side. This unlocks the "evil" campaign, where you can play as the enemy mobs.

You start with a single playable mob, minor demon, but every mob has an added item added to their drop table. Which is an unlock to play that specific mob.

## Technical design

All pawns have most of their functionality in common. They all have the same type of stats, health, mana, array of skills (not the same skills per say but an array of castable skills).

What separates different pawns is their controller, visuals and attached physics.
