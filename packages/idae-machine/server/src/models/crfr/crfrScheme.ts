// crfr org — canonical MachineModel (reviewed 2026-06-07)
// Changes from auto-generated:
//   - bases corrected per MongoDB sitebase_* mapping
//   - agent_* removed (covered by core appuser_*); user_tuile/user_list/user_note/user_table kept (crfr-specific)
//   - agent_recherche / app_version_file_preprod removed
//   - FR field names → EN
//   - undeclared junk stripped (mongodate, md5, ip, F_action, grille*, id{Legacy} FK columns)
//   - FKs completed (tache_statut, conge appuser, devis_passager, facture_ligne, etc.)
import type { MachineModel } from '../../../../src/lib/types/machine-model.js';

export const crfrScheme: MachineModel = {

	// ── BASE ──────────────────────────────────────────────────────────────────

	"app_conf": {
		base: 'machine_base',
		fields: {
			id:   { type: 'id', readonly: true },
			code: { type: 'text', required: true },
			name: { type: 'text', required: true },
		},
		fks: {},
		template: { presentation: 'name code' },
	},

	"app_daemon": {
		base: 'machine_base',
		fields: {
			id:   { type: 'id', readonly: true },
			code: { type: 'text', required: true },
			name: { type: 'text', required: true },
		},
		fks: {},
		template: { presentation: 'name code' },
	},

	"app_version": {
		base: 'machine_base',
		fields: {
			id:   { type: 'id', readonly: true },
			code: { type: 'text', required: true },
			name: { type: 'text', required: true },
		},
		fks: {},
		template: { presentation: 'name code' },
	},

	"app_version_file": {
		base: 'machine_base',
		fields: {
			id:   { type: 'id', readonly: true },
			code: { type: 'text', required: true },
			name: { type: 'text', required: true },
		},
		fks: {},
		template: { presentation: 'name code' },
	},

	"conge": {
		base: 'machine_base',
		isType:   true,
		isStatus: true,
		fields: {
			id:   { type: 'id', readonly: true },
			code: { type: 'text', required: true },
			name: { type: 'text', required: true },
		},
		fks: {
			conge_type:   { code: 'conge_type',   multiple: false },
			conge_statut: { code: 'conge_statut', multiple: false },
			appuser:      { code: 'appuser',       multiple: false },
		},
		template: { presentation: 'name code' },
	},

	"conge_statut": {
		base: 'machine_base',
		isGroup: true,
		fields: {
			id:   { type: 'id', readonly: true },
			code: { type: 'text', required: true },
			name: { type: 'text', required: true },
		},
		fks: {},
		template: { presentation: 'name code' },
	},

	"conge_type": {
		base: 'machine_base',
		isGroup: true,
		fields: {
			id:   { type: 'id', readonly: true },
			code: { type: 'text', required: true },
			name: { type: 'text', required: true },
		},
		fks: {},
		template: { presentation: 'name code' },
	},

	"document_extension": {
		base: 'machine_base',
		fields: {
			id:   { type: 'id', readonly: true },
			code: { type: 'text', required: true },
			name: { type: 'text', required: true },
		},
		fks: {},
		template: { presentation: 'name code' },
	},

	"document_type": {
		base: 'machine_base',
		isGroup: true,
		fields: {
			id:   { type: 'id', readonly: true },
			code: { type: 'text', required: true },
			name: { type: 'text', required: true },
		},
		fks: {},
		template: { presentation: 'name code' },
	},

	"note": {
		base: 'machine_base',
		fields: {
			id:       { type: 'id', readonly: true },
			code:     { type: 'text', required: true },
			name:     { type: 'text', required: true },
			isActive: { type: 'boolean' },
			text:     { type: 'text-long' },
		},
		fks: {
			appuser: { code: 'appuser', multiple: false },
		},
		template: { presentation: 'name code' },
	},

	"tache": {
		base: 'machine_base',
		isType:   true,
		isStatus: true,
		fields: {
			id:          { type: 'id', readonly: true },
			code:        { type: 'text', required: true },
			name:        { type: 'text', required: true },
			startDate:   { type: 'date' },
			endDate:     { type: 'date' },
			description: { type: 'text-long' },
			startTime:   { type: 'datetime' },
			endTime:     { type: 'datetime' },
		},
		fks: {
			client:       { code: 'client',       multiple: false },
			tache_type:   { code: 'tache_type',   multiple: false },
			tache_statut: { code: 'tache_statut', multiple: false },
		},
		template: { presentation: 'name code' },
	},

	"tache_statut": {
		base: 'machine_base',
		isGroup: true,
		fields: {
			id:    { type: 'id', readonly: true },
			code:  { type: 'text', required: true },
			name:  { type: 'text', required: true },
			order: { type: 'number' },
			color: { type: 'text' },
			icon:  { type: 'text' },
		},
		fks: {},
		template: { presentation: 'name code' },
	},

	"tache_type": {
		base: 'machine_base',
		isGroup: true,
		fields: {
			id:    { type: 'id', readonly: true },
			code:  { type: 'text', required: true },
			name:  { type: 'text', required: true },
			order: { type: 'number' },
			color: { type: 'text' },
			icon:  { type: 'text' },
		},
		fks: {},
		template: { presentation: 'name code' },
	},

	"todo": {
		base: 'machine_base',
		fields: {
			id:   { type: 'id', readonly: true },
			code: { type: 'text', required: true },
			name: { type: 'text', required: true },
		},
		fks: {},
		template: { presentation: 'name code' },
	},

	"type_activite": {
		base: 'machine_base',
		fields: {
			id:          { type: 'id', readonly: true },
			code:        { type: 'text', required: true },
			name:        { type: 'text', required: true },
			shortName:   { type: 'text' },
			description: { type: 'text' },
		},
		fks: {},
		template: { presentation: 'name code' },
	},

	// crfr-specific user extensions (not covered by core appuser_*)
	"user_list": {
		base: 'machine_base',
		fields: {
			id:   { type: 'id', readonly: true },
			code: { type: 'text', required: true },
			name: { type: 'text', required: true },
		},
		fks: {
			appuser: { code: 'appuser', multiple: false },
		},
		template: { presentation: 'name code' },
	},

	"user_note": {
		base: 'machine_base',
		fields: {
			id:   { type: 'id', readonly: true },
			code: { type: 'text', required: true },
			name: { type: 'text', required: true },
		},
		fks: {
			appuser: { code: 'appuser', multiple: false },
		},
		template: { presentation: 'name code' },
	},

	"user_table": {
		base: 'machine_base',
		fields: {
			id:   { type: 'id', readonly: true },
			code: { type: 'text', required: true },
			name: { type: 'text', required: true },
		},
		fks: {
			appuser: { code: 'appuser', multiple: false },
		},
		template: { presentation: 'name code' },
	},

	"user_tuile": {
		base: 'machine_base',
		fields: {
			id:    { type: 'id', readonly: true },
			code:  { type: 'text', required: true },
			name:  { type: 'text', required: true },
			value: { type: 'text' },
		},
		fks: {
			appuser: { code: 'appuser', multiple: false },
		},
		template: { presentation: 'name code' },
	},

	"vacance": {
		base: 'machine_base',
		fields: {
			id:          { type: 'id', readonly: true },
			code:        { type: 'text', required: true },
			name:        { type: 'text', required: true },
			startDate:   { type: 'date' },
			endDate:     { type: 'date' },
			description: { type: 'text' },
			zone:        { type: 'text' },
		},
		fks: {},
		template: { presentation: 'name code' },
	},

	// ── DEVIS ─────────────────────────────────────────────────────────────────

	"client": {
		base: 'machine_devis',
		isType: true,
		fields: {
			id:          { type: 'id', readonly: true },
			code:        { type: 'text', required: true },
			name:        { type: 'text', required: true },
			isActive:    { type: 'boolean' },
			firstName:   { type: 'text' },
			createdAt:   { type: 'date' },
			postalCode:  { type: 'text' },
			address:     { type: 'text' },
			address2:    { type: 'text' },
			city:        { type: 'text' },
			email:       { type: 'email' },
			mobilePhone: { type: 'phone' },
			phone:       { type: 'phone' },
			gender:      { type: 'text' },
			isClient:    { type: 'boolean' },
		},
		fks: {
			client_type: { code: 'client_type', multiple: false },
		},
		template: { presentation: 'name code' },
	},

	"client_type": {
		base: 'machine_devis',
		isGroup: true,
		fields: {
			id:    { type: 'id', readonly: true },
			code:  { type: 'text', required: true },
			name:  { type: 'text', required: true },
			order: { type: 'number' },
		},
		fks: {},
		template: { presentation: 'name code' },
	},

	"devis": {
		base: 'machine_devis',
		isType:   true,
		isStatus: true,
		fields: {
			id:          { type: 'id', readonly: true },
			code:        { type: 'text', required: true },
			name:        { type: 'text', required: true },
			price:       { type: 'currency' },
			createdAt:   { type: 'date' },
			description: { type: 'text-long' },
			email:       { type: 'email' },
			startDate:   { type: 'date' },
			phone:       { type: 'phone' },
			adultCount:  { type: 'number' },
			childCount:  { type: 'number' },
			number:      { type: 'text' },
			isArchived:  { type: 'boolean' },
			comment:     { type: 'text' },
			wishLetter:  { type: 'text-long' },
			desire:      { type: 'text' },
			gender:      { type: 'text' },
			siteUrl:     { type: 'url' },
		},
		fks: {
			client:              { code: 'client',              multiple: false },
			fournisseur:         { code: 'fournisseur',         multiple: false },
			hotel_gamme:         { code: 'hotel_gamme',         multiple: false },
			produit:             { code: 'produit',             multiple: false },
			produit_tarif:       { code: 'produit_tarif',       multiple: false },
			produit_tarif_gamme: { code: 'produit_tarif_gamme', multiple: false },
			transport:           { code: 'transport',           multiple: false },
			devis_type:          { code: 'devis_type',          multiple: false },
			produit_type:        { code: 'produit_type',        multiple: false },
			devis_statut:        { code: 'devis_statut',        multiple: false },
		},
		template: { presentation: 'name code' },
	},

	"devis_acompte": {
		base: 'machine_devis',
		isType: true,
		fields: {
			id:    { type: 'id', readonly: true },
			code:  { type: 'text', required: true },
			name:  { type: 'text', required: true },
			price: { type: 'currency' },
			date:  { type: 'date' },
		},
		fks: {
			devis:              { code: 'devis',              multiple: false },
			devis_acompte_type: { code: 'devis_acompte_type', multiple: false },
		},
		template: { presentation: 'name code' },
	},

	"devis_acompte_type": {
		base: 'machine_devis',
		isGroup: true,
		fields: {
			id:    { type: 'id', readonly: true },
			code:  { type: 'text', required: true },
			name:  { type: 'text', required: true },
			order: { type: 'number' },
		},
		fks: {},
		template: { presentation: 'name code' },
	},

	"devis_annotation": {
		base: 'machine_devis',
		fields: {
			id:   { type: 'id', readonly: true },
			code: { type: 'text', required: true },
			name: { type: 'text', required: true },
		},
		fks: {
			devis: { code: 'devis', multiple: false },
		},
		template: { presentation: 'name code' },
	},

	"devis_envie": {
		base: 'machine_devis',
		fields: {
			id:   { type: 'id', readonly: true },
			code: { type: 'text', required: true },
			name: { type: 'text', required: true },
		},
		fks: {},
		template: { presentation: 'name code' },
	},

	"devis_mail": {
		base: 'machine_devis',
		fields: {
			id:   { type: 'id', readonly: true },
			code: { type: 'text', required: true },
			name: { type: 'text', required: true },
		},
		fks: {
			devis: { code: 'devis', multiple: false },
		},
		template: { presentation: 'name code' },
	},

	"devis_marge": {
		base: 'machine_devis',
		isType: true,
		fields: {
			id:            { type: 'id', readonly: true },
			code:          { type: 'text', required: true },
			name:          { type: 'text', required: true },
			order:         { type: 'number' },
			purchasePrice: { type: 'currency' },
		},
		fks: {
			devis:            { code: 'devis',            multiple: false },
			devis_marge_type: { code: 'devis_marge_type', multiple: false },
		},
		template: { presentation: 'name code' },
	},

	"devis_marge_type": {
		base: 'machine_devis',
		isGroup: true,
		fields: {
			id:   { type: 'id', readonly: true },
			code: { type: 'text', required: true },
			name: { type: 'text', required: true },
		},
		fks: {},
		template: { presentation: 'name code' },
	},

	"devis_passager": {
		base: 'machine_devis',
		fields: {
			id:        { type: 'id', readonly: true },
			code:      { type: 'text', required: true },
			name:      { type: 'text', required: true },
			firstName: { type: 'text' },
			email:     { type: 'email' },
			phone:     { type: 'phone' },
		},
		fks: {
			devis:  { code: 'devis',  multiple: false },
			client: { code: 'client', multiple: false },
		},
		template: { presentation: 'name code' },
	},

	"devis_prestation": {
		base: 'machine_devis',
		fields: {
			id:          { type: 'id', readonly: true },
			code:        { type: 'text', required: true },
			name:        { type: 'text', required: true },
			order:       { type: 'number' },
			price:       { type: 'currency' },
			quantity:    { type: 'number' },
			description: { type: 'text-long' },
			total:       { type: 'currency' },
		},
		fks: {
			devis: { code: 'devis', multiple: false },
		},
		template: { presentation: 'name code' },
	},

	"devis_statut": {
		base: 'machine_devis',
		isGroup: true,
		fields: {
			id:    { type: 'id', readonly: true },
			code:  { type: 'text', required: true },
			name:  { type: 'text', required: true },
			order: { type: 'number' },
		},
		fks: {},
		template: { presentation: 'name code' },
	},

	"devis_type": {
		base: 'machine_devis',
		isGroup: true,
		fields: {
			id:          { type: 'id', readonly: true },
			code:        { type: 'text', required: true },
			name:        { type: 'text', required: true },
			order:       { type: 'number' },
			shortName:   { type: 'text' },
			description: { type: 'text' },
		},
		fks: {},
		template: { presentation: 'name code' },
	},

	"document": {
		base: 'machine_devis',
		fields: {
			id:   { type: 'id', readonly: true },
			code: { type: 'text', required: true },
			name: { type: 'text', required: true },
		},
		fks: {
			devis: { code: 'devis', multiple: false },
		},
		template: { presentation: 'name code' },
	},

	"dossier_devis": {
		base: 'machine_devis',
		fields: {
			id:            { type: 'id', readonly: true },
			code:          { type: 'text', required: true },
			name:          { type: 'text', required: true },
			number:        { type: 'text' },
			dossierNumber: { type: 'text' },
		},
		fks: {
			devis: { code: 'devis', multiple: false },
		},
		template: { presentation: 'name code' },
	},

	"facture": {
		base: 'machine_devis',
		isType: true,
		fields: {
			id:          { type: 'id', readonly: true },
			code:        { type: 'text', required: true },
			name:        { type: 'text', required: true },
			date:        { type: 'date' },
			total:       { type: 'currency' },
			vatRateFR:   { type: 'text' },
			vatRateHUE:  { type: 'text' },
			vatRateUE:   { type: 'text' },
			externalRef: { type: 'text' },
			title:       { type: 'text' },
		},
		fks: {
			client:       { code: 'client',       multiple: false },
			devis:        { code: 'devis',         multiple: false },
			dossier_devis:{ code: 'dossier_devis', multiple: false },
			facture_type: { code: 'facture_type',  multiple: false },
		},
		template: { presentation: 'name code' },
	},

	"facture_ligne": {
		base: 'machine_devis',
		fields: {
			id:   { type: 'id', readonly: true },
			code: { type: 'text', required: true },
			name: { type: 'text', required: true },
		},
		fks: {
			facture: { code: 'facture', multiple: false },
		},
		template: { presentation: 'name code' },
	},

	"facture_type": {
		base: 'machine_devis',
		isGroup: true,
		fields: {
			id:   { type: 'id', readonly: true },
			code: { type: 'text', required: true },
			name: { type: 'text', required: true },
		},
		fks: {},
		template: { presentation: 'name code' },
	},

	"paiement": {
		base: 'machine_devis',
		fields: {
			id:          { type: 'id', readonly: true },
			code:        { type: 'text', required: true },
			name:        { type: 'text', required: true },
			amount:      { type: 'currency' },
			mode:        { type: 'text' },
			externalRef: { type: 'text' },
		},
		fks: {
			devis:  { code: 'devis',  multiple: false },
			client: { code: 'client', multiple: false },
		},
		template: { presentation: 'name code' },
	},

	"prestataire": {
		base: 'machine_devis',
		fields: {
			id:               { type: 'id', readonly: true },
			code:             { type: 'text', required: true },
			name:             { type: 'text', required: true },
			contact:          { type: 'text' },
			commission:       { type: 'text' },
			phone:            { type: 'phone' },
			reservationPhone: { type: 'phone' },
			fax:              { type: 'phone' },
			commercialEmail:  { type: 'email' },
			website:          { type: 'url' },
			description:      { type: 'text' },
		},
		fks: {},
		template: { presentation: 'name code' },
	},

	// ── NEWSLETTER ────────────────────────────────────────────────────────────

	"newsletter": {
		base: 'machine_newsletter',
		isType: true,
		fields: {
			id:             { type: 'id', readonly: true },
			code:           { type: 'text', required: true },
			name:           { type: 'text', required: true },
			color:          { type: 'text' },
			date:           { type: 'date' },
			description:    { type: 'text-long' },
			url:            { type: 'url' },
			bgColor:        { type: 'text' },
			content:        { type: 'text-long' },
			previewContent: { type: 'text' },
		},
		fks: {},
		template: { presentation: 'name code' },
	},

	"newsletter_block": {
		base: 'machine_newsletter',
		fields: {
			id:   { type: 'id', readonly: true },
			code: { type: 'text', required: true },
			name: { type: 'text', required: true },
		},
		fks: {},
		template: { presentation: 'name code' },
	},

	"newsletter_item": {
		base: 'machine_newsletter',
		isType: true,
		fields: {
			id:          { type: 'id', readonly: true },
			code:        { type: 'text', required: true },
			name:        { type: 'text', required: true },
			description: { type: 'text-long' },
			order:       { type: 'number' },
			url:         { type: 'url' },
		},
		fks: {
			newsletter: { code: 'newsletter', multiple: false },
		},
		template: { presentation: 'name code' },
	},

	"newsletter_item_type": {
		base: 'machine_newsletter',
		isGroup: true,
		fields: {
			id:       { type: 'id', readonly: true },
			code:     { type: 'text', required: true },
			name:     { type: 'text', required: true },
			quantity: { type: 'number', required: true },
		},
		fks: {},
		template: { presentation: 'name code' },
	},

	"newsletter_type": {
		base: 'machine_newsletter',
		isGroup: true,
		fields: {
			id:   { type: 'id', readonly: true },
			code: { type: 'text', required: true },
			name: { type: 'text', required: true },
		},
		fks: {},
		template: { presentation: 'name code' },
	},

	// ── PRODUCTION ────────────────────────────────────────────────────────────

	"aeroport": {
		base: 'machine_production',
		fields: {
			id:          { type: 'id', readonly: true },
			code:        { type: 'text', required: true },
			name:        { type: 'text', required: true },
			shortName:   { type: 'text' },
			description: { type: 'text-long' },
			image:       { type: 'text' },
		},
		fks: {},
		template: { presentation: 'name code' },
	},

	"asavoir": {
		base: 'machine_production',
		isType: true,
		fields: {
			id:          { type: 'id', readonly: true },
			code:        { type: 'text', required: true },
			name:        { type: 'text', required: true },
			shortName:   { type: 'text' },
			asset:       { type: 'text' },
			description: { type: 'text' },
			information: { type: 'text' },
		},
		fks: {
			asavoir_type: { code: 'asavoir_type', multiple: false },
		},
		template: { presentation: 'name code' },
	},

	"asavoir_type": {
		base: 'machine_production',
		isGroup: true,
		fields: {
			id:          { type: 'id', readonly: true },
			code:        { type: 'text', required: true },
			name:        { type: 'text', required: true },
			shortName:   { type: 'text' },
			asset:       { type: 'text' },
			description: { type: 'text' },
			information: { type: 'text' },
		},
		fks: {},
		template: { presentation: 'name code' },
	},

	"continent": {
		base: 'machine_production',
		fields: {
			id:          { type: 'id', readonly: true },
			code:        { type: 'text', required: true },
			name:        { type: 'text', required: true },
			description: { type: 'text-long' },
			color:       { type: 'text' },
			ref:         { type: 'text' },
			adjective:   { type: 'text' },
			order:       { type: 'number' },
			prefix:      { type: 'text' },
			isFeatured:  { type: 'boolean' },
			isVisible:   { type: 'boolean' },
			isActive:    { type: 'boolean' },
			shortName:   { type: 'text' },
			viewCount:   { type: 'number' },
		},
		fks: {},
		template: { presentation: 'name code' },
	},

	"destination": {
		base: 'machine_production',
		fields: {
			id:                { type: 'id', readonly: true },
			code:              { type: 'text', required: true },
			name:              { type: 'text', required: true },
			color:             { type: 'text' },
			ref:               { type: 'text' },
			information:       { type: 'text' },
			description:       { type: 'text-long' },
			adjective:         { type: 'text' },
			adjectifContinent: { type: 'text' },
			adjectifPays:      { type: 'text' },
			cityDescription:   { type: 'text' },
			isFeatured:        { type: 'boolean' },
			cityLatitude:      { type: 'text' },
			cityLongitude:     { type: 'text' },
			countryOrder:      { type: 'text' },
			cityOrder:         { type: 'text' },
			continentPrefix:   { type: 'text' },
			prefix:            { type: 'text' },
			countryPrefix:     { type: 'text' },
			viewCount:         { type: 'number' },
		},
		fks: {
			continent: { code: 'continent', multiple: false },
			pays:      { code: 'pays',      multiple: false },
			ville:     { code: 'ville',     multiple: false },
		},
		template: { presentation: 'name code' },
	},

	"fleuve": {
		base: 'machine_production',
		isType: true,
		fields: {
			id:          { type: 'id', readonly: true },
			code:        { type: 'text', required: true },
			name:        { type: 'text', required: true },
			image:       { type: 'text' },
			description: { type: 'text-long' },
			order:       { type: 'number' },
			url:         { type: 'url' },
		},
		fks: {
			pays: { code: 'pays', multiple: false },
		},
		template: { presentation: 'name code' },
	},

	"fleuve_type": {
		base: 'machine_production',
		isGroup: true,
		fields: {
			id:   { type: 'id', readonly: true },
			code: { type: 'text', required: true },
			name: { type: 'text', required: true },
		},
		fks: {},
		template: { presentation: 'name code' },
	},

	"fournisseur": {
		base: 'machine_production',
		isType: true,
		fields: {
			id:          { type: 'id', readonly: true },
			code:        { type: 'text', required: true },
			name:        { type: 'text', required: true },
			color:       { type: 'text' },
			shortName:   { type: 'text' },
			description: { type: 'text-long' },
		},
		fks: {},
		template: { presentation: 'name code' },
	},

	"fournisseur_clause": {
		base: 'machine_production',
		isType: true,
		fields: {
			id:              { type: 'id', readonly: true },
			code:            { type: 'text', required: true },
			name:            { type: 'text', required: true },
			order:           { type: 'number' },
			descriptionHTML: { type: 'text' },
		},
		fks: {},
		template: { presentation: 'name code' },
	},

	"fournisseur_clause_type": {
		base: 'machine_production',
		isGroup: true,
		fields: {
			id:   { type: 'id', readonly: true },
			code: { type: 'text', required: true },
			name: { type: 'text', required: true },
		},
		fks: {},
		template: { presentation: 'name code' },
	},

	"fournisseur_presentation": {
		base: 'machine_production',
		fields: {
			id:          { type: 'id', readonly: true },
			code:        { type: 'text', required: true },
			name:        { type: 'text', required: true },
			description: { type: 'text-long' },
		},
		fks: {},
		template: { presentation: 'name code' },
	},

	"fournisseur_presentation_type": {
		base: 'machine_production',
		isGroup: true,
		fields: {
			id:          { type: 'id', readonly: true },
			code:        { type: 'text', required: true },
			name:        { type: 'text', required: true },
			description: { type: 'text-long' },
		},
		fks: {},
		template: { presentation: 'name code' },
	},

	"fournisseur_type": {
		base: 'machine_production',
		isGroup: true,
		fields: {
			id:        { type: 'id', readonly: true },
			code:      { type: 'text', required: true },
			name:      { type: 'text', required: true },
			adjective: { type: 'text' },
			plural:    { type: 'text' },
			prefix:    { type: 'text' },
		},
		fks: {
			transport_type: { code: 'transport_type', multiple: false },
		},
		template: { presentation: 'name code' },
	},

	"gamme": {
		base: 'machine_production',
		fields: {
			id:          { type: 'id', readonly: true },
			code:        { type: 'text', required: true },
			name:        { type: 'text', required: true },
			image:       { type: 'text' },
			order:       { type: 'number' },
			description: { type: 'text-long' },
		},
		fks: {
			produit_type: { code: 'produit_type', multiple: false },
		},
		template: { presentation: 'name code' },
	},

	"hotel": {
		base: 'machine_production',
		isType: true,
		fields: {
			id:          { type: 'id', readonly: true },
			code:        { type: 'text', required: true },
			name:        { type: 'text', required: true },
			image:       { type: 'text' },
			postalCode:  { type: 'text' },
			address:     { type: 'text' },
			city:        { type: 'text' },
			description: { type: 'text' },
			stars:       { type: 'text' },
			viewCount:   { type: 'number' },
		},
		fks: {
			ville: { code: 'ville', multiple: false },
		},
		template: { presentation: 'name code' },
	},

	"hotel_clause": {
		base: 'machine_production',
		fields: {
			id:          { type: 'id', readonly: true },
			code:        { type: 'text', required: true },
			name:        { type: 'text', required: true },
			description: { type: 'text-long' },
		},
		fks: {
			hotel: { code: 'hotel', multiple: false },
		},
		template: { presentation: 'name code' },
	},

	"hotel_gamme": {
		base: 'machine_production',
		fields: {
			id:         { type: 'id', readonly: true },
			code:       { type: 'text', required: true },
			name:       { type: 'text', required: true },
			gammeOrder: { type: 'text' },
		},
		fks: {
			gamme:        { code: 'gamme',        multiple: false },
			hotel:        { code: 'hotel',        multiple: false },
			produit_type: { code: 'produit_type', multiple: false },
		},
		template: { presentation: 'name code' },
	},

	"hotel_type": {
		base: 'machine_production',
		isGroup: true,
		fields: {
			id:          { type: 'id', readonly: true },
			code:        { type: 'text', required: true },
			name:        { type: 'text', required: true },
			shortName:   { type: 'text' },
			description: { type: 'text' },
		},
		fks: {},
		template: { presentation: 'name code' },
	},

	"mer": {
		base: 'machine_production',
		isType: true,
		fields: {
			id:          { type: 'id', readonly: true },
			code:        { type: 'text', required: true },
			name:        { type: 'text', required: true },
			image:       { type: 'text' },
			shortName:   { type: 'text' },
			description: { type: 'text-long' },
			viewCount:   { type: 'number' },
		},
		fks: {
			mer_type: { code: 'mer_type', multiple: false },
		},
		template: { presentation: 'name code' },
	},

	"mer_type": {
		base: 'machine_production',
		isGroup: true,
		fields: {
			id:   { type: 'id', readonly: true },
			code: { type: 'text', required: true },
			name: { type: 'text', required: true },
		},
		fks: {},
		template: { presentation: 'name code' },
	},

	"pays": {
		base: 'machine_production',
		fields: {
			id:                  { type: 'id', readonly: true },
			code:                { type: 'text', required: true },
			name:                { type: 'text', required: true },
			image:               { type: 'text' },
			hasVisa:             { type: 'text' },
			adjectifContinent:   { type: 'text' },
			adjectifDestination: { type: 'text' },
			adjective:           { type: 'text' },
			count:               { type: 'number' },
			description:         { type: 'text' },
			visaInfo:            { type: 'text' },
			order:               { type: 'number' },
			continentPrefix:     { type: 'text' },
			destinationPrefix:   { type: 'text' },
			prefix:              { type: 'text' },
			viewCount:           { type: 'number' },
		},
		fks: {
			continent:   { code: 'continent',   multiple: false },
			destination: { code: 'destination', multiple: false },
		},
		template: { presentation: 'name code' },
	},

	"produit": {
		base: 'machine_production',
		isType: true,
		fields: {
			id:                    { type: 'id', readonly: true },
			code:                  { type: 'text', required: true },
			name:                  { type: 'text', required: true },
			price:                 { type: 'currency' },
			date:                  { type: 'date' },
			duration:              { type: 'number' },
			durationDays:          { type: 'text' },
			isFeatured:            { type: 'boolean' },
			isVisible:             { type: 'boolean' },
			isActive:              { type: 'boolean' },
			isActiveFournisseur:   { type: 'boolean' },
			isFeaturedDestination: { type: 'boolean' },
			isFeaturedFournisseur: { type: 'boolean' },
			description:           { type: 'text' },
			promoPrice:            { type: 'currency' },
			promoText:             { type: 'text' },
			reference:             { type: 'text' },
			subtitle:              { type: 'text' },
			promoSubtitle:         { type: 'text' },
			altTransportName:      { type: 'text' },
			fullBoard:             { type: 'text' },
			supplierShortName:     { type: 'text' },
			lowestPrice:           { type: 'text' },
			destinationPrefix:     { type: 'text' },
			supplierTypePrefix:    { type: 'text' },
			productTypePrefix:     { type: 'text' },
			homePageOrder:         { type: 'text' },
			supplierOrder:         { type: 'text' },
			viewCount:             { type: 'number' },
			arrivalCityName:       { type: 'text' },
			departureCityName:     { type: 'text' },
		},
		fks: {
			continent:      { code: 'continent',      multiple: false },
			destination:    { code: 'destination',    multiple: false },
			fournisseur:    { code: 'fournisseur',    multiple: false },
			fournisseur_type: { code: 'fournisseur_type', multiple: false },
			prestataire:    { code: 'prestataire',    multiple: false },
			produit_type:   { code: 'produit_type',   multiple: false },
			transport:      { code: 'transport',      multiple: false },
			transport_type: { code: 'transport_type', multiple: false },
			ville:          { code: 'ville',          multiple: false },
			pays:           { code: 'pays',           multiple: false },
		},
		template: { presentation: 'name code' },
	},

	"produit_etape": {
		base: 'machine_production',
		fields: {
			id:          { type: 'id', readonly: true },
			code:        { type: 'text', required: true },
			name:        { type: 'text', required: true },
			image:       { type: 'text' },
			order:       { type: 'number' },
			description: { type: 'text-long' },
			startTime:   { type: 'datetime' },
			endTime:     { type: 'datetime' },
		},
		fks: {
			produit: { code: 'produit', multiple: false },
			ville:   { code: 'ville',   multiple: false },
		},
		template: { presentation: 'name code' },
	},

	"produit_selection": {
		base: 'machine_production',
		fields: {
			id:          { type: 'id', readonly: true },
			code:        { type: 'text', required: true },
			name:        { type: 'text', required: true },
			isActive:    { type: 'boolean' },
			description: { type: 'text' },
		},
		fks: {},
		template: { presentation: 'name code' },
	},

	"produit_tarif": {
		base: 'machine_production',
		fields: {
			id:          { type: 'id', readonly: true },
			code:        { type: 'text', required: true },
			name:        { type: 'text', required: true },
			price:       { type: 'currency' },
			date:        { type: 'date' },
			year:        { type: 'text' },
			month:       { type: 'text' },
			monthFr:     { type: 'text' },
			monthYearFr: { type: 'text' },
		},
		fks: {
			produit: { code: 'produit', multiple: false },
		},
		template: { presentation: 'name code' },
	},

	"produit_tarif_gamme": {
		base: 'machine_production',
		isType: true,
		fields: {
			id:         { type: 'id', readonly: true },
			code:       { type: 'text', required: true },
			name:       { type: 'text', required: true },
			price:      { type: 'currency' },
			promoPrice: { type: 'currency' },
		},
		fks: {
			gamme:         { code: 'gamme',         multiple: false },
			produit:       { code: 'produit',       multiple: false },
			produit_tarif: { code: 'produit_tarif', multiple: false },
		},
		template: { presentation: 'name code' },
	},

	"produit_tarif_gamme_type": {
		base: 'machine_production',
		isGroup: true,
		fields: {
			id:   { type: 'id', readonly: true },
			code: { type: 'text', required: true },
			name: { type: 'text', required: true },
		},
		fks: {},
		template: { presentation: 'name code' },
	},

	"produit_type": {
		base: 'machine_production',
		isType:  true,
		isGroup: true,
		fields: {
			id:              { type: 'id', readonly: true },
			code:            { type: 'text', required: true },
			name:            { type: 'text', required: true },
			description:     { type: 'text' },
			isActive:        { type: 'boolean' },
			isVisible:       { type: 'boolean' },
			metaDescription: { type: 'text' },
			metaTitle:       { type: 'text' },
			order:           { type: 'number' },
			plural:          { type: 'text' },
			webName:         { type: 'text' },
			webPlural:       { type: 'text' },
			viewCount:       { type: 'number' },
		},
		fks: {},
		template: { presentation: 'name code' },
	},

	"produit_type_type": {
		base: 'machine_production',
		isGroup: true,
		fields: {
			id:   { type: 'id', readonly: true },
			code: { type: 'text', required: true },
			name: { type: 'text', required: true },
		},
		fks: {},
		template: { presentation: 'name code' },
	},

	"theme": {
		base: 'machine_production',
		isType: true,
		fields: {
			id:          { type: 'id', readonly: true },
			code:        { type: 'text', required: true },
			name:        { type: 'text', required: true },
			shortName:   { type: 'text' },
			asset:       { type: 'text' },
			description: { type: 'text' },
			information: { type: 'text' },
			isActive:    { type: 'boolean' },
		},
		fks: {
			theme_type: { code: 'theme_type', multiple: false },
		},
		template: { presentation: 'name code' },
	},

	"theme_type": {
		base: 'machine_production',
		isGroup: true,
		fields: {
			id:       { type: 'id', readonly: true },
			code:     { type: 'text', required: true },
			name:     { type: 'text', required: true },
			isActive: { type: 'boolean' },
		},
		fks: {},
		template: { presentation: 'name code' },
	},

	"transport": {
		base: 'machine_production',
		isType: true,
		fields: {
			id:             { type: 'id', readonly: true },
			code:           { type: 'text', required: true },
			name:           { type: 'text', required: true },
			color:          { type: 'text' },
			description:    { type: 'text-long' },
			altName:        { type: 'text' },
			descriptionExt: { type: 'text' },
			isFeatured:     { type: 'boolean' },
		},
		fks: {
			fournisseur:    { code: 'fournisseur',    multiple: false },
			produit_type:   { code: 'produit_type',   multiple: false },
			transport_type: { code: 'transport_type', multiple: false },
		},
		template: { presentation: 'name code' },
	},

	"transport_cabine": {
		base: 'machine_production',
		fields: {
			id:          { type: 'id', readonly: true },
			code:        { type: 'text', required: true },
			name:        { type: 'text', required: true },
			order:       { type: 'number' },
			description: { type: 'text-long' },
		},
		fks: {
			transport:    { code: 'transport',    multiple: false },
			gamme:        { code: 'gamme',        multiple: false },
			produit_type: { code: 'produit_type', multiple: false },
		},
		template: { presentation: 'name code' },
	},

	"transport_gamme": {
		base: 'machine_production',
		fields: {
			id:   { type: 'id', readonly: true },
			code: { type: 'text', required: true },
			name: { type: 'text', required: true },
		},
		fks: {},
		template: { presentation: 'name code' },
	},

	"transport_pont": {
		base: 'machine_production',
		fields: {
			id:    { type: 'id', readonly: true },
			code:  { type: 'text', required: true },
			name:  { type: 'text', required: true },
			order: { type: 'number' },
		},
		fks: {},
		template: { presentation: 'name code' },
	},

	"transport_presentation": {
		base: 'machine_production',
		isType: true,
		fields: {
			id:   { type: 'id', readonly: true },
			code: { type: 'text', required: true },
			name: { type: 'text', required: true },
		},
		fks: {},
		template: { presentation: 'name code' },
	},

	"transport_presentation_type": {
		base: 'machine_production',
		isGroup: true,
		fields: {
			id:   { type: 'id', readonly: true },
			code: { type: 'text', required: true },
			name: { type: 'text', required: true },
		},
		fks: {},
		template: { presentation: 'name code' },
	},

	"transport_type": {
		base: 'machine_production',
		isGroup: true,
		fields: {
			id:     { type: 'id', readonly: true },
			code:   { type: 'text', required: true },
			name:   { type: 'text', required: true },
			plural: { type: 'text' },
		},
		fks: {},
		template: { presentation: 'name code' },
	},

	"ville": {
		base: 'machine_production',
		fields: {
			id:                  { type: 'id', readonly: true },
			code:                { type: 'text', required: true },
			name:                { type: 'text', required: true },
			description:         { type: 'text-long' },
			information:         { type: 'text' },
			color:               { type: 'text' },
			ref:                 { type: 'text' },
			latitude:            { type: 'text' },
			longitude:           { type: 'text' },
			isFeatured:          { type: 'boolean' },
			isPort:              { type: 'boolean' },
			adjectifContinent:   { type: 'text' },
			adjectifDestination: { type: 'text' },
			adjectifPays:        { type: 'text' },
			countryOrder:        { type: 'text' },
			order:               { type: 'number' },
			continentPrefix:     { type: 'text' },
			destinationPrefix:   { type: 'text' },
			countryPrefix:       { type: 'text' },
		},
		fks: {
			continent:   { code: 'continent',   multiple: false },
			destination: { code: 'destination', multiple: false },
			pays:        { code: 'pays',         multiple: false },
		},
		template: { presentation: 'name code' },
	},

	// ── SITE ──────────────────────────────────────────────────────────────────

	"article": {
		base: 'machine_site',
		isType: true,
		fields: {
			id:          { type: 'id', readonly: true },
			code:        { type: 'text', required: true },
			name:        { type: 'text', required: true },
			description: { type: 'text' },
			content:     { type: 'text-long' },
			order:       { type: 'number' },
			thumbnail:   { type: 'text' },
		},
		fks: {
			categorie: { code: 'categorie', multiple: false },
			site:      { code: 'site',      multiple: false },
		},
		template: { presentation: 'name code' },
	},

	"article_type": {
		base: 'machine_site',
		isGroup: true,
		fields: {
			id:   { type: 'id', readonly: true },
			code: { type: 'text', required: true },
			name: { type: 'text', required: true },
		},
		fks: {},
		template: { presentation: 'name code' },
	},

	"categorie": {
		base: 'machine_site',
		fields: {
			id:          { type: 'id', readonly: true },
			code:        { type: 'text', required: true },
			name:        { type: 'text', required: true },
			description: { type: 'text' },
			order:       { type: 'number' },
		},
		fks: {
			site: { code: 'site', multiple: false },
		},
		template: { presentation: 'name code' },
	},

	"site": {
		base: 'machine_site',
		isType: true,
		fields: {
			id:       { type: 'id', readonly: true },
			code:     { type: 'text', required: true },
			name:     { type: 'text', required: true },
			contact:  { type: 'text' },
			domain:   { type: 'text' },
			subtitle: { type: 'text' },
			intro:    { type: 'text-long' },
			url:      { type: 'url' },
		},
		fks: {},
		template: { presentation: 'name code' },
	},

	"site_type": {
		base: 'machine_site',
		isGroup: true,
		fields: {
			id:   { type: 'id', readonly: true },
			code: { type: 'text', required: true },
			name: { type: 'text', required: true },
		},
		fks: {},
		template: { presentation: 'name code' },
	},

	// ── SOCKETS ───────────────────────────────────────────────────────────────

	"daemon": {
		base: 'machine_sockets',
		fields: {
			id:        { type: 'id', readonly: true },
			code:      { type: 'text', required: true },
			name:      { type: 'text', required: true },
			date:      { type: 'date' },
			startDate: { type: 'date' },
			startTime: { type: 'datetime' },
			time:      { type: 'datetime' },
		},
		fks: {},
		template: { presentation: 'name code' },
	},

	// ── WEB ───────────────────────────────────────────────────────────────────

	"appsite": {
		base: 'machine_web',
		fields: {
			id:   { type: 'id', readonly: true },
			code: { type: 'text', required: true },
			name: { type: 'text', required: true },
			url:  { type: 'url' },
		},
		fks: {},
		template: { presentation: 'name code' },
	},

	"appsite_page": {
		base: 'machine_web',
		isType: true,
		fields: {
			id:    { type: 'id', readonly: true },
			code:  { type: 'text', required: true },
			name:  { type: 'text', required: true },
			order: { type: 'number' },
		},
		fks: {},
		template: { presentation: 'name code' },
	},

	"appsite_page_ligne": {
		base: 'machine_web',
		fields: {
			id:    { type: 'id', readonly: true },
			code:  { type: 'text', required: true },
			name:  { type: 'text', required: true },
			order: { type: 'number', required: true },
		},
		fks: {},
		template: { presentation: 'name code' },
	},

	"appsite_page_type": {
		base: 'machine_web',
		isGroup: true,
		fields: {
			id:   { type: 'id', readonly: true },
			code: { type: 'text', required: true },
			name: { type: 'text', required: true },
		},
		fks: {},
		template: { presentation: 'name code' },
	},

	"appsite_template": {
		base: 'machine_web',
		fields: {
			id:          { type: 'id', readonly: true },
			code:        { type: 'text', required: true },
			name:        { type: 'text', required: true },
			description: { type: 'text-long' },
		},
		fks: {},
		template: { presentation: 'name code' },
	},

	"appsite_template_type": {
		base: 'machine_web',
		isGroup: true,
		fields: {
			id:   { type: 'id', readonly: true },
			code: { type: 'text', required: true },
			name: { type: 'text', required: true },
		},
		fks: {},
		template: { presentation: 'name code' },
	},

	// ── XML ───────────────────────────────────────────────────────────────────

	"feed_header": {
		base: 'machine_xml',
		fields: {
			id:          { type: 'id', readonly: true },
			code:        { type: 'text', required: true },
			name:        { type: 'text', required: true },
			description: { type: 'text-long' },
			url:         { type: 'url' },
			isActive:    { type: 'boolean' },
		},
		fks: {},
		template: { presentation: 'name code' },
	},

	"xml_conf": {
		base: 'machine_xml',
		fields: {
			id:   { type: 'id', readonly: true },
			code: { type: 'text', required: true },
			name: { type: 'text', required: true },
		},
		fks: {},
		template: { presentation: 'name code' },
	},

	"xml_cruise": {
		base: 'machine_xml',
		fields: {
			id:   { type: 'id', readonly: true },
			code: { type: 'text', required: true },
			name: { type: 'text', required: true },
		},
		fks: {},
		template: { presentation: 'name code' },
	},

	"xml_destination": {
		base: 'machine_xml',
		fields: {
			id:   { type: 'id', readonly: true },
			code: { type: 'text', required: true },
			name: { type: 'text', required: true },
		},
		fks: {},
		template: { presentation: 'name code' },
	},

	"xml_itinerary": {
		base: 'machine_xml',
		fields: {
			id:   { type: 'id', readonly: true },
			code: { type: 'text', required: true },
			name: { type: 'text', required: true },
		},
		fks: {},
		template: { presentation: 'name code' },
	},

	"xml_job": {
		base: 'machine_xml',
		fields: {
			id:   { type: 'id', readonly: true },
			code: { type: 'text', required: true },
			name: { type: 'text', required: true },
		},
		fks: {},
		template: { presentation: 'name code' },
	},

	"xml_price": {
		base: 'machine_xml',
		fields: {
			id:        { type: 'id', readonly: true },
			code:      { type: 'text', required: true },
			name:      { type: 'text', required: true },
			price:     { type: 'currency' },
			startDate: { type: 'date' },
		},
		fks: {},
		template: { presentation: 'name code' },
	},

	"xml_ville": {
		base: 'machine_xml',
		fields: {
			id:   { type: 'id', readonly: true },
			code: { type: 'text', required: true },
			name: { type: 'text', required: true },
		},
		fks: {},
		template: { presentation: 'name code' },
	},
};

export default crfrScheme;
