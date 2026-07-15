import type { MachineModel } from '../../../../src/lib/types/machine-model.js';

export const comixScheme: MachineModel = {

	// ── Statuts / Types ───────────────────────────────────────────────────────

	page_status: {
		base: 'machine_base',
		icon: 'flag',
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

	issue_status: {
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

	credit_role: {
		base: 'machine_base',
		icon: 'identification-card',
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

	panel_shape: {
		base: 'machine_base',
		icon: 'layout',
		isType: true,
		fields: {
			id:    { type: 'id',   readonly: true },
			code:  { type: 'text', required: true },
			name:  { type: 'text', required: true },
		},
		fkRelations: {},
		template: { presentation: 'name code' },
	},

	bubble_type: {
		base: 'machine_base',
		icon: 'chat-circle',
		isType: true,
		fields: {
			id:   { type: 'id',   readonly: true },
			code: { type: 'text', required: true },
			name: { type: 'text', required: true },
		},
		fkRelations: {},
		template: { presentation: 'name code' },
	},

	genre: {
		base: 'machine_base',
		icon: 'tag',
		fields: {
			id:   { type: 'id',   readonly: true },
			code: { type: 'text', required: true },
			name: { type: 'text', required: true },
			slug: { type: 'text' },
		},
		fkRelations: {},
		template: { presentation: 'name code' },
	},

	// ── Catalogue ─────────────────────────────────────────────────────────────

	publisher: {
		base: 'machine_base',
		icon: 'buildings',
		fields: {
			id:      { type: 'id',   readonly: true },
			code:    { type: 'text', required: true },
			name:    { type: 'text', required: true },
			slug:    { type: 'text' },
			country: { type: 'text' },
			founded: { type: 'number' },
			logo:    { type: 'image' },
			website: { type: 'url' },
		},
		fkRelations: {},
		template: { presentation: 'name country founded' },
	},

	creator: {
		base: 'machine_base',
		icon: 'pen-nib',
		fields: {
			id:         { type: 'id',      readonly: true },
			code:       { type: 'text',    required: true },
			name:       { type: 'text',    required: true },
			slug:       { type: 'text' },
			first_name: { type: 'text' },
			last_name:  { type: 'text' },
			email:      { type: 'email' },
			bio:        { type: 'text-lg' },
			website:    { type: 'url' },
			photo:      { type: 'image' },
			country:    { type: 'text' },
		},
		fkRelations: {},
		template: { presentation: 'name country' },
	},

	series: {
		base: 'machine_base',
		icon: 'books',
		fields: {
			id:           { type: 'id',      readonly: true },
			code:         { type: 'text',    required: true },
			name:         { type: 'text',    required: true },
			slug:         { type: 'text',    required: true },
			synopsis:     { type: 'text-lg' },
			started_year: { type: 'number' },
			ended_year:   { type: 'number' },
			ongoing:      { type: 'boolean' },
			cover:        { type: 'image' },
			banner:       { type: 'image' },
		},
		fkRelations: {
			publisher: { code: 'publisher', required: false },
		},
		template: { presentation: 'name publisher started_year ongoing' },
	},

	series_genre: {
		base: 'machine_base',
		icon: 'link',
		fields: {
			id:   { type: 'id',   readonly: true },
			code: { type: 'text', required: true },
		},
		fkRelations: {
			series: { code: 'series', required: true },
			genre:  { code: 'genre',  required: true },
		},
		template: { presentation: 'series genre' },
	},

	character: {
		base: 'machine_base',
		icon: 'user-circle',
		fields: {
			id:           { type: 'id',      readonly: true },
			code:         { type: 'text',    required: true },
			name:         { type: 'text',    required: true },
			alias:        { type: 'text' },
			real_name:    { type: 'text' },
			bio:          { type: 'text-lg' },
			powers:       { type: 'text-lg' },
			first_appearance: { type: 'text' },
			ref_image:    { type: 'image' },
			color_palette:{ type: 'text' },
		},
		fkRelations: {
			series: { code: 'series', required: false },
		},
		template: { presentation: 'name alias series' },
	},

	location: {
		base: 'machine_base',
		icon: 'map-pin',
		fields: {
			id:          { type: 'id',      readonly: true },
			code:        { type: 'text',    required: true },
			name:        { type: 'text',    required: true },
			description: { type: 'text-lg' },
			ref_image:   { type: 'image' },
		},
		fkRelations: {
			series: { code: 'series', required: false },
		},
		template: { presentation: 'name series' },
	},

	// ── Issue ────────────────────────────────────────────────────────────────

	issue: {
		base: 'machine_base',
		icon: 'book',
		fields: {
			id:           { type: 'id',      readonly: true },
			code:         { type: 'text',    required: true },
			name:         { type: 'text',    required: true },
			number:       { type: 'number',  required: true },
			title:        { type: 'text' },
			synopsis:     { type: 'text-lg' },
			page_count:   { type: 'number' },
			release_date: { type: 'date' },
			cover_front:  { type: 'image' },
			cover_back:   { type: 'image' },
			isbn:         { type: 'text' },
			price:        { type: 'currency' },
		},
		fkRelations: {
			series:       { code: 'series',       required: true },
			issue_status: { code: 'issue_status', required: true },
		},
		template: { presentation: 'series number title issue_status release_date' },
	},

	issue_credit: {
		base: 'machine_base',
		icon: 'link',
		fields: {
			id:    { type: 'id',   readonly: true },
			code:  { type: 'text', required: true },
			ordre: { type: 'number' },
		},
		fkRelations: {
			issue:       { code: 'issue',       required: true },
			creator:     { code: 'creator',     required: true },
			credit_role: { code: 'credit_role', required: true },
		},
		template: { presentation: 'issue creator credit_role' },
	},

	// ── Script / Page / Panel ─────────────────────────────────────────────────

	script: {
		base: 'machine_base',
		icon: 'file-text',
		fields: {
			id:         { type: 'id',      readonly: true },
			code:       { type: 'text',    required: true },
			name:       { type: 'text',    required: true },
			version:    { type: 'number' },
			body:       { type: 'text-lg' },
			synopsis:   { type: 'text-lg' },
			word_count: { type: 'number' },
			locked:     { type: 'boolean' },
			updated_at: { type: 'date' },
		},
		fkRelations: {
			issue:  { code: 'issue',   required: true },
			writer: { code: 'creator', required: false },
		},
		template: { presentation: 'issue version writer locked updated_at' },
	},

	page: {
		base: 'machine_base',
		icon: 'file-text',
		fields: {
			id:           { type: 'id',      readonly: true },
			code:         { type: 'text',    required: true },
			number:       { type: 'number',  required: true },
			panel_count:  { type: 'number' },
			layout_notes: { type: 'text-lg' },
			thumbnail:    { type: 'image' },
			pencil_image: { type: 'image' },
			ink_image:    { type: 'image' },
			color_image:  { type: 'image' },
			final_image:  { type: 'image' },
			width_px:     { type: 'number' },
			height_px:    { type: 'number' },
			due_date:     { type: 'date' },
		},
		fkRelations: {
			issue:       { code: 'issue',       required: true },
			page_status: { code: 'page_status', required: true },
			penciller:   { code: 'creator',     required: false },
			inker:       { code: 'creator',     required: false },
			colorist:    { code: 'creator',     required: false },
			letterer:    { code: 'creator',     required: false },
		},
		template: { presentation: 'issue number page_status due_date' },
	},

	panel: {
		base: 'machine_base',
		icon: 'layout',
		fields: {
			id:           { type: 'id',      readonly: true },
			code:         { type: 'text',    required: true },
			number:       { type: 'number',  required: true },
			description:  { type: 'text-lg' },
			x_pct:        { type: 'number' },
			y_pct:        { type: 'number' },
			width_pct:    { type: 'number' },
			height_pct:   { type: 'number' },
			angle:        { type: 'text' },
			sfx:          { type: 'text' },
			image:        { type: 'image' },
		},
		fkRelations: {
			page:        { code: 'page',        required: true },
			panel_shape: { code: 'panel_shape', required: false },
			location:    { code: 'location',    required: false },
		},
		template: { presentation: 'page number panel_shape sfx' },
	},

	panel_character: {
		base: 'machine_base',
		icon: 'link',
		fields: {
			id:       { type: 'id',   readonly: true },
			code:     { type: 'text', required: true },
			position: { type: 'text' },
			pose:     { type: 'text' },
			emotion:  { type: 'text' },
		},
		fkRelations: {
			panel:     { code: 'panel',     required: true },
			character: { code: 'character', required: true },
		},
		template: { presentation: 'panel character pose emotion' },
	},

	bubble: {
		base: 'machine_base',
		icon: 'chat-circle',
		fields: {
			id:        { type: 'id',     readonly: true },
			code:      { type: 'text',   required: true },
			text:      { type: 'text-lg', required: true },
			ordre:     { type: 'number' },
			x_pct:     { type: 'number' },
			y_pct:     { type: 'number' },
			tail_dir:  { type: 'text' },
			font:      { type: 'text' },
		},
		fkRelations: {
			panel:       { code: 'panel',       required: true },
			character:   { code: 'character',   required: false },
			bubble_type: { code: 'bubble_type', required: true },
		},
		template: { presentation: 'panel ordre character bubble_type text' },
	},

	// ── Assets / Production ───────────────────────────────────────────────────

	asset: {
		base: 'machine_base',
		icon: 'image',
		fields: {
			id:          { type: 'id',     readonly: true },
			code:        { type: 'text',   required: true },
			name:        { type: 'text',   required: true },
			kind:        { type: 'text' },
			url:         { type: 'url' },
			image:       { type: 'image' },
			mime:        { type: 'text' },
			size_bytes:  { type: 'number' },
			tags:        { type: 'text' },
			uploaded_at: { type: 'date' },
		},
		fkRelations: {
			creator: { code: 'creator', required: false },
			series:  { code: 'series',  required: false },
		},
		template: { presentation: 'name kind series' },
	},

	revision: {
		base: 'machine_base',
		icon: 'git-branch',
		fields: {
			id:         { type: 'id',      readonly: true },
			code:       { type: 'text',    required: true },
			note:       { type: 'text-lg', required: true },
			revision_number: { type: 'number' },
			created_at: { type: 'date',    required: true },
			resolved_at:{ type: 'date' },
			resolved:   { type: 'boolean' },
		},
		fkRelations: {
			page:    { code: 'page',    required: false },
			panel:   { code: 'panel',   required: false },
			creator: { code: 'creator', required: true },
		},
		template: { presentation: 'page panel creator created_at resolved' },
	},
};
