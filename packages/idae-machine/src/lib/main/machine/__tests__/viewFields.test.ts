import { describe, it, expect } from 'vitest';
import { MachineScheme } from '../MachineScheme.js';

// Minimal model: two primitive fields + one fk field.
const baseModel: any = {
	product: {
		keyPath: '++id',
		fields: {
			id:         { type: 'number' },
			name:       { type: 'text' },
			categoryId: { type: 'fk-category.id' },
		},
	},
};

function scheme(model: any) {
	// machineDb is stored but never touched by getFieldsForView.
	return new MachineScheme('product' as any, {} as any, model);
}

describe('MachineScheme.getFieldsForView — partition (full / flat / fk)', () => {
	it('full = all fields (incl. fk)', () => {
		const names = scheme(baseModel).getFieldsForView('full').map((f) => f.name);
		expect(names).toEqual(['id', 'name', 'categoryId']);
	});

	it('flat = non-fk fields only', () => {
		const names = scheme(baseModel).getFieldsForView('flat').map((f) => f.name);
		expect(names).toEqual(['id', 'name']);
	});

	it('fk = fk fields only', () => {
		const names = scheme(baseModel).getFieldsForView('fk').map((f) => f.name);
		expect(names).toEqual(['categoryId']);
	});

	it('flat ∪ fk = full', () => {
		const s = scheme(baseModel);
		const full = s.getFieldsForView('full').map((f) => f.name).sort();
		const union = [
			...s.getFieldsForView('flat').map((f) => f.name),
			...s.getFieldsForView('fk').map((f) => f.name),
		].sort();
		expect(union).toEqual(full);
	});
});

describe('MachineScheme.getFieldsForView — mini (curated identity subset)', () => {
	it('uses identification-group fields when present', () => {
		const model: any = {
			product: {
				keyPath: '++id',
				fields: {
					id:    { type: 'number' },
					code:  { type: 'text', group: 'identification' },
					name:  { type: 'text', group: 'identification' },
					price: { type: 'currency', group: 'finance' },
				},
			},
		};
		const names = scheme(model).getFieldsForView('mini').map((f) => f.name);
		expect(names).toEqual(['code', 'name']);
	});

	it('falls back to [code, name] when no identification group', () => {
		const model: any = {
			product: { keyPath: '++id', fields: { id: { type: 'number' }, code: { type: 'text' }, name: { type: 'text' } } },
		};
		const names = scheme(model).getFieldsForView('mini').map((f) => f.name);
		expect(names).toEqual(['code', 'name']);
	});

	it('falls back to [code] only when no name field', () => {
		const model: any = {
			product: { keyPath: '++id', fields: { id: { type: 'number' }, code: { type: 'text' } } },
		};
		const names = scheme(model).getFieldsForView('mini').map((f) => f.name);
		expect(names).toEqual(['code']);
	});
});

describe('MachineScheme.getFieldsForView — seeded override wins', () => {
	it('returns _views[view] verbatim when present', () => {
		const model = JSON.parse(JSON.stringify(baseModel));
		model.product._views = { full: [{ name: 'name', code: 'name', order: 0 }] };
		const out = scheme(model).getFieldsForView('full');
		expect(out).toEqual([{ name: 'name', code: 'name', order: 0 }]);
	});
});
