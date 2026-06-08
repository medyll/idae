import type { MachineModel } from '../../../../src/lib/types/machine-model.js';

export const iotScheme: MachineModel = {

	// ── Statuts / Types ───────────────────────────────────────────────────────

	device_status: {
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

	alert_status: {
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

	severity: {
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

	device_type: {
		base: 'machine_base',
		isType: true,
		fields: {
			id:           { type: 'id',   readonly: true },
			code:         { type: 'text', required: true },
			name:         { type: 'text', required: true },
			manufacturer: { type: 'text' },
			ordre:        { type: 'number' },
		},
		fks: {},
		template: { presentation: 'name manufacturer' },
	},

	sensor_type: {
		base: 'machine_base',
		isType: true,
		fields: {
			id:    { type: 'id',   readonly: true },
			code:  { type: 'text', required: true },
			name:  { type: 'text', required: true },
			unit:  { type: 'text' },
			min_value: { type: 'number' },
			max_value: { type: 'number' },
		},
		fks: {},
		template: { presentation: 'name unit' },
	},

	command_status: {
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

	// ── Topologie ─────────────────────────────────────────────────────────────

	site: {
		base: 'machine_base',
		fields: {
			id:        { type: 'id',     readonly: true },
			code:      { type: 'text',   required: true },
			name:      { type: 'text',   required: true },
			address:   { type: 'text' },
			city:      { type: 'text' },
			country:   { type: 'text' },
			latitude:  { type: 'number' },
			longitude: { type: 'number' },
			timezone:  { type: 'text' },
		},
		fks: {},
		template: { presentation: 'name city country' },
	},

	zone: {
		base: 'machine_base',
		fields: {
			id:          { type: 'id',     readonly: true },
			code:        { type: 'text',   required: true },
			name:        { type: 'text',   required: true },
			description: { type: 'text-lg' },
			floor:       { type: 'number' },
		},
		fks: {
			site:   { code: 'site', required: true,  multiple: false },
			parent: { code: 'zone', required: false, multiple: false },
		},
		template: { presentation: 'site name floor' },
	},

	gateway: {
		base: 'machine_base',
		fields: {
			id:           { type: 'id',     readonly: true },
			code:         { type: 'text',   required: true },
			name:         { type: 'text',   required: true },
			mac_address:  { type: 'text' },
			ip_address:   { type: 'text' },
			protocol:     { type: 'text' },
			last_seen_at: { type: 'date' },
		},
		fks: {
			site:          { code: 'site',          required: true, multiple: false },
			device_status: { code: 'device_status', required: true, multiple: false },
		},
		template: { presentation: 'name site protocol device_status' },
	},

	// ── Firmware ──────────────────────────────────────────────────────────────

	firmware: {
		base: 'machine_base',
		fields: {
			id:          { type: 'id',     readonly: true },
			code:        { type: 'text',   required: true },
			name:        { type: 'text',   required: true },
			version:     { type: 'text',   required: true },
			url:         { type: 'url' },
			size_bytes:  { type: 'number' },
			checksum:    { type: 'text' },
			released_at: { type: 'date' },
			changelog:   { type: 'text-lg' },
		},
		fks: {
			device_type: { code: 'device_type', required: true, multiple: false },
		},
		template: { presentation: 'device_type version released_at' },
	},

	// ── Devices & sensors ─────────────────────────────────────────────────────

	device: {
		base: 'machine_base',
		fields: {
			id:             { type: 'id',     readonly: true },
			code:           { type: 'text',   required: true },
			name:           { type: 'text',   required: true },
			serial_number:  { type: 'text',   required: true },
			mac_address:    { type: 'text' },
			battery_pct:    { type: 'number' },
			signal_dbm:     { type: 'number' },
			installed_at:   { type: 'date' },
			last_seen_at:   { type: 'date' },
			latitude:       { type: 'number' },
			longitude:      { type: 'number' },
		},
		fks: {
			device_type:      { code: 'device_type',   required: true,  multiple: false },
			zone:             { code: 'zone',          required: false, multiple: false },
			gateway:          { code: 'gateway',       required: false, multiple: false },
			device_status:    { code: 'device_status', required: true,  multiple: false },
			current_firmware: { code: 'firmware',      required: false, multiple: false },
		},
		template: { presentation: 'name serial_number device_type device_status last_seen_at' },
	},

	sensor: {
		base: 'machine_base',
		fields: {
			id:             { type: 'id',     readonly: true },
			code:           { type: 'text',   required: true },
			name:           { type: 'text',   required: true },
			channel:        { type: 'text' },
			calibration_offset:{ type: 'number' },
			sampling_sec:   { type: 'number' },
			active:         { type: 'boolean' },
		},
		fks: {
			device:      { code: 'device',      required: true, multiple: false },
			sensor_type: { code: 'sensor_type', required: true, multiple: false },
		},
		template: { presentation: 'device name sensor_type sampling_sec' },
	},

	// ── Télémétrie (time-series volume) ───────────────────────────────────────

	reading: {
		base: 'machine_base',
		fields: {
			id:           { type: 'id',     readonly: true },
			code:         { type: 'text',   required: true },
			value:        { type: 'number', required: true },
			recorded_at:  { type: 'date',   required: true },
			quality:      { type: 'number' },
		},
		fks: {
			sensor: { code: 'sensor', required: true, multiple: false },
			device: { code: 'device', required: true, multiple: false },
		},
		template: { presentation: 'sensor value recorded_at' },
	},

	reading_rollup: {
		base: 'machine_base',
		fields: {
			id:          { type: 'id',     readonly: true },
			code:        { type: 'text',   required: true },
			bucket:      { type: 'text',   required: true },
			bucket_start:{ type: 'date',   required: true },
			min_value:   { type: 'number' },
			max_value:   { type: 'number' },
			avg_value:   { type: 'number' },
			sum_value:   { type: 'number' },
			sample_count:{ type: 'number' },
		},
		fks: {
			sensor: { code: 'sensor', required: true, multiple: false },
		},
		template: { presentation: 'sensor bucket bucket_start avg_value sample_count' },
	},

	// ── Règles & alertes ──────────────────────────────────────────────────────

	alert_rule: {
		base: 'machine_base',
		fields: {
			id:            { type: 'id',     readonly: true },
			code:          { type: 'text',   required: true },
			name:          { type: 'text',   required: true },
			operator:      { type: 'text',   required: true },
			threshold:     { type: 'number', required: true },
			threshold_high:{ type: 'number' },
			window_sec:    { type: 'number' },
			cooldown_sec:  { type: 'number' },
			enabled:       { type: 'boolean' },
			message_template:{ type: 'text-lg' },
		},
		fks: {
			sensor_type: { code: 'sensor_type', required: false, multiple: false },
			sensor:      { code: 'sensor',      required: false, multiple: false },
			device:      { code: 'device',      required: false, multiple: false },
			severity:    { code: 'severity',    required: true,  multiple: false },
		},
		template: { presentation: 'name operator threshold severity enabled' },
	},

	alert: {
		base: 'machine_base',
		fields: {
			id:             { type: 'id',     readonly: true },
			code:           { type: 'text',   required: true },
			name:           { type: 'text',   required: true },
			message:        { type: 'text-lg' },
			triggered_value:{ type: 'number' },
			triggered_at:   { type: 'date',   required: true },
			acknowledged_at:{ type: 'date' },
			resolved_at:    { type: 'date' },
		},
		fks: {
			alert_rule:   { code: 'alert_rule',   required: true,  multiple: false },
			device:       { code: 'device',       required: true,  multiple: false },
			sensor:       { code: 'sensor',       required: false, multiple: false },
			severity:     { code: 'severity',     required: true,  multiple: false },
			alert_status: { code: 'alert_status', required: true,  multiple: false },
		},
		template: { presentation: 'name device severity alert_status triggered_at' },
	},

	// ── Commandes downlink ────────────────────────────────────────────────────

	command: {
		base: 'machine_base',
		fields: {
			id:          { type: 'id',     readonly: true },
			code:        { type: 'text',   required: true },
			name:        { type: 'text',   required: true },
			payload:     { type: 'text-lg' },
			issued_at:   { type: 'date',   required: true },
			sent_at:     { type: 'date' },
			acked_at:    { type: 'date' },
		},
		fks: {
			device:         { code: 'device',         required: true, multiple: false },
			command_status: { code: 'command_status', required: true, multiple: false },
		},
		template: { presentation: 'device name command_status issued_at' },
	},

	maintenance_log: {
		base: 'machine_base',
		fields: {
			id:          { type: 'id',     readonly: true },
			code:        { type: 'text',   required: true },
			name:        { type: 'text',   required: true },
			kind:        { type: 'text' },
			description: { type: 'text-lg' },
			performed_at:{ type: 'date',   required: true },
			technician:  { type: 'text' },
		},
		fks: {
			device: { code: 'device', required: true, multiple: false },
		},
		template: { presentation: 'device kind performed_at technician' },
	},
};
