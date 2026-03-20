# idae-engine

A powerful TypeScript library for data manipulation operations like sorting, finding, and grouping.

## Architecture

```mermaid
graph TD
    A[Data Input] --> B[Engine]
    B --> C[Sort]
    B --> D[Filter]
    B --> E[Group]
    B --> F[Transform]
    C --> G[Processed Data]
    D --> G
    E --> G
    F --> G
```

## Features

- Sorting utilities
- Filtering operations
- Grouping functions
- Data transformation
- Type-safe operations

## Installation

```bash
npm install @medyll/idae-engine
pnpm add @medyll/idae-engine
```

## Documentation

For more information, visit the [main documentation](../../README.md)

## License

MIT
