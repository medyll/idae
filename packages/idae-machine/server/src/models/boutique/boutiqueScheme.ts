import type { MachineModel } from '../../../../src/lib/types/machine-model.js';

export const boutiqueScheme: MachineModel = {

	// ── Statuts / Types (référentiels) ────────────────────────────────────────

	order_status: {
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

	payment_status: {
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

	product_status: {
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
		template: { presentation: 'name code' },
	},

	cart_status: {
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
		template: { presentation: 'name code' },
	},

	payment_method: {
		base: 'machine_base',
		icon: 'credit-card',
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

	address_type: {
		base: 'machine_base',
		icon: 'envelope',
		isGroup: true,
		fields: {
			id:    { type: 'id',   readonly: true },
			code:  { type: 'text', required: true },
			name:  { type: 'text', required: true },
			ordre: { type: 'number' },
		},
		fkRelations: {},
		template: { presentation: 'name code' },
	},

	currency: {
		base: 'machine_base',
		icon: 'coin',
		isType: true,
		fields: {
			id:     { type: 'id',   readonly: true },
			code:   { type: 'text', required: true },
			name:   { type: 'text', required: true },
			symbol: { type: 'text' },
		},
		fkRelations: {},
		template: { presentation: 'code symbol name' },
	},

	// ── Catalogue ─────────────────────────────────────────────────────────────

	brand: {
		base: 'machine_base',
		icon: 'trademark-registered',
		fields: {
			id:          { type: 'id',      readonly: true },
			code:        { type: 'text',    required: true },
			name:        { type: 'text',    required: true },
			slug:        { type: 'text',    required: true },
			description: { type: 'text-lg' },
			logo:        { type: 'image' },
			website:     { type: 'url' },
		},
		fkRelations: {},
		template: { presentation: 'name slug' },
	},

	category: {
		base: 'machine_base',
		icon: 'squares-four',
		fields: {
			id:          { type: 'id',      readonly: true },
			code:        { type: 'text',    required: true },
			name:        { type: 'text',    required: true },
			slug:        { type: 'text',    required: true },
			description: { type: 'text-lg' },
			image:       { type: 'image' },
			ordre:       { type: 'number' },
		},
		fkRelations: {
			parent: { code: 'category' },
		},
		template: { presentation: 'name slug' },
	},

	product: {
		base: 'machine_base',
		icon: 'package',
		fields: {
			id:               { type: 'id',       readonly: true },
			code:             { type: 'text',     required: true },
			name:             { type: 'text',     required: true },
			slug:             { type: 'text',     required: true },
			sku:              { type: 'text',     required: true },
			short_description:{ type: 'text-lg' },
			description:      { type: 'text-lg' },
			price:            { type: 'currency', required: true },
			compare_at_price: { type: 'currency' },
			cost:             { type: 'currency' },
			weight:           { type: 'number' },
			stock:            { type: 'number' },
			low_stock_alert:  { type: 'number' },
			track_stock:      { type: 'boolean' },
			cover_image:      { type: 'image' },
			meta_title:       { type: 'text' },
			meta_description: { type: 'text-lg' },
			featured:         { type: 'boolean' },
			published_at:     { type: 'date' },
		},
		fkRelations: {
			brand:          { code: 'brand',          required: false },
			category:       { code: 'category',       required: false },
			product_status: { code: 'product_status', required: true },
		},
		template: { presentation: 'name sku price stock product_status' },
	},

	variant: {
		base: 'machine_base',
		icon: 'stack',
		fields: {
			id:           { type: 'id',       readonly: true },
			code:         { type: 'text',     required: true },
			name:         { type: 'text',     required: true },
			sku:          { type: 'text',     required: true },
			price_delta:  { type: 'currency' },
			price:        { type: 'currency' },
			stock:        { type: 'number' },
			weight:       { type: 'number' },
			barcode:      { type: 'text' },
			option_size:  { type: 'text' },
			option_color: { type: 'text' },
			image:        { type: 'image' },
		},
		fkRelations: {
			product: { code: 'product', required: true },
		},
		template: { presentation: 'name sku price stock' },
	},

	product_image: {
		base: 'machine_base',
		icon: 'image',
		fields: {
			id:    { type: 'id',     readonly: true },
			code:  { type: 'text',   required: true },
			url:   { type: 'image',  required: true },
			alt:   { type: 'text' },
			ordre: { type: 'number' },
		},
		fkRelations: {
			product: { code: 'product', required: true },
		},
		template: { presentation: 'product alt ordre' },
	},

	// ── Adresses (pattern legacy idae: data pure + lien typé) ─────────────────

	address: {
		base: 'machine_base',
		icon: 'map-pin',
		fields: {
			id:          { type: 'id',   readonly: true },
			code:        { type: 'text', required: true },
			name:        { type: 'text' },
			street:      { type: 'text', required: true },
			street2:     { type: 'text' },
			postal_code: { type: 'text', required: true },
			city:        { type: 'text', required: true },
			region:      { type: 'text' },
			country:     { type: 'text', required: true },
			comment:     { type: 'text-lg' },
		},
		fkRelations: {},
		template: { presentation: 'street postal_code city country' },
	},

	customer_address: {
		base: 'machine_base',
		icon: 'map-pin',
		fields: {
			id:           { type: 'id',      readonly: true },
			code:         { type: 'text',    required: true },
			is_primary:   { type: 'boolean' },
		},
		fkRelations: {
			customer:     { code: 'customer',     required: true },
			address:      { code: 'address',      required: true },
			address_type: { code: 'address_type', required: true },
		},
		template: { presentation: 'customer address_type address is_primary' },
	},

	// ── Clients ───────────────────────────────────────────────────────────────

	customer: {
		base: 'machine_base',
		icon: 'user',
		fields: {
			id:         { type: 'id',      readonly: true },
			code:       { type: 'text',    required: true },
			name:       { type: 'text',    required: true },
			first_name: { type: 'text',    required: true },
			last_name:  { type: 'text',    required: true },
			email:      { type: 'email',   required: true },
			phone:      { type: 'phone' },
			company:    { type: 'text' },
			notes:      { type: 'text-lg' },
			accepts_marketing: { type: 'boolean' },
			created_at: { type: 'date' },
		},
		fkRelations: {},
		template: { presentation: 'last_name first_name email' },
	},

	// ── Panier ────────────────────────────────────────────────────────────────

	cart: {
		base: 'machine_base',
		icon: 'shopping-cart',
		fields: {
			id:         { type: 'id',       readonly: true },
			code:       { type: 'text',     required: true },
			session_id: { type: 'text' },
			subtotal:   { type: 'currency' },
			created_at: { type: 'date' },
			updated_at: { type: 'date' },
		},
		fkRelations: {
			customer:    { code: 'customer',    required: false },
			cart_status: { code: 'cart_status', required: true },
		},
		template: { presentation: 'customer cart_status subtotal updated_at' },
	},

	cart_item: {
		base: 'machine_base',
		icon: 'list-bullets',
		fields: {
			id:         { type: 'id',       readonly: true },
			code:       { type: 'text',     required: true },
			qty:        { type: 'number',   required: true },
			unit_price: { type: 'currency', required: true },
			line_total: { type: 'currency' },
		},
		fkRelations: {
			cart:    { code: 'cart',    required: true },
			product: { code: 'product', required: true },
			variant: { code: 'variant', required: false },
		},
		template: { presentation: 'cart product variant qty line_total' },
	},

	// ── Commandes ─────────────────────────────────────────────────────────────

	order: {
		base: 'machine_base',
		icon: 'receipt',
		fields: {
			id:                { type: 'id',       readonly: true },
			code:              { type: 'text',     required: true },
			name:              { type: 'text',     required: true },
			order_number:      { type: 'text',     required: true },
			subtotal:          { type: 'currency', required: true },
			shipping_cost:     { type: 'currency' },
			tax:               { type: 'currency' },
			discount:          { type: 'currency' },
			total:             { type: 'currency', required: true },
			customer_note:     { type: 'text-lg' },
			internal_note:     { type: 'text-lg' },
			placed_at:         { type: 'date' },
			paid_at:           { type: 'date' },
			shipped_at:        { type: 'date' },
			delivered_at:      { type: 'date' },
			cancelled_at:      { type: 'date' },
		},
		fkRelations: {
			customer:         { code: 'customer',         required: true },
			order_status:     { code: 'order_status',     required: true },
			currency:         { code: 'currency',         required: true },
			billing_address:  { code: 'address',          required: false },
			shipping_address: { code: 'address',          required: false },
			shipping_method:  { code: 'shipping_method',  required: false },
			coupon:           { code: 'coupon',           required: false },
		},
		template: { presentation: 'order_number customer order_status total placed_at' },
	},

	order_item: {
		base: 'machine_base',
		icon: 'list-bullets',
		fields: {
			id:           { type: 'id',       readonly: true },
			code:         { type: 'text',     required: true },
			sku_snapshot: { type: 'text' },
			name_snapshot:{ type: 'text' },
			qty:          { type: 'number',   required: true },
			unit_price:   { type: 'currency', required: true },
			line_total:   { type: 'currency', required: true },
			tax:          { type: 'currency' },
		},
		fkRelations: {
			order:   { code: 'order',   required: true },
			product: { code: 'product', required: true },
			variant: { code: 'variant', required: false },
		},
		template: { presentation: 'order name_snapshot qty unit_price line_total' },
	},

	// ── Paiements / Livraison / Promo ─────────────────────────────────────────

	payment: {
		base: 'machine_base',
		icon: 'credit-card',
		fields: {
			id:        { type: 'id',       readonly: true },
			code:      { type: 'text',     required: true },
			amount:    { type: 'currency', required: true },
			reference: { type: 'text' },
			paid_at:   { type: 'date' },
			notes:     { type: 'text-lg' },
		},
		fkRelations: {
			order:          { code: 'order',          required: true },
			payment_method: { code: 'payment_method', required: true },
			payment_status: { code: 'payment_status', required: true },
			currency:       { code: 'currency',       required: true },
		},
		template: { presentation: 'order payment_method amount payment_status paid_at' },
	},

	shipping_method: {
		base: 'machine_base',
		icon: 'truck',
		fields: {
			id:         { type: 'id',       readonly: true },
			code:       { type: 'text',     required: true },
			name:       { type: 'text',     required: true },
			carrier:    { type: 'text' },
			base_cost:  { type: 'currency' },
			min_days:   { type: 'number' },
			max_days:   { type: 'number' },
			active:     { type: 'boolean' },
		},
		fkRelations: {},
		template: { presentation: 'name carrier base_cost' },
	},

	coupon: {
		base: 'machine_base',
		icon: 'ticket',
		fields: {
			id:              { type: 'id',       readonly: true },
			code:            { type: 'text',     required: true },
			name:            { type: 'text',     required: true },
			discount_type:   { type: 'text',     required: true },
			discount_value:  { type: 'currency', required: true },
			min_order_total: { type: 'currency' },
			valid_from:      { type: 'date' },
			valid_until:     { type: 'date' },
			max_uses:        { type: 'number' },
			used_count:      { type: 'number' },
			active:          { type: 'boolean' },
		},
		fkRelations: {},
		template: { presentation: 'code discount_type discount_value valid_until active' },
	},

	// ── Engagement ────────────────────────────────────────────────────────────

	review: {
		base: 'machine_base',
		icon: 'star',
		fields: {
			id:           { type: 'id',      readonly: true },
			code:         { type: 'text',    required: true },
			rating:       { type: 'number',  required: true },
			title:        { type: 'text' },
			body:         { type: 'text-lg' },
			author_name:  { type: 'text' },
			author_email: { type: 'email' },
			verified:     { type: 'boolean' },
			created_at:   { type: 'date',    required: true },
		},
		fkRelations: {
			product:  { code: 'product',  required: true },
			customer: { code: 'customer', required: false },
		},
		template: { presentation: 'product rating author_name created_at' },
	},
};
