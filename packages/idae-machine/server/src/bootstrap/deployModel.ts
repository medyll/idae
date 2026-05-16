/**
 * deployModel — writes a MachineModel into Mongo meta collections (appscheme_*).
 * Reflexive: engine model can be deployed by the same function — see buildEngineModel().
 *
 * Convention: every meta doc has {id, code, name, color, icon, order}.
 * Relations (base, type, group, view_type, link) carried via gridFks only — no scalar duplicates.
 */
import { IdaeDb, DbType } from '@medyll/idae-db';

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

// ── Static registry data ─────────────────────────────────────────────────────
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

const SCHEME_TYPES = ['standard', 'type', 'group', 'status', 'range'] as const;
const VIEW_TYPES   = ['list', 'mini', 'form', 'custom', 'fk_label'] as const;

const ICON_BY_GROUP: Record<string, string> = {
	audit:          'history',
	classification: 'tag',
	codification:   'hash',
	contact:        'mail',
	date:           'calendar',
	finance:        'dollar',
	identification: 'key',
	inventory:      'box',
	location:       'map',
	metrics:        'ruler',
	presentation:   'eye',
	progress:       'trending-up',
	quantity:       'package',
	security:       'lock',
	status:         'flag',
	system:         'cog',
	custom:         'star',
};

const DEFAULT_BASE = 'machine_user';

function inferFieldGroup(_name: string, type: string): string {
	if (type.startsWith('fk') || type === 'id')           return 'identification';
	if (['date', 'datetime', 'time'].includes(type))      return 'date';
	if (['email', 'phone', 'url'].includes(type))         return 'contact';
	if (type === 'boolean')                               return 'status';
	if (type === 'number')                                return 'metrics';
	if (type === 'currency')                              return 'finance';
	if (['image', 'file'].includes(type))                 return 'presentation';
	if (type === 'password')                              return 'security';
	return 'presentation';
}

async function upsertGetId(
	adapter:    any,
	matchQuery: Record<string, any>,
	data:       Record<string, any>,
): Promise<number> {
	const existing = await adapter.findOne({ query: matchQuery });
	if (existing) {
		await adapter.updateWhere({ query: matchQuery }, { $set: data });
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

// ── seedEngineRegistries ─────────────────────────────────────────────────────
// Bootstraps base 'machine_app' + global registries (field_type, field_group, scheme_type, view_type).
export async function seedEngineRegistries(opts: DeployOpts): Promise<void> {
	const idaeDb = await initDb(opts);
	const col    = (name: string) => idaeDb.collection(name);

	// 0. Base 'machine_app' (no fk yet — chicken-egg root)
	await upsertGetId(
		col('appscheme_base'),
		{ code: 'machine_app' },
		{ code: 'machine_app', name: 'Machine Engine', icon: 'cpu', color: '#111', order: 1 },
	);

	const baseRef = {
		appscheme_base: {
			id:       null as number | null,
			code:     'machine_app',
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
export async function deployModel(model: MachineModel, opts: DeployOpts): Promise<void> {
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
		const stId     = stById.get('standard') ?? 1;

		const gridFks: Record<string, any> = {
			appscheme_base: {
				id: baseId, code: baseCode, name: baseCode,
				icon: 'database', color: '#333',
				order: 0, multiple: false, required: true,
			},
			appscheme_type: {
				id: stId, code: 'standard', name: 'Standard',
				icon: 'layers', color: '#555',
				order: 0, multiple: false, required: false,
			},
		};

		for (const [fkKey, fkDef] of Object.entries(fks)) {
			const fk = fkDef as any;
			gridFks[fkKey] = {
				id:       null,
				code:     fk.code ?? fkKey,
				name:     fk.code ?? fkKey,
				icon:     'link',
				color:    '#888',
				order:    0,
				multiple: fk.multiple ?? false,
				required: !!fk.required,
			};
		}

		// ── appscheme ─────────────────────────────────────────────────────────
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

			let fkTargetCol:   string | null = null;
			let fkTargetField: string | null = null;
			if (rawType.startsWith('fk-')) {
				const [tc, tf] = rawType.replace('fk-', '').split('.');
				fkTargetCol   = tc ?? null;
				fkTargetField = tf ?? 'id';
			}

			if (!fieldReg.has(fieldName)) {
				const fieldGridFks = {
					appscheme_base: {
						id: baseId, code: baseCode, name: baseCode,
						icon: 'database', color: '#333',
						order: 0, multiple: false, required: true,
					},
					appscheme_field_type: {
						id: ftId, code: baseType, name: baseType,
						icon: 'type', color: '#666',
						order: 0, multiple: false, required: true,
					},
					appscheme_field_group: {
						id: fgId, code: group, name: group,
						icon: ICON_BY_GROUP[group] ?? 'tag', color: '#888',
						order: 0, multiple: false, required: false,
					},
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
						required: fd.required ? 1 : 0,
						readonly: fd.readonly ? 1 : 0,
						private:  fd.private  ? 1 : 0,
						fkTargetCol,
						fkTargetField,
						gridFks: fieldGridFks,
					},
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

		// ── appscheme_view ───────────────────────────────────────────────────
		const presentationFields = ((template as any).presentation ?? '').split(' ').filter(Boolean);
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
							appscheme: {
								id: schemeId, code: collectionName, name: collectionName,
								icon: 'table', color: '#222',
								order: 0, multiple: false, required: true,
							},
							appscheme_view_type: {
								id: vtId, code: viewTypeCode, name: viewTypeCode,
								icon: 'eye', color: '#444',
								order: 0, multiple: false, required: true,
							},
							appscheme_field: {
								id: vFieldId, code: vFieldName, name: vFieldName,
								icon: ICON_BY_GROUP[inferFieldGroup(vFieldName, '')] ?? 'circle',
								color: '#666',
								order: order + 1, multiple: false, required: false,
							},
						},
					},
				);
			}
		}
	}
}

// Back-compat alias — old call sites still work.
export const seedSchemeFromModel = deployModel;
