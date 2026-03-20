# idae-db

A flexible database interaction library with focus on MongoDB, offering connection management, API, and CRUD operations.

## Architecture

```mermaid
graph TD
    A[Application] --> B[Database Manager]
    B --> C{Database Type}
    C -->|MongoDB| D[Mongo Connection]
    C -->|MySQL| E[MySQL Connection]
    C -->|PostgreSQL| F[PostgreSQL Connection]
    D --> G[CRUD Operations]
    E --> G
    F --> G
```

## Features

- Multi-database support
- Connection pooling
- CRUD operations
- Query builder
- Transaction support

## Installation

```bash
npm install @medyll/idae-db
pnpm add @medyll/idae-db
```

## Documentation

For more information, visit the [main documentation](../../README.md)

## License

MIT
