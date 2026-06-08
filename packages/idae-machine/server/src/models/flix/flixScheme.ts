import type { MachineModel } from '../../../../src/lib/types/machine-model.js';

export const flixScheme: MachineModel = {

	// ── Statuts / Types ───────────────────────────────────────────────────────

	title_type: {
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

	role_type: {
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

	age_rating: {
		base: 'machine_base',
		isGroup: true,
		fields: {
			id:         { type: 'id',   readonly: true },
			code:       { type: 'text', required: true },
			name:       { type: 'text', required: true },
			min_age:    { type: 'number' },
			ordre:      { type: 'number' },
		},
		fks: {},
		template: { presentation: 'code name min_age' },
	},

	subscription_status: {
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

	video_quality: {
		base: 'machine_base',
		isType: true,
		fields: {
			id:     { type: 'id',   readonly: true },
			code:   { type: 'text', required: true },
			name:   { type: 'text', required: true },
			width:  { type: 'number' },
			height: { type: 'number' },
			ordre:  { type: 'number' },
		},
		fks: {},
		template: { presentation: 'code name height' },
	},

	language: {
		base: 'machine_base',
		fields: {
			id:    { type: 'id',   readonly: true },
			code:  { type: 'text', required: true },
			name:  { type: 'text', required: true },
			native_name: { type: 'text' },
		},
		fks: {},
		template: { presentation: 'code name' },
	},

	// ── Référentiels ──────────────────────────────────────────────────────────

	genre: {
		base: 'machine_base',
		fields: {
			id:   { type: 'id',   readonly: true },
			code: { type: 'text', required: true },
			name: { type: 'text', required: true },
			slug: { type: 'text', required: true },
		},
		fks: {},
		template: { presentation: 'name slug' },
	},

	studio: {
		base: 'machine_base',
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
		fks: {},
		template: { presentation: 'name country founded' },
	},

	person: {
		base: 'machine_base',
		fields: {
			id:         { type: 'id',      readonly: true },
			code:       { type: 'text',    required: true },
			name:       { type: 'text',    required: true },
			slug:       { type: 'text',    required: true },
			bio:        { type: 'text-lg' },
			birth_date: { type: 'date' },
			death_date: { type: 'date' },
			birth_place:{ type: 'text' },
			photo:      { type: 'image' },
		},
		fks: {},
		template: { presentation: 'name birth_date' },
	},

	// ── Catalogue ─────────────────────────────────────────────────────────────

	title: {
		base: 'machine_base',
		fields: {
			id:           { type: 'id',      readonly: true },
			code:         { type: 'text',    required: true },
			name:         { type: 'text',    required: true },
			slug:         { type: 'text',    required: true },
			original_name:{ type: 'text' },
			tagline:      { type: 'text' },
			synopsis:     { type: 'text-lg' },
			release_year: { type: 'number' },
			release_date: { type: 'date' },
			duration_min: { type: 'number' },
			imdb_id:      { type: 'text' },
			tmdb_id:      { type: 'text' },
			poster:       { type: 'image' },
			backdrop:     { type: 'image' },
			trailer_url:  { type: 'url' },
			rating_avg:   { type: 'number' },
			rating_count: { type: 'number' },
			featured:     { type: 'boolean' },
			published_at: { type: 'date' },
		},
		fks: {
			title_type: { code: 'title_type', required: true,  multiple: false },
			age_rating: { code: 'age_rating', required: false, multiple: false },
		},
		template: { presentation: 'name title_type release_year rating_avg' },
	},

	title_genre: {
		base: 'machine_base',
		fields: {
			id:   { type: 'id',   readonly: true },
			code: { type: 'text', required: true },
		},
		fks: {
			title: { code: 'title', required: true, multiple: false },
			genre: { code: 'genre', required: true, multiple: false },
		},
		template: { presentation: 'title genre' },
	},

	title_studio: {
		base: 'machine_base',
		fields: {
			id:   { type: 'id',   readonly: true },
			code: { type: 'text', required: true },
			role: { type: 'text' },
		},
		fks: {
			title:  { code: 'title',  required: true, multiple: false },
			studio: { code: 'studio', required: true, multiple: false },
		},
		template: { presentation: 'title studio role' },
	},

	credit: {
		base: 'machine_base',
		fields: {
			id:             { type: 'id',     readonly: true },
			code:           { type: 'text',   required: true },
			character_name: { type: 'text' },
			ordre:          { type: 'number' },
		},
		fks: {
			title:     { code: 'title',     required: true, multiple: false },
			person:    { code: 'person',    required: true, multiple: false },
			role_type: { code: 'role_type', required: true, multiple: false },
		},
		template: { presentation: 'title person role_type character_name' },
	},

	season: {
		base: 'machine_base',
		fields: {
			id:           { type: 'id',      readonly: true },
			code:         { type: 'text',    required: true },
			name:         { type: 'text',    required: true },
			number:       { type: 'number',  required: true },
			synopsis:     { type: 'text-lg' },
			release_year: { type: 'number' },
			poster:       { type: 'image' },
		},
		fks: {
			title: { code: 'title', required: true, multiple: false },
		},
		template: { presentation: 'title number name release_year' },
	},

	episode: {
		base: 'machine_base',
		fields: {
			id:           { type: 'id',      readonly: true },
			code:         { type: 'text',    required: true },
			name:         { type: 'text',    required: true },
			number:       { type: 'number',  required: true },
			synopsis:     { type: 'text-lg' },
			duration_min: { type: 'number' },
			air_date:     { type: 'date' },
			still_image:  { type: 'image' },
		},
		fks: {
			season: { code: 'season', required: true, multiple: false },
			title:  { code: 'title',  required: true, multiple: false },
		},
		template: { presentation: 'season number name air_date' },
	},

	// ── Média technique ───────────────────────────────────────────────────────

	video_asset: {
		base: 'machine_base',
		fields: {
			id:           { type: 'id',     readonly: true },
			code:         { type: 'text',   required: true },
			url:          { type: 'url',    required: true },
			codec:        { type: 'text' },
			container:    { type: 'text' },
			bitrate_kbps: { type: 'number' },
			size_bytes:   { type: 'number' },
			duration_sec: { type: 'number' },
			hdr:          { type: 'boolean' },
		},
		fks: {
			title:         { code: 'title',         required: false, multiple: false },
			episode:       { code: 'episode',       required: false, multiple: false },
			video_quality: { code: 'video_quality', required: true,  multiple: false },
		},
		template: { presentation: 'title episode video_quality codec' },
	},

	audio_track: {
		base: 'machine_base',
		fields: {
			id:    { type: 'id',   readonly: true },
			code:  { type: 'text', required: true },
			kind:  { type: 'text' },
			url:   { type: 'url' },
		},
		fks: {
			video_asset: { code: 'video_asset', required: true, multiple: false },
			language:    { code: 'language',    required: true, multiple: false },
		},
		template: { presentation: 'video_asset language kind' },
	},

	subtitle: {
		base: 'machine_base',
		fields: {
			id:     { type: 'id',     readonly: true },
			code:   { type: 'text',   required: true },
			url:    { type: 'url',    required: true },
			format: { type: 'text' },
			forced: { type: 'boolean' },
			sdh:    { type: 'boolean' },
		},
		fks: {
			video_asset: { code: 'video_asset', required: true, multiple: false },
			language:    { code: 'language',    required: true, multiple: false },
		},
		template: { presentation: 'video_asset language format' },
	},

	// ── Abonnés / Plans ───────────────────────────────────────────────────────

	plan: {
		base: 'machine_base',
		fields: {
			id:             { type: 'id',       readonly: true },
			code:           { type: 'text',     required: true },
			name:           { type: 'text',     required: true },
			price_monthly:  { type: 'currency', required: true },
			price_yearly:   { type: 'currency' },
			max_profiles:   { type: 'number' },
			max_quality:    { type: 'text' },
			ad_supported:   { type: 'boolean' },
			download_allowed:{ type: 'boolean' },
			active:         { type: 'boolean' },
		},
		fks: {},
		template: { presentation: 'name price_monthly max_quality ad_supported' },
	},

	viewer: {
		base: 'machine_base',
		fields: {
			id:         { type: 'id',    readonly: true },
			code:       { type: 'text',  required: true },
			name:       { type: 'text',  required: true },
			email:      { type: 'email', required: true },
			phone:      { type: 'phone' },
			country:    { type: 'text' },
			joined_at:  { type: 'date' },
			last_login: { type: 'date' },
		},
		fks: {},
		template: { presentation: 'name email country joined_at' },
	},

	subscription: {
		base: 'machine_base',
		fields: {
			id:           { type: 'id',       readonly: true },
			code:         { type: 'text',     required: true },
			started_at:   { type: 'date',     required: true },
			renews_at:    { type: 'date' },
			cancelled_at: { type: 'date' },
			price:        { type: 'currency' },
			billing_cycle:{ type: 'text' },
		},
		fks: {
			viewer:              { code: 'viewer',              required: true, multiple: false },
			plan:                { code: 'plan',                required: true, multiple: false },
			subscription_status: { code: 'subscription_status', required: true, multiple: false },
		},
		template: { presentation: 'viewer plan subscription_status started_at renews_at' },
	},

	viewer_profile: {
		base: 'machine_base',
		fields: {
			id:            { type: 'id',      readonly: true },
			code:          { type: 'text',    required: true },
			name:          { type: 'text',    required: true },
			avatar:        { type: 'image' },
			is_kid:        { type: 'boolean' },
			pin:           { type: 'text' },
			language_pref: { type: 'text' },
		},
		fks: {
			viewer:            { code: 'viewer',     required: true,  multiple: false },
			max_age_rating:    { code: 'age_rating', required: false, multiple: false },
		},
		template: { presentation: 'viewer name is_kid' },
	},

	// ── Activité utilisateur ──────────────────────────────────────────────────

	watchlist: {
		base: 'machine_base',
		fields: {
			id:       { type: 'id',   readonly: true },
			code:     { type: 'text', required: true },
			added_at: { type: 'date' },
		},
		fks: {
			viewer_profile: { code: 'viewer_profile', required: true, multiple: false },
			title:          { code: 'title',          required: true, multiple: false },
		},
		template: { presentation: 'viewer_profile title added_at' },
	},

	watch_history: {
		base: 'machine_base',
		fields: {
			id:           { type: 'id',      readonly: true },
			code:         { type: 'text',    required: true },
			position_sec: { type: 'number',  required: true },
			duration_sec: { type: 'number' },
			completed:    { type: 'boolean' },
			started_at:   { type: 'date' },
			watched_at:   { type: 'date',    required: true },
			device:       { type: 'text' },
		},
		fks: {
			viewer_profile: { code: 'viewer_profile', required: true,  multiple: false },
			title:          { code: 'title',          required: false, multiple: false },
			episode:        { code: 'episode',        required: false, multiple: false },
		},
		template: { presentation: 'viewer_profile title episode position_sec watched_at' },
	},

	rating: {
		base: 'machine_base',
		fields: {
			id:         { type: 'id',      readonly: true },
			code:       { type: 'text',    required: true },
			score:      { type: 'number',  required: true },
			review:     { type: 'text-lg' },
			created_at: { type: 'date',    required: true },
		},
		fks: {
			viewer_profile: { code: 'viewer_profile', required: true, multiple: false },
			title:          { code: 'title',          required: true, multiple: false },
		},
		template: { presentation: 'viewer_profile title score created_at' },
	},
};
