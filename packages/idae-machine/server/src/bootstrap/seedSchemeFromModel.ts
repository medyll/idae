import mongoose from 'mongoose';
import type { IdbqModel } from '@medyll/idae-idbql';

interface SeedOpts {
	org: string;
	mongoUri: string;
}

function getMetaDb(org: string) {
	return mongoose.connection.useDb(`${org}_machine_app`, { useCache: true });
}

/**
 * Seed MongoDB appscheme_* collections from an IdbqModel.
 * Idempotent — uses upsert on `code` field.
 * Target DB: {org}_machine_app
 *
 * Collections written:
 *   appscheme_base  — unique base identifiers
 *   appscheme       — one entry per collection
 *   appscheme_field — one entry per field per collection
 */
export async function seedSchemeFromModel(model: IdbqModel, opts: SeedOpts): Promise<void> {
	const { org, mongoUri } = opts;

	const alreadyConnected = mongoose.connection.readyState === 1;
	if (!alreadyConnected) {
		await mongoose.connect(mongoUri);
	}

	const db = getMetaDb(org);
	const baseCol   = db.collection('appscheme_base');
	const schemeCol = db.collection('appscheme');
	const fieldCol  = db.collection('appscheme_field');

	// 1. Collect unique bases
	const bases = new Set<string>();
	for (const col of Object.values(model)) {
		const base = (col as any).base as string | undefined;
		if (base) bases.add(base);
	}

	// 2. Upsert appscheme_base
	for (const base of bases) {
		await baseCol.updateOne(
			{ code: base },
			{ $set: { code: base, name: base } },
			{ upsert: true }
		);
	}

	// 3. Upsert appscheme + appscheme_field per collection
	for (const [collectionName, col] of Object.entries(model)) {
		const c = col as any;
		const template = c.template ?? {};

		await schemeCol.updateOne(
			{ code: collectionName },
			{
				$set: {
					code:         collectionName,
					base:         c.base ?? null,
					index:        template.index ?? null,
					presentation: template.presentation ?? null,
					keyPath:      c.keyPath ?? null,
				}
			},
			{ upsert: true }
		);

		const fields = template.fields ?? {};
		for (const [fieldName, fieldDef] of Object.entries(fields)) {
			const fd = fieldDef as any;
			await fieldCol.updateOne(
				{ collection: collectionName, name: fieldName },
				{
					$set: {
						collection: collectionName,
						name:       fieldName,
						type:       fd.type ?? 'text',
						required:   fd.required ?? false,
						readonly:   fd.readonly ?? false,
						private:    fd.private ?? false,
					}
				},
				{ upsert: true }
			);
		}
	}
}
