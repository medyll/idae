import type { MachineModel } from '../../../../src/lib/types/machine-model.js';

export const medbookScheme: MachineModel = {

	// ── Statuts / Types ───────────────────────────────────────────────────────

	appointment_status: {
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
		template: { presentation: 'name code ordre' },
	},

	consultation_status: {
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

	payment_status: {
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

	appointment_type: {
		base: 'machine_base',
		isType: true,
		fields: {
			id:           { type: 'id',       readonly: true },
			code:         { type: 'text',     required: true },
			name:         { type: 'text',     required: true },
			duration_min: { type: 'number' },
			default_fee:  { type: 'currency' },
			color:        { type: 'text' },
		},
		fkRelations: {},
		template: { presentation: 'name code duration_min default_fee' },
	},

	consultation_motive: {
		base: 'machine_base',
		isType: true,
		fields: {
			id:    { type: 'id',   readonly: true },
			code:  { type: 'text', required: true },
			name:  { type: 'text', required: true },
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

	insurance_provider: {
		base: 'machine_base',
		fields: {
			id:      { type: 'id',   readonly: true },
			code:    { type: 'text', required: true },
			name:    { type: 'text', required: true },
			phone:   { type: 'phone' },
			email:   { type: 'email' },
			website: { type: 'url' },
		},
		fkRelations: {},
		template: { presentation: 'name code' },
	},

	// ── Référentiel médical ───────────────────────────────────────────────────

	specialty: {
		base: 'machine_base',
		fields: {
			id:          { type: 'id',      readonly: true },
			code:        { type: 'text',    required: true },
			name:        { type: 'text',    required: true },
			slug:        { type: 'text' },
			description: { type: 'text-lg' },
			icon:        { type: 'image' },
		},
		fkRelations: {},
		template: { presentation: 'name code' },
	},

	act: {
		base: 'machine_base',
		fields: {
			id:           { type: 'id',       readonly: true },
			code:         { type: 'text',     required: true },
			name:         { type: 'text',     required: true },
			ngap_code:    { type: 'text' },
			fee:          { type: 'currency' },
			reimbursable: { type: 'boolean' },
		},
		fkRelations: {
			specialty: { code: 'specialty', required: false, multiple: false },
		},
		template: { presentation: 'ngap_code name fee specialty' },
	},

	// ── Etablissement ────────────────────────────────────────────────────────

	clinic: {
		base: 'machine_base',
		fields: {
			id:          { type: 'id',    readonly: true },
			code:        { type: 'text',  required: true },
			name:        { type: 'text',  required: true },
			slug:        { type: 'text' },
			address:     { type: 'text',  required: true },
			postal_code: { type: 'text',  required: true },
			city:        { type: 'text',  required: true },
			country:     { type: 'text' },
			phone:       { type: 'phone' },
			email:       { type: 'email' },
			website:     { type: 'url' },
			latitude:    { type: 'number' },
			longitude:   { type: 'number' },
			logo:        { type: 'image' },
			photo:       { type: 'image' },
		},
		fkRelations: {},
		template: { presentation: 'name city postal_code phone' },
	},

	room: {
		base: 'machine_base',
		fields: {
			id:        { type: 'id',     readonly: true },
			code:      { type: 'text',   required: true },
			name:      { type: 'text',   required: true },
			floor:     { type: 'number' },
			equipment: { type: 'text-lg' },
		},
		fkRelations: {
			clinic: { code: 'clinic', required: true, multiple: false },
		},
		template: { presentation: 'clinic name floor' },
	},

	// ── Praticiens ────────────────────────────────────────────────────────────

	practitioner: {
		base: 'machine_base',
		fields: {
			id:                { type: 'id',    readonly: true },
			code:              { type: 'text',  required: true },
			name:              { type: 'text',  required: true },
			first_name:        { type: 'text',  required: true },
			last_name:         { type: 'text',  required: true },
			honorific:         { type: 'text' },
			gender:            { type: 'text' },
			email:             { type: 'email' },
			phone:             { type: 'phone' },
			rpps_number:       { type: 'text' },
			adeli_number:      { type: 'text' },
			bio:               { type: 'text-lg' },
			languages_spoken:  { type: 'text' },
			online_booking:    { type: 'boolean' },
			accepts_new_patients: { type: 'boolean' },
			tier_1_sector:     { type: 'boolean' },
			photo:             { type: 'image' },
		},
		fkRelations: {
			primary_specialty: { code: 'specialty', required: true, multiple: false },
		},
		template: { presentation: 'honorific name primary_specialty rpps_number' },
	},

	practitioner_clinic: {
		base: 'machine_base',
		fields: {
			id:         { type: 'id',   readonly: true },
			code:       { type: 'text', required: true },
			is_primary: { type: 'boolean' },
			start_date: { type: 'date' },
			end_date:   { type: 'date' },
		},
		fkRelations: {
			practitioner: { code: 'practitioner', required: true, multiple: false },
			clinic:       { code: 'clinic',       required: true, multiple: false },
		},
		template: { presentation: 'practitioner clinic is_primary' },
	},

	practitioner_specialty: {
		base: 'machine_base',
		fields: {
			id:   { type: 'id',   readonly: true },
			code: { type: 'text', required: true },
		},
		fkRelations: {
			practitioner: { code: 'practitioner', required: true, multiple: false },
			specialty:    { code: 'specialty',    required: true, multiple: false },
		},
		template: { presentation: 'practitioner specialty' },
	},

	// ── Disponibilités ────────────────────────────────────────────────────────

	availability_slot: {
		base: 'machine_base',
		fields: {
			id:          { type: 'id',     readonly: true },
			code:        { type: 'text',   required: true },
			start_time:  { type: 'text',   required: true },
			end_time:    { type: 'text',   required: true },
			slot_minutes:{ type: 'number' },
			is_recurring:{ type: 'boolean' },
			valid_from:  { type: 'date' },
			valid_until: { type: 'date' },
		},
		fkRelations: {
			practitioner: { code: 'practitioner', required: true,  multiple: false },
			clinic:       { code: 'clinic',       required: false, multiple: false },
			day_of_week:  { code: 'day_of_week',  required: true,  multiple: false },
		},
		template: { presentation: 'practitioner day_of_week start_time end_time clinic' },
	},

	leave_period: {
		base: 'machine_base',
		fields: {
			id:         { type: 'id',     readonly: true },
			code:       { type: 'text',   required: true },
			name:       { type: 'text' },
			start_date: { type: 'date',   required: true },
			end_date:   { type: 'date',   required: true },
			reason:     { type: 'text' },
		},
		fkRelations: {
			practitioner: { code: 'practitioner', required: true, multiple: false },
		},
		template: { presentation: 'practitioner start_date end_date reason' },
	},

	// ── Patients ──────────────────────────────────────────────────────────────

	patient: {
		base: 'machine_base',
		fields: {
			id:                { type: 'id',    readonly: true },
			code:              { type: 'text',  required: true },
			name:              { type: 'text',  required: true },
			first_name:        { type: 'text',  required: true },
			last_name:         { type: 'text',  required: true },
			birth_date:        { type: 'date',  required: true },
			birth_place:       { type: 'text' },
			gender:            { type: 'text' },
			email:             { type: 'email' },
			phone:             { type: 'phone' },
			phone_mobile:      { type: 'phone' },
			address:           { type: 'text' },
			postal_code:       { type: 'text' },
			city:              { type: 'text' },
			country:           { type: 'text' },
			national_id:       { type: 'text' },
			social_security_no:{ type: 'text' },
			blood_type:        { type: 'text' },
			allergies:         { type: 'text-lg' },
			chronic_conditions:{ type: 'text-lg' },
			emergency_contact: { type: 'text' },
			emergency_phone:   { type: 'phone' },
			photo:             { type: 'image' },
			registered_at:     { type: 'date' },
		},
		fkRelations: {
			insurance_provider: { code: 'insurance_provider', required: false, multiple: false },
		},
		template: { presentation: 'last_name first_name birth_date phone' },
	},

	patient_document: {
		base: 'machine_base',
		fields: {
			id:           { type: 'id',     readonly: true },
			code:         { type: 'text',   required: true },
			name:         { type: 'text',   required: true },
			kind:         { type: 'text' },
			url:          { type: 'url',    required: true },
			mime:         { type: 'text' },
			size_bytes:   { type: 'number' },
			uploaded_at:  { type: 'date' },
			notes:        { type: 'text-lg' },
		},
		fkRelations: {
			patient: { code: 'patient', required: true, multiple: false },
		},
		template: { presentation: 'patient name kind uploaded_at' },
	},

	// ── Rendez-vous ───────────────────────────────────────────────────────────

	appointment: {
		base: 'machine_base',
		fields: {
			id:           { type: 'id',     readonly: true },
			code:         { type: 'text',   required: true },
			name:         { type: 'text' },
			scheduled_at: { type: 'date',   required: true },
			duration_min: { type: 'number', required: true },
			reason:       { type: 'text-lg' },
			notes:        { type: 'text-lg' },
			booked_online:{ type: 'boolean' },
			first_visit:  { type: 'boolean' },
			created_at:   { type: 'date' },
			confirmed_at: { type: 'date' },
			cancelled_at: { type: 'date' },
			reminder_sent_at: { type: 'date' },
		},
		fkRelations: {
			patient:            { code: 'patient',            required: true,  multiple: false },
			practitioner:       { code: 'practitioner',       required: true,  multiple: false },
			clinic:             { code: 'clinic',             required: false, multiple: false },
			room:               { code: 'room',               required: false, multiple: false },
			appointment_type:   { code: 'appointment_type',   required: true,  multiple: false },
			appointment_status: { code: 'appointment_status', required: true,  multiple: false },
		},
		template: { presentation: 'scheduled_at patient practitioner appointment_type appointment_status' },
	},

	// ── Dossier médical ───────────────────────────────────────────────────────

	consultation: {
		base: 'machine_base',
		fields: {
			id:             { type: 'id',       readonly: true },
			code:           { type: 'text',     required: true },
			consulted_at:   { type: 'date',     required: true },
			chief_complaint:{ type: 'text-lg' },
			history:        { type: 'text-lg' },
			examination:    { type: 'text-lg' },
			diagnosis:      { type: 'text-lg' },
			treatment_plan: { type: 'text-lg' },
			notes:          { type: 'text-lg' },
			follow_up_date: { type: 'date' },
			fee:            { type: 'currency' },
		},
		fkRelations: {
			patient:             { code: 'patient',             required: true,  multiple: false },
			practitioner:        { code: 'practitioner',        required: true,  multiple: false },
			appointment:         { code: 'appointment',         required: false, multiple: false },
			consultation_motive: { code: 'consultation_motive', required: false, multiple: false },
			consultation_status: { code: 'consultation_status', required: true,  multiple: false },
		},
		template: { presentation: 'consulted_at patient practitioner consultation_status' },
	},

	vital_record: {
		base: 'machine_base',
		fields: {
			id:               { type: 'id',     readonly: true },
			code:             { type: 'text',   required: true },
			measured_at:      { type: 'date',   required: true },
			weight_kg:        { type: 'number' },
			height_cm:        { type: 'number' },
			bmi:              { type: 'number' },
			blood_pressure_sys:{ type: 'number' },
			blood_pressure_dia:{ type: 'number' },
			heart_rate_bpm:   { type: 'number' },
			temperature_c:    { type: 'number' },
			oxygen_saturation:{ type: 'number' },
			notes:            { type: 'text-lg' },
		},
		fkRelations: {
			patient:      { code: 'patient',      required: true,  multiple: false },
			consultation: { code: 'consultation', required: false, multiple: false },
		},
		template: { presentation: 'patient measured_at weight_kg blood_pressure_sys heart_rate_bpm' },
	},

	prescription: {
		base: 'machine_base',
		fields: {
			id:          { type: 'id',     readonly: true },
			code:        { type: 'text',   required: true },
			issued_at:   { type: 'date',   required: true },
			valid_until: { type: 'date' },
			notes:       { type: 'text-lg' },
			pdf_url:     { type: 'url' },
		},
		fkRelations: {
			consultation: { code: 'consultation', required: true,  multiple: false },
			patient:      { code: 'patient',      required: true,  multiple: false },
			practitioner: { code: 'practitioner', required: true,  multiple: false },
		},
		template: { presentation: 'issued_at patient practitioner' },
	},

	prescription_item: {
		base: 'machine_base',
		fields: {
			id:           { type: 'id',     readonly: true },
			code:         { type: 'text',   required: true },
			drug_name:    { type: 'text',   required: true },
			dosage:       { type: 'text' },
			frequency:    { type: 'text' },
			duration_days:{ type: 'number' },
			route:        { type: 'text' },
			quantity:     { type: 'number' },
			instructions: { type: 'text-lg' },
		},
		fkRelations: {
			prescription: { code: 'prescription', required: true, multiple: false },
		},
		template: { presentation: 'prescription drug_name dosage frequency duration_days' },
	},

	consultation_act: {
		base: 'machine_base',
		fields: {
			id:       { type: 'id',       readonly: true },
			code:     { type: 'text',     required: true },
			quantity: { type: 'number' },
			fee:      { type: 'currency' },
		},
		fkRelations: {
			consultation: { code: 'consultation', required: true, multiple: false },
			act:          { code: 'act',          required: true, multiple: false },
		},
		template: { presentation: 'consultation act quantity fee' },
	},

	// ── Facturation ───────────────────────────────────────────────────────────

	invoice: {
		base: 'machine_base',
		fields: {
			id:           { type: 'id',       readonly: true },
			code:         { type: 'text',     required: true },
			invoice_number:{ type: 'text',    required: true },
			amount:       { type: 'currency', required: true },
			reimbursed:   { type: 'currency' },
			issued_at:    { type: 'date',     required: true },
			paid_at:      { type: 'date' },
			pdf_url:      { type: 'url' },
		},
		fkRelations: {
			consultation:   { code: 'consultation',   required: true, multiple: false },
			patient:        { code: 'patient',        required: true, multiple: false },
			payment_status: { code: 'payment_status', required: true, multiple: false },
		},
		template: { presentation: 'invoice_number patient amount payment_status issued_at' },
	},

	// ── Avis ──────────────────────────────────────────────────────────────────

	review: {
		base: 'machine_base',
		fields: {
			id:         { type: 'id',     readonly: true },
			code:       { type: 'text',   required: true },
			rating:     { type: 'number', required: true },
			comment:    { type: 'text-lg' },
			created_at: { type: 'date',   required: true },
			verified:   { type: 'boolean' },
		},
		fkRelations: {
			practitioner: { code: 'practitioner', required: true,  multiple: false },
			patient:      { code: 'patient',      required: false, multiple: false },
			appointment:  { code: 'appointment',  required: false, multiple: false },
		},
		template: { presentation: 'practitioner rating verified created_at' },
	},
};
