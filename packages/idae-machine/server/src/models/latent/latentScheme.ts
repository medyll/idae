import type { MachineModel } from '../../../../src/lib/types/machine-model.js';

/**
 * latent-line schema — relational expansion of D:\development\latent-line\ARCH.md.
 *
 * Expansion rules:
 *  - Arrays (timeline events, actors, references, outfits, audio_tracks) → own collections + FK.
 *  - Single embedded value-objects (camera, lighting, fx, controlnet, audio_reactive) → flattened
 *    into `frame` fields (1:1, normalizing them buys nothing).
 *  - resolution {w,h} → res_w / res_h.
 *  - Enums (mood, style, lighting type, controlnet type, resolution preset) → `text`
 *    (MachineModel has no select/options field type).
 */
export const latentScheme: MachineModel = {

	// ── Project ──────────────────────────────────────────────────────────────────
	project: {
		base: 'machine_base',
		fields: {
			id:    { type: 'id',     readonly: true },
			name:  { type: 'text',   required: true },
			fps:   { type: 'number', required: true },
			res_w: { type: 'number', required: true },
			res_h: { type: 'number', required: true },
		},
		fks: {},
		template: { presentation: 'name fps' },
	},

	// ── Assets · Characters ──────────────────────────────────────────────────────
	characters: {
		base: 'machine_base',
		fields: {
			id:       { type: 'id',   readonly: true },
			name:     { type: 'text', required: true },
			voice_id: { type: 'text' },
		},
		fks: {},
		template: { presentation: 'name voice_id' },
	},

	// character.references[] → { url, context, weight }
	character_reference: {
		base: 'machine_base',
		fields: {
			id:      { type: 'id',     readonly: true },
			url:     { type: 'text',   required: true },
			context: { type: 'text' },
			weight:  { type: 'number' },
		},
		fks: {
			character: { code: 'characters', multiple: false, required: true },
		},
		template: { presentation: 'context url weight' },
	},

	// character.outfits{} → { name, prompt, lora }
	outfit: {
		base: 'machine_base',
		fields: {
			id:     { type: 'id',   readonly: true },
			name:   { type: 'text', required: true },
			prompt: { type: 'text', required: true },
			lora:   { type: 'text' },
		},
		fks: {
			character: { code: 'characters', multiple: false, required: true },
		},
		template: { presentation: 'name prompt' },
	},

	// ── Assets · Environments ────────────────────────────────────────────────────
	environments: {
		base: 'machine_base',
		fields: {
			id:     { type: 'id',   readonly: true },
			prompt: { type: 'text', required: true },
			ref:    { type: 'text' },
		},
		fks: {},
		template: { presentation: 'prompt' },
	},

	// ── Assets · Audio ───────────────────────────────────────────────────────────
	audio: {
		base: 'machine_base',
		fields: {
			id:    { type: 'id',   readonly: true },
			url:   { type: 'text', required: true },
			label: { type: 'text' },
		},
		fks: {},
		template: { presentation: 'label url' },
	},

	// ── Timeline event ───────────────────────────────────────────────────────────
	timeline: {
		base: 'machine_base',
		fields: {
			id:       { type: 'id',     readonly: true },
			time:     { type: 'number', required: true },
			duration: { type: 'number' },
			notes:    { type: 'text' },
		},
		fks: {
			project: { code: 'project', multiple: false, required: true },
		},
		template: { presentation: 'time duration notes' },
	},

	// ── Timeline frame (1:1 with event) — embedded value-objects flattened ───────
	frame: {
		base: 'machine_base',
		fields: {
			id:                    { type: 'id',     readonly: true },
			prompt:                { type: 'text' },
			// camera
			camera_zoom:           { type: 'number' },
			camera_pan_x:          { type: 'number' },
			camera_pan_y:          { type: 'number' },
			camera_tilt:           { type: 'number' },
			// lighting
			lighting_type:         { type: 'text' },   // enum: dusk|daylight|studio|tungsten|ambient
			lighting_intensity:    { type: 'number' },
			// fx
			fx_bloom:              { type: 'number' },
			fx_motion_blur:        { type: 'number' },
			// controlnet
			controlnet_type:       { type: 'text' },   // enum: depth|...
			controlnet_strength:   { type: 'number' },
			// audio_reactive
			audio_reactive_target:   { type: 'text' },
			audio_reactive_param:    { type: 'text' },
			audio_reactive_strength: { type: 'number' },
		},
		fks: {
			timeline: { code: 'timeline', multiple: false, required: true },
		},
		template: { presentation: 'prompt lighting_type' },
	},

	// ── Frame · Actor[] ──────────────────────────────────────────────────────────
	actor: {
		base: 'machine_base',
		fields: {
			id:               { type: 'id',      readonly: true },
			action:           { type: 'text' },
			outfit:           { type: 'text' },   // outfit key (e.g. 'casual')
			pos_x:            { type: 'number' },
			pos_y:            { type: 'number' },
			pos_scale:        { type: 'number' },
			speech_text:      { type: 'text' },
			speech_mood:      { type: 'text' },   // enum: joyful|melancholic|anxious|serene|curious
			speech_style:     { type: 'text' },   // enum: whisper|shout|monotone|playful|formal
			speech_lip_sync:  { type: 'boolean' },
			speech_volume:    { type: 'number' },
		},
		fks: {
			frame:     { code: 'frame',      multiple: false, required: true },
			character: { code: 'characters', multiple: false, required: true },
		},
		template: { presentation: 'action speech_text' },
	},

	// ── Frame · audio_tracks[] ───────────────────────────────────────────────────
	frame_audio_track: {
		base: 'machine_base',
		fields: {
			id:       { type: 'id',     readonly: true },
			volume:   { type: 'number' },
			start_ms: { type: 'number' },
			fade_in:  { type: 'number' },
			loop:     { type: 'boolean' },
		},
		fks: {
			frame: { code: 'frame', multiple: false, required: true },
			audio: { code: 'audio', multiple: false, required: true },
		},
		template: { presentation: 'volume start_ms' },
	},

	// ── Markers ──────────────────────────────────────────────────────────────────
	markers: {
		base: 'machine_base',
		fields: {
			id:        { type: 'id',     readonly: true },
			time:      { type: 'number', required: true },
			type:      { type: 'text',   required: true },
			label:     { type: 'text',   required: true },
			color:     { type: 'text' },
			notes:     { type: 'text' },
			createdAt: { type: 'date',   required: true },
			updatedAt: { type: 'date',   required: true },
		},
		fks: {
			project: { code: 'project', multiple: false, required: false },
		},
		template: { presentation: 'type label time' },
	},

	// ── Config ───────────────────────────────────────────────────────────────────
	config: {
		base: 'machine_base',
		fields: {
			id:         { type: 'id',     readonly: true },
			checkpoint: { type: 'text' },
			sampler:    { type: 'text' },
			seed:       { type: 'number' },
			tts_engine: { type: 'text' },
			audioLanes: { type: 'text' },   // lane array — no lane schema in ARCH, kept as JSON text
		},
		fks: {
			project: { code: 'project', multiple: false, required: false },
		},
		template: { presentation: 'checkpoint sampler tts_engine' },
	},
};

export default latentScheme;
