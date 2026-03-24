import fs from 'fs';
import path from 'path';
import type { IdbqModel } from '@medyll/idae-idbql';

const demoDir = path.resolve(__dirname);
const statusPath = path.resolve(__dirname, './demo-status.json');

export function analyzeDemo(model: IdbqModel) {
	const missingComponents: string[] = [];
	const warnings: string[] = [];

	// Check for required view components
	const tableComp = path.resolve(demoDir, 'CollectionTable.svelte');
	const cardComp = path.resolve(demoDir, 'CollectionCard.svelte');
	if (!fs.existsSync(tableComp)) missingComponents.push('CollectionTable');
	if (!fs.existsSync(cardComp)) missingComponents.push('CollectionCard');

	// Inspect model collections for uncommon field types that may need custom components
	for (const [collectionName, def] of Object.entries(model as any)) {
		const presentation = def.template?.presentation;
		if (!presentation) warnings.push(`${collectionName}: missing presentation field`);
		const fields = def.template?.fields || {};
		for (const [fName, rule] of Object.entries(fields)) {
			const ruleStr = String(rule || '');
			if (ruleStr.includes('fk-') && !ruleStr.includes('(required)')) {
				// just a non-critical warning
				warnings.push(`${collectionName}.${fName}: foreign key without explicit required rule`);
			}
			if (ruleStr.includes('text-long')) {
				// assume generic textarea exists; no-op
			}
		}
	}

	const ready = missingComponents.length === 0;
	const status = { missingComponents, warnings, ready, generatedAt: new Date().toISOString() };
	fs.writeFileSync(statusPath, JSON.stringify(status, null, 2), 'utf-8');
	return status;
}
