import type { MachineModel } from '../../../../src/lib/types/machine-model.js';

export const siveScheme: MachineModel = {

	// ── Core ────────────────────────────────────────────────────────────────
	task: {
		base: 'machine_base',
		fields: {
			id:      { type: 'id',     readonly: true },
			title:   { type: 'text',   required: true },
			priority: { type: 'number', required: true, default: 1 },
		},
		fks: {},
		template: { presentation: 'title priority' },
	},

	documents: {
		base: 'machine_base',
		fields: {
			id:         { type: 'id',     readonly: true },
			user_id:    { type: 'text',   required: true },
			title:      { type: 'text',   required: true, default: 'Untitled' },
			content:    { type: 'text-lg', required: true, default: '' },
			tags:       { type: 'text',   required: true, default: '[]' },
			created_at: { type: 'date',   required: true },
			updated_at: { type: 'date',   required: true },
		},
		fks: {},
		template: { presentation: 'title user_id updated_at' },
	},

	user_preferences: {
		base: 'machine_base',
		fields: {
			id:          { type: 'id',     readonly: true },
			user_id:     { type: 'text',   required: true },
			prefs:        { type: 'text',   required: true, default: '{}' },
			updated_at:  { type: 'date',   required: true },
		},
		fks: {},
		template: { presentation: 'user_id updated_at' },
	},

	document_shares: {
		base: 'machine_base',
		fields: {
			id:           { type: 'id',     readonly: true },
			document_id:  { type: 'text',   required: true },
			user_id:      { type: 'text',   required: true },
			role:         { type: 'text',   required: true, default: 'viewer' },
			created_at:   { type: 'date',   required: true },
		},
		fks: {},
		template: { presentation: 'document_id user_id role' },
	},

	// ── Challenges ────────────────────────────────────────────────────────────────

	challenges: {
		base: 'machine_base',
		fields: {
			id:            { type: 'id',     readonly: true },
			title:         { type: 'text',   required: true },
			description:   { type: 'text-lg', required: true, default: '' },
			targetWords:   { type: 'number',  required: true },
			durationDays:  { type: 'number',  required: true },
			creatorId:    { type: 'text',   required: true },
			createdAt:     { type: 'date',   required: true },
			endsAt:        { type: 'date',   required: true },
		},
		fks: {},
		template: { presentation: 'title creatorId endsAt' },
	},

	challengeParticipants: {
		base: 'machine_base',
		fields: {
			challengeId:      { type: 'text',   required: true },
			userId:           { type: 'text',   required: true },
			joinedAt:         { type: 'date',   required: true },
			wordsContributed: { type: 'number',  required: true, default: 0 },
		},
		fks: {},
		template: { presentation: 'challengeId userId wordsContributed' },
	},

	// ── Discovery & Activity ────────────────────────────────────────────────────────────────

	writerDiscovery: {
		base: 'machine_base',
		fields: {
			userId:          { type: 'text',   required: true },
			displayName:     { type: 'text',   required: true },
			currentStreak:   { type: 'number',  required: true, default: 0 },
			longestStreak:   { type: 'number',  required: true, default: 0 },
			totalWords:      { type: 'number',  required: true, default: 0 },
			topBadgeIcon:    { type: 'text',   default: '✍️' },
			topBadgeName:    { type: 'text',   default: 'Writer' },
			optedIn:         { type: 'boolean', required: true, default: false },
			updatedAt:       { type: 'date',   required: true },
		},
		fks: {},
		template: { presentation: 'displayName currentStreak optedIn' },
	},

	activityEvents: {
		base: 'machine_base',
		fields: {
			id:          { type: 'id',     readonly: true },
			type:        { type: 'text',   required: true },
			userId:      { type: 'text',   required: true },
			displayName: { type: 'text',   required: true },
			timestamp:   { type: 'date',   required: true },
			payload:     { type: 'text' },
		},
		fks: {},
		template: { presentation: 'type userId timestamp' },
	},

	// ── Auth ────────────────────────────────────────────────────────────────

	users: {
		base: 'machine_base',
		fields: {
			id:            { type: 'id',     readonly: true },
			email:         { type: 'email',  required: true },
			name:          { type: 'text' },
			password_hash: { type: 'text' },
			created_at:    { type: 'date',   required: true },
		},
		fks: {},
		template: { presentation: 'email name created_at' },
	},

	sessions: {
		base: 'machine_base',
		fields: {
			id:           { type: 'id',     readonly: true },
			user_id:      { type: 'text',   required: true },
			session_token: { type: 'text',   required: true },
			expires_at:   { type: 'date',   required: true },
		},
		fks: {},
		template: { presentation: 'user_id expires_at' },
	},

	accounts: {
		base: 'machine_base',
		fields: {
			id:                  { type: 'id',     readonly: true },
			user_id:             { type: 'text',   required: true },
			provider:            { type: 'text',   required: true },
			provider_account_id: { type: 'text',   required: true },
			access_token:        { type: 'text' },
			refresh_token:       { type: 'text' },
			expires_at:          { type: 'date' },
		},
		fks: {},
		template: { presentation: 'user_id provider expires_at' },
	},
};

export default siveScheme;