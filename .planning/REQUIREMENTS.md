# Requirements: Tetris Multiplayer

**Defined:** 2026-03-04
**Core Value:** Partidas multiplayer em tempo real funcionando sem lag — 4 jogadores vendo seus campos e os campos dos adversários atualizados instantaneamente.

## v1 Requirements

Requirements for initial release. Each maps to roadmap phases.

### Gameplay

- [ ] **GAME-01**: User can move, rotate, and drop Tetris pieces using keyboard controls
- [ ] **GAME-02**: Pieces follow SRS rotation system with wall kicks
- [ ] **GAME-03**: Ghost piece shows where current piece will land
- [ ] **GAME-04**: User can hard drop and soft drop pieces
- [ ] **GAME-05**: Completed lines are cleared with animation
- [ ] **GAME-06**: User can hold current piece and swap it back later
- [ ] **GAME-07**: Next queue shows preview of upcoming 5 pieces
- [ ] **GAME-08**: 7-bag randomizer ensures fair piece distribution
- [ ] **GAME-09**: Score system with points for singles, doubles, triples, tetrises, T-spins, combos, and back-to-back bonuses
- [ ] **GAME-10**: Game speed increases as player progresses (levels)

### Multiplayer

- [ ] **MULT-01**: 2-4 players can play simultaneously in real-time
- [ ] **MULT-02**: Clearing lines sends garbage lines to opponents
- [ ] **MULT-03**: Garbage lines appear from bottom with random gap
- [ ] **MULT-04**: Player is eliminated when pieces stack to the top
- [ ] **MULT-05**: Last player standing wins the match
- [ ] **MULT-06**: Each player sees their field large + 3 mini opponent fields

### Room

- [ ] **ROOM-01**: User can create a room and receive a shareable code/link
- [ ] **ROOM-02**: User can join a room by entering code or clicking link
- [ ] **ROOM-03**: Lobby shows all connected players with ready status
- [ ] **ROOM-04**: Host can start game when at least 2 players are ready
- [ ] **ROOM-05**: User enters with a nickname (no account required)

### Visual

- [ ] **VISL-01**: Retro pixel art visual style with vibrant arcade colors
- [ ] **VISL-02**: Smooth piece movement and line clear animations
- [ ] **VISL-03**: Responsive layout that works on desktop browsers

## v2 Requirements

### Multiplayer

- **MULT-07**: Player can choose targeting strategy (badges, KOs, random)
- **MULT-08**: Spectator mode to watch ongoing matches

### Room

- **ROOM-06**: Host can configure game settings (speed, garbage rules)
- **ROOM-07**: Chat messages in lobby while waiting
- **ROOM-08**: Rematch option to play again with same group

### Social

- **SOCL-01**: Matchmaking queue for random opponents
- **SOCL-02**: User accounts with login for persistent stats
- **SOCL-03**: Global ranking/leaderboard

## Out of Scope

| Feature | Reason |
|---------|--------|
| Mobile native app | Web-first approach, mobile later |
| In-game chat | Focus on gameplay, not social features |
| Cooperative/team modes | v1 is free-for-all competitive only |
| Replays | High complexity, low priority for v1 |
| Custom skins/themes | Visual complexity, defer to v2+ |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| GAME-01 | Phase 2 | Pending |
| GAME-02 | Phase 2 | Pending |
| GAME-03 | Phase 2 | Pending |
| GAME-04 | Phase 2 | Pending |
| GAME-05 | Phase 2 | Pending |
| GAME-06 | Phase 2 | Pending |
| GAME-07 | Phase 2 | Pending |
| GAME-08 | Phase 2 | Pending |
| GAME-09 | Phase 2 | Pending |
| GAME-10 | Phase 2 | Pending |
| MULT-01 | Phase 3 | Pending |
| MULT-02 | Phase 3 | Pending |
| MULT-03 | Phase 3 | Pending |
| MULT-04 | Phase 3 | Pending |
| MULT-05 | Phase 3 | Pending |
| MULT-06 | Phase 3 | Pending |
| ROOM-01 | Phase 1 | Pending |
| ROOM-02 | Phase 1 | Pending |
| ROOM-03 | Phase 1 | Pending |
| ROOM-04 | Phase 1 | Pending |
| ROOM-05 | Phase 1 | Pending |
| VISL-01 | Phase 3 | Pending |
| VISL-02 | Phase 3 | Pending |
| VISL-03 | Phase 3 | Pending |

**Coverage:**
- v1 requirements: 24 total
- Mapped to phases: 24
- Unmapped: 0 ✓

---
*Requirements defined: 2026-03-04*
*Last updated: 2026-03-04 after roadmap creation*
