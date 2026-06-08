import type { MachineModel } from '../../../../src/lib/types/machine-model.js';

export const factoryScheme: MachineModel = {

	// ── Statuts / Types ───────────────────────────────────────────────────────

	item_type: {
		base: 'machine_base',
		isType: true,
		fields: {
			id:    { type: 'id',   readonly: true },
			code:  { type: 'text', required: true },
			name:  { type: 'text', required: true },
			ordre: { type: 'number' },
		},
		fks: {},
		template: { presentation: 'name code' },
	},

	work_order_status: {
		base: 'machine_base',
		isStatus: true,
		fields: {
			id:    { type: 'id',   readonly: true },
			code:  { type: 'text', required: true },
			name:  { type: 'text', required: true },
			ordre: { type: 'number' },
			color: { type: 'text' },
		},
		fks: {},
		template: { presentation: 'name code ordre' },
	},

	po_status: {
		base: 'machine_base',
		isStatus: true,
		fields: {
			id:    { type: 'id',   readonly: true },
			code:  { type: 'text', required: true },
			name:  { type: 'text', required: true },
			ordre: { type: 'number' },
		},
		fks: {},
		template: { presentation: 'name code ordre' },
	},

	lot_status: {
		base: 'machine_base',
		isStatus: true,
		fields: {
			id:    { type: 'id',   readonly: true },
			code:  { type: 'text', required: true },
			name:  { type: 'text', required: true },
			ordre: { type: 'number' },
		},
		fks: {},
		template: { presentation: 'name code ordre' },
	},

	qc_result: {
		base: 'machine_base',
		isGroup: true,
		fields: {
			id:    { type: 'id',   readonly: true },
			code:  { type: 'text', required: true },
			name:  { type: 'text', required: true },
			color: { type: 'text' },
		},
		fks: {},
		template: { presentation: 'name code' },
	},

	uom: {
		base: 'machine_base',
		isType: true,
		fields: {
			id:   { type: 'id',   readonly: true },
			code: { type: 'text', required: true },
			name: { type: 'text', required: true },
		},
		fks: {},
		template: { presentation: 'code name' },
	},

	machine_status: {
		base: 'machine_base',
		isStatus: true,
		fields: {
			id:    { type: 'id',   readonly: true },
			code:  { type: 'text', required: true },
			name:  { type: 'text', required: true },
			ordre: { type: 'number' },
			color: { type: 'text' },
		},
		fks: {},
		template: { presentation: 'name code' },
	},

	// ── Référentiels ──────────────────────────────────────────────────────────

	item: {
		base: 'machine_base',
		fields: {
			id:            { type: 'id',       readonly: true },
			code:          { type: 'text',     required: true },
			name:          { type: 'text',     required: true },
			sku:           { type: 'text',     required: true },
			description:   { type: 'text-lg' },
			standard_cost: { type: 'currency' },
			unit_price:    { type: 'currency' },
			lead_time_days:{ type: 'number' },
			min_stock:     { type: 'number' },
			reorder_qty:   { type: 'number' },
			lot_tracked:   { type: 'boolean' },
			image:         { type: 'image' },
		},
		fks: {
			item_type: { code: 'item_type', required: true, multiple: false },
			uom:       { code: 'uom',       required: true, multiple: false },
		},
		template: { presentation: 'sku name item_type standard_cost' },
	},

	supplier: {
		base: 'machine_base',
		fields: {
			id:           { type: 'id',    readonly: true },
			code:         { type: 'text',  required: true },
			name:         { type: 'text',  required: true },
			contact_name: { type: 'text' },
			email:        { type: 'email' },
			phone:        { type: 'phone' },
			address:      { type: 'text' },
			city:         { type: 'text' },
			country:      { type: 'text' },
			lead_time_days:{ type: 'number' },
		},
		fks: {},
		template: { presentation: 'name city lead_time_days' },
	},

	supplier_item: {
		base: 'machine_base',
		fields: {
			id:            { type: 'id',       readonly: true },
			code:          { type: 'text',     required: true },
			supplier_sku:  { type: 'text' },
			price:         { type: 'currency' },
			min_order_qty: { type: 'number' },
			lead_time_days:{ type: 'number' },
			preferred:     { type: 'boolean' },
		},
		fks: {
			supplier: { code: 'supplier', required: true, multiple: false },
			item:     { code: 'item',     required: true, multiple: false },
		},
		template: { presentation: 'supplier item price preferred' },
	},

	// ── BOM (récursif) ────────────────────────────────────────────────────────

	bom: {
		base: 'machine_base',
		fields: {
			id:          { type: 'id',     readonly: true },
			code:        { type: 'text',   required: true },
			name:        { type: 'text',   required: true },
			version:     { type: 'text' },
			output_qty:  { type: 'number' },
			is_active:   { type: 'boolean' },
			notes:       { type: 'text-lg' },
		},
		fks: {
			item: { code: 'item', required: true, multiple: false },
			uom:  { code: 'uom',  required: true, multiple: false },
		},
		template: { presentation: 'item name version is_active' },
	},

	bom_line: {
		base: 'machine_base',
		fields: {
			id:           { type: 'id',     readonly: true },
			code:         { type: 'text',   required: true },
			quantity:     { type: 'number', required: true },
			scrap_pct:    { type: 'number' },
			ordre:        { type: 'number' },
			notes:        { type: 'text-lg' },
		},
		fks: {
			bom:           { code: 'bom',  required: true,  multiple: false },
			component:     { code: 'item', required: true,  multiple: false },
			component_bom: { code: 'bom',  required: false, multiple: false },
			uom:           { code: 'uom',  required: true,  multiple: false },
		},
		template: { presentation: 'bom component quantity uom' },
	},

	// ── Capacité ──────────────────────────────────────────────────────────────

	work_center: {
		base: 'machine_base',
		fields: {
			id:             { type: 'id',       readonly: true },
			code:           { type: 'text',     required: true },
			name:           { type: 'text',     required: true },
			hourly_rate:    { type: 'currency' },
			capacity_hours_day:{ type: 'number' },
		},
		fks: {},
		template: { presentation: 'name hourly_rate capacity_hours_day' },
	},

	machine: {
		base: 'machine_base',
		fields: {
			id:              { type: 'id',     readonly: true },
			code:            { type: 'text',   required: true },
			name:            { type: 'text',   required: true },
			serial_number:   { type: 'text' },
			manufacturer:    { type: 'text' },
			installed_at:    { type: 'date' },
			last_maintenance:{ type: 'date' },
			next_maintenance:{ type: 'date' },
		},
		fks: {
			work_center:    { code: 'work_center',    required: true, multiple: false },
			machine_status: { code: 'machine_status', required: true, multiple: false },
		},
		template: { presentation: 'name work_center machine_status next_maintenance' },
	},

	routing: {
		base: 'machine_base',
		fields: {
			id:   { type: 'id',   readonly: true },
			code: { type: 'text', required: true },
			name: { type: 'text', required: true },
		},
		fks: {
			item: { code: 'item', required: true, multiple: false },
		},
		template: { presentation: 'item name' },
	},

	operation: {
		base: 'machine_base',
		fields: {
			id:            { type: 'id',     readonly: true },
			code:          { type: 'text',   required: true },
			name:          { type: 'text',   required: true },
			sequence:      { type: 'number', required: true },
			setup_minutes: { type: 'number' },
			run_minutes:   { type: 'number' },
			instructions:  { type: 'text-lg' },
		},
		fks: {
			routing:     { code: 'routing',     required: true, multiple: false },
			work_center: { code: 'work_center', required: true, multiple: false },
		},
		template: { presentation: 'routing sequence name work_center' },
	},

	// ── Production ────────────────────────────────────────────────────────────

	work_order: {
		base: 'machine_base',
		fields: {
			id:           { type: 'id',     readonly: true },
			code:         { type: 'text',   required: true },
			name:         { type: 'text',   required: true },
			wo_number:    { type: 'text',   required: true },
			quantity:     { type: 'number', required: true },
			quantity_done:{ type: 'number' },
			scheduled_start:{ type: 'date' },
			scheduled_end:{ type: 'date' },
			actual_start: { type: 'date' },
			actual_end:   { type: 'date' },
			priority:     { type: 'number' },
			notes:        { type: 'text-lg' },
		},
		fks: {
			item:              { code: 'item',              required: true,  multiple: false },
			bom:               { code: 'bom',               required: false, multiple: false },
			routing:           { code: 'routing',           required: false, multiple: false },
			work_order_status: { code: 'work_order_status', required: true,  multiple: false },
		},
		template: { presentation: 'wo_number item quantity work_order_status scheduled_start' },
	},

	wo_operation: {
		base: 'machine_base',
		fields: {
			id:            { type: 'id',     readonly: true },
			code:          { type: 'text',   required: true },
			sequence:      { type: 'number' },
			planned_minutes:{ type: 'number' },
			actual_minutes:{ type: 'number' },
			started_at:    { type: 'date' },
			completed_at:  { type: 'date' },
		},
		fks: {
			work_order:  { code: 'work_order',  required: true,  multiple: false },
			operation:   { code: 'operation',   required: false, multiple: false },
			work_center: { code: 'work_center', required: true,  multiple: false },
			machine:     { code: 'machine',     required: false, multiple: false },
		},
		template: { presentation: 'work_order sequence work_center actual_minutes' },
	},

	material_consumption: {
		base: 'machine_base',
		fields: {
			id:           { type: 'id',     readonly: true },
			code:         { type: 'text',   required: true },
			planned_qty:  { type: 'number' },
			consumed_qty: { type: 'number' },
			consumed_at:  { type: 'date' },
		},
		fks: {
			work_order: { code: 'work_order', required: true,  multiple: false },
			item:       { code: 'item',       required: true,  multiple: false },
			lot:        { code: 'lot',        required: false, multiple: false },
		},
		template: { presentation: 'work_order item planned_qty consumed_qty' },
	},

	// ── Stock & traçabilité ───────────────────────────────────────────────────

	warehouse: {
		base: 'machine_base',
		fields: {
			id:      { type: 'id',   readonly: true },
			code:    { type: 'text', required: true },
			name:    { type: 'text', required: true },
			address: { type: 'text' },
			city:    { type: 'text' },
		},
		fks: {},
		template: { presentation: 'name city' },
	},

	stock_location: {
		base: 'machine_base',
		fields: {
			id:   { type: 'id',   readonly: true },
			code: { type: 'text', required: true },
			name: { type: 'text', required: true },
			aisle:{ type: 'text' },
			bin:  { type: 'text' },
		},
		fks: {
			warehouse: { code: 'warehouse', required: true, multiple: false },
		},
		template: { presentation: 'warehouse name aisle bin' },
	},

	lot: {
		base: 'machine_base',
		fields: {
			id:           { type: 'id',     readonly: true },
			code:         { type: 'text',   required: true },
			lot_number:   { type: 'text',   required: true },
			quantity:     { type: 'number', required: true },
			produced_at:  { type: 'date' },
			expires_at:   { type: 'date' },
		},
		fks: {
			item:       { code: 'item',       required: true,  multiple: false },
			lot_status: { code: 'lot_status', required: true,  multiple: false },
			work_order: { code: 'work_order', required: false, multiple: false },
		},
		template: { presentation: 'lot_number item quantity lot_status' },
	},

	stock_move: {
		base: 'machine_base',
		fields: {
			id:        { type: 'id',     readonly: true },
			code:      { type: 'text',   required: true },
			quantity:  { type: 'number', required: true },
			move_type: { type: 'text' },
			moved_at:  { type: 'date',   required: true },
			reference: { type: 'text' },
		},
		fks: {
			item:          { code: 'item',           required: true,  multiple: false },
			lot:           { code: 'lot',            required: false, multiple: false },
			from_location: { code: 'stock_location', required: false, multiple: false },
			to_location:   { code: 'stock_location', required: false, multiple: false },
			work_order:    { code: 'work_order',     required: false, multiple: false },
		},
		template: { presentation: 'item quantity move_type moved_at' },
	},

	// ── Approvisionnement ─────────────────────────────────────────────────────

	purchase_order: {
		base: 'machine_base',
		fields: {
			id:           { type: 'id',       readonly: true },
			code:         { type: 'text',     required: true },
			name:         { type: 'text',     required: true },
			po_number:    { type: 'text',     required: true },
			order_date:   { type: 'date',     required: true },
			expected_date:{ type: 'date' },
			total:        { type: 'currency' },
			notes:        { type: 'text-lg' },
		},
		fks: {
			supplier:  { code: 'supplier',  required: true, multiple: false },
			po_status: { code: 'po_status', required: true, multiple: false },
		},
		template: { presentation: 'po_number supplier order_date po_status total' },
	},

	po_line: {
		base: 'machine_base',
		fields: {
			id:           { type: 'id',       readonly: true },
			code:         { type: 'text',     required: true },
			quantity:     { type: 'number',   required: true },
			received_qty: { type: 'number' },
			unit_price:   { type: 'currency', required: true },
			line_total:   { type: 'currency' },
		},
		fks: {
			purchase_order: { code: 'purchase_order', required: true, multiple: false },
			item:           { code: 'item',           required: true, multiple: false },
		},
		template: { presentation: 'purchase_order item quantity received_qty unit_price' },
	},

	// ── Qualité ───────────────────────────────────────────────────────────────

	quality_check: {
		base: 'machine_base',
		fields: {
			id:          { type: 'id',     readonly: true },
			code:        { type: 'text',   required: true },
			name:        { type: 'text',   required: true },
			checked_at:  { type: 'date',   required: true },
			measured_value:{ type: 'number' },
			notes:       { type: 'text-lg' },
		},
		fks: {
			lot:        { code: 'lot',        required: false, multiple: false },
			work_order: { code: 'work_order', required: false, multiple: false },
			item:       { code: 'item',       required: true,  multiple: false },
			qc_result:  { code: 'qc_result',  required: true,  multiple: false },
		},
		template: { presentation: 'item lot qc_result checked_at' },
	},
};
