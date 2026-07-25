import type { MachineModel } from '../../../../src/lib/types/machine-model.js';

export const blogcmsScheme: MachineModel = {

	// ── Référentiels ──────────────────────────────────────────────────────────

	post_status: {
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

	comment_status: {
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

	page_template: {
		base: 'machine_base',
		icon: 'layout',
		isType: true,
		fields: {
			id:   { type: 'id',   readonly: true },
			code: { type: 'text', required: true },
			name: { type: 'text', required: true },
		},
		fkRelations: {},
		template: { presentation: 'name code' },
	},

	// ── Taxonomie ─────────────────────────────────────────────────────────────

	category: {
		base: 'machine_base',
		icon: 'squares-four',
		fields: {
			id:          { type: 'id',      readonly: true },
			code:        { type: 'text',    required: true },
			name:        { type: 'text',    required: true },
			slug:        { type: 'text',    required: true },
			description: { type: 'text-lg' },
			ordre:       { type: 'number' },
		},
		fkRelations: {
			parent: { code: 'category' },
		},
		template: { presentation: 'name slug' },
	},

	tag: {
		base: 'machine_base',
		icon: 'tag',
		fields: {
			id:   { type: 'id',   readonly: true },
			code: { type: 'text', required: true },
			name: { type: 'text', required: true },
			slug: { type: 'text', required: true },
		},
		fkRelations: {},
		template: { presentation: 'name slug' },
	},

	// ── Auteurs ───────────────────────────────────────────────────────────────

	author: {
		base: 'machine_base',
		icon: 'pen-nib',
		fields: {
			id:      { type: 'id',      readonly: true },
			code:    { type: 'text',    required: true },
			name:    { type: 'text',    required: true },
			slug:    { type: 'text',    required: true },
			email:   { type: 'email' },
			bio:     { type: 'text-lg' },
			avatar:  { type: 'image' },
			website: { type: 'url' },
			twitter: { type: 'text' },
		},
		fkRelations: {},
		template: { presentation: 'name email' },
	},

	// ── Médias ────────────────────────────────────────────────────────────────

	media: {
		base: 'machine_base',
		icon: 'image',
		fields: {
			id:          { type: 'id',      readonly: true },
			code:        { type: 'text',    required: true },
			name:        { type: 'text',    required: true },
			filename:    { type: 'text',    required: true },
			url:         { type: 'url',     required: true },
			mime:        { type: 'text' },
			size:        { type: 'number' },
			width:       { type: 'number' },
			height:      { type: 'number' },
			alt:         { type: 'text' },
			caption:     { type: 'text-lg' },
			uploaded_at: { type: 'date' },
		},
		fkRelations: {
			author: { code: 'author' },
		},
		template: { presentation: 'filename mime size' },
	},

	// ── Contenu ───────────────────────────────────────────────────────────────

	post: {
		base: 'machine_base',
		icon: 'article',
		fields: {
			id:               { type: 'id',      readonly: true },
			code:             { type: 'text',    required: true },
			name:             { type: 'text',    required: true },
			title:            { type: 'text',    required: true },
			slug:             { type: 'text',    required: true },
			excerpt:          { type: 'text-lg' },
			body:             { type: 'text-lg', required: true },
			cover_image:      { type: 'image' },
			meta_title:       { type: 'text' },
			meta_description: { type: 'text-lg' },
			published_at:     { type: 'date' },
			updated_at:       { type: 'date' },
			view_count:       { type: 'number' },
			featured:         { type: 'boolean' },
		},
		fkRelations: {
			author:      { code: 'author',      required: true },
			category:    { code: 'category',    required: false },
			post_status: { code: 'post_status', required: true },
		},
		template: { presentation: 'title published_at post_status author' },
	},

	post_tag: {
		base: 'machine_base',
		icon: 'link',
		fields: {
			id:   { type: 'id',   readonly: true },
			code: { type: 'text', required: true },
		},
		fkRelations: {
			post: { code: 'post', required: true },
			tag:  { code: 'tag',  required: true },
		},
		template: { presentation: 'post tag' },
	},

	page: {
		base: 'machine_base',
		icon: 'file-text',
		fields: {
			id:               { type: 'id',      readonly: true },
			code:             { type: 'text',    required: true },
			name:             { type: 'text',    required: true },
			title:            { type: 'text',    required: true },
			slug:             { type: 'text',    required: true },
			body:             { type: 'text-lg', required: true },
			meta_title:       { type: 'text' },
			meta_description: { type: 'text-lg' },
			published_at:     { type: 'date' },
			ordre:            { type: 'number' },
		},
		fkRelations: {
			author:        { code: 'author',        required: true },
			parent:        { code: 'page',          required: false },
			page_template: { code: 'page_template', required: false },
			post_status:   { code: 'post_status',   required: true },
		},
		template: { presentation: 'title slug post_status' },
	},

	// ── Engagement ────────────────────────────────────────────────────────────

	comment: {
		base: 'machine_base',
		icon: 'chat-circle',
		fields: {
			id:           { type: 'id',      readonly: true },
			code:         { type: 'text',    required: true },
			author_name:  { type: 'text',    required: true },
			author_email: { type: 'email' },
			author_url:   { type: 'url' },
			body:         { type: 'text-lg', required: true },
			ip:           { type: 'text' },
			created_at:   { type: 'date',    required: true },
		},
		fkRelations: {
			post:           { code: 'post',           required: true },
			parent:         { code: 'comment',        required: false },
			comment_status: { code: 'comment_status', required: true },
		},
		template: { presentation: 'author_name created_at comment_status post' },
	},
};
