---
name: technical-planner
description: Detects intent to build, refactor, or debug code and generates a detailed technical roadmap. Use when the user describes a coding task, feature request, or complex bug fix.
metadata:
  author: Mydde
  version: "1.1"
---

# Technical Planner Skill

## Detection Logic
Trigger this skill when the user expresses an intent to perform a programming task. 
Keywords: "build", "refactor", "how to implement", "setup", "fix", "create", "implement".

## Instructions
1. **Goal Extraction:** Identify the core technical objective and the stack.
2. **Action Plan:** Generate a detailed Markdown list of tasks using `[ ]`. 
3. **Phased Approach:** Group actions into logical phases (e.g., Infrastructure, Logic, Frontend).
4. **Technical Specifics:** Include essential code snippets, schema definitions, or architectural patterns.
5. **Constraints:** Use the imperative mood, avoid fluff, and ensure steps are incremental.

## Examples

**User:** "I want to implement a real-time notification system with Node and MongoDB."

### 🏗️ Technical Implementation Plan

#### Phase 1: Infrastructure & Schema
- [ ] **Setup WebSocket:** Initialize `socket.io` or `ws` on the Node.js server.
- [ ] **Database Schema:** Create a `Notification` collection in MongoDB with `userId`, `type`, `payload`, and `isRead` (Boolean).
- [ ] **Indexing:** Add an index on `userId` and `createdAt` for performant fetching.

#### Phase 2: Backend Logic
- [ ] **Event Emitter:** Create a central utility to trigger notifications within the app logic.
- [ ] **Socket Middleware:** Implement JWT authentication for Socket.io connections.
- [ ] **Persistence Layer:** Write a service to save notifications to DB before emitting to the socket.

#### Phase 3: Frontend Integration (React/Svelte)
- [ ] **Context/Store:** Setup a global state to manage the notification stream.
- [ ] **Listener:** Implement the `on('notification')` effect with proper cleanup to avoid memory leaks.
- [ ] **UI Component:** Build a "Toast" or "Inbox" component to display incoming data.

#### ⚠️ Critical Notes
- **Scalability:** If using multiple server instances, use a **Redis Adapter** for Socket.io to sync events.
- **Backpressure:** Implement pagination or "Load More" for the notification history.

## Edge Cases
- **Schema Changes:** Always add a "Migration" or "Schema Update" step for DB modifications.
- **State Management:** For frontend tasks, specify if a store (Redux, Zustand, Svelte Store) is required.
- **Security:** Always include a step for authentication/authorization on new endpoints or sockets.