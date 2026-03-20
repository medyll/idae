# idae-router

Routing library for managing application navigation and routes.

## Architecture

```mermaid
graph LR
    A[URL Change] --> B[Router]
    B --> C{Route Match}
    C -->|Match| D[Route Handler]
    C -->|No Match| E[404 Handler]
    D --> F[Component/Page]
    E --> F
    F --> G[Render]
```

## Features

- Dynamic routing
- Middleware support
- Route matching
- Navigation guards
- History management

## Installation

```bash
npm install @medyll/idae-router
pnpm add @medyll/idae-router
```

## Documentation

For more information, visit the [main documentation](../../README.md)

## License

MIT
