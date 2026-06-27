#!/usr/bin/env node
// scan-conventions.mjs — déduit les règles d'écriture DEPUIS le code, pas depuis la prose.
//
// Problème résolu : "écris comme le code autour" échoue quand le code autour montre 2-3 patterns.
// L'AI copie le mauvais voisin → drift. Ici on extrait le pattern DOMINANT, on le fige dans
// CONVENTIONS.generated.md, et on désigne un "golden component" par famille (= COPIE ÇA).
//
// Rejouable : re-scan régulier. Le nombre d'outliers = thermomètre du drift.
//
// Usage : npm run conventions   (écrit CONVENTIONS.generated.md à la racine)

import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SCAN_DIR = join(ROOT, 'src', 'lib');

// --- collecte des .svelte (hors tests/demo) ---
function walk(dir, acc = []) {
	for (const name of readdirSync(dir)) {
		const p = join(dir, name);
		const st = statSync(p);
		if (st.isDirectory()) {
			if (name === '__tests__') continue; // fixtures de test ≠ golden
			walk(p, acc);
		} else if (name.endsWith('.svelte') && !/\.(test|spec|demo)\./.test(name)) acc.push(p);
	}
	return acc;
}

// --- les RÈGLES MAISON (alignées CLAUDE.md invariants) ---
// chaque règle : detecte si applicable, puis si conforme. Score = conformes/applicables.
const RULES = [
	{
		id: 'ts-script',
		label: 'script en lang="ts"',
		applies: (s) => /<script/.test(s),
		ok: (s) => /<script[^>]*\blang=["']ts["']/.test(s)
	},
	{
		id: 'runes-props',
		label: 'props via $props() (pas export let)',
		applies: (s) => /export\s+let\s|\$props\s*\(/.test(s),
		ok: (s) => /\$props\s*\(/.test(s) && !/export\s+let\s/.test(s)
	},
	{
		id: 'no-reactive-colon',
		label: 'pas de $: (runes $derived/$effect)',
		applies: () => true,
		ok: (s) => !/^\s*\$:/m.test(s)
	},
	{
		id: 'no-onmount',
		label: 'pas de onMount (runes $effect)',
		applies: () => true,
		ok: (s) => !/\bonMount\b/.test(s)
	},
	{
		id: 'no-svelte-store',
		label: "pas d'import svelte/store (runes only)",
		applies: () => true,
		ok: (s) => !/from\s+['"]svelte\/store['"]/.test(s)
	},
	{
		id: 'no-self-import',
		label: 'pas de self-import @medyll/idae-machine',
		applies: () => true,
		ok: (s) => !/@medyll\/idae-machine/.test(s)
	},
	{
		id: 'style-has-display',
		label: 'si <style> + tag custom, règle display présente',
		applies: (s) => /<style/.test(s) && /<[a-z]+-[a-z-]+/.test(s),
		ok: (s) => /display\s*:/.test(s.split('<style')[1] || '')
	}
];

const files = walk(SCAN_DIR).sort();
const rows = files.map((f) => {
	const src = readFileSync(f, 'utf8');
	const results = RULES.map((r) => ({
		id: r.id,
		applies: r.applies(src),
		ok: r.applies(src) ? r.ok(src) : null
	}));
	const applicable = results.filter((r) => r.applies);
	const conform = applicable.filter((r) => r.ok);
	return {
		file: relative(ROOT, f).replace(/\\/g, '/'),
		folder: relative(SCAN_DIR, dirname(f)).replace(/\\/g, '/') || '.',
		results,
		score: applicable.length ? conform.length / applicable.length : 1,
		violations: results.filter((r) => r.applies && r.ok === false).map((r) => r.id)
	};
});

// --- adoption par règle (le pattern DOMINANT) ---
const adoption = RULES.map((r) => {
	const app = rows.filter((row) => row.results.find((x) => x.id === r.id)?.applies);
	const ok = app.filter((row) => row.results.find((x) => x.id === r.id)?.ok);
	return { ...r, total: app.length, ok: ok.length, pct: app.length ? Math.round((ok.length / app.length) * 100) : 100 };
});

// --- golden component par famille (dossier) : meilleur score, départage par taille ---
const families = {};
for (const row of rows) {
	const fam = row.folder.split('/').slice(0, 2).join('/');
	(families[fam] ||= []).push(row);
}
const golden = Object.entries(families)
	.map(([fam, list]) => {
		const best = [...list].sort((a, b) => b.score - a.score || a.file.localeCompare(b.file))[0];
		return { fam, golden: best.file, score: Math.round(best.score * 100), count: list.length };
	})
	.sort((a, b) => a.fam.localeCompare(b.fam));

const outliers = rows.filter((r) => r.violations.length).sort((a, b) => b.violations.length - a.violations.length);

// --- émission markdown ---
const d = new Date().toISOString().slice(0, 10);
let md = `# CONVENTIONS.generated.md — règles d'écriture déduites du code\n\n`;
md += `> Généré par \`npm run conventions\` le ${d}. **Ne pas éditer à la main** — re-scanner.\n`;
md += `> Source : ${rows.length} composants .svelte sous \`src/lib\` (hors tests/demo).\n`;
md += `> Le nombre d'outliers est le thermomètre du drift : il doit tendre vers 0.\n\n`;

md += `## Règles maison (adoption mesurée = le pattern dominant)\n\n`;
md += `| Règle | Adoption | Statut |\n|---|---|---|\n`;
for (const a of adoption) {
	const flag = a.pct === 100 ? '✅ loi' : a.pct >= 80 ? '🟡 dominante' : '🔴 contestée';
	md += `| ${a.label} | ${a.ok}/${a.total} (${a.pct}%) | ${flag} |\n`;
}
md += `\n_≥80% = convention de facto → traiter comme loi, corriger les déviants. <80% = pas de loi claire, décision utilisateur requise._\n\n`;

md += `## Golden components (COPIE ÇA par famille)\n\n`;
md += `| Famille | Golden (le plus conforme) | Score | Composants |\n|---|---|---|---|\n`;
for (const g of golden) md += `| \`${g.fam}\` | \`${g.golden}\` | ${g.score}% | ${g.count} |\n`;

md += `\n## Outliers (déviants à corriger ou drift à tuer) — ${outliers.length}\n\n`;
if (!outliers.length) md += `_Aucun. Cohérence pleine._\n`;
else {
	md += `| Composant | Règles violées |\n|---|---|\n`;
	for (const o of outliers) md += `| \`${o.file}\` | ${o.violations.join(', ')} |\n`;
}

writeFileSync(join(ROOT, 'CONVENTIONS.generated.md'), md);
console.log(`CONVENTIONS.generated.md écrit — ${rows.length} composants, ${outliers.length} outliers.`);
for (const a of adoption.filter((x) => x.pct < 100)) console.log(`  ${a.pct}% ${a.label}`);
