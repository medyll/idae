/**
 * Generate server/MCP-TOOLS.md from the live tool registry.
 * Usage: npx tsx server/scripts/generate-mcp-doc.ts
 */
import { writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { TOOLS } from '../src/mcp/McpTools.js';
import { schemaTools } from '../src/mcp/tools/schemaTools.js';
import { dataTools } from '../src/mcp/tools/dataTools.js';
import { authTools } from '../src/mcp/tools/authTools.js';
import { adminTools } from '../src/mcp/tools/adminTools.js';
import { orgTools } from '../src/mcp/tools/orgTools.js';
import { peripheryTools } from '../src/mcp/tools/peripheryTools.js';

const groups: Array<[string, typeof TOOLS]> = [
	['Schema', schemaTools],
	['Data', dataTools],
	['Auth & API keys', authTools],
	['Admin (users / RBAC / audit)', adminTools],
	['Org & schema mutation', orgTools],
	['Periphery (files / mail / health)', peripheryTools],
];

function args(schema: Record<string, any>): string {
	const props = schema.properties ?? {};
	const required: string[] = schema.required ?? [];
	const parts = Object.entries(props).map(([name, def]: [string, any]) => {
		const opt = required.includes(name) ? '' : '?';
		return `\`${name}${opt}\` (${def.type ?? 'any'})`;
	});
	return parts.length ? parts.join(', ') : '—';
}

let md = `# MCP Tool Reference — idae-machine

> GENERATED — do not edit. Regenerate with \`npx tsx server/scripts/generate-mcp-doc.ts\`.
> Endpoint: \`POST /api/mcp\` (stateless Streamable HTTP). Auth: \`Authorization: Bearer <JWT | mk_<org>_<secret> API key>\`.
> ${TOOLS.length} tools.

`;

for (const [title, tools] of groups) {
	md += `## ${title}\n\n| Tool | Arguments | Description |\n|------|-----------|-------------|\n`;
	for (const t of tools) {
		md += `| \`${t.name}\` | ${args(t.inputSchema)} | ${t.description.replace(/\|/g, '\\|')} |\n`;
	}
	md += '\n';
}

const out = resolve(dirname(fileURLToPath(import.meta.url)), '../MCP-TOOLS.md');
writeFileSync(out, md, 'utf8');
console.log(`Wrote ${out} (${TOOLS.length} tools)`);
