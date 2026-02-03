# @medyll/idae-socket - Agent Instructions

**Package**: `@medyll/idae-socket`
**Description**: Real-time synchronization service (HTTP-to-WebSocket gateway).
**Status**: Alpha / Prototype

## 🧠 What you need to know

`idae-socket` is the **glue** between the REST-based backend and the reactive Frontend. 
It solves the problem: *"How do I tell the frontend that the database changed?"*

### Core Mechanism
It works as a relay:
`Backend` --(HTTP POST)--> `idae-socket` --(Socket.IO)--> `Frontend`

### Files to Watch
- `src/lib/server/httpDriver.ts`: Main entry point. Starts Express server + Socket.io.
- `src/lib/server/socketBridge/socketIoServer.ts`: Manages Socket.IO connections, rooms, and auth.
- `src/lib/server/dataEvent.ts`: Dispatches internal events to socket rooms.
- `src/lib/client/index.ts`: The TypeScript client used by frontends.

## ⚠️ Coding Guidelines for this Package

1.  **Imports**:
    *   This package currently mixes `require` and `import`.
    *   **Goal**: Refactor towards pure ESM `import`.
    *   When adding new code, use `import`.

2.  **Dependencies**:
    *   Do **NOT** use `request` for new HTTP calls (it is deprecated). Use `fetch`.
    *   `express` is used for the ingress server.

3.  **Authentication**:
    *   Auth is extremely basic/stubbed in `socketIoServer.ts`.
    *   Do not rely on it for security in its current state.

4.  **Client Usage**:
    *   The `EventDataClientInstance` is the standard way to connect.
    *   Always configure `host` and `port` before calling `.connect()`.

## Common Tasks

- **Adding a new route/event**:
    - Routes are config-driven (check `src/lib/server/_utils/routes.ts` or `_config/`).
    - The `httpDriver` dynamically creates POST routes based on this config.

- **Debugging connectivity**:
    - Check `socketDriver.ts` to see how the "client" mimics a connection.
    - Logs are simple `console.log` for now.

## Relationships
- **Upstream**: `idae-api-nest` (calls `idae-socket` via HTTP).
- **Downstream**: `idae-idbql` (listens to `idae-socket` events).
