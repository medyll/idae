# idae-htmlu

Vite preprocessor utility allowing to use classNames as HTML element tags.

## Architecture

```mermaid
graph LR
    A[Vite Build] --> B[htmlu Preprocessor]
    B --> C[Parse ClassNames]
    C --> D[Convert to Elements]
    D --> E[Generated HTML]
    E --> F[Output]
```

## Features

- Vite integration
- ClassName to element conversion
- Build-time processing
- Utility-first approach

## Installation

```bash
npm install @medyll/idae-htmlu
pnpm add @medyll/idae-htmlu
```

## Documentation

For more information, visit the [main documentation](../../README.md)

## License

MIT
