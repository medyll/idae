/**
 * deployModel — writes a MachineModel into Mongo meta collections (appscheme_*).
 * Reflexive: engine model can be deployed by the same function — see buildEngineModel().
 *
 * Convention: every meta doc has {id, code, name, color, icon, order}.
 * Relations (base, type, group, view_type, link) carried via gridFks only — no scalar duplicates.
 */
import { IdaeDb, DbType } from '@medyll/idae-db';
import { fkRef, FkRef, FieldList } from '../../lib/types/schema-types';
import { inferFieldGroup, ICON_BY_GROUP } from '../../lib/types/schema-utils';
import { analyzeSchema } from './seed/schemaWalker';
import { idaeModelCore, ENGINE_BASE } from './seed/idae-model-core';

interface MachineFieldDef { type: string; required?: boolean; readonly?: boolean; private?: boolean; }
interface MachineFkDef    { code: string; multiple: boolean; required?: boolean; }
interface MachineCollection {
	keyPath:   string;
	base?:     string;
	ts?:       any;
	fields:    Record<string, MachineFieldDef>;
	fks:       Record<string, MachineFkDef>;
	template?: Record<string, any>;
}
interface MachineModel { [collection: string]: MachineCollection; }

interface DeployOpts { org: string; mongoUri: string; }

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
const FIELD_TYPES = Object.values(FieldList).map(f => f.type);
const FIELD_GROUPS = Object.values(FieldList).map(f => f.group);
const SCHEME_TYPES = ['standard', 'type', 'group', 'status', 'range'] as const;
const VIEW_TYPES   = ['full', 'flat', 'fk', 'focus'] as const;

// Default base for collections without explicit base (aligned with engineModel.ts)
const ENGINE_BASE = 'machine_app';
const USER_BASE   = 'machine_user';
const DEFAULT_BASE = ENGINE_BASE; // Default to engine base for core collections

// Log schema analysis (for debugging FK asymmetries)
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
	await idaeDb.db('machine_app');
	return idaeDb;
}

// ENGINE_COLLECTIONS dérivées dynamiquement de appModelDeclaration (via engineModel.ts)
// Supprimé en juin 2026 pour autonomie totale

// ── clearCollections ──────────────────────────────────────────────────────────
// Wipes all docs from engine meta collections before a fresh seed.
export async function clearCollections(opts: DeployOpts): Promise<void> {
	const idaeDb = await initDb(opts);
	for (const name of ENGINE_COLLECTIONS) {
		try {
			await idaeDb.collection(name).deleteWhere({ query: {} });
		} catch {
			// Collection may not exist yet on first run — ignore
		}
	}
}

// ── seedEngineRegistries ─────────────────────────────────────────────────────
// Bootstraps base 'machine_app' + global registries (field_type, field_group, scheme_type, view_type).
export async function seedEngineRegistries(opts: DeployOpts): Promise<void> {
	const idaeDb = await initDb(opts);
	const col    = (name: string) => idaeDb.collection(name);

	// 0. Base 'ENGINE_BASE' (no fk yet — chicken-egg root)
	await upsertGetId(
		col('appscheme_base'),
		{ code: ENGINE_BASE },
		{ code: ENGINE_BASE, name: 'Machine Engine', icon: 'cpu', color: '#111', order: 1 },
	);

	const baseRef = {
		appscheme_base: {
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
	const baseDoc = await col('appscheme_base').findOne({ query: { code: 'machine_app' } });
	if (baseDoc) baseRef.appscheme_base.id = baseDoc.id;

	// 1. appscheme_field_type
	let ftOrder = 0;
	for (const code of FIELD_TYPES) {
		await upsertGetId(
			col('appscheme_field_type'),
			{ code },
			{ code, name: code, icon: 'type', color: '#666', order: ++ftOrder, gridFks: baseRef },
		);
	}

	// 2. appscheme_field_group
	let fgOrder = 0;
	for (const code of FIELD_GROUPS) {
		await upsertGetId(
			col('appscheme_field_group'),
			{ code },
			{ code, name: code, icon: ICON_BY_GROUP[code] ?? 'tag', color: '#888', order: ++fgOrder, gridFks: baseRef },
		);
	}

	// 3. appscheme_type
	let stOrder = 0;
	for (const code of SCHEME_TYPES) {
		await upsertGetId(
			col('appscheme_type'),
			{ code },
			{ code, name: code, icon: 'layers', color: '#555', order: ++stOrder, gridFks: baseRef },
		);
	}

	// 4. appscheme_view_type
	let vtOrder = 0;
	for (const code of VIEW_TYPES) {
		await upsertGetId(
			col('appscheme_view_type'),
			{ code },
			{ code, name: code, icon: 'eye', color: '#444', order: ++vtOrder, gridFks: baseRef },
		);
	}
}

// ── deployModel ──────────────────────────────────────────────────────────────
// Writes schemes / fields / has_field / views for the given MachineModel.
// Each collection's `base` is registered in appscheme_base (default: 'machine_user').
export async function deployModel(rawModel: MachineModel, opts: DeployOpts): Promise<void> {
	const model = ensureCodeField(rawModel);
	
	// Analyze schema for FK asymmetries (debugging)
	logSchemaAnalysis();
	const idaeDb = await initDb(opts);
	const col    = (name: string) => idaeDb.collection(name);

	// Resolve registries — must exist (seedEngineRegistries first).
	const ftDocs = await col('appscheme_field_type').find({ query: {} });
	const ftById = new Map<string, number>(ftDocs.map((d: any) => [d.code as string, d.id as number]));

	const fgDocs = await col('appscheme_field_group').find({ query: {} });
	const fgById = new Map<string, number>(fgDocs.map((d: any) => [d.code as string, d.id as number]));

	const stDocs = await col('appscheme_type').find({ query: {} });
	const stById = new Map<string, number>(stDocs.map((d: any) => [d.code as string, d.id as number]));

	const vtDocs = await col('appscheme_view_type').find({ query: {} });
	const vtById = new Map<string, number>(vtDocs.map((d: any) => [d.code as string, d.id as number]));

	// ── Ensure every base referenced by the model exists in appscheme_base ──
	const baseById = new Map<string, number>();
	const bases    = new Set<string>();
	for (const c of Object.values(model)) bases.add(c.base ?? DEFAULT_BASE);

	let baseOrder = 10;
	for (const code of bases) {
		const id = await upsertGetId(
			col('appscheme_base'),
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
		const baseId   = baseById.get(baseCode)!;

		// Scheme type reflects the collection's role so DataList can group by it.
		const typeCode =
			((colDef as any).isType   ?? collectionName.endsWith('_type'))   ? 'type'   :
			((colDef as any).isGroup  ?? collectionName.endsWith('_group'))  ? 'group'  :
			((colDef as any).isStatus ?? collectionName.endsWith('_status')) ? 'status' :
			'standard';
		const stId = stById.get(typeCode) ?? stById.get('standard') ?? 1;

		const gridFks: Record<string, any> = {
			appscheme_base: fkRef({ code: baseCode, name: baseCode, icon: 'database', color: '#333', order: 0, multiple: false, required: true }),
			appscheme_type: fkRef({ code: typeCode, name: typeCode.charAt(0).toUpperCase() + typeCode.slice(1), icon: 'layers', color: '#555', order: 0, multiple: false, required: false }),
		};

		for (const [fkKey, fkDef] of Object.entries(fks)) {
			const fk = fkDef as any;
			gridFks[fkKey] = fkRef({ code: fk.code ?? fkKey, name: fk.code ?? fkKey, icon: 'link', color: '#888', order: 0, multiple: fk.multiple ?? false, required: !!fk.required });
		}

		// ── appscheme ─────────────────────────────────────────────────────────
		const isType   = ((colDef as any).isType   ?? collectionName.endsWith('_type'))   || undefined;
		const isGroup  = ((colDef as any).isGroup  ?? collectionName.endsWith('_group'))  || undefined;
		const isStatus = ((colDef as any).isStatus ?? collectionName.endsWith('_status')) || undefined;

		const schemeId = await upsertGetId(
			col('appscheme'),
			{ code: collectionName },
			{
				code:         collectionName,
				name:         collectionName,
				icon:         'table',
				color:        '#222',
				order:        ++schemeOrder,
				keyPath:      colDef.keyPath ?? '++id',
				base:         baseCode,
				...(isType   ? { isType:   true } : {}),
				...(isGroup  ? { isGroup:  true } : {}),
				...(isStatus ? { isStatus: true } : {}),
				template,
				gridFks,
			},
		);

		// ── appscheme_field + appscheme_has_field ────────────────────────────
		let fieldOrder = 0;
		for (const [fieldName, fieldDef] of Object.entries(fields)) {
			const fd        = fieldDef as any;
			const rawType   = fd.type ?? 'text';
			const baseType  = rawType.startsWith('fk-')
				? 'fk'
				: (FIELD_TYPES.includes(rawType as any) ? rawType : 'text');
			const group     = inferFieldGroup(fieldName, rawType);
			const ftId      = ftById.get(baseType) ?? ftById.get('text') ?? 1;
			const fgId      = fgById.get(group)    ?? fgById.get('presentation') ?? 1;
			const fieldIcon = ICON_BY_GROUP[group] ?? 'circle';

			const fieldType = rawType;

			if (!fieldReg.has(fieldName)) {
				const fieldGridFks = {
					appscheme_base: fkRef({ code: baseCode, name: baseCode, icon: 'database', color: '#333', order: 0, multiple: false, required: true }),
					appscheme_field_type: fkRef({ code: baseType, name: baseType, icon: 'type', color: '#666', order: 0, multiple: false, required: true }),
					appscheme_field_group: fkRef({ code: group, name: group, icon: ICON_BY_GROUP[group] ?? 'tag', color: '#888', order: 0, multiple: false, required: false }),
				};

				const fieldId = await upsertGetId(
					col('appscheme_field'),
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
						gridFks: fieldGridFks,
					},
					{ fkTargetCol: '', fkTargetField: '' },
				);
				fieldReg.set(fieldName, fieldId);
			}

			const fieldId = fieldReg.get(fieldName)!;
			fieldOrder++;

			await upsertGetId(
				col('appscheme_has_field'),
				{ 'gridFks.appscheme.code': collectionName, 'gridFks.appscheme_field.code': fieldName },
				{
					code:     `${collectionName}_${fieldName}`,
					name:     fieldName,
					icon:     fieldIcon,
					color:    '#666',
					order:    fieldOrder,
					visible:  fd.private ? 0 : 1,
					required: fd.required ? 1 : 0,
					readonly: fd.readonly ? 1 : 0,
					gridFks: {
						appscheme: {
							id: schemeId, code: collectionName, name: collectionName,
							icon: 'table', color: '#222',
							order: 0, multiple: false, required: true,
						},
						appscheme_field: {
							id: fieldId, code: fieldName, name: fieldName,
							icon: fieldIcon, color: '#666',
							order: 0, multiple: false, required: true,
						},
					},
				},
			);
		}

		// ── appscheme_view ────────────────────────────────────────────────────
		// Partition by fk-ness (full = flat ∪ fk). Plus a curated `focus` subset =
		// 'identification' group fields, falling back to [code, name] when none.
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
			const vtId = vtById.get(viewTypeCode) ?? 1;
			for (const [order, vFieldName] of viewFields.entries()) {
				const vFieldId = fieldReg.get(vFieldName);
				if (!vFieldId) continue;
				await upsertGetId(
					col('appscheme_view'),
					{
						'gridFks.appscheme.code':           collectionName,
						'gridFks.appscheme_view_type.code': viewTypeCode,
						'gridFks.appscheme_field.code':     vFieldName,
					},
					{
						code:  `${collectionName}_${viewTypeCode}_${vFieldName}`,
						name:  vFieldName,
						icon:  'eye',
						color: '#444',
						order: order + 1,
						gridFks: {
							appscheme: fkRef({ code: collectionName, name: collectionName, icon: 'table', color: '#222', order: 0, multiple: false, required: true }),
							appscheme_view_type: fkRef({ code: viewTypeCode, name: viewTypeCode, icon: 'eye', color: '#444', order: 0, multiple: false, required: true }),
							appscheme_field: fkRef({ code: vFieldName, name: vFieldName, icon: ICON_BY_GROUP[inferFieldGroup(vFieldName, '')] ?? 'circle', color: '#666', order: order + 1, multiple: false, required: false }),
						},
					},
				);
			}
		}
	}
}

// Back-compat alias — old call sites still work.
export const seedSchemeFromModel = deployModel;
