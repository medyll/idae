# idae-csss MCP server

Minimal MCP server scaffold for `idae-csss`.

Endpoints:

- `POST /mcp/run` — body `{ "tool": "csss.parse", "params": { "source": "..." } }`

Usage (development):

```bash
cd packages/idae-csss/mcp-server
pnpm install
pnpm run dev
```

Next steps: replace the stub parser in `src/handlers/csssHandler.ts` with the real parser from the package.

Run via npx (after publishing or from a packaged release):

```bash
npx idae-csss-mcp
```

If running from the repo for testing, build first and then run the bin:

```bash
cd packages/idae-csss/mcp-server
pnpm install
pnpm run build
node ./bin/idae-csss-mcp
```
