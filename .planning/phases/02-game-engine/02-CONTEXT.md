# Phase 2: Game Engine - Context

**Gathered:** 2026-03-04
**Status:** Ready for planning

<domain>
## Phase Boundary

A complete, correct single-player Tetris game with all classic mechanics: movement, rotation (SRS + wall kicks), hard/soft drop, ghost piece, hold piece, next-5 queue, 7-bag randomizer, line clears with animation, scoring (singles/doubles/triples/tetrises/T-spins/combos/back-to-back), and level progression. Game ends when pieces stack to the top.

</domain>

<decisions>
## Implementation Decisions

### Board & piece visuals
- Standard 10x20 board
- Classic solid colors for each piece type (cyan I, yellow O, purple T, blue J, orange L, green S, red Z)
- Ghost piece rendered as outline only (no fill)
- Side panel layout: hold box on the left, next-5 queue on the right
- Dark solid background (black or near-black) — no grid lines

### Scoring system
- Modern Tetris Guideline scoring: 100/300/500/800 for single/double/triple/tetris
- T-spin bonuses, combo multipliers, back-to-back bonuses included
- Floating text popups on the board for scoring events ("TETRIS!", "T-SPIN DOUBLE", combo counters)
- Score, level, and lines cleared displayed persistently

### Level progression
- Level up every 10 lines cleared
- Drop speed increases each level
- Speed caps at level 15-20 so it remains playable

### Game over
- Game over screen showing final stats: score, level, lines cleared, time played
- "Play Again" button to restart

### Animations
- 60fps smooth rendering — pieces glide, don't teleport
- Line clear animations required

### Claude's Discretion
- Rendering technology (Canvas 2D, WebGL, or HTML/CSS)
- Tech stack / bundler choice
- Framework vs framework-agnostic architecture
- Key bindings layout
- DAS/ARR auto-repeat tuning
- Lock delay behavior (with/without reset)
- Pause functionality
- Exact cell size and spacing
- Line clear animation style
- Game over animation

</decisions>

<specifics>
## Specific Ideas

- Engine must be ready for multiplayer integration in Phase 3 (game state needs to be serializable/syncable)
- Retro pixel art final polish is Phase 3, but the foundation should support it (solid colors now, textures later)
- Competitive Tetris references: Jstris, Tetr.io, Tetris 99 for gameplay feel

</specifics>

<code_context>
## Existing Code Insights

### Reusable Assets
- No existing codebase — greenfield project

### Established Patterns
- No patterns established yet — Phase 2 will set the foundation

### Integration Points
- Phase 1 (Room & Lobby) will provide the app shell and WebSocket infrastructure
- Phase 3 will need to instantiate multiple game engines per room and sync state
- Game engine state must be extractable for opponent board rendering in Phase 3

</code_context>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 02-game-engine*
*Context gathered: 2026-03-04*
