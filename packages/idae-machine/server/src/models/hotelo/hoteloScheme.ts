import type { MachineModel } from '../../../../src/lib/types/machine-model.js';

export const hoteloScheme: MachineModel = {

	// ── Statuts / Types ───────────────────────────────────────────────────────

	booking_status: {
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

	room_status: {
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

	housekeeping_status: {
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

	bed_type: {
		base: 'machine_base',
		isGroup: true,
		fields: {
			id:       { type: 'id',     readonly: true },
			code:     { type: 'text',   required: true },
			name:     { type: 'text',   required: true },
			capacity: { type: 'number' },
		},
		fkRelations: {},
		template: { presentation: 'name capacity' },
	},

	channel: {
		base: 'machine_base',
		isType: true,
		fields: {
			id:              { type: 'id',     readonly: true },
			code:            { type: 'text',   required: true },
			name:            { type: 'text',   required: true },
			commission_pct:  { type: 'number' },
		},
		fkRelations: {},
		template: { presentation: 'name commission_pct' },
	},

	rate_type: {
		base: 'machine_base',
		isType: true,
		fields: {
			id:   { type: 'id',   readonly: true },
			code: { type: 'text', required: true },
			name: { type: 'text', required: true },
			refundable: { type: 'boolean' },
		},
		fkRelations: {},
		template: { presentation: 'name refundable' },
	},

	// ── Etablissement ────────────────────────────────────────────────────────

	property: {
		base: 'machine_base',
		fields: {
			id:          { type: 'id',     readonly: true },
			code:        { type: 'text',   required: true },
			name:        { type: 'text',   required: true },
			slug:        { type: 'text' },
			stars:       { type: 'number' },
			address:     { type: 'text',   required: true },
			postal_code: { type: 'text' },
			city:        { type: 'text',   required: true },
			country:     { type: 'text' },
			latitude:    { type: 'number' },
			longitude:   { type: 'number' },
			phone:       { type: 'phone' },
			email:       { type: 'email' },
			website:     { type: 'url' },
			check_in_time:{ type: 'text' },
			check_out_time:{ type: 'text' },
			logo:        { type: 'image' },
			photo:       { type: 'image' },
		},
		fkRelations: {},
		template: { presentation: 'name city stars' },
	},

	amenity: {
		base: 'machine_base',
		fields: {
			id:   { type: 'id',   readonly: true },
			code: { type: 'text', required: true },
			name: { type: 'text', required: true },
			icon: { type: 'image' },
		},
		fkRelations: {},
		template: { presentation: 'name code' },
	},

	room_type: {
		base: 'machine_base',
		fields: {
			id:            { type: 'id',       readonly: true },
			code:          { type: 'text',     required: true },
			name:          { type: 'text',     required: true },
			description:   { type: 'text-lg' },
			max_occupancy: { type: 'number' },
			base_rate:     { type: 'currency' },
			size_sqm:      { type: 'number' },
			photo:         { type: 'image' },
		},
		fkRelations: {
			property: { code: 'property', required: true,  multiple: false },
			bed_type: { code: 'bed_type', required: false, multiple: false },
		},
		template: { presentation: 'property name max_occupancy base_rate' },
	},

	room_type_amenity: {
		base: 'machine_base',
		fields: {
			id:   { type: 'id',   readonly: true },
			code: { type: 'text', required: true },
		},
		fkRelations: {
			room_type: { code: 'room_type', required: true, multiple: false },
			amenity:   { code: 'amenity',   required: true, multiple: false },
		},
		template: { presentation: 'room_type amenity' },
	},

	room: {
		base: 'machine_base',
		fields: {
			id:         { type: 'id',     readonly: true },
			code:       { type: 'text',   required: true },
			name:       { type: 'text',   required: true },
			number:     { type: 'text',   required: true },
			floor:      { type: 'number' },
			notes:      { type: 'text-lg' },
		},
		fkRelations: {
			property:            { code: 'property',            required: true, multiple: false },
			room_type:           { code: 'room_type',           required: true, multiple: false },
			room_status:         { code: 'room_status',         required: true, multiple: false },
			housekeeping_status: { code: 'housekeeping_status', required: true, multiple: false },
		},
		template: { presentation: 'number room_type room_status housekeeping_status' },
	},

	// ── Tarification (par date) ───────────────────────────────────────────────

	rate_plan: {
		base: 'machine_base',
		fields: {
			id:          { type: 'id',       readonly: true },
			code:        { type: 'text',     required: true },
			name:        { type: 'text',     required: true },
			description: { type: 'text-lg' },
			cancellation_policy:{ type: 'text-lg' },
		},
		fkRelations: {
			property:  { code: 'property',  required: true,  multiple: false },
			rate_type: { code: 'rate_type', required: true,  multiple: false },
		},
		template: { presentation: 'property name rate_type' },
	},

	daily_rate: {
		base: 'machine_base',
		fields: {
			id:            { type: 'id',       readonly: true },
			code:          { type: 'text',     required: true },
			rate_date:     { type: 'date',     required: true },
			price:         { type: 'currency', required: true },
			min_stay:      { type: 'number' },
			closed:        { type: 'boolean' },
		},
		fkRelations: {
			rate_plan: { code: 'rate_plan', required: true, multiple: false },
			room_type: { code: 'room_type', required: true, multiple: false },
		},
		template: { presentation: 'room_type rate_date price min_stay' },
	},

	availability: {
		base: 'machine_base',
		fields: {
			id:            { type: 'id',     readonly: true },
			code:          { type: 'text',   required: true },
			avail_date:    { type: 'date',   required: true },
			total_rooms:   { type: 'number' },
			booked_rooms:  { type: 'number' },
			available_rooms:{ type: 'number' },
			stop_sell:     { type: 'boolean' },
		},
		fkRelations: {
			room_type: { code: 'room_type', required: true, multiple: false },
		},
		template: { presentation: 'room_type avail_date available_rooms stop_sell' },
	},

	// ── Clients ───────────────────────────────────────────────────────────────

	guest: {
		base: 'machine_base',
		fields: {
			id:           { type: 'id',    readonly: true },
			code:         { type: 'text',  required: true },
			name:         { type: 'text',  required: true },
			first_name:   { type: 'text',  required: true },
			last_name:    { type: 'text',  required: true },
			email:        { type: 'email' },
			phone:        { type: 'phone' },
			address:      { type: 'text' },
			city:         { type: 'text' },
			country:      { type: 'text' },
			birth_date:   { type: 'date' },
			passport_no:  { type: 'text' },
			vip:          { type: 'boolean' },
			loyalty_points:{ type: 'number' },
			notes:        { type: 'text-lg' },
		},
		fkRelations: {},
		template: { presentation: 'last_name first_name email vip' },
	},

	// ── Réservations (date-range) ─────────────────────────────────────────────

	booking: {
		base: 'machine_base',
		fields: {
			id:              { type: 'id',       readonly: true },
			code:            { type: 'text',     required: true },
			name:            { type: 'text' },
			booking_number:  { type: 'text',     required: true },
			check_in:        { type: 'date',     required: true },
			check_out:       { type: 'date',     required: true },
			nights:          { type: 'number' },
			adults:          { type: 'number' },
			children:        { type: 'number' },
			room_total:      { type: 'currency' },
			extras_total:    { type: 'currency' },
			tax_total:       { type: 'currency' },
			total:           { type: 'currency', required: true },
			amount_paid:     { type: 'currency' },
			booked_at:       { type: 'date' },
			special_requests:{ type: 'text-lg' },
		},
		fkRelations: {
			property:       { code: 'property',       required: true,  multiple: false },
			guest:          { code: 'guest',          required: true,  multiple: false },
			booking_status: { code: 'booking_status', required: true,  multiple: false },
			channel:        { code: 'channel',        required: false, multiple: false },
			payment_status: { code: 'payment_status', required: true,  multiple: false },
		},
		template: { presentation: 'booking_number guest check_in check_out booking_status total' },
	},

	booking_room: {
		base: 'machine_base',
		fields: {
			id:          { type: 'id',       readonly: true },
			code:        { type: 'text',     required: true },
			check_in:    { type: 'date',     required: true },
			check_out:   { type: 'date',     required: true },
			rate_total:  { type: 'currency' },
			guest_name:  { type: 'text' },
			adults:      { type: 'number' },
			children:    { type: 'number' },
		},
		fkRelations: {
			booking:   { code: 'booking',   required: true,  multiple: false },
			room_type: { code: 'room_type', required: true,  multiple: false },
			room:      { code: 'room',      required: false, multiple: false },
			rate_plan: { code: 'rate_plan', required: false, multiple: false },
		},
		template: { presentation: 'booking room_type room check_in check_out rate_total' },
	},

	stay: {
		base: 'machine_base',
		fields: {
			id:              { type: 'id',   readonly: true },
			code:            { type: 'text', required: true },
			checked_in_at:   { type: 'date' },
			checked_out_at:  { type: 'date' },
			key_cards:       { type: 'number' },
			actual_check_out:{ type: 'date' },
		},
		fkRelations: {
			booking_room: { code: 'booking_room', required: true, multiple: false },
			room:         { code: 'room',         required: true, multiple: false },
		},
		template: { presentation: 'room checked_in_at checked_out_at' },
	},

	// ── Extras & facturation ──────────────────────────────────────────────────

	service: {
		base: 'machine_base',
		fields: {
			id:    { type: 'id',       readonly: true },
			code:  { type: 'text',     required: true },
			name:  { type: 'text',     required: true },
			price: { type: 'currency' },
			unit:  { type: 'text' },
		},
		fkRelations: {
			property: { code: 'property', required: true, multiple: false },
		},
		template: { presentation: 'name price unit' },
	},

	folio_charge: {
		base: 'machine_base',
		fields: {
			id:         { type: 'id',       readonly: true },
			code:       { type: 'text',     required: true },
			description:{ type: 'text',     required: true },
			quantity:   { type: 'number' },
			unit_price: { type: 'currency' },
			amount:     { type: 'currency', required: true },
			charged_at: { type: 'date',     required: true },
		},
		fkRelations: {
			booking: { code: 'booking', required: true,  multiple: false },
			service: { code: 'service', required: false, multiple: false },
		},
		template: { presentation: 'booking description amount charged_at' },
	},

	payment: {
		base: 'machine_base',
		fields: {
			id:        { type: 'id',       readonly: true },
			code:      { type: 'text',     required: true },
			amount:    { type: 'currency', required: true },
			method:    { type: 'text' },
			paid_at:   { type: 'date',     required: true },
			reference: { type: 'text' },
		},
		fkRelations: {
			booking:        { code: 'booking',        required: true, multiple: false },
			payment_status: { code: 'payment_status', required: true, multiple: false },
		},
		template: { presentation: 'booking amount method paid_at' },
	},

	// ── Opérations ────────────────────────────────────────────────────────────

	housekeeping_task: {
		base: 'machine_base',
		fields: {
			id:          { type: 'id',     readonly: true },
			code:        { type: 'text',   required: true },
			name:        { type: 'text' },
			task_date:   { type: 'date',   required: true },
			assigned_to: { type: 'text' },
			completed_at:{ type: 'date' },
			notes:       { type: 'text-lg' },
		},
		fkRelations: {
			room:                { code: 'room',                required: true, multiple: false },
			housekeeping_status: { code: 'housekeeping_status', required: true, multiple: false },
		},
		template: { presentation: 'room task_date housekeeping_status assigned_to' },
	},

	review: {
		base: 'machine_base',
		fields: {
			id:         { type: 'id',     readonly: true },
			code:       { type: 'text',   required: true },
			rating:     { type: 'number', required: true },
			title:      { type: 'text' },
			comment:    { type: 'text-lg' },
			created_at: { type: 'date',   required: true },
			response:   { type: 'text-lg' },
		},
		fkRelations: {
			property: { code: 'property', required: true,  multiple: false },
			guest:    { code: 'guest',    required: false, multiple: false },
			booking:  { code: 'booking',  required: false, multiple: false },
		},
		template: { presentation: 'property rating guest created_at' },
	},
};
