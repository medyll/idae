import type { MachineModel } from '../../../../src/lib/types/machine-model.js';

/**
 * jobber — email-sourced job matching.
 *
 * Pivot model (see D:/development/jobber/NEXT.md): job offers are harvested from
 * the mailbox (LinkedIn/Indeed/WTTJ/Glassdoor alert digests, recruiter mails),
 * scored against a fixed resume profile, then surfaced/triaged in the GUI.
 * No resume rewriting, no auto-apply.
 *
 * Data flow:
 *   resume → profile (parsed once)
 *   mailbox → email_message → job (1..N per email) → match_result (score/gaps)
 *   user triage → job.status + job_event timeline
 */
export const jobberScheme: MachineModel = {

	// ── Référentiels ────────────────────────────────────────────────────────

	job_status: {
		base: 'machine_base',
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

	job_source: {
		base: 'machine_base',
		isType: true,
		fields: {
			id:     { type: 'id',   readonly: true },
			code:   { type: 'text', required: true },   // linkedin | indeed | wttj | glassdoor | recruiter | other
			name:   { type: 'text', required: true },
			domain: { type: 'text' },                   // sender domain of the alert digest
		},
		fkRelations: {},
		template: { presentation: 'name domain' },
	},

	contract_type: {
		base: 'machine_base',
		isType: true,
		fields: {
			id:   { type: 'id',   readonly: true },
			code: { type: 'text', required: true },     // cdi | cdd | freelance | internship | apprenticeship | temp
			name: { type: 'text', required: true },
		},
		fkRelations: {},
		template: { presentation: 'name code' },
	},

	seniority: {
		base: 'machine_base',
		isType: true,
		fields: {
			id:    { type: 'id',   readonly: true },
			code:  { type: 'text', required: true },    // junior | mid | senior | lead | principal
			name:  { type: 'text', required: true },
			ordre: { type: 'number' },
		},
		fkRelations: {},
		template: { presentation: 'name code' },
	},

	match_method: {
		base: 'machine_base',
		isType: true,
		fields: {
			id:   { type: 'id',   readonly: true },
			code: { type: 'text', required: true },     // ollama | embeddings | keyword
			name: { type: 'text', required: true },
		},
		fkRelations: {},
		template: { presentation: 'name code' },
	},

	skill_kind: {
		base: 'machine_base',
		isType: true,
		fields: {
			id:   { type: 'id',   readonly: true },
			code: { type: 'text', required: true },     // required | matched | missing | detected
			name: { type: 'text', required: true },
		},
		fkRelations: {},
		template: { presentation: 'name code' },
	},

	event_type: {
		base: 'machine_base',
		isType: true,
		fields: {
			id:   { type: 'id',   readonly: true },
			code: { type: 'text', required: true },     // status_change | note | applied | interview | follow_up | rejected | offer
			name: { type: 'text', required: true },
		},
		fkRelations: {},
		template: { presentation: 'name code' },
	},

	// ── Taxonomie ───────────────────────────────────────────────────────────

	skill: {
		base: 'machine_base',
		fields: {
			id:       { type: 'id',   readonly: true },
			code:     { type: 'text', required: true }, // canonical slug, e.g. "typescript"
			name:     { type: 'text', required: true }, // display, e.g. "TypeScript"
			category: { type: 'text' },                 // language | framework | cloud | data | soft | ...
			aliases:  { type: 'text-lg' },              // comma-separated variants for matcher
		},
		fkRelations: {},
		template: { presentation: 'name category' },
	},

	company: {
		base: 'machine_base',
		fields: {
			id:       { type: 'id',   readonly: true },
			code:     { type: 'text', required: true },
			name:     { type: 'text', required: true },
			website:  { type: 'url' },
			domain:   { type: 'text' },
			location: { type: 'text' },
			logo:     { type: 'image' },
		},
		fkRelations: {},
		template: { presentation: 'name location' },
	},

	// ── Candidat ────────────────────────────────────────────────────────────

	profile: {
		base: 'machine_base',
		fields: {
			id:               { type: 'id',      readonly: true },
			code:             { type: 'text',    required: true },
			name:             { type: 'text',    required: true },
			full_name:        { type: 'text' },
			headline:         { type: 'text' },                   // target role / one-liner
			email:            { type: 'email' },
			phone:            { type: 'phone' },
			location:         { type: 'text' },
			linkedin:         { type: 'url' },
			github:           { type: 'url' },
			website:          { type: 'url' },
			summary:          { type: 'text-lg' },                // parsed objective/profile section
			years_experience: { type: 'number' },
			resume_file:      { type: 'url' },                    // source resume PDF/Docx
			raw_text:         { type: 'text-long' },              // full extracted resume text
			parsed_at:        { type: 'datetime' },
			active:           { type: 'boolean' },                // the profile used for scoring
		},
		fkRelations: {},
		template: { presentation: 'full_name headline email' },
	},

	profile_skill: {
		base: 'machine_base',
		fields: {
			id:    { type: 'id',   readonly: true },
			code:  { type: 'text', required: true },
			level: { type: 'number' },                  // optional self-rated 0-5
			years: { type: 'number' },
		},
		fkRelations: {
			profile: { code: 'profile', required: true, multiple: false },
			skill:   { code: 'skill',   required: true, multiple: false },
		},
		template: { presentation: 'profile skill level' },
	},

	// ── Source mailbox ──────────────────────────────────────────────────────

	email_message: {
		base: 'machine_base',
		fields: {
			id:            { type: 'id',      readonly: true },
			code:          { type: 'text',    required: true },  // = message_id (dedupe key)
			message_id:    { type: 'text',    required: true },  // IMAP Message-ID, unique
			folder:        { type: 'text' },                     // mailbox folder/label
			sender:        { type: 'email' },
			sender_domain: { type: 'text' },
			subject:       { type: 'text-lg' },
			received_at:   { type: 'datetime' },
			processed:     { type: 'boolean' },                  // extractor has run on this msg
			job_count:     { type: 'number' },                   // postings extracted from this digest
		},
		fkRelations: {
			job_source: { code: 'job_source', required: false, multiple: false },
		},
		template: { presentation: 'subject sender received_at' },
	},

	// ── Offres ──────────────────────────────────────────────────────────────

	job: {
		base: 'machine_base',
		fields: {
			id:            { type: 'id',      readonly: true },
			code:          { type: 'text',    required: true },  // stable key (link hash / board id)
			name:          { type: 'text',    required: true },
			title:         { type: 'text',    required: true },
			location:      { type: 'text' },
			remote:        { type: 'boolean' },
			link:          { type: 'url',     required: true },  // canonical posting URL, dedupe (UNIFY jobs.url)
			message_id:    { type: 'text' },                     // source email id, denormalized dedupe (UNIFY jobs.message_id)
			description:   { type: 'text-long' },                // raw snippet from the email
			salary_min:    { type: 'currency' },
			salary_max:    { type: 'currency' },
			salary_period: { type: 'text' },                     // year | month | day
			posted_at:     { type: 'date' },                     // as stated in the posting
			discovered_at: { type: 'datetime' },                 // when harvested from mailbox (UNIFY jobs.found_at)
			deadline:      { type: 'date' },
			score:         { type: 'number' },                   // latest fit score 0..1 (UNIFY) — denormalized for sort
			gaps:          { type: 'text-long' },                // latest missing-skills JSON, denormalized (UNIFY jobs.gaps); detail in match_result/job_skill
			favorite:      { type: 'boolean' },
			notes:         { type: 'text-lg' },                  // user annotation
		},
		fkRelations: {
			company:       { code: 'company',       required: false, multiple: false },
			job_source:    { code: 'job_source',    required: false, multiple: false },
			contract_type: { code: 'contract_type', required: false, multiple: false },
			seniority:     { code: 'seniority',     required: false, multiple: false },
			job_status:    { code: 'job_status',    required: true,  multiple: false },
			email_message: { code: 'email_message', required: false, multiple: false },
		},
		template: { presentation: 'title company score job_status' },
	},

	match_result: {
		base: 'machine_base',
		fields: {
			id:         { type: 'id',      readonly: true },
			code:       { type: 'text',    required: true },
			score:      { type: 'number',  required: true },     // fit 0..1 (UNIFY)
			model:      { type: 'text' },                        // e.g. mistral / all-MiniLM-L6-v2
			summary:    { type: 'text-lg' },                     // one-line assessment
			strengths:  { type: 'text-lg' },                     // bullet points
			gaps:       { type: 'text-lg' },                     // bullet points
			created_at: { type: 'datetime' },
		},
		fkRelations: {
			job:          { code: 'job',          required: true,  multiple: false },
			profile:      { code: 'profile',      required: false, multiple: false },
			match_method: { code: 'match_method', required: false, multiple: false },
		},
		template: { presentation: 'job score match_method created_at' },
	},

	job_skill: {
		base: 'machine_base',
		fields: {
			id:   { type: 'id',   readonly: true },
			code: { type: 'text', required: true },
		},
		fkRelations: {
			job:        { code: 'job',        required: true,  multiple: false },
			skill:      { code: 'skill',      required: true,  multiple: false },
			skill_kind: { code: 'skill_kind', required: true,  multiple: false },  // required | matched | missing | detected
		},
		template: { presentation: 'job skill skill_kind' },
	},

	job_event: {
		base: 'machine_base',
		fields: {
			id:         { type: 'id',      readonly: true },
			code:       { type: 'text',    required: true },
			at:         { type: 'datetime', required: true },
			note:       { type: 'text-lg' },
		},
		fkRelations: {
			job:         { code: 'job',        required: true,  multiple: false },
			event_type:  { code: 'event_type', required: true,  multiple: false },
			new_status:  { code: 'job_status', required: false, multiple: false },  // for status_change events
		},
		template: { presentation: 'at event_type job' },
	},
};

// ── Seed data ───────────────────────────────────────────────────────────────
// Real profile (Meddy Lebrun, from D:/profile/MEDDY_LEBRUN_CV.md) + referentials
// + skill taxonomy. NO fake job ads — real offers arrive via the email pipeline
// (UNIFY). Only two rows prefixed "TEST —" exist so UI lists aren't empty; safe
// to delete. Insertion order = referentials before dependents (FK = target id).

export const jobberSeed = {

	// ── Référentiels ────────────────────────────────────────────────────────

	job_status: [
		{ id: 1, code: 'new',         name: 'New',         ordre: 1 },  // UNIFY canonical
		{ id: 2, code: 'reviewed',    name: 'Reviewed',    ordre: 2 },
		{ id: 3, code: 'interesting', name: 'Interesting', ordre: 3 },  // triage extra
		{ id: 4, code: 'discarded',   name: 'Discarded',   ordre: 4 },  // triage extra
		{ id: 5, code: 'applied',     name: 'Applied',     ordre: 5 },
		{ id: 6, code: 'interview',   name: 'Interview',   ordre: 6 },
		{ id: 7, code: 'rejected',    name: 'Rejected',    ordre: 7 },
		{ id: 8, code: 'offer',       name: 'Offer',       ordre: 8 },
	],

	job_source: [
		{ id: 1, code: 'linkedin',  name: 'LinkedIn',              domain: 'linkedin.com' },
		{ id: 2, code: 'indeed',    name: 'Indeed',                domain: 'indeed.com' },
		{ id: 3, code: 'wttj',      name: 'Welcome to the Jungle', domain: 'welcometothejungle.com' },
		{ id: 4, code: 'glassdoor', name: 'Glassdoor',             domain: 'glassdoor.com' },
		{ id: 5, code: 'recruiter', name: 'Recruiter',             domain: '' },
		{ id: 6, code: 'other',     name: 'Other',                 domain: '' },
	],

	contract_type: [
		{ id: 1, code: 'cdi',            name: 'CDI' },
		{ id: 2, code: 'cdd',            name: 'CDD' },
		{ id: 3, code: 'freelance',      name: 'Freelance' },
		{ id: 4, code: 'internship',     name: 'Internship' },
		{ id: 5, code: 'apprenticeship', name: 'Apprenticeship' },
		{ id: 6, code: 'temp',           name: 'Temporary' },
	],

	seniority: [
		{ id: 1, code: 'junior',    name: 'Junior',    ordre: 1 },
		{ id: 2, code: 'mid',       name: 'Mid',       ordre: 2 },
		{ id: 3, code: 'senior',    name: 'Senior',    ordre: 3 },
		{ id: 4, code: 'lead',      name: 'Lead',      ordre: 4 },
		{ id: 5, code: 'principal', name: 'Principal', ordre: 5 },
	],

	match_method: [
		{ id: 1, code: 'ollama',     name: 'Ollama (LLM)' },
		{ id: 2, code: 'embeddings', name: 'Embeddings' },
		{ id: 3, code: 'keyword',    name: 'Keyword fallback' },
	],

	skill_kind: [
		{ id: 1, code: 'required', name: 'Required' },
		{ id: 2, code: 'matched',  name: 'Matched' },
		{ id: 3, code: 'missing',  name: 'Missing' },
		{ id: 4, code: 'detected', name: 'Detected' },
	],

	event_type: [
		{ id: 1, code: 'status_change', name: 'Status change' },
		{ id: 2, code: 'note',          name: 'Note' },
		{ id: 3, code: 'applied',       name: 'Applied' },
		{ id: 4, code: 'interview',     name: 'Interview' },
		{ id: 5, code: 'follow_up',     name: 'Follow-up' },
		{ id: 6, code: 'rejected',      name: 'Rejected' },
		{ id: 7, code: 'offer',         name: 'Offer' },
	],

	// ── Skill taxonomy (from CV) ──────────────────────────────────────────────

	skill: [
		{ id: 1,  code: 'typescript',   name: 'TypeScript',           category: 'language' },
		{ id: 2,  code: 'javascript',   name: 'JavaScript',           category: 'language', aliases: 'js, es6, ecmascript' },
		{ id: 3,  code: 'php',          name: 'PHP',                  category: 'language' },
		{ id: 4,  code: 'nodejs',       name: 'Node.js',              category: 'runtime',  aliases: 'node' },
		{ id: 5,  code: 'java',         name: 'Java',                 category: 'language',  aliases: 'j2ee' },
		{ id: 6,  code: 'go',           name: 'Go',                   category: 'language',  aliases: 'golang' },
		{ id: 7,  code: 'rust',         name: 'Rust',                 category: 'language' },
		{ id: 8,  code: 'python',       name: 'Python',               category: 'language' },
		{ id: 9,  code: 'react',        name: 'React',                category: 'frontend',  aliases: 'reactjs' },
		{ id: 10, code: 'svelte',       name: 'Svelte',               category: 'frontend',  aliases: 'sveltekit, svelte5' },
		{ id: 11, code: 'vuejs',        name: 'Vue.js',               category: 'frontend',  aliases: 'vue' },
		{ id: 12, code: 'angular',      name: 'Angular',              category: 'frontend' },
		{ id: 13, code: 'react-native', name: 'React Native',         category: 'frontend' },
		{ id: 14, code: 'nextjs',       name: 'Next.js',              category: 'frontend',  aliases: 'next' },
		{ id: 15, code: 'jquery',       name: 'jQuery',               category: 'frontend' },
		{ id: 16, code: 'html5',        name: 'HTML5',                category: 'frontend',  aliases: 'html' },
		{ id: 17, code: 'css3',         name: 'CSS3',                 category: 'frontend',  aliases: 'css' },
		{ id: 18, code: 'sass',         name: 'Sass',                 category: 'frontend',  aliases: 'scss, less' },
		{ id: 19, code: 'bootstrap',    name: 'Bootstrap',            category: 'frontend' },
		{ id: 20, code: 'symfony',      name: 'Symfony',              category: 'backend',   aliases: 'php-symfony' },
		{ id: 21, code: 'nestjs',       name: 'NestJS',               category: 'backend',   aliases: 'nest' },
		{ id: 22, code: 'express',      name: 'Express',              category: 'backend' },
		{ id: 23, code: 'laravel',      name: 'Laravel',              category: 'backend' },
		{ id: 24, code: 'mongodb',      name: 'MongoDB',              category: 'database',  aliases: 'mongo' },
		{ id: 25, code: 'mysql',        name: 'MySQL',                category: 'database' },
		{ id: 26, code: 'mariadb',      name: 'MariaDB',              category: 'database' },
		{ id: 27, code: 'postgresql',   name: 'PostgreSQL',           category: 'database',  aliases: 'postgres, pg' },
		{ id: 28, code: 'redis',        name: 'Redis',                category: 'database' },
		{ id: 29, code: 'db2',          name: 'DB2',                  category: 'database' },
		{ id: 30, code: 'oracle',       name: 'Oracle',               category: 'database' },
		{ id: 31, code: 'rabbitmq',     name: 'RabbitMQ',             category: 'messaging', aliases: 'rmq, amqp' },
		{ id: 32, code: 'socketio',     name: 'Socket.io',            category: 'messaging', aliases: 'websocket' },
		{ id: 33, code: 'aws',          name: 'AWS',                  category: 'cloud',     aliases: 'amazon web services, cognito' },
		{ id: 34, code: 'gcp',          name: 'Google Cloud Platform',category: 'cloud',     aliases: 'google cloud' },
		{ id: 35, code: 'docker',       name: 'Docker',               category: 'devops' },
		{ id: 36, code: 'jenkins',      name: 'Jenkins',              category: 'devops' },
		{ id: 37, code: 'ansible',      name: 'Ansible',              category: 'devops' },
		{ id: 38, code: 'nginx',        name: 'Nginx',                category: 'devops' },
		{ id: 39, code: 'apache',       name: 'Apache',               category: 'devops' },
		{ id: 40, code: 'git',          name: 'Git',                  category: 'devops',    aliases: 'gitlab, github' },
		{ id: 41, code: 'agile',        name: 'Agile',                category: 'method' },
		{ id: 42, code: 'scrum',        name: 'SCRUM',                category: 'method',    aliases: 'kanban' },
		{ id: 43, code: 'ddd',          name: 'Domain-Driven Design', category: 'method',    aliases: 'ddd, solid, mvc' },
		{ id: 44, code: 'langchain',    name: 'LangChain',            category: 'ai' },
		{ id: 45, code: 'ollama',       name: 'Ollama',               category: 'ai',        aliases: 'llm, anthropic, claude' },
	],

	// ── Candidat (real) ───────────────────────────────────────────────────────

	profile: [
		{
			id: 1,
			code: 'meddy-lebrun',
			name: 'Meddy Lebrun',
			full_name: 'Meddy Lebrun',
			headline: 'Lead Développeur Fullstack Senior',
			email: 'lebrun.meddy@proton.me',
			phone: '+33 6 88 09 61 40',
			location: '06300 Nice, France',
			github: 'https://github.com/medyll',
			summary: 'Lead développeur senior, dual-stack, concepteur frontend et backend utilisant des technologies actuelles et des interfaces riches. Solutions CRM et ERP en mode SaaS. Spécialiste React, HTML5, CSS3, JavaScript, PHP, Node.js, MySQL et MongoDB. Féru de nouvelles technologies, en veille constante.',
			years_experience: 25,
			resume_file: 'D:/profile/MEDDY_LEBRUN_CV.md',
			parsed_at: new Date('2026-06-13'),
			active: true,
		},
	],

	profile_skill: [
		{ id: 1,  code: 'ps-ts',     profile: 1, skill: 1,  level: 5, years: 8 },
		{ id: 2,  code: 'ps-js',     profile: 1, skill: 2,  level: 5, years: 24 },
		{ id: 3,  code: 'ps-php',    profile: 1, skill: 3,  level: 5, years: 22 },
		{ id: 4,  code: 'ps-node',   profile: 1, skill: 4,  level: 5, years: 12 },
		{ id: 5,  code: 'ps-react',  profile: 1, skill: 9,  level: 5, years: 9 },
		{ id: 6,  code: 'ps-svelte', profile: 1, skill: 10, level: 5, years: 5 },
		{ id: 7,  code: 'ps-next',   profile: 1, skill: 14, level: 4, years: 4 },
		{ id: 8,  code: 'ps-nest',   profile: 1, skill: 21, level: 4, years: 5 },
		{ id: 9,  code: 'ps-express',profile: 1, skill: 22, level: 5, years: 12 },
		{ id: 10, code: 'ps-symfony',profile: 1, skill: 20, level: 4, years: 6 },
		{ id: 11, code: 'ps-mongo',  profile: 1, skill: 24, level: 5, years: 14 },
		{ id: 12, code: 'ps-mysql',  profile: 1, skill: 25, level: 4, years: 20 },
		{ id: 13, code: 'ps-pg',     profile: 1, skill: 27, level: 4, years: 10 },
		{ id: 14, code: 'ps-socket', profile: 1, skill: 32, level: 5, years: 10 },
		{ id: 15, code: 'ps-docker', profile: 1, skill: 35, level: 4, years: 7 },
		{ id: 16, code: 'ps-aws',    profile: 1, skill: 33, level: 3, years: 4 },
		{ id: 17, code: 'ps-angular',profile: 1, skill: 12, level: 3, years: 3 },
		{ id: 18, code: 'ps-vue',    profile: 1, skill: 11, level: 3, years: 2 },
		{ id: 19, code: 'ps-ddd',    profile: 1, skill: 43, level: 5, years: 20 },
		{ id: 20, code: 'ps-agile',  profile: 1, skill: 41, level: 5, years: 15 },
	],

	// ── TEST fixtures (NOT real offers — safe to delete) ──────────────────────

	company: [
		{ id: 1, code: 'test-co', name: 'TEST Company', location: 'Remote' },
	],

	job: [
		{
			id: 1, code: 'test-job-1', name: 'TEST — Lead Frontend React',
			title: 'TEST — Lead Frontend React', location: 'Nice / Remote', remote: true,
			link: 'https://example.test/job/1', message_id: 'test-msg-1',
			description: 'TEST fixture. Lead a React/Next.js team building a SaaS dashboard. Safe to delete.',
			salary_min: 65000, salary_max: 80000, salary_period: 'year',
			discovered_at: new Date('2026-06-13'), score: 0.86,
			gaps: '["GraphQL exposure light"]',
			favorite: true, notes: 'TEST data — safe to delete',
			company: 1, job_source: 1, contract_type: 1, seniority: 4, job_status: 2,
		},
		{
			id: 2, code: 'test-job-2', name: 'TEST — Fullstack Node/Svelte',
			title: 'TEST — Fullstack Node/Svelte', location: 'Remote', remote: true,
			link: 'https://example.test/job/2', message_id: 'test-msg-2',
			description: 'TEST fixture. Fullstack role, Node + Svelte, offline-first. Safe to delete.',
			salary_min: 55000, salary_max: 70000, salary_period: 'year',
			discovered_at: new Date('2026-06-13'), score: 0.78,
			gaps: '["Kubernetes ops"]',
			favorite: false, notes: 'TEST data — safe to delete',
			company: 1, job_source: 3, contract_type: 3, seniority: 3, job_status: 1,
		},
	],

	match_result: [
		{ id: 1, code: 'mr-1', job: 1, profile: 1, match_method: 1, model: 'mistral', score: 0.86,
		  summary: 'Strong React/Next lead fit; minor GraphQL gap.',
		  strengths: 'React, Next.js, team lead, TypeScript',
		  gaps: 'GraphQL exposure light',
		  created_at: new Date('2026-06-13') },
		{ id: 2, code: 'mr-2', job: 2, profile: 1, match_method: 1, model: 'mistral', score: 0.78,
		  summary: 'Good fullstack Node/Svelte fit; ops/K8s lighter.',
		  strengths: 'Node.js, Svelte, Socket.io, offline-first',
		  gaps: 'Kubernetes ops',
		  created_at: new Date('2026-06-13') },
	],

	job_skill: [
		{ id: 1, code: 'js-1-react',  job: 1, skill: 9,  skill_kind: 2 },  // matched
		{ id: 2, code: 'js-1-next',   job: 1, skill: 14, skill_kind: 1 },  // required
		{ id: 3, code: 'js-1-ts',     job: 1, skill: 1,  skill_kind: 2 },  // matched
		{ id: 4, code: 'js-2-node',   job: 2, skill: 4,  skill_kind: 2 },  // matched
		{ id: 5, code: 'js-2-svelte', job: 2, skill: 10, skill_kind: 2 },  // matched
		{ id: 6, code: 'js-2-socket', job: 2, skill: 32, skill_kind: 4 },  // detected
	],

	job_event: [
		{ id: 1, code: 'je-1', job: 1, event_type: 1, new_status: 2, at: new Date('2026-06-13'), note: 'Auto-triaged to reviewed (score 0.86).' },
	],
};
