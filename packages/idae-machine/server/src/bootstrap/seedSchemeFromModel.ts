import { IdaeDb, DbType } from '@medyll/idae-db';

interface MachineFieldDef { type: string; required?: boolean; readonly?: boolean; private?: boolean; }
interface MachineFkDef    { code: string; multiple: boolean; required?: boolean; }
interface MachineModel    {
	[collection: string]: {
		keyPath:  string;
		base?:    string;
		ts?:      any;
		template: {
			index:        string;
			presentation: string;
			fields:       Record<string, MachineFieldDef>;
			fks:          Record<string, MachineFkDef>;
		};
	};
}

interface SeedOpts { org: string; mongoUri: string; }

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

// ── seedSchemeFromModel ───────────────────────────────────────────────────────
export async function seedSchemeFromModel(model: MachineModel, opts: SeedOpts): Promise<void> {
	const { org, mongoUri } = opts;

	const idaeDb = IdaeDb.init(mongoUri, {
		dbType:           DbType.MONGODB,
		dbScope:          org,
		dbScopeSeparator: '_',
		idaeModelOptions: {
			autoIncrementFormat:       () => 'id',
			autoIncrementDbCollection: 'auto_increment',
		},
	});

	await idaeDb.db('machine_app');
	const col = (name: string) => idaeDb.collection(name);

	// ── 1. appscheme_field_type ─────────────────────────────────────────────
	const ftById = new Map<string, number>();
	let ftOrder = 0;
	for (const code of FIELD_TYPES) {
		const id = await upsertGetId(
			col('appscheme_field_type'),
			{ code },
			{ code, name: code, icon: 'type', color: '#666', order: ++ftOrder },
		);
		ftById.set(code, id);
	}

	// ── 2. appscheme_field_group ────────────────────────────────────────────
	const fgById = new Map<string, number>();
	let fgOrder = 0;
	for (const code of FIELD_GROUPS) {
		const id = await upsertGetId(
			col('appscheme_field_group'),
			{ code },
			{ code, name: code, icon: ICON_BY_GROUP[code] ?? 'tag', color: '#888', order: ++fgOrder },
		);
		fgById.set(code, id);
	}

	// ── 3. appscheme_type ───────────────────────────────────────────────────
	const stById = new Map<string, number>();
	let stOrder = 0;
	for (const code of SCHEME_TYPES) {
		const id = await upsertGetId(
			col('appscheme_type'),
			{ code },
			{ code, name: code, icon: 'layers', color: '#555', order: ++stOrder },
		);
		stById.set(code, id);
	}

	// ── 4. appscheme_view_type ──────────────────────────────────────────────
	const vtById = new Map<string, number>();
	let vtOrder = 0;
	for (const code of VIEW_TYPES) {
		const id = await upsertGetId(
			col('appscheme_view_type'),
			{ code },
			{ code, name: code, icon: 'eye', color: '#444', order: ++vtOrder },
		);
		vtById.set(code, id);
	}

	// ── 5. appscheme_base ───────────────────────────────────────────────────
	const baseById = new Map<string, number>();
	const bases    = new Set<string>();
	for (const c of Object.values(model)) {
		const base = (c as any).base as string | undefined;
		if (base) bases.add(base);
	}
	let baseOrder = 0;
	for (const code of bases) {
		const id = await upsertGetId(
			col('appscheme_base'),
			{ code },
			{ code, name: code, icon: 'database', color: '#333', order: ++baseOrder },
		);
		baseById.set(code, id);
	}

	// ── 6-9. Per-collection ─────────────────────────────────────────────────
	const fieldReg     = new Map<string, number>();
	let   schemeOrder  = 0;

	for (const [collectionName, colDef] of Object.entries(model)) {
		const c        = colDef as any;
		const template = c.template ?? {};
		const fks      = template.fks ?? {};
		const fields   = template.fields ?? {};
		const baseCode = c.base as string | undefined;
		const baseId   = baseCode ? (baseById.get(baseCode) ?? null) : null;
		const stId     = stById.get('standard') ?? 1;

		// ── Build appscheme.gridFks ──────────────────────────────────────────
		const gridFks: Record<string, any> = {};

		if (baseCode && baseId) {
			gridFks['appscheme_base'] = {
				id: baseId, code: baseCode, name: baseCode,
				icon: 'database', color: '#333',
				order: 0, multiple: false, required: false,
			};
		}

		gridFks['appscheme_type'] = {
			id: stId, code: 'standard', name: 'Standard',
			icon: 'layers', color: '#555',
			order: 0, multiple: false, required: false,
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
				required: !!(fk.required),
			};
		}

		// ── 6. appscheme ────────────────────────────────────────────────────
		const schemeId = await upsertGetId(
			col('appscheme'),
			{ code: collectionName },
			{
				code:         collectionName,
				name:         collectionName,
				icon:         'table',
				color:        '#222',
				order:        ++schemeOrder,
				base:         baseCode ?? null,
				index:        template.index ?? null,
				presentation: template.presentation ?? null,
				keyPath:      c.keyPath ?? '++id',
				gridFks,
			},
		);

		// ── 7. appscheme_field + 8. appscheme_has_field ─────────────────────
		let fieldOrder = 0;
		for (const [fieldName, fieldDef] of Object.entries(fields)) {
			const fd        = fieldDef as any;
			const rawType   = fd.type ?? 'text';
			const baseType  = rawType.startsWith('fk-')
				? 'fk'
				: (FIELD_TYPES.includes(rawType as any) ? rawType : 'text');
			const group     = inferFieldGroup(fieldName, rawType);
			const ftId      = ftById.get(baseType) ?? ftById.get('text') ?? 1;
			const fgId      = fgById.get(group) ?? fgById.get('presentation') ?? 1;
			const fieldIcon = ICON_BY_GROUP[group] ?? 'circle';

			let fkTargetCol:   string | null = null;
			let fkTargetField: string | null = null;
			if (rawType.startsWith('fk-')) {
				const [tc, tf] = rawType.replace('fk-', '').split('.');
				fkTargetCol   = tc ?? null;
				fkTargetField = tf ?? 'id';
			}

			if (!fieldReg.has(fieldName)) {
				const fieldId = await upsertGetId(
					col('appscheme_field'),
					{ code: fieldName },
					{
						code:        fieldName,
						name:        fieldName,
						icon:        fieldIcon,
						color:       '#666',
						order:       0,
						field_raw:   fieldName,
						field_type:  rawType,
						field_group: group,
						required:    fd.required ? 1 : 0,
						readonly:    fd.readonly ? 1 : 0,
						private:     fd.private  ? 1 : 0,
						fkTargetCol,
						fkTargetField,
						gridFks: {
							appscheme_field_type:  {
								id: ftId, code: baseType, name: baseType,
								icon: 'type', color: '#666',
								order: 0, multiple: false, required: false,
							},
							appscheme_field_group: {
								id: fgId, code: group, name: group,
								icon: ICON_BY_GROUP[group] ?? 'tag', color: '#888',
								order: 0, multiple: false, required: false,
							},
						},
					},
				);
				fieldReg.set(fieldName, fieldId);
			}

			const fieldId = fieldReg.get(fieldName)!;
			fieldOrder++;

			// ── 8. appscheme_has_field ───────────────────────────────────────
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

		// ── 9. appscheme_view ────────────────────────────────────────────────
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
