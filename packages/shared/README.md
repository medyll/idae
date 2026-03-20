# shared

Shared utilities and dependencies for the Idae ecosystem.

## Architecture

```mermaid
graph TD
    A[Shared Core] --> B[Utilities]
    A --> C[Types]
    A --> D[Constants]
    B --> E[Applications]
    C --> E
    D --> E
```

## Features

- Shared utilities
- Common types
- Shared constants
- Reusable helpers
- Type-safe exports

## Installation

```bash
npm install @medyll/shared
pnpm add @medyll/shared
```

## Documentation

For more information, visit the [main documentation](../../README.md)

## License

MIT
