# Phase 1: Room & Lobby - Context

**Gathered:** 2026-03-04
**Status:** Ready for planning

<domain>
## Phase Boundary

Players can enter the game casually (nickname only), create or join rooms via a 4-letter code or shareable link, gather in a visual lobby with real-time player status, ready up, and the host starts the match. No gameplay, no accounts, no matchmaking.

</domain>

<decisions>
## Implementation Decisions

### Entry flow
- Single screen: nickname input + "Create Room" and "Join Room" buttons
- Logo/title at the top of the entry screen — sets the Tetris mood
- Nickname validation: 2-12 characters, anything but empty (letters, numbers, spaces allowed)
- Nickname persisted in localStorage, pre-filled on next visit (editable)

### Lobby layout
- 2x2 grid of player cards — always show all 4 slots
- Empty slots display "Waiting for player..." with dashed border
- Room code displayed large at top with "Copy" button + shareable link visible
- When a player joins or leaves: card animation (fade in/out) + brief toast notification ("Player X joined")

### Room sharing
- Room code format: 4 uppercase letters (e.g., "ABCD")
- Shareable link: path-based URL like `/room/ABCD`
- Full room: error message "Room is full", player stays on join screen to try another code
- Invalid/expired room via link: "Room not found — create a new one?" with create button

### Ready & start
- Each player's card has a toggle "Ready" button — card changes color when ready
- Host distinguished by crown/star icon on their card
- Host sees "Start" button, enabled only when 2+ players are ready
- After pressing Start: 3-2-1 countdown overlay before game begins
- If host disconnects: host role transfers to next player who joined, room stays alive

### Claude's Discretion
- Exact visual styling, colors, and spacing
- Toast notification duration and animation style
- Countdown animation design
- Error message styling
- Loading states and connection handling

</decisions>

<specifics>
## Specific Ideas

No specific requirements — open to standard approaches

</specifics>

<code_context>
## Existing Code Insights

### Reusable Assets
- No existing codebase — greenfield project

### Established Patterns
- No patterns yet — this phase establishes the foundation

### Integration Points
- Entry screen is the app root
- Lobby feeds into game screen (Phase 2+3)
- WebSocket connection established in lobby carries into gameplay

</code_context>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 01-room-lobby*
*Context gathered: 2026-03-04*
