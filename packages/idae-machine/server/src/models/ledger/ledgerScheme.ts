import type { MachineModel } from '../../../../src/lib/types/machine-model.js';

export const ledgerScheme: MachineModel = {

	// ── Statuts / Types ───────────────────────────────────────────────────────

	account_type: {
		base: 'machine_base',
		icon: 'tag',
		isType: true,
		fields: {
			id:           { type: 'id',   readonly: true },
			code:         { type: 'text', required: true },
			name:         { type: 'text', required: true },
			normal_side:  { type: 'text', required: true },
			ordre:        { type: 'number' },
		},
		fkRelations: {},
		template: { presentation: 'code name normal_side' },
	},

	entry_status: {
		base: 'machine_base',
		icon: 'flag',
		isStatus: true,
		fields: {
			id:    { type: 'id',   readonly: true },
			code:  { type: 'text', required: true },
			name:  { type: 'text', required: true },
			ordre: { type: 'number' },
		},
		fkRelations: {},
		template: { presentation: 'name code ordre' },
	},

	period_status: {
		base: 'machine_base',
		icon: 'flag',
		isStatus: true,
		fields: {
			id:    { type: 'id',   readonly: true },
			code:  { type: 'text', required: true },
			name:  { type: 'text', required: true },
			ordre: { type: 'number' },
		},
		fkRelations: {},
		template: { presentation: 'name code ordre' },
	},

	invoice_status: {
		base: 'machine_base',
		icon: 'flag',
		isStatus: true,
		fields: {
			id:    { type: 'id',   readonly: true },
			code:  { type: 'text', required: true },
			name:  { type: 'text', required: true },
			ordre: { type: 'number' },
		},
		fkRelations: {},
		template: { presentation: 'name code ordre' },
	},

	currency: {
		base: 'machine_base',
		icon: 'coin',
		isType: true,
		fields: {
			id:        { type: 'id',     readonly: true },
			code:      { type: 'text',   required: true },
			name:      { type: 'text',   required: true },
			symbol:    { type: 'text' },
			decimals:  { type: 'number' },
		},
		fkRelations: {},
		template: { presentation: 'code symbol name' },
	},

	tax_rate: {
		base: 'machine_base',
		icon: 'percent',
		isGroup: true,
		fields: {
			id:      { type: 'id',     readonly: true },
			code:    { type: 'text',   required: true },
			name:    { type: 'text',   required: true },
			rate_pct:{ type: 'number', required: true },
		},
		fkRelations: {},
		template: { presentation: 'name rate_pct' },
	},

	// ── Plan comptable ────────────────────────────────────────────────────────

	account: {
		base: 'machine_base',
		icon: 'bank',
		fields: {
			id:           { type: 'id',       readonly: true },
			code:         { type: 'text',     required: true },
			name:         { type: 'text',     required: true },
			account_number:{ type: 'text',    required: true },
			description:  { type: 'text-lg' },
			opening_balance:{ type: 'currency' },
			is_active:    { type: 'boolean' },
			is_reconcilable:{ type: 'boolean' },
		},
		fkRelations: {
			account_type: { code: 'account_type', required: true },
			parent:       { code: 'account',      required: false },
			currency:     { code: 'currency',     required: true },
		},
		template: { presentation: 'account_number name account_type' },
	},

	fiscal_year: {
		base: 'machine_base',
		icon: 'calendar',
		fields: {
			id:         { type: 'id',   readonly: true },
			code:       { type: 'text', required: true },
			name:       { type: 'text', required: true },
			start_date: { type: 'date', required: true },
			end_date:   { type: 'date', required: true },
			closed:     { type: 'boolean' },
		},
		fkRelations: {},
		template: { presentation: 'name start_date end_date closed' },
	},

	period: {
		base: 'machine_base',
		icon: 'calendar-blank',
		fields: {
			id:         { type: 'id',     readonly: true },
			code:       { type: 'text',   required: true },
			name:       { type: 'text',   required: true },
			start_date: { type: 'date',   required: true },
			end_date:   { type: 'date',   required: true },
			ordre:      { type: 'number' },
			closed_at:  { type: 'date' },
		},
		fkRelations: {
			fiscal_year:   { code: 'fiscal_year',   required: true },
			period_status: { code: 'period_status', required: true },
		},
		template: { presentation: 'fiscal_year name period_status start_date end_date' },
	},

	journal: {
		base: 'machine_base',
		icon: 'book',
		fields: {
			id:   { type: 'id',   readonly: true },
			code: { type: 'text', required: true },
			name: { type: 'text', required: true },
			kind: { type: 'text' },
		},
		fkRelations: {},
		template: { presentation: 'code name kind' },
	},

	// ── Tiers ─────────────────────────────────────────────────────────────────

	party: {
		base: 'machine_base',
		icon: 'handshake',
		fields: {
			id:          { type: 'id',    readonly: true },
			code:        { type: 'text',  required: true },
			name:        { type: 'text',  required: true },
			kind:        { type: 'text' },
			tax_id:      { type: 'text' },
			email:       { type: 'email' },
			phone:       { type: 'phone' },
			address:     { type: 'text' },
			postal_code: { type: 'text' },
			city:        { type: 'text' },
			country:     { type: 'text' },
			iban:        { type: 'text' },
		},
		fkRelations: {
			receivable_account: { code: 'account', required: false },
			payable_account:    { code: 'account', required: false },
		},
		template: { presentation: 'name kind tax_id' },
	},

	// ── Ecritures (double-entry) ──────────────────────────────────────────────

	journal_entry: {
		base: 'machine_base',
		icon: 'note-pencil',
		fields: {
			id:            { type: 'id',       readonly: true },
			code:          { type: 'text',     required: true },
			name:          { type: 'text',     required: true },
			entry_number:  { type: 'text',     required: true },
			entry_date:    { type: 'date',     required: true },
			reference:     { type: 'text' },
			memo:          { type: 'text-lg' },
			total_debit:   { type: 'currency' },
			total_credit:  { type: 'currency' },
			posted_at:     { type: 'date' },
			reversed:      { type: 'boolean' },
		},
		fkRelations: {
			journal:      { code: 'journal',      required: true },
			period:       { code: 'period',       required: true },
			entry_status: { code: 'entry_status', required: true },
			party:        { code: 'party',        required: false },
			reverses:     { code: 'journal_entry', required: false },
		},
		template: { presentation: 'entry_number entry_date journal entry_status total_debit' },
	},

	entry_line: {
		base: 'machine_base',
		icon: 'list-bullets',
		fields: {
			id:          { type: 'id',       readonly: true },
			code:        { type: 'text',     required: true },
			line_number: { type: 'number' },
			debit:       { type: 'currency' },
			credit:      { type: 'currency' },
			description: { type: 'text-lg' },
			reconciled:  { type: 'boolean' },
		},
		fkRelations: {
			journal_entry: { code: 'journal_entry', required: true },
			account:       { code: 'account',       required: true },
			party:         { code: 'party',         required: false },
			tax_rate:      { code: 'tax_rate',      required: false },
		},
		template: { presentation: 'journal_entry account debit credit' },
	},

	// ── Facturation ───────────────────────────────────────────────────────────

	invoice: {
		base: 'machine_base',
		icon: 'receipt',
		fields: {
			id:            { type: 'id',       readonly: true },
			code:          { type: 'text',     required: true },
			name:          { type: 'text',     required: true },
			invoice_number:{ type: 'text',     required: true },
			direction:     { type: 'text',     required: true },
			issue_date:    { type: 'date',     required: true },
			due_date:      { type: 'date' },
			subtotal:      { type: 'currency', required: true },
			tax_total:     { type: 'currency' },
			total:         { type: 'currency', required: true },
			amount_paid:   { type: 'currency' },
			notes:         { type: 'text-lg' },
		},
		fkRelations: {
			party:          { code: 'party',          required: true },
			invoice_status: { code: 'invoice_status', required: true },
			currency:       { code: 'currency',       required: true },
			journal_entry:  { code: 'journal_entry',  required: false },
		},
		template: { presentation: 'invoice_number party direction total invoice_status' },
	},

	invoice_line: {
		base: 'machine_base',
		icon: 'list-bullets',
		fields: {
			id:          { type: 'id',       readonly: true },
			code:        { type: 'text',     required: true },
			description: { type: 'text',     required: true },
			quantity:    { type: 'number',   required: true },
			unit_price:  { type: 'currency', required: true },
			line_total:  { type: 'currency', required: true },
			tax_amount:  { type: 'currency' },
		},
		fkRelations: {
			invoice:  { code: 'invoice',  required: true },
			account:  { code: 'account',  required: false },
			tax_rate: { code: 'tax_rate', required: false },
		},
		template: { presentation: 'invoice description quantity unit_price line_total' },
	},

	// ── Trésorerie ────────────────────────────────────────────────────────────

	payment: {
		base: 'machine_base',
		icon: 'credit-card',
		fields: {
			id:          { type: 'id',       readonly: true },
			code:        { type: 'text',     required: true },
			amount:      { type: 'currency', required: true },
			payment_date:{ type: 'date',     required: true },
			method:      { type: 'text' },
			reference:   { type: 'text' },
			memo:        { type: 'text-lg' },
		},
		fkRelations: {
			party:          { code: 'party',          required: true },
			invoice:        { code: 'invoice',        required: false },
			bank_account:   { code: 'account',        required: true },
			currency:       { code: 'currency',       required: true },
			journal_entry:  { code: 'journal_entry',  required: false },
		},
		template: { presentation: 'payment_date party amount method' },
	},

	bank_statement: {
		base: 'machine_base',
		icon: 'file-text',
		fields: {
			id:              { type: 'id',       readonly: true },
			code:            { type: 'text',     required: true },
			name:            { type: 'text',     required: true },
			statement_date:  { type: 'date',     required: true },
			opening_balance: { type: 'currency' },
			closing_balance: { type: 'currency' },
		},
		fkRelations: {
			bank_account: { code: 'account', required: true },
		},
		template: { presentation: 'bank_account statement_date closing_balance' },
	},

	statement_line: {
		base: 'machine_base',
		icon: 'list-bullets',
		fields: {
			id:          { type: 'id',       readonly: true },
			code:        { type: 'text',     required: true },
			value_date:  { type: 'date',     required: true },
			label:       { type: 'text' },
			amount:      { type: 'currency', required: true },
			reconciled:  { type: 'boolean' },
		},
		fkRelations: {
			bank_statement:  { code: 'bank_statement', required: true },
			matched_line:    { code: 'entry_line',     required: false },
		},
		template: { presentation: 'bank_statement value_date label amount reconciled' },
	},
};
