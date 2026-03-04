# Roadmap: Tetris Multiplayer

## Overview

Build a competitive multiplayer Tetris game for the web in three phases: first establish the room and lobby system so players can find each other; then build a complete single-player Tetris engine with all classic mechanics; finally wire up real-time multiplayer, garbage line mechanics, and the full visual style. Each phase delivers something independently verifiable before the next begins.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [ ] **Phase 1: Room & Lobby** - Players can create/join rooms and gather in a lobby before the game starts
- [ ] **Phase 2: Game Engine** - A complete, correct single-player Tetris game with all classic mechanics
- [ ] **Phase 3: Multiplayer & Polish** - Real-time competitive play with garbage lines, elimination, opponent views, and retro visuals

## Phase Details

### Phase 1: Room & Lobby
**Goal**: Players can enter the game casually and meet in a shared lobby before any match begins
**Depends on**: Nothing (first phase)
**Requirements**: ROOM-01, ROOM-02, ROOM-03, ROOM-04, ROOM-05
**Success Criteria** (what must be TRUE):
  1. User can open the app, type a nickname, and proceed without creating an account
  2. User can create a room and receive a shareable code or link to send to friends
  3. User can paste a code or click a link and land in the same room as the creator
  4. Lobby shows every connected player's nickname and their ready status in real time
  5. Host can press Start once at least 2 players have marked themselves ready
**Plans:** 3 plans

Plans:
- [ ] 01-01-PLAN.md — Project setup + entry screen with nickname input
- [ ] 01-02-PLAN.md — Socket.io server + room creation and joining flows
- [ ] 01-03-PLAN.md — Lobby UI with player cards, ready/start, countdown

### Phase 2: Game Engine
**Goal**: A fully correct single-player Tetris game that anyone can play in isolation
**Depends on**: Phase 1
**Requirements**: GAME-01, GAME-02, GAME-03, GAME-04, GAME-05, GAME-06, GAME-07, GAME-08, GAME-09, GAME-10
**Success Criteria** (what must be TRUE):
  1. Player can move, rotate (SRS + wall kicks), hard drop, and soft drop pieces with keyboard controls
  2. Ghost piece shows the landing position and the next-5-piece queue is always visible
  3. Player can hold a piece and swap it back; 7-bag randomizer ensures no piece drought
  4. Completed lines clear with animation and score updates for singles/doubles/triples/tetrises/T-spins/combos/back-to-back
  5. Game speed increases each level and the game ends when pieces stack to the top of the board
**Plans:** 4 plans

Plans:
- [ ] 02-01-PLAN.md — Project scaffold (Vite+TS) + core engine: types, board, pieces, SRS, 7-bag
- [ ] 02-02-PLAN.md — Game state machine: movement, drops, ghost, hold, lock delay, input handler
- [ ] 02-03-PLAN.md — Scoring system: T-spin detection, combos, back-to-back, level progression
- [ ] 02-04-PLAN.md — Canvas renderer, HUD, effects, main loop integration, human verification

### Phase 3: Multiplayer & Polish
**Goal**: 2-4 players compete in real time with garbage line mechanics, progressive elimination, and the full retro arcade visual style
**Depends on**: Phase 2
**Requirements**: MULT-01, MULT-02, MULT-03, MULT-04, MULT-05, MULT-06, VISL-01, VISL-02, VISL-03
**Success Criteria** (what must be TRUE):
  1. 2-4 players play simultaneously and see each other's boards update in real time without perceptible lag
  2. Clearing lines sends garbage rows (with random gap) to opponents' boards immediately
  3. A player whose pieces reach the top is eliminated and the remaining players continue until one wins
  4. Each player's screen shows their own board large with 3 mini opponent boards visible at all times
  5. The entire game uses a retro pixel art aesthetic with vibrant arcade colors, smooth piece movement, and line clear animations on desktop browsers
**Plans:** 4 plans

Plans:
- [ ] 03-01-PLAN.md — Real-time multiplayer sync + garbage line mechanics
- [ ] 03-02-PLAN.md — Multiplayer layout with main board + opponent mini boards
- [ ] 03-03-PLAN.md — Match flow: countdown, elimination, win condition, results
- [ ] 03-04-PLAN.md — Retro pixel art visual style, starfield, animations

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Room & Lobby | 0/3 | Planning complete | - |
| 2. Game Engine | 0/4 | Planning complete | - |
| 3. Multiplayer & Polish | 0/4 | Planning complete | - |
