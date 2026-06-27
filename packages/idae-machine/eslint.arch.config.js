// eslint.arch.config.js — GARDE D'ARCHITECTURE (mécanique, infaillible)
//
// Ne contient QUE les règles de frontière. Pas de règles de style (volontaire :
// le `gate` gagne le garde-fou archi sans hériter de milliers d'erreurs cosmétiques).
//
// Deux lois codées :
//   1. NAMESPACE.md  — main/ (moteur) NE DOIT PAS importer idae/ (domaine).
//                      Direction unique idae→main. Seam composition-root exempté.
//   2. CLAUDE.md §11 — pas de self-import du package (résout vers dist/).
//
// Lancé par `npm run lint:arch`, branché sur `gate`.

import tseslint from 'typescript-eslint';

const SELF_IMPORT = {
	group: ['@medyll/idae-machine', '@medyll/idae-machine/**'],
	message:
		"Self-import interdit (résout vers dist/ → faux positifs svelte-check). Utiliser $lib/... ou un chemin relatif. Voir CLAUDE.md invariant 11."
};

const IDAE_FROM_MAIN = {
	group: ['$lib/idae', '$lib/idae/**', '**/idae/**'],
	message:
		"LOI namespace (NAMESPACE.md) : main/ (MOTEUR) ne doit pas importer idae/ (DOMAINE). Direction unique idae→main. Code domaine = pose-le dans idae/. Seul seam autorisé = composition-root main/machine.ts."
};

export default tseslint.config(
	// parser TS sans type-info (rapide ; on ne fait que de l'analyse d'imports).
	// On enregistre le plugin @typescript-eslint SANS activer ses règles, pour que les
	// directives inline `eslint-disable @typescript-eslint/...` des sources se résolvent.
	{
		languageOptions: { parser: tseslint.parser },
		plugins: { '@typescript-eslint': tseslint.plugin },
		// ce config n'active QUE no-restricted-imports ; ne pas juger les directives
		// eslint-disable des sources (qui visent des règles de style non chargées ici).
		linterOptions: { reportUnusedDisableDirectives: 'off' }
	},

	// Loi 2 : self-import interdit partout dans src
	{
		files: ['src/**/*.ts'],
		rules: {
			'no-restricted-imports': ['error', { patterns: [SELF_IMPORT] }]
		}
	},

	// Loi 1 : main/ ne doit pas importer idae/ (en plus du self-import).
	// Vient APRÈS le bloc ci-dessus → pour les fichiers main/, ce bloc gagne (flat = last-wins
	// par règle), donc on répète SELF_IMPORT pour ne pas le perdre.
	// Exempté : composition-root (machine.ts) + tests.
	{
		files: ['src/lib/main/**/*.ts'],
		ignores: [
			'src/lib/main/machine.ts',
			'src/lib/main/**/*.test.ts',
			'src/lib/main/**/*.spec.ts',
			'src/lib/main/**/__tests__/**'
		],
		rules: {
			'no-restricted-imports': ['error', { patterns: [SELF_IMPORT, IDAE_FROM_MAIN] }]
		}
	}
);
