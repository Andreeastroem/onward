# Ant RTS Potential Factions

## Purpose

Define a comprehensive faction direction using ant species identity, with explicit asymmetry in:

- Logistics and supply-line behavior.
- Resource conversion and bank pressure.
- Map-shape interaction and traversal.
- Production/connectivity exception hooks.
- Counterplay readability under high-unit-density RTS conditions.

This document assumes and extends the locked v0 system contracts in:

- `RTS_design_doc.md`
- `RTS_combat_spec.md`
- `RTS_economy_design.md`
- `RTS_resource_ownership_spec.md`
- `RTS_production_operations_spec.md`
- `RTS_tech_tree_operational_spec.md`
- `RTS_match_termination_spec.md`
- `RTS_technical_requirements.md`

---

## Recommended Faction Set

### Core 5 (recommended)

1. Black Ants (baseline logistics-control)
2. Fire Ants (tempo swarm pressure)
3. Weaver Ants (mobility and route-shape manipulation)
4. Army Ants (forward pressure, low-stability macro)
5. Leafcutter Ants (industrial throughput and large-corpse economy)

### Sixth slot (recommended timing: after core 5 is stable)

Primary sixth:

- Trap-jaw Ants (precision interception and logistics denial)

Alternate sixth (if a defensive macro faction is preferred):

- Honeypot Ants (storage resilience and delayed-income stability)

---

## Shared Rules And Asymmetry Budget

### Shared non-negotiables

All factions obey the baseline rule set:

- One spendable strategic resource: biomass.
- Core-credit authority (banked biomass is not spendable until core deposit).
- Single-queue deterministic production sources.
- Soft-counter-first combat model with deterministic outcomes.
- Impassable water chokepoints in baseline map rules.
- Mandatory role-family coverage: Worker, Warrior, Air, Anti-air, Behemoth.

### Asymmetry budget

Each faction should vary mainly on:

- One macro hook (economy/logistics/production/connectivity behavior).
- Route-shape strengths and weaknesses.
- Unit role mapping and tactical profile.
- A limited set of explicit faction exceptions in production/connectivity.

Avoid full-ruleset divergence. Keep faction readability high and onboarding clear.

---

## Faction Contracts

## 1) Black Ants

### Identity

Reliable territorial logistics faction. Converts defended fights into stable economy gains.

### Macro hook

Route efficiency, connected infrastructure reliability, and corridor-based logistics bonuses.

### Play pattern

- Build defensible mid-length route networks.
- Stabilize banks and bank-to-core transfer reliability.
- Win by maintaining consistent reclaim conversion over time.

### Strengths

- Strong core-to-frontline logistics discipline.
- Good defensive posture around banks/chokepoints.
- High conversion rate from won or neutralized engagements.

### Weaknesses

- Predictable route architecture.
- Lower ability to bypass map geometry compared with mobility factions.
- Can be overtaxed by many simultaneous side threats.

### Counterplay windows

- Break route continuity in multiple lanes.
- Force rapid map reorientation (multi-prong harassment).
- Avoid prolonged direct efficiency fights on Black-controlled ground.

### First 8-minute strategic incentive

Secure map-near carcass routes, establish one safe pass-through bank lane, and force fights near own logistics cover.

### Black Ant faction expression

Black Ant bonuses should amplify the player's logistics setup, not automate it. The faction should still require the player to choose routes, assign escorts, and decide when to risk longer transfers.

Recommended faction-facing bonuses:

- Connected Route Bonus: biomass carriers gain a modest movement speed bonus and carry-capacity bonus while traveling through a fully connected Black logistics network.
- Assigned Escort Bonus: units manually assigned to guard a carrier, bank, or logistics structure gain a small damage bonus and a small armor bonus while in that escort role.
- Home-Ground Conversion Bonus: harvest, pickup, and handoff interactions complete faster near friendly Black logistics structures, improving practical gather rate without changing combat tempo.
- Corridor Efficiency: banks, relays, and core-linked logistics structures provide slightly faster transfer and withdrawal throughput when they remain part of a continuous connected corridor.

Design intent:

- No automatic rerouting.
- No automatic retreat.
- No automatic escort assignment.
- The faction rewards good setup and disciplined player orders, rather than replacing them.

This keeps the faction snappy in combat while making the economy and convoy game feel more efficient only when the player has built and defended the right network.

---

## 2) Fire Ants

### Identity

High-tempo pressure faction that thrives on frequent skirmish conversion and front-loaded momentum.

### Macro hook

Tempo conversion: quick pressure into immediate pickup/deny/raid opportunities.

### Play pattern

- Force repeated early contacts.
- Convert short windows into biomass denial and bank harassment.
- Maintain initiative through sustained movement pressure.

### Strengths

- Strong early swarm and surround potential.
- Fast local conversion after tactical wins.
- Excellent at destabilizing under-defended routes.

### Weaknesses

- Less efficient at long-haul logistics.
- Worse scaling if forced into slow macro-only states.
- Vulnerable to disciplined defensive attrition if momentum stalls.

### Counterplay windows

- Shorten fronts and deny free surrounds.
- Force Fire into longer transfer distances and escort tax.
- Trade defensively around protected banks and punish overextension.

### First 8-minute strategic incentive

Open with map pressure and rapid skirmish cadence, delay enemy banking infrastructure, and keep all lanes tactically hot.

---

## 3) Weaver Ants

### Identity

Map-geometry manipulation faction that wins by route-shape advantage rather than frontal force.

### Macro hook

Traversal/control via networked mobility infrastructure and route-bypass options.

### Play pattern

- Re-shape movement lanes to create off-angle pressure.
- Attack route geometry and reinforcement timing.
- Prefer distributed pressure over central slugging.

### Strengths

- High route flexibility and flank access.
- Strong side-lane harassment and redeploy speed.
- Good at creating asymmetric engagements.

### Weaknesses

- Lower frontal siege reliability.
- Reduced performance in forced direct sustain fights.
- Can underperform if the opponent compresses the map effectively.

### Counterplay windows

- Collapse fronts into constrained high-commitment engagements.
- Deny route-construction opportunities near critical lanes.
- Force Weaver into direct, symmetric trades.

### First 8-minute strategic incentive

Secure traversal options early, contest route edges, and convert mobility advantage into repeated bank-line disruptions.

---

## 4) Army Ants

### Identity

Forward-pressure destabilization faction. Trades stability for persistent offensive presence.

### Macro hook

Low dependence on stable static infrastructure; stronger field pressure posture.

### Play pattern

- Operate aggressively in enemy half-map.
- Sustain pressure through repeated forward engagements.
- Convert map disorder into economic and positional advantage.

### Strengths

- Strong distributed pressure and proxy threat.
- Effective at keeping opponents in emergency-defense loops.
- Good at exploiting disconnected map states.

### Weaknesses

- Weaker static defense and long-game stability.
- Punishable if pressure cadence drops.
- Higher strategic risk profile if early/mid commitments fail.

### Counterplay windows

- Weather first pressure cycle, then reclaim map structure.
- Punish over-forward rally positions and unsupported pushes.
- Force longer engagements where stability outvalues chaos.

### First 8-minute strategic incentive

Deny enemy setup time, contest expansions before completion, and maintain multi-lane threat so no lane fully stabilizes.

---

## 5) Leafcutter Ants

### Identity

Industrial throughput faction focused on heavy conversion and protected macro scaling.

### Macro hook

Superior medium/large corpse handling and processing throughput.

### Play pattern

- Prioritize high-value objective fights and large biomass opportunities.
- Build protected processing and transfer lanes.
- Outscale through superior conversion of high-mass resource events.

### Strengths

- Excellent value extraction from medium/large corpse classes.
- Stronger macro payoffs from defended objective control.
- Robust mid/late economy if route integrity is maintained.

### Weaknesses

- Slower early tempo.
- Vulnerable to sustained early raid pressure.
- High dependence on defended logistics depth.

### Counterplay windows

- Deny setup and route hardening before throughput engine forms.
- Split pressure across processing lanes to overload defense.
- Force many small fights instead of fewer large-payoff contests.

### First 8-minute strategic incentive

Stabilize safely, secure one reliable large-corpse conversion lane, and avoid early spiral losses from repeated route interruption.

---

## 6) Trap-jaw Ants (Primary Sixth)

### Identity

Precision interception faction that weaponizes narrow punish windows.

### Macro hook

Carrier interception, channel interruption, and chokepoint punishment.

### Play pattern

- Hunt transport and processing vulnerabilities.
- Deny/interrupt high-value transfers.
- Convert picks into cascading route instability.

### Strengths

- High-value target elimination and disruption pressure.
- Strong chokepoint control through ambush threat.
- Excellent at punishing overextension and exposed logistics.

### Weaknesses

- Lower efficiency in broad sustained army trades.
- Weaker direct siege identity.
- Requires precision and map-reading to peak.

### Counterplay windows

- Increase escort density and route redundancy.
- Avoid predictable single-path convoy movement.
- Force wide-front engagements where precision pick tools dilute.

### First 8-minute strategic incentive

Scout transfer timings, establish ambush control on key lane intersections, and repeatedly tax enemy transport flow.

---

## 6B) Honeypot Ants (Alternate Sixth)

### Identity

Defensive resilience faction focused on storage stability and raid tolerance.

### Macro hook

Improved storage resilience and delayed-income stabilization.

### Play pattern

- Absorb harassment without total flow collapse.
- Gradually outlast high-variance raid factions.
- Prefer structured defensive macro progression.

### Strengths

- Better tolerance to small or repeated raids.
- Higher economy stability under attrition pressure.
- Strong in controlled, prolonged map states.

### Weaknesses

- Lower initiative and tempo.
- Reduced map reach and slower punishment profile.
- Can be outmaneuvered by geometry/mobility factions.

### Counterplay windows

- Force rapid multi-lane tactical pivots.
- Deny map space before defensive lattice forms.
- Keep pressure mobile instead of committing to static sieges.

### First 8-minute strategic incentive

Establish resilient storage-transfer posture, prevent early snowball damage, and aim for controlled midgame stability.

---

## Interaction Matrix (Behavioral Asymmetry)

These matchup notes describe strategic behavior differences, not balance outcomes.

## Black vs Fire

- Fire seeks early tempo, route disruption, and frequent contact.
- Black seeks stable lanes and efficient reclaim conversion.
- Black is advantaged if early chaos is contained.
- Fire is advantaged if map stability is prevented.

## Black vs Weaver

- Weaver attacks route shape and reinforcement geometry.
- Black defends linear reliability and positional control.
- Black wins by compressing fronts into direct trades.
- Weaver wins by forcing constant reorientation.

## Black vs Army

- Army pressures setup windows and route completion.
- Black seeks to survive first pressure cycles then stabilize.
- Black wins if it restores structured lane integrity.
- Army wins if it keeps the map in persistent disorder.

## Black vs Leafcutter

- Black prefers repeated efficient skirmish reclaim.
- Leafcutter prefers fewer high-mass payoff battles.
- Black wins by fragmenting engagements and denying large conversions.
- Leafcutter wins by securing objective-scale transfers.

## Black vs Trap-jaw

- Trap-jaw seeks picks and transfer interruptions.
- Black seeks escort discipline and lane redundancy.
- Black wins by reducing high-value intercept windows.
- Trap-jaw wins by repeatedly taxing flow efficiency.

## Fire vs Weaver

- Fire wants broad direct contact and tempo snowball.
- Weaver wants off-angle pressure and selective fights.
- Fire wins if it repeatedly forces symmetric engagements.
- Weaver wins if it dictates where fights can occur.

## Fire vs Army

- Both favor tempo, but through different vectors.
- Fire spikes harder in immediate swarms.
- Army sustains broader multi-lane disruption.
- Winner is typically whoever better converts pressure into lasting logistics damage.

## Fire vs Leafcutter

- Fire aims to deny setup and processing safety.
- Leafcutter aims to survive early disruption and outscale.
- Fire wins when it prevents stable throughput formation.
- Leafcutter wins after defended heavy-conversion windows.

## Fire vs Trap-jaw

- Trap-jaw punishes overcommit and exposed route tails.
- Fire tries to saturate with too many simultaneous threats.
- Fire wins in wide chaotic fronts.
- Trap-jaw wins when fights fragment into pick scenarios.

## Weaver vs Army

- Weaver pressures geometry and timing windows.
- Army pressures presence and persistence.
- Weaver wins with selective cuts and map shaping.
- Army wins by overwhelming with simultaneous threat density.

## Weaver vs Leafcutter

- Weaver attacks long processing and transfer chains.
- Leafcutter defends for high-value conversion moments.
- Weaver wins by denying route consistency.
- Leafcutter wins by anchoring objective zones and forcing value fights.

## Weaver vs Trap-jaw

- Trap-jaw controls narrow punish zones.
- Weaver avoids predictable movement signatures.
- Trap-jaw wins if chokepoints become mandatory transit.
- Weaver wins if route optionality remains high.

## Army vs Leafcutter

- Army wants permanent instability and no setup windows.
- Leafcutter wants one or two stabilized conversion cycles.
- Army wins if tempo remains permanently high.
- Leafcutter wins if midgame route structure is secured.

## Army vs Trap-jaw

- Army applies simultaneous pressure in many locations.
- Trap-jaw removes key links and punishable overextensions.
- Army wins via saturation.
- Trap-jaw wins via precision attrition on pressure logistics.

## Leafcutter vs Trap-jaw

- Leafcutter field value is concentrated in larger escorted transfers.
- Trap-jaw seeks to break those transfers before conversion.
- Leafcutter wins with robust escort and lane depth.
- Trap-jaw wins with repeated interception and channel denial.

---

## Production/Connectivity Exception Candidates

Use these as initial faction-exception directions against the shared baseline.

## Black

- Connectivity: strict baseline (disconnect significantly degrades function).
- Production: no major queue rule changes; reliability-focused defaults.

## Fire

- Construction: stronger early pressure-friendly build cadence on select military structures, balanced by escalating surcharge sensitivity.
- Connectivity: mostly baseline.

## Weaver

- Placement: expanded projection behavior tied to traversal-network structures.
- Connectivity: partial function on select peripheral structures if network condition is met.

## Army

- Connectivity: targeted partial functionality while disconnected for specific forward classes.
- Production topology: more operational flexibility in forward pressure lanes.

## Leafcutter

- Construction: throughput-oriented economy/processing build incentives; vulnerable if interrupted mid-ramp.
- Connectivity: baseline or stricter on industrial chain integrity.

## Trap-jaw

- Production: limited exception enabling faster deployment of interception specialists, with tradeoffs in broad-line throughput.
- Connectivity: baseline.

## Honeypot (alternate)

- Bank/storage behavior: resilience-oriented raid interaction profile.
- Connectivity: strong dependence on defended structure network.

---

## Suggested Implementation Order

1. Lock core 5 faction contracts (Black, Fire, Weaver, Army, Leafcutter).
2. Prototype 5-faction role matrices with shared baseline tech skeleton.
3. Validate early/mid timing windows and route-pressure signatures per faction.
4. Add Trap-jaw as sixth once raid/intercept readability is proven stable.
5. Keep Honeypot as alternate sixth if testing shows need for a defensive macro archetype.

---

## Open Design Questions

- Which exact faction gets the strongest connectivity exception budget without reducing clarity?
- Should Army and Weaver both have connectivity exceptions, or should one rely only on mobility and topology?
- How much bank-raid asymmetry can be introduced before ownership model readability degrades?
- Do we want one faction with a stronger anti-air identity early, or preserve tighter parity until Tier 2?
- Which matchup pair should anchor first balance pass telemetry (recommended: Fire vs Leafcutter, Army vs Black)?

---

## Success Criteria For Asymmetry

Faction asymmetry is successful if:

- Matchups feel strategically different by minute 4, not only by late-game stats.
- Supply-line decisions differ significantly by faction identity.
- Counterplay windows are scoutable and punishable in all matchups.
- No faction bypasses core system rules enough to become a separate game.
- Readability remains high at 200 soft cap / 260 hard cap conditions.
