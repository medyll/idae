import type { MachineModel } from '../../../../src/lib/types/machine-model.js';

export const hippoScheme: MachineModel = {

	// ── Statuts / Types ───────────────────────────────────────────────────────

	race_type: {
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

	race_discipline: {
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

	race_status: {
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

	track_surface: {
		base: 'machine_base',
		isType: true,
		fields: {
			id:    { type: 'id',   readonly: true },
			code:  { type: 'text', required: true },
			name:  { type: 'text', required: true },
		},
		fks: {},
		template: { presentation: 'name code' },
	},

	going: {
		base: 'machine_base',
		isGroup: true,
		fields: {
			id:    { type: 'id',   readonly: true },
			code:  { type: 'text', required: true },
			name:  { type: 'text', required: true },
			ordre: { type: 'number' },
		},
		fks: {},
		template: { presentation: 'name code' },
	},

	bet_type: {
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

	bet_status: {
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

	horse_gender: {
		base: 'machine_base',
		isGroup: true,
		fields: {
			id:   { type: 'id',   readonly: true },
			code: { type: 'text', required: true },
			name: { type: 'text', required: true },
		},
		fks: {},
		template: { presentation: 'name code' },
	},

	// ── Hippodrome ────────────────────────────────────────────────────────────

	racetrack: {
		base: 'machine_base',
		fields: {
			id:        { type: 'id',   readonly: true },
			code:      { type: 'text', required: true },
			name:      { type: 'text', required: true },
			slug:      { type: 'text' },
			city:      { type: 'text' },
			country:   { type: 'text' },
			capacity:  { type: 'number' },
			founded:   { type: 'number' },
			website:   { type: 'url' },
			logo:      { type: 'image' },
		},
		fks: {},
		template: { presentation: 'name city country' },
	},

	track: {
		base: 'machine_base',
		fields: {
			id:           { type: 'id',     readonly: true },
			code:         { type: 'text',   required: true },
			name:         { type: 'text',   required: true },
			length_meters:{ type: 'number' },
			direction:    { type: 'text' },
		},
		fks: {
			racetrack:     { code: 'racetrack',     required: true, multiple: false },
			track_surface: { code: 'track_surface', required: true, multiple: false },
		},
		template: { presentation: 'racetrack name length_meters track_surface' },
	},

	meeting: {
		base: 'machine_base',
		fields: {
			id:           { type: 'id',     readonly: true },
			code:         { type: 'text',   required: true },
			name:         { type: 'text',   required: true },
			meeting_date: { type: 'date',   required: true },
			weather:      { type: 'text' },
			temp_celsius: { type: 'number' },
		},
		fks: {
			racetrack: { code: 'racetrack', required: true,  multiple: false },
			going:     { code: 'going',     required: false, multiple: false },
		},
		template: { presentation: 'racetrack meeting_date going weather' },
	},

	// ── Acteurs ───────────────────────────────────────────────────────────────

	stable: {
		base: 'machine_base',
		fields: {
			id:       { type: 'id',    readonly: true },
			code:     { type: 'text',  required: true },
			name:     { type: 'text',  required: true },
			city:     { type: 'text' },
			country:  { type: 'text' },
			founded:  { type: 'number' },
			capacity: { type: 'number' },
			phone:    { type: 'phone' },
			email:    { type: 'email' },
		},
		fks: {},
		template: { presentation: 'name city country' },
	},

	owner: {
		base: 'machine_base',
		fields: {
			id:           { type: 'id',    readonly: true },
			code:         { type: 'text',  required: true },
			name:         { type: 'text',  required: true },
			first_name:   { type: 'text' },
			last_name:    { type: 'text' },
			email:        { type: 'email' },
			phone:        { type: 'phone' },
			silks_colors: { type: 'text' },
			silks_image:  { type: 'image' },
			country:      { type: 'text' },
		},
		fks: {},
		template: { presentation: 'name silks_colors country' },
	},

	trainer: {
		base: 'machine_base',
		fields: {
			id:         { type: 'id',    readonly: true },
			code:       { type: 'text',  required: true },
			name:       { type: 'text',  required: true },
			first_name: { type: 'text' },
			last_name:  { type: 'text' },
			licence:    { type: 'text' },
			email:      { type: 'email' },
			phone:      { type: 'phone' },
			photo:      { type: 'image' },
			win_count:  { type: 'number' },
		},
		fks: {
			stable: { code: 'stable', required: false, multiple: false },
		},
		template: { presentation: 'name stable win_count' },
	},

	jockey: {
		base: 'machine_base',
		fields: {
			id:           { type: 'id',    readonly: true },
			code:         { type: 'text',  required: true },
			name:         { type: 'text',  required: true },
			first_name:   { type: 'text' },
			last_name:    { type: 'text' },
			licence:      { type: 'text' },
			birth_date:   { type: 'date' },
			weight_kg:    { type: 'number' },
			height_cm:    { type: 'number' },
			country:      { type: 'text' },
			email:        { type: 'email' },
			phone:        { type: 'phone' },
			photo:        { type: 'image' },
			career_wins:  { type: 'number' },
			career_runs:  { type: 'number' },
		},
		fks: {},
		template: { presentation: 'name weight_kg career_wins' },
	},

	horse: {
		base: 'machine_base',
		fields: {
			id:            { type: 'id',    readonly: true },
			code:          { type: 'text',  required: true },
			name:          { type: 'text',  required: true },
			birth_year:    { type: 'number' },
			passport:      { type: 'text' },
			coat_color:    { type: 'text' },
			breed:         { type: 'text' },
			sire:          { type: 'text' },
			dam:           { type: 'text' },
			photo:         { type: 'image' },
			weight_kg:     { type: 'number' },
			active:        { type: 'boolean' },
			career_starts: { type: 'number' },
			career_wins:   { type: 'number' },
			career_earnings:{ type: 'currency' },
		},
		fks: {
			horse_gender: { code: 'horse_gender', required: true,  multiple: false },
			owner:        { code: 'owner',        required: false, multiple: false },
			trainer:      { code: 'trainer',      required: false, multiple: false },
			stable:       { code: 'stable',       required: false, multiple: false },
		},
		template: { presentation: 'name horse_gender birth_year trainer owner' },
	},

	// ── Course ────────────────────────────────────────────────────────────────

	race: {
		base: 'machine_base',
		fields: {
			id:              { type: 'id',       readonly: true },
			code:            { type: 'text',     required: true },
			name:            { type: 'text',     required: true },
			race_number:     { type: 'number',   required: true },
			scheduled_at:    { type: 'date',     required: true },
			distance_meters: { type: 'number',   required: true },
			prize_total:     { type: 'currency' },
			min_age:         { type: 'number' },
			max_age:         { type: 'number' },
			conditions:      { type: 'text-lg' },
			handicap:        { type: 'boolean' },
		},
		fks: {
			meeting:         { code: 'meeting',         required: true,  multiple: false },
			track:           { code: 'track',           required: true,  multiple: false },
			race_type:       { code: 'race_type',       required: true,  multiple: false },
			race_discipline: { code: 'race_discipline', required: true,  multiple: false },
			race_status:     { code: 'race_status',     required: true,  multiple: false },
		},
		template: { presentation: 'meeting race_number name distance_meters race_status' },
	},

	runner: {
		base: 'machine_base',
		fields: {
			id:             { type: 'id',       readonly: true },
			code:           { type: 'text',     required: true },
			cloth_number:   { type: 'number',   required: true },
			gate:           { type: 'number' },
			weight_kg:      { type: 'number' },
			odds_morning:   { type: 'number' },
			odds_final:     { type: 'number' },
			scratched:      { type: 'boolean' },
			disqualified:   { type: 'boolean' },
		},
		fks: {
			race:    { code: 'race',    required: true,  multiple: false },
			horse:   { code: 'horse',   required: true,  multiple: false },
			jockey:  { code: 'jockey',  required: true,  multiple: false },
			trainer: { code: 'trainer', required: false, multiple: false },
			owner:   { code: 'owner',   required: false, multiple: false },
		},
		template: { presentation: 'race cloth_number horse jockey weight_kg odds_final' },
	},

	race_result: {
		base: 'machine_base',
		fields: {
			id:           { type: 'id',       readonly: true },
			code:         { type: 'text',     required: true },
			finish_position: { type: 'number' },
			finish_time_sec:{ type: 'number' },
			length_behind:{ type: 'number' },
			prize_won:    { type: 'currency' },
			comment:      { type: 'text-lg' },
		},
		fks: {
			race:   { code: 'race',   required: true, multiple: false },
			runner: { code: 'runner', required: true, multiple: false },
		},
		template: { presentation: 'race finish_position runner finish_time_sec prize_won' },
	},

	// ── Paris ─────────────────────────────────────────────────────────────────

	punter: {
		base: 'machine_base',
		fields: {
			id:      { type: 'id',    readonly: true },
			code:    { type: 'text',  required: true },
			name:    { type: 'text',  required: true },
			email:   { type: 'email' },
			phone:   { type: 'phone' },
			balance: { type: 'currency' },
			joined_at:{ type: 'date' },
		},
		fks: {},
		template: { presentation: 'name balance joined_at' },
	},

	bet: {
		base: 'machine_base',
		fields: {
			id:        { type: 'id',       readonly: true },
			code:      { type: 'text',     required: true },
			stake:     { type: 'currency', required: true },
			payout:    { type: 'currency' },
			placed_at: { type: 'date',     required: true },
			settled_at:{ type: 'date' },
			ticket_ref:{ type: 'text' },
		},
		fks: {
			punter:     { code: 'punter',     required: true,  multiple: false },
			race:       { code: 'race',       required: true,  multiple: false },
			bet_type:   { code: 'bet_type',   required: true,  multiple: false },
			bet_status: { code: 'bet_status', required: true,  multiple: false },
		},
		template: { presentation: 'punter race bet_type stake bet_status payout' },
	},

	bet_selection: {
		base: 'machine_base',
		fields: {
			id:       { type: 'id',     readonly: true },
			code:     { type: 'text',   required: true },
			position: { type: 'number' },
		},
		fks: {
			bet:    { code: 'bet',    required: true, multiple: false },
			runner: { code: 'runner', required: true, multiple: false },
		},
		template: { presentation: 'bet runner position' },
	},
};
