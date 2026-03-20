# idae-sync

Sync scaffolding for Idae with Outbox store, SyncAdapter, and deliverers.

## Architecture

```mermaid
graph TD
    A[Application] --> B[Outbox Store]
    B --> C[SyncAdapter]
    C --> D[Deliverers]
    D -->|Email| E[Email Service]
    D -->|Webhook| F[Webhook]
    D -->|Queue| G[Message Queue]
```

## Features

- Outbox pattern
- Sync adapter
- Multiple deliverers
- Reliable delivery
- Event sourcing

## Installation

```bash
npm install @medyll/idae-sync
pnpm add @medyll/idae-sync
```

## Documentation

For more information, visit the [main documentation](../../README.md)

## License

MIT
