/**
 * publishModel — publishes a MachineModel into Mongo meta collections (appscheme_*).
 * Not infra/DDL: it writes the schema-as-data (rows describing collections/fields/views).
 * Reflexive: the idae model is published by the same function — see buildIdaeModel().
 *
 * Convention: every meta doc has {id, code, name, color, icon, order}.
 * Relations (base, type, group, view_type, link) carried via fks only — no scalar duplicates.
 */
import { IdaeDb, DbType } from '@medyll/idae-db';
import { buildFkRef, FieldList, type FkRef } from '../idae/index.js';
import { ensureCodeToId } from './resolveFkUtils.js';
import { inferFieldGroup, ICON_BY_GROUP } from '../../../src/lib/types/schema-utils.js';
import { analyzeSchema } from './seed/schemaWalker.js';
import { MACHINE_APP_BASE } from './seed/idaeModel.js';
import type {
	MachineModel,
	MachineCollectionModel as MachineCollection,
	MachineFieldDef,
	MachineFkDef,
} from '../../../src/lib/types/machine-model.js';

interface DeployOpts { org: string; mongoUri: string; }

/** Single source of truth for meta-schema collection names. */
const META = {
	base:       'appscheme_base',
	scheme:     'appscheme',
	field:      'appscheme_field',
	hasField:   'appscheme_has_field',
	view:       'appscheme_view',
	fieldType:  'appscheme_field_type',
	fieldGroup: 'appscheme_field_group',
	schemeType: 'appscheme_type',
	viewType:   'appscheme_view_type',
} as const;

/** Ensure every collection declares both `code` and `name` fields. Pure. */
function ensureCodeField(model: MachineModel): MachineModel {
	const out: MachineModel = {};
	for (const [name, col] of Object.entries(model)) {
		const fields = col.fields ?? {};
		let rebuilt: Record<string, MachineFieldDef> | null = null;

		// Ensure code field exists
		if (!('code' in fields)) {
			rebuilt = {};
			for (const [fn, fd] of Object.entries(fields)) {
				rebuilt[fn] = fd;
				if (fn === 'id') rebuilt.code = { type: 'text' };
			}
			if (!('code' in rebuilt)) rebuilt.code = { type: 'text' };
		}

		// Ensure name field exists, mirror from code if needed
		if (!('name' in fields)) {
			if (!rebuilt) {
				rebuilt = { ...fields };
			}
			if (!('name' in rebuilt)) {
				// Mirror code field definition to name if code exists, otherwise create a basic text field
				if ('code' in (rebuilt ?? fields)) {
					rebuilt.name = { ...(rebuilt.code ?? fields.code) };
				} else {
					rebuilt.name = { type: 'text' };
				}
			}
		}

		out[name] = rebuilt ? { ...col, fields: rebuilt } : col;
	}
	return out;
}

// ── Dynamic registry data (from FieldList) ────────────────────────────────
const FIELD_TYPES  = Object.values(FieldList).map(f => f.type);
const FIELD_GROUPS = Object.values(FieldList).map(f => f.group);
const SCHEME_TYPES = ['standard', 'type', 'group', 'status', 'range'] as const;
const VIEW_TYPES   = ['full', 'flat', 'fk', 'focus'] as const;

const DEFAULT_BASE = MACHINE_APP_BASE;

function logSchemaAnalysis() {
	try {
		const { graph, report } = analyzeSchema();
		console.log('[publishModel] Schema analysis:');
		console.log(`- Collections: ${Object.keys(graph.collections).length}`);
		console.log(`- FK dependencies: ${Object.keys(graph.fkDependencies).length}`);
		if (report.unresolvedRefs.length > 0) {
			console.log(`- Unresolved FK refs: ${report.unresolvedRefs.length}`);
			report.unresolvedRefs.forEach(ref => console.log(`  ${ref}`));
		}
		if (report.asymmetries.length > 0) {
			console.log(`- Asymmetries: ${report.asymmetries.length}`);
			report.asymmetries.forEach(a => console.log(`  ${a.sourceCollection}.${a.sourceField} → ${a.targetCollection} (${a.issue})`));
		}
	} catch (e) {
		console.error('[publishModel] Schema analysis failed:', e);
	}
}

async function upsertGetId(
	adapter:    any,
	matchQuery: Record<string, any>,
	data:       Record<string, any>,
	unsetData?: Record<string, ''>,
): Promise<number> {
	const existing = await adapter.findOne({ query: matchQuery });
	if (existing) {
		const updateDoc: Record<string, unknown> = { $set: data };
		if (unsetData && Object.keys(unsetData).length > 0) updateDoc.$unset = unsetData;
		await adapter.updateWhere({ query: matchQuery }, updateDoc);
		return existing.id as number;
	}
	const created = await adapter.create(data);
	return created.id as number;
}

// ── embedFk ──────────────────────────────────────────────────────────────────
// Resolves code → id (creating record if absent) then returns a complete FkRef.
// The adapter MUST target the collection where the FK points — never the caller's DB.
async function embedFk(
	adapter: any,
	code: string,
	fkData: Omit<FkRef, 'id' | 'code'>
): Promise<FkRef> {
	const id = await ensureCodeToId(adapter, code, fkData);
	return buildFkRef({ id, code, ...fkData });
}

async function initDb(opts: DeployOpts): Promise<IdaeDb> {
	const idaeDb = IdaeDb.init(opts.mongoUri, {
		dbType:           DbType.MONGODB,
		dbScope:          opts.org,
		dbScopeSeparator: '_',
		idaeModelOptions: {
			autoIncrementFormat:       () => 'id',
			autoIncrementDbCollection: 'auto_increment',
		},
	});
	const conn = await idaeDb.db('machine_app');
	console.log(`[initDb] connected → ${(conn as any).dbName ?? 'unknown'}`);
	return idaeDb;
}

// ── clearCollections ──────────────────────────────────────────────────────────
// Wipes all docs from idae meta collections before a fresh seed.
export async function clearCollections(opts: DeployOpts): Promise<void> {
	console.log('[clearCollections] start, org=', opts.org);
	const idaeDb = await initDb(opts);
	for (const name of Object.values(META)) {
		try {
			await idaeDb.collection(name).deleteWhere({ query: {} });
			console.log(`  cleared ${name}`);
		} catch (e) {
			console.log(`  skip ${name} (not found)`);
		}
	}
	console.log('[clearCollections] done');
}

// ── seedIdaeRegistries ─────────────────────────────────────────────────────
// Bootstraps base 'machine_app' + global registries (field_type, field_group, scheme_type, view_type).
export async function seedIdaeRegistries(opts: DeployOpts): Promise<void> {
	const idaeDb = await initDb(opts);
	const col    = (name: string) => idaeDb.collection(name);

	// 0. Base root (no fk yet — chicken-egg root)
	const baseId = await upsertGetId(
		col(META.base),
		{ code: MACHINE_APP_BASE },
		{ code: MACHINE_APP_BASE, name: 'Machine App', icon: 'cpu', color: '#111', order: 1 },
	);

	const baseRef: Record<string, any> = {
		[META.base]: { id: baseId, code: MACHINE_APP_BASE, name: 'Machine App', icon: 'cpu', color: '#111', order: 1, multiple: false, required: true },
	};

	// 1. field_type
	let ftOrder = 0;
	for (const code of FIELD_TYPES) {
		const fieldTypeId = await ensureCodeToId(
			col(META.fieldType),
			code,
			{ code, name: code, icon: 'type', color: '#666', order: ++ftOrder, fks: baseRef }
		);
		console.log(`  [seedIdaeRegistries] field_type ${code} → id=${fieldTypeId}`);
	}

	// 2. field_group
	let fgOrder = 0;
	for (const code of FIELD_GROUPS) {
		const fieldGroupId = await ensureCodeToId(
			col(META.fieldGroup),
			code,
			{ code, name: code, icon: ICON_BY_GROUP[code] ?? 'tag', color: '#888', order: ++fgOrder, fks: baseRef }
		);
		console.log(`  [seedIdaeRegistries] field_group ${code} → id=${fieldGroupId}`);
	}

	// 3. scheme_type
	let stOrder = 0;
	for (const code of SCHEME_TYPES) {
		const schemeTypeId = await ensureCodeToId(
			col(META.schemeType),
			code,
			{ code, name: code, icon: 'layers', color: '#555', order: ++stOrder, fks: baseRef }
		);
		console.log(`  [seedIdaeRegistries] scheme_type ${code} → id=${schemeTypeId}`);
	}

	// 4. view_type
	let vtOrder = 0;
	for (const code of VIEW_TYPES) {
		const viewTypeId = await ensureCodeToId(
			col(META.viewType),
			code,
			{ code, name: code, icon: 'eye', color: '#444', order: ++vtOrder, fks: baseRef }
		);
		console.log(`  [seedIdaeRegistries] view_type ${code} → id=${viewTypeId}`);
	}
}

// ── publishModel ──────────────────────────────────────────────────────────────
// Writes schemes / fields / has_field / views for the given MachineModel.
// Each collection's `base` is registered in META.base (default: MACHINE_APP_BASE).
export async function publishModel(rawModel: MachineModel, opts: DeployOpts): Promise<void> {
	const model = ensureCodeField(rawModel);

	logSchemaAnalysis();
	const idaeDb = await initDb(opts);
	const col    = (name: string) => idaeDb.collection(name);
 

	// ── Ensure every base referenced by the model exists in META.base ──
	const baseById = new Map<string, number>();
	const bases    = new Set<string>();
	for (const c of Object.values(model)) bases.add(c.base ?? DEFAULT_BASE);
	console.log('[publishModel] bases in model:', [...bases]);

	let baseOrder = 10;
	for (const code of bases) {
		const id = await ensureCodeToId(
			col(META.base),
			code,
			{ code, name: code, icon: 'database', color: '#333', order: ++baseOrder }
		);
		baseById.set(code, id);
		console.log(`  [publishModel] base ${code} → id=${id}`);
	}

	// ── Per-collection ───────────────────────────────────────────────────────
	const fieldReg    = new Map<string, number>();
	let   schemeOrder = 0;

	for (const [collectionName, colDef] of Object.entries(model)) {
		const template = colDef.template ?? {};
		const fks      = colDef.fks      ?? {};
		const fields   = colDef.fields   ?? {};
		const baseCode = colDef.base     ?? DEFAULT_BASE;

		const typeCode =
			((colDef as any).isType   ?? collectionName.endsWith('_type'))   ? 'type'   :
			((colDef as any).isGroup  ?? collectionName.endsWith('_group'))  ? 'group'  :
			((colDef as any).isStatus ?? collectionName.endsWith('_status')) ? 'status' :
			'standard';

		const schemeFksDoc: Record<string, any> = {};

		// Resolve base FK eagerly
		schemeFksDoc[META.base] = await embedFk(col(META.base), baseCode, {
			name: baseCode, icon: 'database', color: '#333', order: 0, multiple: false, required: true
		});

		// Resolve schemeType FK eagerly
		schemeFksDoc[META.schemeType] = await embedFk(col(META.schemeType), typeCode, {
			name: typeCode.charAt(0).toUpperCase() + typeCode.slice(1), icon: 'layers', color: '#555', order: 0, multiple: false, required: false
		});

		// Resolve custom FKs eagerly
		for (const [fkKey, fkDef] of Object.entries(fks)) {
			if (fkKey === META.base) continue;
			const fk = fkDef as any;
			schemeFksDoc[fkKey] = await embedFk(col(fkKey), fk.code ?? fkKey, {
				name: fk.code ?? fkKey, icon: 'link', color: '#888', order: 0, multiple: fk.multiple ?? false, required: !!fk.required
			});
		}

		// ── META.scheme ───────────────────────────────────────────────────────
		const isType   = ((colDef as any).isType   ?? collectionName.endsWith('_type'))   || undefined;
		const isGroup  = ((colDef as any).isGroup  ?? collectionName.endsWith('_group'))  || undefined;
		const isStatus = ((colDef as any).isStatus ?? collectionName.endsWith('_status')) || undefined;

		// Log declared FKs (from the model), not the auto-injected meta base/type.
		const declaredFks = Object.entries(fks)
			.map(([k, v]) => `${k}${(v as any).multiple ? '[]' : ''}${(v as any).required ? '*' : ''}`);
		console.log(
			`  [publishModel] ${collectionName.padEnd(28)} base=${baseCode.padEnd(14)} type=${typeCode.padEnd(9)} fks=[${declaredFks.join(', ')}]`,
		);
		const schemeId = await ensureCodeToId(
			col(META.scheme),
			collectionName,
			{
				code:     collectionName,
				name:     collectionName,
				icon:     'table',
				color:    '#222',
				order:    ++schemeOrder,
				keyPath:  colDef.keyPath ?? '++id',
				base:     baseCode,
				...(isType   ? { isType:   true } : {}),
				...(isGroup  ? { isGroup:  true } : {}),
				...(isStatus ? { isStatus: true } : {}),
				...(colDef.rights ? { rights: colDef.rights } : {}),
				template,
				fks: schemeFksDoc,
			}
		);

		// ── META.field + META.hasField ────────────────────────────────────────
		let fieldOrder = 0;
		for (const [fieldName, fieldDef] of Object.entries(fields)) {
			const fd       = fieldDef as any;
			const rawType  = fd.type ?? 'text';
			const baseType = rawType.startsWith('fk-')
				? 'fk'
				: (FIELD_TYPES.includes(rawType as any) ? rawType : 'text');
			const group     = inferFieldGroup(fieldName, rawType);
			const fieldIcon = ICON_BY_GROUP[group] ?? 'circle';
			const fieldType = rawType;

			if (!fieldReg.has(fieldName)) {
				const fieldGridFks = {
					[META.base]:       await embedFk(col(META.base),       baseCode, { name: baseCode, icon: 'database', color: '#333', order: 0, multiple: false, required: true }),
					[META.fieldType]:  await embedFk(col(META.fieldType),  baseType, { name: baseType, icon: 'type',     color: '#666', order: 0, multiple: false, required: true }),
					[META.fieldGroup]: await embedFk(col(META.fieldGroup), group,    { name: group,    icon: ICON_BY_GROUP[group] ?? 'tag', color: '#888', order: 0, multiple: false, required: false }),
				};

				const fieldId = await ensureCodeToId(
                col(META.field),
                fieldName,
                {
                  code:     fieldName,
                  name:     fieldName,
                  icon:     fieldIcon,
                  color:    '#666',
                  order:    0,
                  fieldType,
                  required: fd.required ? 1 : 0,
                  readonly: fd.readonly ? 1 : 0,
                  private:  fd.private  ? 1 : 0,
                  fks: fieldGridFks,
                },
                { fkTargetCol: '', fkTargetField: '' }
              );
				fieldReg.set(fieldName, fieldId);
			}

			const fieldId = fieldReg.get(fieldName)!;
			fieldOrder++;

			await upsertGetId(
				col(META.hasField),
				{ [`fks.${META.scheme}.code`]: collectionName, [`fks.${META.field}.code`]: fieldName },
				{
					code:     `${collectionName}_${fieldName}`,
					name:     fieldName,
					icon:     fieldIcon,
					color:    '#666',
					order:    fieldOrder,
					visible:  fd.private ? 0 : 1,
					required: fd.required ? 1 : 0,
					readonly: fd.readonly ? 1 : 0,
					fks: {
						[META.scheme]: {
							id: schemeId, code: collectionName, name: collectionName,
							icon: 'table', color: '#222',
							order: 0, multiple: false, required: true,
						},
						[META.field]: {
							id: fieldId, code: fieldName, name: fieldName,
							icon: fieldIcon, color: '#666',
							order: 0, multiple: false, required: true,
						},
					},
				},
			);
		}

		// ── META.view ─────────────────────────────────────────────────────────
		const allFieldNames = Object.keys(fields);
		const fkSet = new Set(
			allFieldNames.filter((n) => ((fields[n] as any)?.type ?? '').startsWith('fk-')),
		);
		const identFields = allFieldNames.filter(
			(n) => inferFieldGroup(n, (fields[n] as any)?.type ?? 'text') === 'identification',
		);
		const focusFields = identFields.length
			? identFields
			: ['code', 'name'].filter((n) => n in fields);

		const viewDefs: Record<string, string[]> = {
			full:  allFieldNames,
			flat:  allFieldNames.filter((n) => !fkSet.has(n)),
			fk:    allFieldNames.filter((n) => fkSet.has(n)),
			focus: focusFields,
		};

		for (const [viewTypeCode, viewFields] of Object.entries(viewDefs)) {
			const viewTypeFk = await embedFk(col(META.viewType), viewTypeCode, { name: viewTypeCode, icon: 'eye', color: '#444', order: 0, multiple: false, required: true });
			for (const [order, vFieldName] of viewFields.entries()) {
				const vFieldId = fieldReg.get(vFieldName);
				if (!vFieldId) continue;
				await upsertGetId(
					col(META.view),
					{
						[`fks.${META.scheme}.code`]:   collectionName,
						[`fks.${META.viewType}.code`]: viewTypeCode,
						[`fks.${META.field}.code`]:    vFieldName,
					},
					{
						code:  `${collectionName}_${viewTypeCode}_${vFieldName}`,
						name:  vFieldName,
						icon:  'eye',
						color: '#444',
						order: order + 1,
						fks: {
							[META.scheme]:   buildFkRef({ id: schemeId, code: collectionName, name: collectionName, icon: 'table', color: '#222', order: 0, multiple: false, required: true }),
							[META.viewType]: viewTypeFk,
							[META.field]:    buildFkRef({ id: vFieldId, code: vFieldName, name: vFieldName, icon: ICON_BY_GROUP[inferFieldGroup(vFieldName, '')] ?? 'circle', color: '#666', order: order + 1, multiple: false, required: false }),
						},
					},
				);
			}
		}
	}

	// FKs are now resolved eagerly during publish — no post-pass needed.
}

// Back-compat alias — old call sites still work.
export const seedSchemeFromModel = publishModel;
