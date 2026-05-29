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

describe('MachineScheme.getFieldsForView — derived partition', () => {
	it('full = all fields (incl. fk)', () => {
		const names = scheme(baseModel).getFieldsForView('full').map((f) => f.name);
		expect(names).toEqual(['id', 'name', 'categoryId']);
	});

	it('mini = non-fk fields only', () => {
		const names = scheme(baseModel).getFieldsForView('mini').map((f) => f.name);
		expect(names).toEqual(['id', 'name']);
	});

	it('fk = fk fields only', () => {
		const names = scheme(baseModel).getFieldsForView('fk').map((f) => f.name);
		expect(names).toEqual(['categoryId']);
	});

	it('mini ∪ fk = full', () => {
		const s = scheme(baseModel);
		const full = s.getFieldsForView('full').map((f) => f.name).sort();
		const union = [
			...s.getFieldsForView('mini').map((f) => f.name),
			...s.getFieldsForView('fk').map((f) => f.name),
		].sort();
		expect(union).toEqual(full);
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
