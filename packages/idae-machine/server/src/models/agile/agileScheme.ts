import type { MachineModel } from '../../../../src/lib/types/machine-model.js';

export const agileScheme: MachineModel = {

	// ── Statuts / Types ───────────────────────────────────────────────────────

	project_status: {
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

	sprint_status: {
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

	story_status: {
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

	task_status: {
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

	bug_status: {
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

	bug_severity: {
		base: 'machine_base',
		isGroup: true,
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

	priority: {
		base: 'machine_base',
		isGroup: true,
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

	member_role: {
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

	milestone_status: {
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

	// ── Acteurs ───────────────────────────────────────────────────────────────

	team_member: {
		base: 'machine_base',
		fields: {
			id:       { type: 'id',    readonly: true },
			code:     { type: 'text',  required: true },
			name:     { type: 'text',  required: true },
			handle:   { type: 'text' },
			email:    { type: 'email', required: true },
			avatar:   { type: 'image' },
			capacity_hours_week: { type: 'number' },
			active:   { type: 'boolean' },
		},
		fks: {},
		template: { presentation: 'name handle email' },
	},

	// ── Projet ────────────────────────────────────────────────────────────────

	project: {
		base: 'machine_base',
		fields: {
			id:          { type: 'id',      readonly: true },
			code:        { type: 'text',    required: true },
			name:        { type: 'text',    required: true },
			slug:        { type: 'text',    required: true },
			description: { type: 'text-lg' },
			icon:        { type: 'image' },
			color:       { type: 'text' },
			started_at:  { type: 'date' },
			ended_at:    { type: 'date' },
		},
		fks: {
			project_status: { code: 'project_status', required: true,  multiple: false },
			lead:           { code: 'team_member',    required: false, multiple: false },
		},
		template: { presentation: 'name code project_status lead' },
	},

	project_member: {
		base: 'machine_base',
		fields: {
			id:        { type: 'id',   readonly: true },
			code:      { type: 'text', required: true },
			joined_at: { type: 'date' },
		},
		fks: {
			project:     { code: 'project',     required: true, multiple: false },
			team_member: { code: 'team_member', required: true, multiple: false },
			member_role: { code: 'member_role', required: true, multiple: false },
		},
		template: { presentation: 'project team_member member_role' },
	},

	label: {
		base: 'machine_base',
		fields: {
			id:    { type: 'id',   readonly: true },
			code:  { type: 'text', required: true },
			name:  { type: 'text', required: true },
			color: { type: 'text' },
		},
		fks: {
			project: { code: 'project', required: true, multiple: false },
		},
		template: { presentation: 'project name color' },
	},

	// ── Hiérarchie produit ────────────────────────────────────────────────────

	epic: {
		base: 'machine_base',
		fields: {
			id:          { type: 'id',      readonly: true },
			code:        { type: 'text',    required: true },
			name:        { type: 'text',    required: true },
			slug:        { type: 'text' },
			description: { type: 'text-lg' },
			ordre:       { type: 'number' },
			target_date: { type: 'date' },
		},
		fks: {
			project:      { code: 'project',      required: true,  multiple: false },
			story_status: { code: 'story_status', required: true,  multiple: false },
			owner:        { code: 'team_member',  required: false, multiple: false },
			priority:     { code: 'priority',     required: false, multiple: false },
		},
		template: { presentation: 'project name story_status owner priority' },
	},

	milestone: {
		base: 'machine_base',
		fields: {
			id:           { type: 'id',      readonly: true },
			code:         { type: 'text',    required: true },
			name:         { type: 'text',    required: true },
			description:  { type: 'text-lg' },
			due_date:     { type: 'date',    required: true },
			completed_at: { type: 'date' },
		},
		fks: {
			project:          { code: 'project',          required: true, multiple: false },
			milestone_status: { code: 'milestone_status', required: true, multiple: false },
		},
		template: { presentation: 'project name due_date milestone_status' },
	},

	release: {
		base: 'machine_base',
		fields: {
			id:            { type: 'id',      readonly: true },
			code:          { type: 'text',    required: true },
			name:          { type: 'text',    required: true },
			version:       { type: 'text',    required: true },
			notes:         { type: 'text-lg' },
			planned_at:    { type: 'date' },
			released_at:   { type: 'date' },
		},
		fks: {
			project: { code: 'project', required: true, multiple: false },
		},
		template: { presentation: 'project version released_at' },
	},

	// ── Sprints ───────────────────────────────────────────────────────────────

	sprint: {
		base: 'machine_base',
		fields: {
			id:         { type: 'id',      readonly: true },
			code:       { type: 'text',    required: true },
			name:       { type: 'text',    required: true },
			number:     { type: 'number' },
			goal:       { type: 'text-lg' },
			start_date: { type: 'date',    required: true },
			end_date:   { type: 'date',    required: true },
			capacity_points: { type: 'number' },
		},
		fks: {
			project:       { code: 'project',       required: true, multiple: false },
			sprint_status: { code: 'sprint_status', required: true, multiple: false },
		},
		template: { presentation: 'project number name sprint_status start_date end_date' },
	},

	// ── Backlog ───────────────────────────────────────────────────────────────

	story: {
		base: 'machine_base',
		fields: {
			id:                  { type: 'id',      readonly: true },
			code:                { type: 'text',    required: true },
			name:                { type: 'text',    required: true },
			title:               { type: 'text',    required: true },
			description:         { type: 'text-lg' },
			acceptance_criteria: { type: 'text-lg' },
			story_points:        { type: 'number' },
			estimate_hours:      { type: 'number' },
			ordre:               { type: 'number' },
			created_at:          { type: 'date' },
			started_at:          { type: 'date' },
			completed_at:        { type: 'date' },
			due_date:            { type: 'date' },
		},
		fks: {
			project:      { code: 'project',      required: true,  multiple: false },
			epic:         { code: 'epic',         required: false, multiple: false },
			sprint:       { code: 'sprint',       required: false, multiple: false },
			story_status: { code: 'story_status', required: true,  multiple: false },
			priority:     { code: 'priority',     required: false, multiple: false },
			assignee:     { code: 'team_member',  required: false, multiple: false },
			reporter:     { code: 'team_member',  required: false, multiple: false },
			milestone:    { code: 'milestone',    required: false, multiple: false },
			release:      { code: 'release',      required: false, multiple: false },
		},
		template: { presentation: 'code title story_status assignee story_points sprint' },
	},

	story_label: {
		base: 'machine_base',
		fields: {
			id:   { type: 'id',   readonly: true },
			code: { type: 'text', required: true },
		},
		fks: {
			story: { code: 'story', required: true, multiple: false },
			label: { code: 'label', required: true, multiple: false },
		},
		template: { presentation: 'story label' },
	},

	task: {
		base: 'machine_base',
		fields: {
			id:             { type: 'id',      readonly: true },
			code:           { type: 'text',    required: true },
			name:           { type: 'text',    required: true },
			title:          { type: 'text',    required: true },
			description:    { type: 'text-lg' },
			estimate_hours: { type: 'number' },
			actual_hours:   { type: 'number' },
			ordre:          { type: 'number' },
			due_date:       { type: 'date' },
			completed_at:   { type: 'date' },
		},
		fks: {
			story:       { code: 'story',       required: true,  multiple: false },
			task_status: { code: 'task_status', required: true,  multiple: false },
			assignee:    { code: 'team_member', required: false, multiple: false },
		},
		template: { presentation: 'story title task_status assignee estimate_hours' },
	},

	// ── Bugs ──────────────────────────────────────────────────────────────────

	bug: {
		base: 'machine_base',
		fields: {
			id:                 { type: 'id',      readonly: true },
			code:               { type: 'text',    required: true },
			name:               { type: 'text',    required: true },
			title:              { type: 'text',    required: true },
			description:        { type: 'text-lg' },
			steps_to_reproduce: { type: 'text-lg' },
			expected_behavior:  { type: 'text-lg' },
			actual_behavior:    { type: 'text-lg' },
			environment:        { type: 'text' },
			reported_at:        { type: 'date',    required: true },
			resolved_at:        { type: 'date' },
		},
		fks: {
			project:      { code: 'project',      required: true,  multiple: false },
			bug_status:   { code: 'bug_status',   required: true,  multiple: false },
			bug_severity: { code: 'bug_severity', required: true,  multiple: false },
			priority:     { code: 'priority',     required: false, multiple: false },
			assignee:     { code: 'team_member',  required: false, multiple: false },
			reporter:     { code: 'team_member',  required: false, multiple: false },
			story:        { code: 'story',        required: false, multiple: false },
			release:      { code: 'release',      required: false, multiple: false },
		},
		template: { presentation: 'code title bug_status bug_severity assignee' },
	},

	// ── Suivi temps & engagement ──────────────────────────────────────────────

	worklog: {
		base: 'machine_base',
		fields: {
			id:          { type: 'id',      readonly: true },
			code:        { type: 'text',    required: true },
			hours:       { type: 'number',  required: true },
			work_date:   { type: 'date',    required: true },
			description: { type: 'text-lg' },
		},
		fks: {
			team_member: { code: 'team_member', required: true,  multiple: false },
			story:       { code: 'story',       required: false, multiple: false },
			task:        { code: 'task',        required: false, multiple: false },
			bug:         { code: 'bug',         required: false, multiple: false },
		},
		template: { presentation: 'team_member work_date hours story task bug' },
	},

	comment: {
		base: 'machine_base',
		fields: {
			id:         { type: 'id',      readonly: true },
			code:       { type: 'text',    required: true },
			body:       { type: 'text-lg', required: true },
			created_at: { type: 'date',    required: true },
			edited_at:  { type: 'date' },
		},
		fks: {
			team_member: { code: 'team_member', required: true,  multiple: false },
			story:       { code: 'story',       required: false, multiple: false },
			task:        { code: 'task',        required: false, multiple: false },
			bug:         { code: 'bug',         required: false, multiple: false },
			epic:        { code: 'epic',        required: false, multiple: false },
		},
		template: { presentation: 'team_member created_at story task bug' },
	},

	attachment: {
		base: 'machine_base',
		fields: {
			id:          { type: 'id',     readonly: true },
			code:        { type: 'text',   required: true },
			filename:    { type: 'text',   required: true },
			url:         { type: 'url',    required: true },
			mime:        { type: 'text' },
			size_bytes:  { type: 'number' },
			uploaded_at: { type: 'date' },
		},
		fks: {
			team_member: { code: 'team_member', required: true,  multiple: false },
			story:       { code: 'story',       required: false, multiple: false },
			task:        { code: 'task',        required: false, multiple: false },
			bug:         { code: 'bug',         required: false, multiple: false },
		},
		template: { presentation: 'filename mime size_bytes uploaded_at' },
	},
};
