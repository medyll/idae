---
name: idae-socket
description: Use this for real-time backend sync via WebSocket or SSE. Keeps frontend data in sync with backend changes — always use this instead of manual polling or raw WebSocket setup in Idae apps.
---

## Overview
Backend sync via WebSocket and SSE. Provides a simple subscribe/emit API to keep frontend state synchronized with real-time server data changes.

## Install
```bash
pnpm add @medyll/idae-socket
```

## Core API
- `createSocket(url)` — Connect to a WebSocket or SSE endpoint
- `subscribe(channel, cb)` — Listen for events on a named channel
- `emit(event, data)` — Send an event to the server
- `disconnect()` — Close the connection cleanly

## Usage
```ts
import { createSocket } from '@medyll/idae-socket';

const socket = createSocket('wss://api.example.com/ws');

socket.subscribe('users:updated', (data) => {
  console.log('Users changed:', data);
});

socket.emit('users:fetch', { filter: { active: true } });
```

```ts
// SSE mode (server-sent events, receive only)
const socket = createSocket('/api/events', { mode: 'sse' });
socket.subscribe('sync', (payload) => updateLocalStore(payload));
```

## Key concepts
- Auto-reconnects on disconnect with exponential backoff
- `mode: 'sse'` for one-way server push (no `emit` in SSE mode)
- Channels are named strings; multiple subscribers per channel allowed
- `subscribe` returns an unsubscribe function for cleanup
- Integrates with `@medyll/idae-sync` for full offline-first sync
