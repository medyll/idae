import type { MachineModel } from '../../../../src/lib/types/machine-model.js';

export const schoolScheme: MachineModel = {

	// ── Statuts / Types ───────────────────────────────────────────────────────

	user_role: {
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

	attendance_status: {
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
		template: { presentation: 'name code' },
	},

	assignment_status: {
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

	absence_reason: {
		base: 'machine_base',
		isGroup: true,
		fields: {
			id:    { type: 'id',   readonly: true },
			code:  { type: 'text', required: true },
			name:  { type: 'text', required: true },
			justified_default: { type: 'boolean' },
		},
		fkRelations: {},
		template: { presentation: 'name code' },
	},

	period_type: {
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

	relation_type: {
		base: 'machine_base',
		isGroup: true,
		fields: {
			id:   { type: 'id',   readonly: true },
			code: { type: 'text', required: true },
			name: { type: 'text', required: true },
		},
		fkRelations: {},
		template: { presentation: 'name code' },
	},

	day_of_week: {
		base: 'machine_base',
		isGroup: true,
		fields: {
			id:    { type: 'id',   readonly: true },
			code:  { type: 'text', required: true },
			name:  { type: 'text', required: true },
			ordre: { type: 'number' },
		},
		fkRelations: {},
		template: { presentation: 'ordre name code' },
	},

	// ── Etablissement ────────────────────────────────────────────────────────

	school: {
		base: 'machine_base',
		fields: {
			id:        { type: 'id',    readonly: true },
			code:      { type: 'text',  required: true },
			name:      { type: 'text',  required: true },
			slug:      { type: 'text' },
			address:   { type: 'text' },
			postal_code:{ type: 'text' },
			city:      { type: 'text' },
			country:   { type: 'text' },
			phone:     { type: 'phone' },
			email:     { type: 'email' },
			website:   { type: 'url' },
			logo:      { type: 'image' },
		},
		fkRelations: {},
		template: { presentation: 'name city' },
	},

	school_year: {
		base: 'machine_base',
		fields: {
			id:         { type: 'id',   readonly: true },
			code:       { type: 'text', required: true },
			name:       { type: 'text', required: true },
			start_date: { type: 'date', required: true },
			end_date:   { type: 'date', required: true },
			current:    { type: 'boolean' },
		},
		fkRelations: {
			school: { code: 'school', required: true, multiple: false },
		},
		template: { presentation: 'school name current' },
	},

	term: {
		base: 'machine_base',
		fields: {
			id:         { type: 'id',     readonly: true },
			code:       { type: 'text',   required: true },
			name:       { type: 'text',   required: true },
			start_date: { type: 'date',   required: true },
			end_date:   { type: 'date',   required: true },
			ordre:      { type: 'number' },
		},
		fkRelations: {
			school_year: { code: 'school_year', required: true, multiple: false },
			period_type: { code: 'period_type', required: true, multiple: false },
		},
		template: { presentation: 'school_year name period_type start_date end_date' },
	},

	room: {
		base: 'machine_base',
		fields: {
			id:       { type: 'id',     readonly: true },
			code:     { type: 'text',   required: true },
			name:     { type: 'text',   required: true },
			floor:    { type: 'number' },
			capacity: { type: 'number' },
			equipment:{ type: 'text-lg' },
		},
		fkRelations: {
			school: { code: 'school', required: true, multiple: false },
		},
		template: { presentation: 'school name capacity floor' },
	},

	// ── Cursus ────────────────────────────────────────────────────────────────

	subject: {
		base: 'machine_base',
		fields: {
			id:          { type: 'id',      readonly: true },
			code:        { type: 'text',    required: true },
			name:        { type: 'text',    required: true },
			description: { type: 'text-lg' },
			color:       { type: 'text' },
			icon:        { type: 'image' },
		},
		fkRelations: {},
		template: { presentation: 'name code color' },
	},

	grade_level: {
		base: 'machine_base',
		isType: true,
		fields: {
			id:    { type: 'id',   readonly: true },
			code:  { type: 'text', required: true },
			name:  { type: 'text', required: true },
			ordre: { type: 'number' },
		},
		fkRelations: {},
		template: { presentation: 'ordre name code' },
	},

	class_group: {
		base: 'machine_base',
		fields: {
			id:       { type: 'id',     readonly: true },
			code:     { type: 'text',   required: true },
			name:     { type: 'text',   required: true },
			capacity: { type: 'number' },
		},
		fkRelations: {
			school_year: { code: 'school_year', required: true,  multiple: false },
			grade_level: { code: 'grade_level', required: true,  multiple: false },
			homeroom_teacher: { code: 'teacher', required: false, multiple: false },
		},
		template: { presentation: 'school_year grade_level name homeroom_teacher' },
	},

	// ── Personnes ─────────────────────────────────────────────────────────────

	staff: {
		base: 'machine_base',
		fields: {
			id:         { type: 'id',    readonly: true },
			code:       { type: 'text',  required: true },
			name:       { type: 'text',  required: true },
			first_name: { type: 'text',  required: true },
			last_name:  { type: 'text',  required: true },
			email:      { type: 'email', required: true },
			phone:      { type: 'phone' },
			birth_date: { type: 'date' },
			hire_date:  { type: 'date' },
			photo:      { type: 'image' },
		},
		fkRelations: {
			school:    { code: 'school',    required: true, multiple: false },
			user_role: { code: 'user_role', required: true, multiple: false },
		},
		template: { presentation: 'name user_role email' },
	},

	teacher: {
		base: 'machine_base',
		fields: {
			id:           { type: 'id',    readonly: true },
			code:         { type: 'text',  required: true },
			name:         { type: 'text',  required: true },
			first_name:   { type: 'text',  required: true },
			last_name:    { type: 'text',  required: true },
			email:        { type: 'email', required: true },
			phone:        { type: 'phone' },
			office:       { type: 'text' },
			photo:        { type: 'image' },
			specialty:    { type: 'text' },
			hire_date:    { type: 'date' },
		},
		fkRelations: {
			school: { code: 'school', required: true, multiple: false },
		},
		template: { presentation: 'name specialty email' },
	},

	student: {
		base: 'machine_base',
		fields: {
			id:           { type: 'id',    readonly: true },
			code:         { type: 'text',  required: true },
			name:         { type: 'text',  required: true },
			first_name:   { type: 'text',  required: true },
			last_name:    { type: 'text',  required: true },
			birth_date:   { type: 'date',  required: true },
			birth_place:  { type: 'text' },
			email:        { type: 'email' },
			phone:        { type: 'phone' },
			address:      { type: 'text' },
			postal_code:  { type: 'text' },
			city:         { type: 'text' },
			photo:        { type: 'image' },
			national_id:  { type: 'text' },
			enrolled_at:  { type: 'date' },
		},
		fkRelations: {
			class_group: { code: 'class_group', required: true, multiple: false },
		},
		template: { presentation: 'last_name first_name class_group birth_date' },
	},

	guardian: {
		base: 'machine_base',
		fields: {
			id:         { type: 'id',    readonly: true },
			code:       { type: 'text',  required: true },
			name:       { type: 'text',  required: true },
			first_name: { type: 'text' },
			last_name:  { type: 'text' },
			email:      { type: 'email' },
			phone:      { type: 'phone' },
			phone2:     { type: 'phone' },
			address:    { type: 'text' },
			profession: { type: 'text' },
		},
		fkRelations: {},
		template: { presentation: 'name phone email' },
	},

	student_guardian: {
		base: 'machine_base',
		fields: {
			id:         { type: 'id',      readonly: true },
			code:       { type: 'text',    required: true },
			is_primary: { type: 'boolean' },
			can_pickup: { type: 'boolean' },
			has_custody:{ type: 'boolean' },
		},
		fkRelations: {
			student:       { code: 'student',       required: true, multiple: false },
			guardian:      { code: 'guardian',      required: true, multiple: false },
			relation_type: { code: 'relation_type', required: true, multiple: false },
		},
		template: { presentation: 'student guardian relation_type is_primary' },
	},

	// ── Emploi du temps ───────────────────────────────────────────────────────

	course: {
		base: 'machine_base',
		fields: {
			id:           { type: 'id',     readonly: true },
			code:         { type: 'text',   required: true },
			name:         { type: 'text',   required: true },
			coefficient:  { type: 'number' },
			hours_per_week:{ type: 'number' },
		},
		fkRelations: {
			class_group: { code: 'class_group', required: true, multiple: false },
			subject:     { code: 'subject',     required: true, multiple: false },
			teacher:     { code: 'teacher',     required: true, multiple: false },
		},
		template: { presentation: 'class_group subject teacher' },
	},

	schedule_slot: {
		base: 'machine_base',
		fields: {
			id:         { type: 'id',     readonly: true },
			code:       { type: 'text',   required: true },
			start_time: { type: 'text',   required: true },
			end_time:   { type: 'text',   required: true },
			is_recurring:{ type: 'boolean' },
			valid_from: { type: 'date' },
			valid_until:{ type: 'date' },
		},
		fkRelations: {
			course:      { code: 'course',      required: true,  multiple: false },
			day_of_week: { code: 'day_of_week', required: true,  multiple: false },
			room:        { code: 'room',        required: false, multiple: false },
		},
		template: { presentation: 'course day_of_week start_time end_time room' },
	},

	lesson: {
		base: 'machine_base',
		fields: {
			id:           { type: 'id',     readonly: true },
			code:         { type: 'text',   required: true },
			name:         { type: 'text' },
			lesson_date:  { type: 'date',   required: true },
			start_time:   { type: 'text',   required: true },
			end_time:     { type: 'text',   required: true },
			topic:        { type: 'text' },
			content:      { type: 'text-lg' },
			cancelled:    { type: 'boolean' },
		},
		fkRelations: {
			course:  { code: 'course',  required: true,  multiple: false },
			room:    { code: 'room',    required: false, multiple: false },
			teacher: { code: 'teacher', required: false, multiple: false },
		},
		template: { presentation: 'course lesson_date start_time room teacher' },
	},

	// ── Présence ──────────────────────────────────────────────────────────────

	attendance: {
		base: 'machine_base',
		fields: {
			id:           { type: 'id',     readonly: true },
			code:         { type: 'text',   required: true },
			recorded_at:  { type: 'date' },
			minutes_late: { type: 'number' },
			comment:      { type: 'text-lg' },
		},
		fkRelations: {
			lesson:            { code: 'lesson',            required: true,  multiple: false },
			student:           { code: 'student',           required: true,  multiple: false },
			attendance_status: { code: 'attendance_status', required: true,  multiple: false },
		},
		template: { presentation: 'lesson student attendance_status minutes_late' },
	},

	absence: {
		base: 'machine_base',
		fields: {
			id:          { type: 'id',     readonly: true },
			code:        { type: 'text',   required: true },
			start_date:  { type: 'date',   required: true },
			end_date:    { type: 'date' },
			justified:   { type: 'boolean' },
			comment:     { type: 'text-lg' },
			document:    { type: 'image' },
		},
		fkRelations: {
			student:        { code: 'student',        required: true,  multiple: false },
			absence_reason: { code: 'absence_reason', required: true,  multiple: false },
			justified_by:   { code: 'guardian',       required: false, multiple: false },
		},
		template: { presentation: 'student start_date end_date absence_reason justified' },
	},

	// ── Notes / Devoirs ───────────────────────────────────────────────────────

	assignment: {
		base: 'machine_base',
		fields: {
			id:           { type: 'id',      readonly: true },
			code:         { type: 'text',    required: true },
			name:         { type: 'text',    required: true },
			title:        { type: 'text',    required: true },
			description:  { type: 'text-lg' },
			assigned_at:  { type: 'date',    required: true },
			due_date:     { type: 'date',    required: true },
			max_score:    { type: 'number',  required: true },
			coefficient:  { type: 'number' },
		},
		fkRelations: {
			course:            { code: 'course',            required: true, multiple: false },
			term:              { code: 'term',              required: true, multiple: false },
			assignment_status: { code: 'assignment_status', required: true, multiple: false },
		},
		template: { presentation: 'course title due_date max_score' },
	},

	grade: {
		base: 'machine_base',
		fields: {
			id:         { type: 'id',     readonly: true },
			code:       { type: 'text',   required: true },
			score:      { type: 'number', required: true },
			comment:    { type: 'text-lg' },
			graded_at:  { type: 'date' },
		},
		fkRelations: {
			assignment: { code: 'assignment', required: true, multiple: false },
			student:    { code: 'student',    required: true, multiple: false },
			teacher:    { code: 'teacher',    required: false, multiple: false },
		},
		template: { presentation: 'assignment student score graded_at' },
	},

	report_card: {
		base: 'machine_base',
		fields: {
			id:           { type: 'id',     readonly: true },
			code:         { type: 'text',   required: true },
			avg_score:    { type: 'number' },
			rank:         { type: 'number' },
			class_avg:    { type: 'number' },
			comment:      { type: 'text-lg' },
			issued_at:    { type: 'date' },
			pdf:          { type: 'url' },
		},
		fkRelations: {
			student: { code: 'student', required: true, multiple: false },
			term:    { code: 'term',    required: true, multiple: false },
		},
		template: { presentation: 'student term avg_score rank' },
	},

	// ── Communication ─────────────────────────────────────────────────────────

	message: {
		base: 'machine_base',
		fields: {
			id:         { type: 'id',     readonly: true },
			code:       { type: 'text',   required: true },
			subject:    { type: 'text',   required: true },
			body:       { type: 'text-lg', required: true },
			sent_at:    { type: 'date',   required: true },
			read_at:    { type: 'date' },
			attachment: { type: 'url' },
		},
		fkRelations: {
			from_staff:    { code: 'staff',    required: false, multiple: false },
			from_teacher:  { code: 'teacher',  required: false, multiple: false },
			to_student:    { code: 'student',  required: false, multiple: false },
			to_guardian:   { code: 'guardian', required: false, multiple: false },
		},
		template: { presentation: 'subject sent_at from_teacher to_student' },
	},
};
