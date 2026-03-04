# Phase 3: Multiplayer & Polish - Context

**Gathered:** 2026-03-04
**Status:** Ready for planning

<domain>
## Phase Boundary

2-4 players compete in real time with garbage line mechanics, progressive elimination, opponent views, and the full retro arcade visual style. Depends on Phase 1 (rooms/lobby) and Phase 2 (game engine) being complete. Requirements: MULT-01 through MULT-06, VISL-01 through VISL-03.

</domain>

<decisions>
## Implementation Decisions

### Garbage line mechanics
- Standard guideline garbage table: Single=0, Double=1, Triple=2, Tetris=4, T-spin variants scale similarly
- Short delay (~1-2 seconds) before garbage appears — queued visibly on the side of the board
- Full cancel: clearing lines while garbage is pending reduces or eliminates incoming garbage
- Garbage targets one opponent (auto-target: random or last attacker), not spread evenly — targeting UI deferred to v2

### Multiplayer layout
- Main board centered-left, opponent mini boards stacked vertically on the right sidebar
- Mini boards show board grid + nickname + lines cleared count (basic stats)
- Layout adapts to player count: 2 players = 1 larger mini, 3 = 2 minis, 4 = 3 minis
- Eliminated players: board grays out with X/ELIMINATED label, stays visible in position

### Retro visual style
- Starfield/space animated background behind the boards
- Subtle flash animation on line clears — quick white flash, rows disappear smoothly
- Block style and color palette: Claude's discretion based on the arcade aesthetic

### Match flow
- 3-2-1 synchronized countdown on all screens before pieces start falling
- Disconnected player is instantly eliminated, remaining players continue
- End-of-match: big winner announcement + all players ranked by elimination order with final scores
- After results: everyone returns to room lobby automatically, host can start new match

### Claude's Discretion
- Block style (flat, beveled, or textured) and exact color palette
- Line clear animation timing and visual details
- Starfield animation speed and density
- Garbage queue visual indicator design
- Mini board update frequency and rendering optimization
- Exact spacing, typography, and UI chrome

</decisions>

<specifics>
## Specific Ideas

- Garbage queue should be visible on the side of the board so players can see incoming threat and react strategically
- Auto-targeting for garbage (random or last attacker) since manual targeting is v2
- Layout should feel like classic competitive Tetris (Jstris/Tetr.io style) with focus on your own board

</specifics>

<code_context>
## Existing Code Insights

### Reusable Assets
- No existing code — greenfield project. All components built fresh.

### Established Patterns
- No patterns yet — Phase 1 and 2 will establish WebSocket communication, game engine architecture, and component patterns before Phase 3 begins.

### Integration Points
- Phase 1: Room/lobby system provides the room state, player list, and WebSocket connections
- Phase 2: Game engine provides the Tetris logic (piece movement, rotation, line clearing, scoring) that Phase 3 wraps in multiplayer sync
- Phase 3 connects: game engine events (line clears) → garbage calculation → WebSocket broadcast → opponent board updates

</code_context>

<deferred>
## Deferred Ideas

- Targeting strategy selection (badges, KOs, random) — v2 requirement MULT-07
- Spectator mode — v2 requirement MULT-08
- Rematch button — v2 requirement ROOM-08
- Detailed per-player stats on results screen — possible v2 enhancement

</deferred>

---

*Phase: 03-multiplayer-polish*
*Context gathered: 2026-03-04*
