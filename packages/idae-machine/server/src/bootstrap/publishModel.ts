/**
 * deployModel — writes a MachineModel into Mongo meta collections.
 * Reflexive: engine model can be deployed by the same function — see buildEngineModel().
 *
 * Convention: every meta doc has {id, code, name, color, icon, order}.
 * Relations (base, type, group, view_type, link) carried via fks only — no scalar duplicates.
 */
import { IdaeDb, DbType } from '@medyll/idae-db';
import { fkRef, FieldList } from '../../../src/lib/types/schema-types.js';
import { inferFieldGroup, ICON_BY_GROUP } from '../../../src/lib/types/schema-utils.js';
import { analyzeSchema } from './seed/schemaWalker.js';
import { ENGINE_BASE } from './seed/engineModel.js';

interface MachineFieldDef { type: string; required?: boolean; readonly?: boolean; private?: boolean; }
interface MachineFkDef    { code: string; multiple: boolean; required?: boolean; }
interface MachineCollection {
	keyPath?:  string;
	base?:     string;
	ts?:       any;
	fields:    Record<string, MachineFieldDef>;
	fks:       Record<string, MachineFkDef>;
	template?: Record<string, any>;
}
interface MachineModel { [collection: string]: MachineCollection; }

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

/** Ensure every collection declares a `code` field (semantic key). Pure. */
function ensureCodeField(model: MachineModel): MachineModel {
	const out: MachineModel = {};
	for (const [name, col] of Object.entries(model)) {
		const fields = col.fields ?? {};
		if ('code' in fields) { out[name] = col; continue; }
		const rebuilt: Record<string, MachineFieldDef> = {};
		for (const [fn, fd] of Object.entries(fields)) {
			rebuilt[fn] = fd;
			if (fn === 'id') rebuilt.code = { type: 'text' };
		}
		if (!('code' in rebuilt)) rebuilt.code = { type: 'text' };
		out[name] = { ...col, fields: rebuilt };
	}
	return out;
}

// ── Dynamic registry data (from FieldList) ────────────────────────────────
const FIELD_TYPES  = Object.values(FieldList).map(f => f.type);
const FIELD_GROUPS = Object.values(FieldList).map(f => f.group);
const SCHEME_TYPES = ['standard', 'type', 'group', 'status', 'range'] as const;
const VIEW_TYPES   = ['full', 'flat', 'fk', 'focus'] as const;

const DEFAULT_BASE = ENGINE_BASE;

function logSchemaAnalysis() {
	try {
		const { graph, report } = analyzeSchema();
		console.log('[deployModel] Schema analysis:');
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
		console.error('[deployModel] Schema analysis failed:', e);
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
// Wipes all docs from engine meta collections before a fresh seed.
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

// ── seedEngineRegistries ─────────────────────────────────────────────────────
// Bootstraps base 'machine_app' + global registries (field_type, field_group, scheme_type, view_type).
export async function seedEngineRegistries(opts: DeployOpts): Promise<void> {
	const idaeDb = await initDb(opts);
	const col    = (name: string) => idaeDb.collection(name);

	// 0. Base root (no fk yet — chicken-egg root)
	await upsertGetId(
		col(META.base),
		{ code: ENGINE_BASE },
		{ code: ENGINE_BASE, name: 'Machine Engine', icon: 'cpu', color: '#111', order: 1 },
	);

	const baseRef: Record<string, any> = {
		[META.base]: {
			id:       null as number | null,
			code:     ENGINE_BASE,
			name:     'Machine Engine',
			icon:     'cpu',
			color:    '#111',
			order:    1,
			multiple: false,
			required: true,
		},
	};
	const baseDoc = await col(META.base).findOne({ query: { code: ENGINE_BASE } });
	if (baseDoc) baseRef[META.base].id = baseDoc.id;

	// 1. field_type
	let ftOrder = 0;
	for (const code of FIELD_TYPES) {
		await upsertGetId(
			col(META.fieldType),
			{ code },
			{ code, name: code, icon: 'type', color: '#666', order: ++ftOrder, fks: baseRef },
		);
	}

	// 2. field_group
	let fgOrder = 0;
	for (const code of FIELD_GROUPS) {
		await upsertGetId(
			col(META.fieldGroup),
			{ code },
			{ code, name: code, icon: ICON_BY_GROUP[code] ?? 'tag', color: '#888', order: ++fgOrder, fks: baseRef },
		);
	}

	// 3. scheme_type
	let stOrder = 0;
	for (const code of SCHEME_TYPES) {
		await upsertGetId(
			col(META.schemeType),
			{ code },
			{ code, name: code, icon: 'layers', color: '#555', order: ++stOrder, fks: baseRef },
		);
	}

	// 4. view_type
	let vtOrder = 0;
	for (const code of VIEW_TYPES) {
		await upsertGetId(
			col(META.viewType),
			{ code },
			{ code, name: code, icon: 'eye', color: '#444', order: ++vtOrder, fks: baseRef },
		);
	}
}

// ── deployModel ──────────────────────────────────────────────────────────────
// Writes schemes / fields / has_field / views for the given MachineModel.
// Each collection's `base` is registered in META.base (default: ENGINE_BASE).
export async function deployModel(rawModel: MachineModel, opts: DeployOpts): Promise<void> {
	const model = ensureCodeField(rawModel);

	logSchemaAnalysis();
	const idaeDb = await initDb(opts);
	const col    = (name: string) => idaeDb.collection(name);
 

	// ── Ensure every base referenced by the model exists in META.base ──
	const baseById = new Map<string, number>();
	const bases    = new Set<string>();
	for (const c of Object.values(model)) bases.add(c.base ?? DEFAULT_BASE);
	console.log('[deployModel] bases in model:', [...bases]);

	let baseOrder = 10;
	for (const code of bases) {
		const id = await upsertGetId(
			col(META.base),
			{ code },
			{ code, name: code, icon: 'database', color: '#333', order: ++baseOrder },
		);
		baseById.set(code, id);
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

		const schemeFksDoc: Record<string, any> = {
			[META.base]:       fkRef({ code: baseCode, name: baseCode, icon: 'database', color: '#333', order: 0, multiple: false, required: true }),
			[META.schemeType]: fkRef({ code: typeCode, name: typeCode.charAt(0).toUpperCase() + typeCode.slice(1), icon: 'layers', color: '#555', order: 0, multiple: false, required: false }),
		};

		for (const [fkKey, fkDef] of Object.entries(fks)) {
			if (fkKey === META.base) continue;
			const fk = fkDef as any;
			schemeFksDoc[fkKey] = fkRef({ code: fk.code ?? fkKey, name: fk.code ?? fkKey, icon: 'link', color: '#888', order: 0, multiple: fk.multiple ?? false, required: !!fk.required });
		}

		// ── META.scheme ───────────────────────────────────────────────────────
		const isType   = ((colDef as any).isType   ?? collectionName.endsWith('_type'))   || undefined;
		const isGroup  = ((colDef as any).isGroup  ?? collectionName.endsWith('_group'))  || undefined;
		const isStatus = ((colDef as any).isStatus ?? collectionName.endsWith('_status')) || undefined;

		console.log(`  [deployModel] ${collectionName} → base=${baseCode}`, {fks: schemeFksDoc});
		const schemeId = await upsertGetId(
			col(META.scheme),
			{ code: collectionName },
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
				template,
				fks: schemeFksDoc,
			},
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
					[META.base]:       fkRef({ code: baseCode, name: baseCode, icon: 'database', color: '#333', order: 0, multiple: false, required: true }),
					[META.fieldType]:  fkRef({ code: baseType, name: baseType, icon: 'type', color: '#666', order: 0, multiple: false, required: true }),
					[META.fieldGroup]: fkRef({ code: group, name: group, icon: ICON_BY_GROUP[group] ?? 'tag', color: '#888', order: 0, multiple: false, required: false }),
				};

				const fieldId = await upsertGetId(
					col(META.field),
					{ code: fieldName },
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
					{ fkTargetCol: '', fkTargetField: '' },
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
							[META.scheme]:   fkRef({ code: collectionName, name: collectionName, icon: 'table', color: '#222', order: 0, multiple: false, required: true }),
							[META.viewType]: fkRef({ code: viewTypeCode, name: viewTypeCode, icon: 'eye', color: '#444', order: 0, multiple: false, required: true }),
							[META.field]:    fkRef({ code: vFieldName, name: vFieldName, icon: ICON_BY_GROUP[inferFieldGroup(vFieldName, '')] ?? 'circle', color: '#666', order: order + 1, multiple: false, required: false }),
						},
					},
				);
			}
		}
	}
}

// Back-compat alias — old call sites still work.
export const seedSchemeFromModel = deployModel;
