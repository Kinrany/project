## Roadmap

### 0.1

Example game

1. [x] Each player is a circle
2. [x] Arrow key movement

#### Tech
- [x] Node.js
- [x] No client framework, 2d canvas
- [x] Socket.io
- [x] No build tools

#### Also done
- [x] Handle players joining and leaving

### 0.2

Rewrite in Rust

### 0.3

Extract game-specific code into a single module

1. Browser view setup function
2. Initial game state
3. Browser view update function
4. "Player joined" event handler
5. "Player moved" event handler

### 0.4

Improve the game

1. Left click to shoot
   - Start with three bullets
2. Right click to slash
   - Jump forward
   - Kill enemies in the way
   - Freeze for half a second
3. Dead players drop their bullets
4. Respawn after 5 seconds

### Before 1.0

Extract more game-specific code


- "Game started" event handler
- "Player left" event handler
- Separate player input from events
- Make it possible for an event
  to schedule another event

### After 1.0

1. State filters determine which part of game state
   to share with the player
2. Event filters determine which events
   to share with the player
