Examples for idae-sync

This folder contains minimal runnable examples demonstrating how to bootstrap idae-sync in a client application (browser environment).

Files:
- bootstrap.example.ts — minimal bootstrap showing initSync and a sample local write.

Notes:
- These examples are intended to run in a browser or a browser-like environment (Svelte app, Vite dev server). IndexedDB is required.
- For Node-based testing of idae-idbql you will need a fake IndexedDB polyfill (e.g., fake-indexeddb) and a DOM environment.

How to use
1. Copy the example code into your app bootstrap or run it inside a browser-based dev server.
2. Ensure the app has idae-idbql initialized with a schema and that `usersCollection` (or similar) is available.

