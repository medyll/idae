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
		fkRelations: {},
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
		fkRelations: {},
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
		fkRelations: {},
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
		fkRelations: {},
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
		fkRelations: {},
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
		fkRelations: {},
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
		fkRelations: {},
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
		fkRelations: {},
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
		fkRelations: {},
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
		fkRelations: {
			title_type: { code: 'title_type', required: true },
			age_rating: { code: 'age_rating', required: false },
		},
		template: { presentation: 'name title_type release_year rating_avg' },
	},

	title_genre: {
		base: 'machine_base',
		fields: {
			id:   { type: 'id',   readonly: true },
			code: { type: 'text', required: true },
		},
		fkRelations: {
			title: { code: 'title', required: true },
			genre: { code: 'genre', required: true },
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
		fkRelations: {
			title:  { code: 'title',  required: true },
			studio: { code: 'studio', required: true },
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
		fkRelations: {
			title:     { code: 'title',     required: true },
			person:    { code: 'person',    required: true },
			role_type: { code: 'role_type', required: true },
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
		fkRelations: {
			title: { code: 'title', required: true },
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
		fkRelations: {
			season: { code: 'season', required: true },
			title:  { code: 'title',  required: true },
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
		fkRelations: {
			title:         { code: 'title',         required: false },
			episode:       { code: 'episode',       required: false },
			video_quality: { code: 'video_quality', required: true },
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
		fkRelations: {
			video_asset: { code: 'video_asset', required: true },
			language:    { code: 'language',    required: true },
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
		fkRelations: {
			video_asset: { code: 'video_asset', required: true },
			language:    { code: 'language',    required: true },
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
		fkRelations: {},
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
		fkRelations: {},
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
		fkRelations: {
			viewer:              { code: 'viewer',              required: true },
			plan:                { code: 'plan',                required: true },
			subscription_status: { code: 'subscription_status', required: true },
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
		fkRelations: {
			viewer:            { code: 'viewer',     required: true },
			max_age_rating:    { code: 'age_rating', required: false },
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
		fkRelations: {
			viewer_profile: { code: 'viewer_profile', required: true },
			title:          { code: 'title',          required: true },
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
		fkRelations: {
			viewer_profile: { code: 'viewer_profile', required: true },
			title:          { code: 'title',          required: false },
			episode:        { code: 'episode',        required: false },
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
		fkRelations: {
			viewer_profile: { code: 'viewer_profile', required: true },
			title:          { code: 'title',          required: true },
		},
		template: { presentation: 'viewer_profile title score created_at' },
	},
};
