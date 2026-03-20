# idae-query

A powerful query library with MongoDB-like interface, TypeScript support, and front-end framework integration.

## Architecture

```mermaid
graph TD
    A[Data Source] --> B[Query Builder]
    B --> C[Filter]
    B --> D[Sort]
    B --> E[Paginate]
    C --> F[Aggregation]
    D --> F
    E --> F
    F --> G[Results]
```

## Features

- MongoDB-like syntax
- TypeScript support
- Composable queries
- Framework agnostic
- Performance optimized

## Installation

```bash
npm install @medyll/idae-query
pnpm add @medyll/idae-query
```

## Documentation

For more information, visit the [main documentation](../../README.md)

## License

MIT
