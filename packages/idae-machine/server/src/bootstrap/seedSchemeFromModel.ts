import { mongooseConnectionManager } from '@medyll/idae-api';

// MachineModel shape — minimal interface to avoid circular dep with client types
interface MachineFieldDef { type: string; required?: boolean; readonly?: boolean; private?: boolean; }
interface MachineFkDef    { code: string; multiple: boolean; required?: boolean; }
interface MachineModel    { [collection: string]: { keyPath: string; base?: string; ts?: any; template: { index: string; presentation: string; fields: Record<string, MachineFieldDef>; fks: Record<string, MachineFkDef>; }; }; }

interface SeedOpts {
	org:      string;
	mongoUri: string;
}

// ── ID counters (sequential integers per collection) ──────────────────────────
const counters: Record<string, number> = {};
function nextId(col: string): number {
	counters[col] = (counters[col] ?? 0) + 1;
	return counters[col];
}
function resetCounters() { Object.keys(counters).forEach(k => delete counters[k]); }

// ── Upsert helper ─────────────────────────────────────────────────────────────
async function upsert(col: any, match: Record<string, any>, data: Record<string, any>) {
	return col.updateOne(match, { $setOnInsert: { id: nextId(col.collectionName) }, $set: data }, { upsert: true });
}

// ── Reference caches (code → sequential id) ───────────────────────────────────
type RefCache = Map<string, number>;

// ── Static seed data ──────────────────────────────────────────────────────────
const FIELD_TYPES = [
	'id', 'text', 'text-short', 'text-medium', 'text-long', 'text-area',
	'number', 'boolean', 'date', 'datetime', 'time',
	'email', 'url', 'phone', 'password', 'currency',
	'image', 'file', 'json', 'fk', 'range', 'status', 'any',
] as const;

const FIELD_GROUPS = [
	'audit', 'classification', 'codification', 'contact', 'date',
	'finance', 'identification', 'inventory', 'location', 'metrics',
	'presentation', 'progress', 'quantity', 'security', 'status', 'system', 'custom',
] as const;

const SCHEME_TYPES  = ['standard', 'type', 'group', 'status', 'range'] as const;
const VIEW_TYPES    = ['list', 'mini', 'form', 'custom', 'fk_label'] as const;

// Map fk- prefix → canonical 'fk' type
function normalizeFieldType(type: string): string {
	if (type.startsWith('fk-')) return 'fk';
	if (type.startsWith('text-')) return 'text-long'; // keep text variants as-is if known
	return FIELD_TYPES.includes(type as any) ? type : 'text';
}

function inferFieldGroup(fieldName: string, type: string): string {
	if (type.startsWith('fk-')) return 'identification';
	if (['date', 'datetime', 'time'].includes(type)) return 'date';
	if (['email', 'phone', 'url'].includes(type)) return 'contact';
	if (['boolean'].includes(type)) return 'status';
	if (['number'].includes(type)) return 'metrics';
	if (['currency'].includes(type)) return 'finance';
	if (['image', 'file'].includes(type)) return 'presentation';
	if (['password'].includes(type)) return 'security';
	if (['id'].includes(type)) return 'identification';
	return 'presentation';
}

// ── seedSchemeFromModel ───────────────────────────────────────────────────────
export async function seedSchemeFromModel(model: MachineModel, opts: SeedOpts): Promise<void> {
	const { org, mongoUri } = opts;
	resetCounters();

	const dbName = `${org}_machine_app`;
	const db = mongooseConnectionManager.getConnection(dbName)
		?? await mongooseConnectionManager.createConnection(mongoUri, dbName, { dbName });

	// ── 1. appscheme_field_type ─────────────────────────────────────────────
	const ftCol  = db.collection('appscheme_field_type');
	const ftById: RefCache = new Map();
	for (const [i, code] of FIELD_TYPES.entries()) {
		const id = i + 1;
		await ftCol.updateOne(
			{ code },
			{ $setOnInsert: { id }, $set: { code, name: code, idappscheme_field_type: id } },
			{ upsert: true }
		);
		ftById.set(code, id);
	}

	// ── 2. appscheme_field_group ────────────────────────────────────────────
	const fgCol  = db.collection('appscheme_field_group');
	const fgById: RefCache = new Map();
	for (const [i, code] of FIELD_GROUPS.entries()) {
		const id = i + 1;
		await fgCol.updateOne(
			{ code },
			{ $setOnInsert: { id }, $set: { code, name: code, idappscheme_field_group: id } },
			{ upsert: true }
		);
		fgById.set(code, id);
	}

	// ── 3. appscheme_type ───────────────────────────────────────────────────
	const stCol  = db.collection('appscheme_type');
	const stById: RefCache = new Map();
	for (const [i, code] of SCHEME_TYPES.entries()) {
		const id = i + 1;
		await stCol.updateOne(
			{ code },
			{ $setOnInsert: { id }, $set: { code, name: code, idappscheme_type: id } },
			{ upsert: true }
		);
		stById.set(code, id);
	}

	// ── 4. appscheme_view_type ──────────────────────────────────────────────
	const vtCol  = db.collection('appscheme_view_type');
	const vtById: RefCache = new Map();
	for (const [i, code] of VIEW_TYPES.entries()) {
		const id = i + 1;
		await vtCol.updateOne(
			{ code },
			{ $setOnInsert: { id }, $set: { code, name: code, codeAppscheme_view_type: code, idappscheme_view_type: id } },
			{ upsert: true }
		);
		vtById.set(code, id);
	}

	// ── 5. appscheme_base ───────────────────────────────────────────────────
	const baseCol  = db.collection('appscheme_base');
	const baseById: RefCache = new Map();
	const bases    = new Set<string>();
	for (const col of Object.values(model)) {
		const base = (col as any).base as string | undefined;
		if (base) bases.add(base);
	}
	let baseId = 1;
	for (const code of bases) {
		await baseCol.updateOne(
			{ code },
			{
				$setOnInsert: { id: baseId, idappscheme_base: baseId },
				$set:         { code, name: code, codeAppscheme_base: code, nomAppscheme_base: code }
			},
			{ upsert: true }
		);
		baseById.set(code, baseId++);
	}

	// ── 6-10. Per-collection ─────────────────────────────────────────────────
	const schemeCol = db.collection('appscheme');
	const fieldCol  = db.collection('appscheme_field');
	const hasField  = db.collection('appscheme_has_field');
	const hasTField = db.collection('appscheme_has_table_field');
	const viewCol   = db.collection('appscheme_view');

	// Global field registry: code → { id, doc } (fields shared across collections)
	const fieldReg: Map<string, number> = new Map();
	let   fieldSeq = 0;
	let   schemeSeq = 0;

	for (const [collectionName, col] of Object.entries(model)) {
		const c        = col as any;
		const template = c.template ?? {};
		const fks      = template.fks ?? {};
		const fields   = template.fields ?? {};
		const baseCode = c.base as string | undefined;
		const baseId   = baseCode ? (baseById.get(baseCode) ?? null) : null;
		const stId     = stById.get('standard') ?? 1;

		schemeSeq++;

		// ── Build appscheme.gridFks ──────────────────────────────────────────
		// Contains: appscheme_base, appscheme_type + FK collection links
		const gridFks: Record<string, any> = {};

		if (baseCode && baseId) {
			gridFks['appscheme_base'] = {
				id:       baseId,
				code:     baseCode,
				name:     baseCode,
				icon:     '',
				order:    0,
				multiple: false,
				required: false,
			};
		}

		gridFks['appscheme_type'] = {
			id:       stId,
			code:     'standard',
			name:     'Standard',
			icon:     '',
			order:    0,
			multiple: false,
			required: false,
		};

		// FK collection links from template.fks
		for (const [fkKey, fkDef] of Object.entries(fks)) {
			const fk = fkDef as any;
			gridFks[fkKey] = {
				id:       null, // resolved at runtime when target scheme is known
				code:     fk.code ?? fkKey,
				name:     fk.code ?? fkKey,
				icon:     '',
				order:    0,
				multiple: fk.multiple ?? false,
				required: !!(fk.required),
			};
		}

		// ── 6. appscheme ────────────────────────────────────────────────────
		await schemeCol.updateOne(
			{ code: collectionName },
			{
				$setOnInsert: { id: schemeSeq, idappscheme: schemeSeq },
				$set: {
					code:                  collectionName,
					name:                  collectionName,
					codeAppscheme:         collectionName,
					nomAppscheme:          collectionName,
					base:                  baseCode ?? null,
					index:                 template.index ?? null,
					presentation:          template.presentation ?? null,
					keyPath:               c.keyPath ?? '++id',
					gridFks,
				}
			},
			{ upsert: true }
		);

		// ── 7. appscheme_field + 8. appscheme_has_field ─────────────────────
		let fieldOrder = 0;
		for (const [fieldName, fieldDef] of Object.entries(fields)) {
			const fd       = fieldDef as any;
			const rawType  = fd.type ?? 'text';
			const normType = normalizeFieldType(rawType);
			const group    = inferFieldGroup(fieldName, rawType);
			const ftId     = ftById.get(normType) ?? ftById.get('text') ?? 1;
			const fgId     = fgById.get(group) ?? fgById.get('presentation') ?? 1;

			// Global field dedup by code (fields can be shared)
			const fieldKey = fieldName;
			if (!fieldReg.has(fieldKey)) {
				fieldSeq++;
				fieldReg.set(fieldKey, fieldSeq);
				await fieldCol.updateOne(
					{ code: fieldName },
					{
						$setOnInsert: { id: fieldSeq, idappscheme_field: fieldSeq },
						$set: {
							code:             fieldName,
							name:             fieldName,
							codeAppscheme_field: fieldName,
							field_raw:        fieldName,
							field_type:       normType,
							field_group:      group,
							required:         fd.required ? 1 : 0,
							readonly:         fd.readonly ? 1 : 0,
							private:          fd.private  ? 1 : 0,
							gridFks: {
								appscheme_field_type: {
									id:       ftId,
									code:     normType,
									name:     normType,
									icon:     '',
									order:    0,
									multiple: false,
									required: false,
								},
								appscheme_field_group: {
									id:       fgId,
									code:     group,
									name:     group,
									icon:     '',
									order:    0,
									multiple: false,
									required: false,
								},
							},
						}
					},
					{ upsert: true }
				);
			}

			const fieldId = fieldReg.get(fieldKey)!;
			fieldOrder++;

			// appscheme_has_field: links this collection to this field
			await hasField.updateOne(
				{ 'gridFks.appscheme.code': collectionName, 'gridFks.appscheme_field.code': fieldName },
				{
					$setOnInsert: { id: fieldSeq * 1000 + schemeSeq, idappscheme_has_field: fieldSeq * 1000 + schemeSeq },
					$set: {
						code:      `${collectionName}_${fieldName}`,
						name:      fieldName,
						order:     fieldOrder,
						visible:   fd.private ? 0 : 1,
						required:  fd.required ? 1 : 0,
						readonly:  fd.readonly ? 1 : 0,
						gridFks: {
							appscheme: {
								id:       schemeSeq,
								code:     collectionName,
								name:     collectionName,
								icon:     '',
								order:    0,
								multiple: false,
								required: true,
							},
							appscheme_field: {
								id:       fieldId,
								code:     fieldName,
								name:     fieldName,
								icon:     '',
								order:    0,
								multiple: false,
								required: true,
							},
						},
					}
				},
				{ upsert: true }
			);

			// ── 9. appscheme_has_table_field (FK fields only) ────────────────
			if (rawType.startsWith('fk-')) {
				// e.g. 'fk-category.id' → target collection 'category', target field 'id'
				const [targetCol, targetField] = rawType.replace('fk-', '').split('.');
				await hasTField.updateOne(
					{
						'gridFks.appscheme_field.code': fieldName,
						'gridFks.appscheme.code':       collectionName,
						'gridFks.appscheme_link.code':  targetCol,
					},
					{
						$setOnInsert: { id: fieldSeq * 100 + schemeSeq, idappscheme_has_table_field: fieldSeq * 100 + schemeSeq },
						$set: {
							code:       `${collectionName}_${fieldName}_${targetCol}`,
							name:       `${fieldName} → ${targetCol}`,
							targetField: targetField ?? 'id',
							gridFks: {
								appscheme_field: {
									id:       fieldId,
									code:     fieldName,
									name:     fieldName,
									icon:     '',
									order:    0,
									multiple: false,
									required: fd.required ?? false,
								},
								appscheme: {
									id:       schemeSeq,
									code:     collectionName,
									name:     collectionName,
									icon:     '',
									order:    0,
									multiple: false,
									required: false,
								},
								appscheme_link: {
									id:       null, // resolved when target scheme is seeded
									code:     targetCol,
									name:     targetCol,
									icon:     '',
									order:    0,
									multiple: false,
									required: fd.required ?? false,
								},
							},
						}
					},
					{ upsert: true }
				);
			}
		}

		// ── 10. appscheme_view (auto-generate list/mini/form/fk_label) ───────
		const presentationFields = (template.presentation ?? '').split(' ').filter(Boolean);
		const allFieldNames      = Object.keys(fields);

		const viewDefs: Record<string, string[]> = {
			list:     presentationFields.length ? presentationFields : allFieldNames.slice(0, 5),
			mini:     presentationFields.slice(0, 2).length ? presentationFields.slice(0, 2) : allFieldNames.slice(0, 2),
			form:     allFieldNames,
			fk_label: presentationFields.length ? presentationFields : allFieldNames.slice(0, 2),
		};

		for (const [viewTypeCode, viewFields] of Object.entries(viewDefs)) {
			const vtId = vtById.get(viewTypeCode) ?? 1;
			for (const [order, vFieldName] of viewFields.entries()) {
				const vFieldId = fieldReg.get(vFieldName);
				if (!vFieldId) continue;
				const viewId = schemeSeq * 10000 + vtId * 100 + (order + 1);
				await viewCol.updateOne(
					{
						'gridFks.appscheme.code':            collectionName,
						'gridFks.appscheme_view_type.code':  viewTypeCode,
						'gridFks.appscheme_field.code':      vFieldName,
					},
					{
						$setOnInsert: { id: viewId, idappscheme_view: viewId },
						$set: {
							code:                viewTypeCode,
							ordreAppscheme_view: order + 1,
							gridFks: {
								appscheme: {
									id:       schemeSeq,
									code:     collectionName,
									name:     collectionName,
									icon:     '',
									order:    0,
									multiple: false,
									required: true,
								},
								appscheme_view_type: {
									id:       vtId,
									code:     viewTypeCode,
									name:     viewTypeCode,
									icon:     '',
									order:    0,
									multiple: false,
									required: true,
								},
								appscheme_field: {
									id:       vFieldId,
									code:     vFieldName,
									name:     vFieldName,
									icon:     '',
									order:    order + 1,
									multiple: false,
									required: false,
								},
							},
						}
					},
					{ upsert: true }
				);
			}
		}
	}
}
