import type { MachineModel } from '../../../../src/lib/types/machine-model.js';

export const restauScheme: MachineModel = {

	// ── Statuts / Types ───────────────────────────────────────────────────────

	table_status: {
		base: 'machine_base',
		isStatus: true,
		fields: {
			id:    { type: 'id',   readonly: true },
			code:  { type: 'text', required: true },
			name:  { type: 'text', required: true },
			ordre: { type: 'number' },
			color: { type: 'text' },
		},
		fkRelations: {},
		template: { presentation: 'name code ordre' },
	},

	order_status: {
		base: 'machine_base',
		isStatus: true,
		fields: {
			id:    { type: 'id',   readonly: true },
			code:  { type: 'text', required: true },
			name:  { type: 'text', required: true },
			ordre: { type: 'number' },
			color: { type: 'text' },
		},
		fkRelations: {},
		template: { presentation: 'name code ordre' },
	},

	ticket_status: {
		base: 'machine_base',
		isStatus: true,
		fields: {
			id:    { type: 'id',   readonly: true },
			code:  { type: 'text', required: true },
			name:  { type: 'text', required: true },
			ordre: { type: 'number' },
			color: { type: 'text' },
		},
		fkRelations: {},
		template: { presentation: 'name code ordre' },
	},

	payment_status: {
		base: 'machine_base',
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

	reservation_status: {
		base: 'machine_base',
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

	course_type: {
		base: 'machine_base',
		isGroup: true,
		fields: {
			id:    { type: 'id',   readonly: true },
			code:  { type: 'text', required: true },
			name:  { type: 'text', required: true },
			ordre: { type: 'number' },
		},
		fkRelations: {},
		template: { presentation: 'ordre name' },
	},

	station: {
		base: 'machine_base',
		isType: true,
		fields: {
			id:    { type: 'id',   readonly: true },
			code:  { type: 'text', required: true },
			name:  { type: 'text', required: true },
			ordre: { type: 'number' },
		},
		fkRelations: {},
		template: { presentation: 'name code' },
	},

	payment_method: {
		base: 'machine_base',
		isType: true,
		fields: {
			id:     { type: 'id',   readonly: true },
			code:   { type: 'text', required: true },
			name:   { type: 'text', required: true },
			active: { type: 'boolean' },
		},
		fkRelations: {},
		template: { presentation: 'name code' },
	},

	// ── Salle ─────────────────────────────────────────────────────────────────

	dining_room: {
		base: 'machine_base',
		fields: {
			id:   { type: 'id',   readonly: true },
			code: { type: 'text', required: true },
			name: { type: 'text', required: true },
			floor:{ type: 'number' },
		},
		fkRelations: {},
		template: { presentation: 'name floor' },
	},

	resto_table: {
		base: 'machine_base',
		fields: {
			id:       { type: 'id',     readonly: true },
			code:     { type: 'text',   required: true },
			name:     { type: 'text',   required: true },
			number:   { type: 'number', required: true },
			seats:    { type: 'number' },
			x_pos:    { type: 'number' },
			y_pos:    { type: 'number' },
			shape:    { type: 'text' },
		},
		fkRelations: {
			dining_room:  { code: 'dining_room',  required: true, multiple: false },
			table_status: { code: 'table_status', required: true, multiple: false },
		},
		template: { presentation: 'number name seats table_status' },
	},

	// ── Personnel ─────────────────────────────────────────────────────────────

	staff: {
		base: 'machine_base',
		fields: {
			id:         { type: 'id',    readonly: true },
			code:       { type: 'text',  required: true },
			name:       { type: 'text',  required: true },
			first_name: { type: 'text' },
			last_name:  { type: 'text' },
			role:       { type: 'text' },
			pin:        { type: 'text' },
			email:      { type: 'email' },
			phone:      { type: 'phone' },
			active:     { type: 'boolean' },
			photo:      { type: 'image' },
		},
		fkRelations: {},
		template: { presentation: 'name role active' },
	},

	// ── Carte ─────────────────────────────────────────────────────────────────

	menu_category: {
		base: 'machine_base',
		fields: {
			id:    { type: 'id',     readonly: true },
			code:  { type: 'text',   required: true },
			name:  { type: 'text',   required: true },
			ordre: { type: 'number' },
			image: { type: 'image' },
		},
		fkRelations: {
			course_type: { code: 'course_type', required: false, multiple: false },
		},
		template: { presentation: 'ordre name course_type' },
	},

	menu_item: {
		base: 'machine_base',
		fields: {
			id:           { type: 'id',       readonly: true },
			code:         { type: 'text',     required: true },
			name:         { type: 'text',     required: true },
			description:  { type: 'text-lg' },
			price:        { type: 'currency', required: true },
			cost:         { type: 'currency' },
			prep_minutes: { type: 'number' },
			calories:     { type: 'number' },
			is_vegan:     { type: 'boolean' },
			is_vegetarian:{ type: 'boolean' },
			is_gluten_free:{ type: 'boolean' },
			available:    { type: 'boolean' },
			image:        { type: 'image' },
		},
		fkRelations: {
			menu_category: { code: 'menu_category', required: true,  multiple: false },
			station:       { code: 'station',       required: false, multiple: false },
		},
		template: { presentation: 'name menu_category price available' },
	},

	modifier_group: {
		base: 'machine_base',
		fields: {
			id:           { type: 'id',     readonly: true },
			code:         { type: 'text',   required: true },
			name:         { type: 'text',   required: true },
			min_select:   { type: 'number' },
			max_select:   { type: 'number' },
			required:     { type: 'boolean' },
		},
		fkRelations: {},
		template: { presentation: 'name min_select max_select required' },
	},

	modifier: {
		base: 'machine_base',
		fields: {
			id:          { type: 'id',       readonly: true },
			code:        { type: 'text',     required: true },
			name:        { type: 'text',     required: true },
			price_delta: { type: 'currency' },
			ordre:       { type: 'number' },
		},
		fkRelations: {
			modifier_group: { code: 'modifier_group', required: true, multiple: false },
		},
		template: { presentation: 'modifier_group name price_delta' },
	},

	item_modifier_group: {
		base: 'machine_base',
		fields: {
			id:   { type: 'id',   readonly: true },
			code: { type: 'text', required: true },
		},
		fkRelations: {
			menu_item:      { code: 'menu_item',      required: true, multiple: false },
			modifier_group: { code: 'modifier_group', required: true, multiple: false },
		},
		template: { presentation: 'menu_item modifier_group' },
	},

	// ── Réservations ──────────────────────────────────────────────────────────

	guest: {
		base: 'machine_base',
		fields: {
			id:          { type: 'id',    readonly: true },
			code:        { type: 'text',  required: true },
			name:        { type: 'text',  required: true },
			phone:       { type: 'phone' },
			email:       { type: 'email' },
			notes:       { type: 'text-lg' },
			visit_count: { type: 'number' },
			vip:         { type: 'boolean' },
		},
		fkRelations: {},
		template: { presentation: 'name phone vip' },
	},

	reservation: {
		base: 'machine_base',
		fields: {
			id:          { type: 'id',     readonly: true },
			code:        { type: 'text',   required: true },
			name:        { type: 'text' },
			party_size:  { type: 'number', required: true },
			reserved_at: { type: 'date',   required: true },
			duration_min:{ type: 'number' },
			notes:       { type: 'text-lg' },
		},
		fkRelations: {
			guest:              { code: 'guest',              required: false, multiple: false },
			resto_table:        { code: 'resto_table',        required: false, multiple: false },
			reservation_status: { code: 'reservation_status', required: true,  multiple: false },
		},
		template: { presentation: 'reserved_at guest party_size reservation_status resto_table' },
	},

	// ── Service ───────────────────────────────────────────────────────────────

	resto_order: {
		base: 'machine_base',
		fields: {
			id:          { type: 'id',       readonly: true },
			code:        { type: 'text',     required: true },
			name:        { type: 'text' },
			order_number:{ type: 'text',     required: true },
			covers:      { type: 'number' },
			opened_at:   { type: 'date',     required: true },
			closed_at:   { type: 'date' },
			subtotal:    { type: 'currency' },
			tax:         { type: 'currency' },
			tip:         { type: 'currency' },
			total:       { type: 'currency' },
			notes:       { type: 'text-lg' },
		},
		fkRelations: {
			resto_table:  { code: 'resto_table',  required: false, multiple: false },
			server:       { code: 'staff',        required: true,  multiple: false },
			order_status: { code: 'order_status', required: true,  multiple: false },
			guest:        { code: 'guest',        required: false, multiple: false },
		},
		template: { presentation: 'order_number resto_table server order_status total' },
	},

	order_line: {
		base: 'machine_base',
		fields: {
			id:          { type: 'id',       readonly: true },
			code:        { type: 'text',     required: true },
			quantity:    { type: 'number',   required: true },
			unit_price:  { type: 'currency', required: true },
			line_total:  { type: 'currency' },
			seat_number: { type: 'number' },
			notes:       { type: 'text-lg' },
			fired_at:    { type: 'date' },
		},
		fkRelations: {
			resto_order:  { code: 'resto_order',  required: true,  multiple: false },
			menu_item:    { code: 'menu_item',    required: true,  multiple: false },
			course_type:  { code: 'course_type',  required: false, multiple: false },
			ticket_status:{ code: 'ticket_status', required: true,  multiple: false },
		},
		template: { presentation: 'resto_order menu_item quantity ticket_status' },
	},

	order_line_modifier: {
		base: 'machine_base',
		fields: {
			id:          { type: 'id',       readonly: true },
			code:        { type: 'text',     required: true },
			price_delta: { type: 'currency' },
		},
		fkRelations: {
			order_line: { code: 'order_line', required: true, multiple: false },
			modifier:   { code: 'modifier',   required: true, multiple: false },
		},
		template: { presentation: 'order_line modifier price_delta' },
	},

	kitchen_ticket: {
		base: 'machine_base',
		fields: {
			id:          { type: 'id',     readonly: true },
			code:        { type: 'text',   required: true },
			ticket_number:{ type: 'text' },
			fired_at:    { type: 'date',   required: true },
			ready_at:    { type: 'date' },
			bumped_at:   { type: 'date' },
		},
		fkRelations: {
			resto_order:   { code: 'resto_order',   required: true, multiple: false },
			station:       { code: 'station',       required: true, multiple: false },
			ticket_status: { code: 'ticket_status', required: true, multiple: false },
		},
		template: { presentation: 'resto_order station ticket_status fired_at' },
	},

	// ── Addition ──────────────────────────────────────────────────────────────

	check_split: {
		base: 'machine_base',
		fields: {
			id:        { type: 'id',       readonly: true },
			code:      { type: 'text',     required: true },
			name:      { type: 'text' },
			subtotal:  { type: 'currency' },
			tax:       { type: 'currency' },
			tip:       { type: 'currency' },
			total:     { type: 'currency', required: true },
		},
		fkRelations: {
			resto_order: { code: 'resto_order', required: true, multiple: false },
		},
		template: { presentation: 'resto_order name total' },
	},

	payment: {
		base: 'machine_base',
		fields: {
			id:        { type: 'id',       readonly: true },
			code:      { type: 'text',     required: true },
			amount:    { type: 'currency', required: true },
			tip:       { type: 'currency' },
			paid_at:   { type: 'date',     required: true },
			reference: { type: 'text' },
		},
		fkRelations: {
			resto_order:    { code: 'resto_order',    required: true,  multiple: false },
			check_split:    { code: 'check_split',    required: false, multiple: false },
			payment_method: { code: 'payment_method', required: true,  multiple: false },
			payment_status: { code: 'payment_status', required: true,  multiple: false },
		},
		template: { presentation: 'resto_order amount payment_method payment_status paid_at' },
	},

	// ── Stock cuisine ─────────────────────────────────────────────────────────

	ingredient: {
		base: 'machine_base',
		fields: {
			id:        { type: 'id',       readonly: true },
			code:      { type: 'text',     required: true },
			name:      { type: 'text',     required: true },
			unit:      { type: 'text' },
			stock_qty: { type: 'number' },
			min_qty:   { type: 'number' },
			cost:      { type: 'currency' },
		},
		fkRelations: {},
		template: { presentation: 'name stock_qty unit' },
	},

	recipe_line: {
		base: 'machine_base',
		fields: {
			id:       { type: 'id',     readonly: true },
			code:     { type: 'text',   required: true },
			quantity: { type: 'number', required: true },
			unit:     { type: 'text' },
		},
		fkRelations: {
			menu_item:  { code: 'menu_item',  required: true, multiple: false },
			ingredient: { code: 'ingredient', required: true, multiple: false },
		},
		template: { presentation: 'menu_item ingredient quantity unit' },
	},
};
