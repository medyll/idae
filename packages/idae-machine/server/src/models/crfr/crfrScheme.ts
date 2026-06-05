// AUTO-GENERATED from legacy MongoDB crfr_sitebase_app + sampled _base.
// Source: appscheme / appscheme_has_field / appscheme_field (+ FK & undeclared fields inferred from _base docs).
// Reconstructed in idae-machine model-core (MachineModel) shape. Review 'undeclared' fields before seeding.
import type { MachineModel } from '../../../../src/lib/types/machine-model.js';

export const crfrScheme: MachineModel = {
	"aeroport": {
		base: 'machine_base',
		fields: {
			id:   { type: 'id', readonly: true },
			code: { type: 'text', required: true },
			name: { type: 'text', required: true },
			petitNom: { type: 'text' },
			description: { type: 'text-long' },
			image: { type: 'text' },
		},
		fks: {},
		template: { presentation: 'name code' },
	},

	"agent": {
		base: 'machine_base',
		isType:   true,
		fields: {
			id:   { type: 'id', readonly: true },
			code: { type: 'text', required: true },
			name: { type: 'text', required: true },
			petitNom: { type: 'text', required: true },
			estActif: { type: 'boolean' },
			prenom: { type: 'text', required: true },
			login: { type: 'text', required: true },
			// ── undeclared in registry, detected in _base — verify ──
			email: { type: 'email' },
			groupe: { type: 'text' },
			mailPassword: { type: 'email' },
			password: { type: 'text' },
		},
		fks: {},
		template: { presentation: 'name code' },
	},

	"agent_history": {
		base: 'machine_base',
		fields: {
			id:   { type: 'id', readonly: true },
			code: { type: 'text', required: true },
			name: { type: 'text', required: true },
		},
		fks: {},
		template: { presentation: 'name code' },
	},

	"agent_liste": {
		base: 'machine_base',
		fields: {
			id:   { type: 'id', readonly: true },
			code: { type: 'text', required: true },
			name: { type: 'text', required: true },
		},
		fks: {},
		template: { presentation: 'name code' },
	},

	"agent_note": {
		base: 'machine_base',
		fields: {
			id:   { type: 'id', readonly: true },
			code: { type: 'text', required: true },
			name: { type: 'text', required: true },
		},
		fks: {},
		template: { presentation: 'name code' },
	},

	"agent_recherche": {
		base: 'machine_base',
		fields: {
			id:   { type: 'id', readonly: true },
			code: { type: 'text', required: true },
			name: { type: 'text', required: true },
		},
		fks: {},
		template: { presentation: 'name code' },
	},

	"agent_table": {
		base: 'machine_base',
		fields: {
			id:   { type: 'id', readonly: true },
			code: { type: 'text', required: true },
			name: { type: 'text', required: true },
		},
		fks: {},
		template: { presentation: 'name code' },
	},

	"agent_tuile": {
		base: 'machine_base',
		fields: {
			id:   { type: 'id', readonly: true },
			code: { type: 'text', required: true },
			name: { type: 'text', required: true },
			// ── undeclared in registry, detected in _base — verify ──
			valeur: { type: 'text' },
		},
		fks: {},
		template: { presentation: 'name code' },
	},

	"agent_type": {
		base: 'machine_base',
		isGroup:  true,
		fields: {
			id:   { type: 'id', readonly: true },
			code: { type: 'text', required: true },
			name: { type: 'text', required: true },
		},
		fks: {},
		template: { presentation: 'name code' },
	},

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

	"app_version_file_preprod": {
		base: 'machine_base',
		fields: {
			id:   { type: 'id', readonly: true },
			code: { type: 'text', required: true },
			name: { type: 'text', required: true },
		},
		fks: {},
		template: { presentation: 'name code' },
	},

	"appsite": {
		base: 'machine_base',
		fields: {
			id:   { type: 'id', readonly: true },
			code: { type: 'text', required: true },
			name: { type: 'text', required: true },
			url: { type: 'url' },
		},
		fks: {},
		template: { presentation: 'name code' },
	},

	"appsite_page": {
		base: 'machine_base',
		isType:   true,
		fields: {
			id:   { type: 'id', readonly: true },
			code: { type: 'text', required: true },
			name: { type: 'text', required: true },
			ordre: { type: 'number' },
		},
		fks: {},
		template: { presentation: 'name code' },
	},

	"appsite_page_ligne": {
		base: 'machine_base',
		fields: {
			id:   { type: 'id', readonly: true },
			code: { type: 'text', required: true },
			name: { type: 'text', required: true },
			ordre: { type: 'number', required: true },
		},
		fks: {},
		template: { presentation: 'name code' },
	},

	"appsite_page_type": {
		base: 'machine_base',
		isGroup:  true,
		fields: {
			id:   { type: 'id', readonly: true },
			code: { type: 'text', required: true },
			name: { type: 'text', required: true },
		},
		fks: {},
		template: { presentation: 'name code' },
	},

	"appsite_template": {
		base: 'machine_base',
		fields: {
			id:   { type: 'id', readonly: true },
			code: { type: 'text', required: true },
			name: { type: 'text', required: true },
			description: { type: 'text-long' },
		},
		fks: {},
		template: { presentation: 'name code' },
	},

	"appsite_template_type": {
		base: 'machine_base',
		isGroup:  true,
		fields: {
			id:   { type: 'id', readonly: true },
			code: { type: 'text', required: true },
			name: { type: 'text', required: true },
		},
		fks: {},
		template: { presentation: 'name code' },
	},

	"article": {
		base: 'machine_base',
		isType:   true,
		fields: {
			id:   { type: 'id', readonly: true },
			code: { type: 'text', required: true },
			name: { type: 'text', required: true },
			// ── undeclared in registry, detected in _base — verify ──
			categorie_idcategorie: { type: 'text' },
			contenu: { type: 'text' },
			description: { type: 'text' },
			ordre: { type: 'number' },
			vignette: { type: 'text' },
		},
		fks: {
				categorie: { code: 'categorie', multiple: false },
				site: { code: 'site', multiple: false },
			},
		template: { presentation: 'name code' },
	},

	"article_type": {
		base: 'machine_base',
		isGroup:  true,
		fields: {
			id:   { type: 'id', readonly: true },
			code: { type: 'text', required: true },
			name: { type: 'text', required: true },
		},
		fks: {},
		template: { presentation: 'name code' },
	},

	"asavoir": {
		base: 'machine_base',
		isType:   true,
		fields: {
			id:   { type: 'id', readonly: true },
			code: { type: 'text', required: true },
			name: { type: 'text', required: true },
			// ── undeclared in registry, detected in _base — verify ──
			petitNom: { type: 'text' },
			atout: { type: 'text' },
			description: { type: 'text' },
			information: { type: 'text' },
		},
		fks: {
				asavoir_type: { code: 'asavoir_type', multiple: false },
			},
		template: { presentation: 'name code' },
	},

	"asavoir_type": {
		base: 'machine_base',
		isGroup:  true,
		fields: {
			id:   { type: 'id', readonly: true },
			code: { type: 'text', required: true },
			name: { type: 'text', required: true },
			// ── undeclared in registry, detected in _base — verify ──
			petitNom: { type: 'text' },
			atout: { type: 'text' },
			description: { type: 'text' },
			information: { type: 'text' },
		},
		fks: {},
		template: { presentation: 'name code' },
	},

	"categorie": {
		base: 'machine_base',
		fields: {
			id:   { type: 'id', readonly: true },
			code: { type: 'text', required: true },
			name: { type: 'text', required: true },
			// ── undeclared in registry, detected in _base — verify ──
			description: { type: 'text' },
			ordre: { type: 'number' },
		},
		fks: {
				site: { code: 'site', multiple: false },
			},
		template: { presentation: 'name code' },
	},

	"client": {
		base: 'machine_base',
		isType:   true,
		fields: {
			id:   { type: 'id', readonly: true },
			code: { type: 'text', required: true },
			name: { type: 'text', required: true },
			actif: { type: 'boolean' },
			prenom: { type: 'text' },
			dateCreation: { type: 'date' },
			codePostal: { type: 'text' },
			adresse: { type: 'text' },
			ville: { type: 'text' },
			email: { type: 'email' },
			mobile: { type: 'phone' },
			telephone: { type: 'phone' },
			heureCreation: { type: 'datetime' },
			// ── undeclared in registry, detected in _base — verify ──
			adressePlus: { type: 'text' },
			estClient: { type: 'boolean' },
			grilleDestination: { type: 'text' },
			grilleFournisseur: { type: 'text' },
			grilleProduitType: { type: 'text' },
			ip: { type: 'text' },
			scope: { type: 'text' },
			sexe: { type: 'text' },
		},
		fks: {},
		template: { presentation: 'name code' },
	},

	"client_type": {
		base: 'machine_base',
		isGroup:  true,
		fields: {
			id:   { type: 'id', readonly: true },
			code: { type: 'text', required: true },
			name: { type: 'text', required: true },
			ordre: { type: 'number' },
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
		fks: {},
		template: { presentation: 'name code' },
	},

	"conge_statut": {
		base: 'machine_base',
		isGroup:  true,
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
		isGroup:  true,
		fields: {
			id:   { type: 'id', readonly: true },
			code: { type: 'text', required: true },
			name: { type: 'text', required: true },
		},
		fks: {},
		template: { presentation: 'name code' },
	},

	"continent": {
		base: 'machine_base',
		fields: {
			id:   { type: 'id', readonly: true },
			code: { type: 'text', required: true },
			name: { type: 'text', required: true },
			description: { type: 'text-long' },
			color: { type: 'text' },
			ref: { type: 'text' },
			// ── undeclared in registry, detected in _base — verify ──
			adjectif: { type: 'text' },
			ordre: { type: 'number' },
			prefixe: { type: 'text' },
			estTop: { type: 'boolean' },
			estVisible: { type: 'boolean' },
			estActif: { type: 'boolean' },
			petitNom: { type: 'text' },
			nombreVue: { type: 'number' },
		},
		fks: {},
		template: { presentation: 'name code' },
	},

	"daemon": {
		base: 'machine_base',
		fields: {
			id:   { type: 'id', readonly: true },
			code: { type: 'text', required: true },
			name: { type: 'text', required: true },
			date: { type: 'date' },
			dateDebut: { type: 'date' },
			heureDebut: { type: 'date' },
			heure: { type: 'datetime' },
		},
		fks: {},
		template: { presentation: 'name code' },
	},

	"destination": {
		base: 'machine_base',
		fields: {
			id:   { type: 'id', readonly: true },
			code: { type: 'text', required: true },
			name: { type: 'text', required: true },
			color: { type: 'text' },
			ref: { type: 'text' },
			information: { type: 'text' },
			description: { type: 'text-long' },
			// ── undeclared in registry, detected in _base — verify ──
			adjectifContinent: { type: 'text' },
			adjectif: { type: 'text' },
			adjectifPays: { type: 'text' },
			descriptionVille: { type: 'text' },
			estTop: { type: 'boolean' },
			latitudeVille: { type: 'text' },
			longitudeVille: { type: 'text' },
			ordrePays: { type: 'text' },
			ordreVille: { type: 'text' },
			prefixeContinent: { type: 'text' },
			prefixe: { type: 'text' },
			prefixePays: { type: 'text' },
			nombreVue: { type: 'number' },
		},
		fks: {
				continent: { code: 'continent', multiple: false },
				pays: { code: 'pays', multiple: false },
				ville: { code: 'ville', multiple: false },
			},
		template: { presentation: 'name code' },
	},

	"devis": {
		base: 'machine_base',
		isType:   true,
		isStatus: true,
		fields: {
			id:   { type: 'id', readonly: true },
			code: { type: 'text', required: true },
			name: { type: 'text', required: true },
			prix: { type: 'currency' },
			dateCreation: { type: 'date' },
			description: { type: 'text-long' },
			email: { type: 'email' },
			heureCreation: { type: 'datetime' },
			dateDebut: { type: 'date' },
			telephone: { type: 'phone' },
			// ── undeclared in registry, detected in _base — verify ──
			archive: { type: 'boolean' },
			devisCommentaire: { type: 'text' },
			dreamLetter: { type: 'text' },
			envie: { type: 'text' },
			ipClient: { type: 'text' },
			md5: { type: 'text' },
			mongodate: { type: 'datetime' },
			nombreAdulte: { type: 'number' },
			nombreEnfant: { type: 'number' },
			numero: { type: 'text' },
			prixSite: { type: 'url' },
			scope: { type: 'text' },
			sexe: { type: 'text' },
			timestamp: { type: 'datetime' },
			type: { type: 'text' },
			nbreAdulte: { type: 'number' },
		},
		fks: {
				client: { code: 'client', multiple: false },
				fournisseur: { code: 'fournisseur', multiple: false },
				hotel_gamme: { code: 'hotel_gamme', multiple: false },
				produit: { code: 'produit', multiple: false },
				produit_tarif: { code: 'produit_tarif', multiple: false },
				produit_tarif_gamme: { code: 'produit_tarif_gamme', multiple: false },
				transport: { code: 'transport', multiple: false },
				devis_type: { code: 'devis_type', multiple: false },
				produit_type: { code: 'produit_type', multiple: false },
				devis_statut: { code: 'devis_statut', multiple: false },
			},
		template: { presentation: 'name code' },
	},

	"devis_acompte": {
		base: 'machine_base',
		isType:   true,
		fields: {
			id:   { type: 'id', readonly: true },
			code: { type: 'text', required: true },
			name: { type: 'text', required: true },
			prix: { type: 'currency' },
			date: { type: 'date' },
		},
		fks: {},
		template: { presentation: 'name code' },
	},

	"devis_acompte_type": {
		base: 'machine_base',
		isGroup:  true,
		fields: {
			id:   { type: 'id', readonly: true },
			code: { type: 'text', required: true },
			name: { type: 'text', required: true },
			ordre: { type: 'number' },
		},
		fks: {},
		template: { presentation: 'name code' },
	},

	"devis_annotation": {
		base: 'machine_base',
		fields: {
			id:   { type: 'id', readonly: true },
			code: { type: 'text', required: true },
			name: { type: 'text', required: true },
		},
		fks: {},
		template: { presentation: 'name code' },
	},

	"devis_envie": {
		base: 'machine_base',
		fields: {
			id:   { type: 'id', readonly: true },
			code: { type: 'text', required: true },
			name: { type: 'text', required: true },
		},
		fks: {},
		template: { presentation: 'name code' },
	},

	"devis_mail": {
		base: 'machine_base',
		fields: {
			id:   { type: 'id', readonly: true },
			code: { type: 'text', required: true },
			name: { type: 'text', required: true },
		},
		fks: {},
		template: { presentation: 'name code' },
	},

	"devis_marge": {
		base: 'machine_base',
		isType:   true,
		fields: {
			id:   { type: 'id', readonly: true },
			code: { type: 'text', required: true },
			name: { type: 'text', required: true },
			ordre: { type: 'number' },
			prixAchat: { type: 'currency' },
			// ── undeclared in registry, detected in _base — verify ──
			iddevis_prestataire: { type: 'text' },
		},
		fks: {},
		template: { presentation: 'name code' },
	},

	"devis_marge_type": {
		base: 'machine_base',
		isGroup:  true,
		fields: {
			id:   { type: 'id', readonly: true },
			code: { type: 'text', required: true },
			name: { type: 'text', required: true },
		},
		fks: {},
		template: { presentation: 'name code' },
	},

	"devis_passager": {
		base: 'machine_base',
		fields: {
			id:   { type: 'id', readonly: true },
			code: { type: 'text', required: true },
			name: { type: 'text', required: true },
			prenom: { type: 'text' },
			email: { type: 'email' },
			telephone: { type: 'phone' },
		},
		fks: {},
		template: { presentation: 'name code' },
	},

	"devis_prestation": {
		base: 'machine_base',
		fields: {
			id:   { type: 'id', readonly: true },
			code: { type: 'text', required: true },
			name: { type: 'text', required: true },
			ordre: { type: 'number' },
			prix: { type: 'currency' },
			quantite: { type: 'number' },
			description: { type: 'text-long' },
			total: { type: 'currency' },
		},
		fks: {},
		template: { presentation: 'name code' },
	},

	"devis_statut": {
		base: 'machine_base',
		isGroup:  true,
		fields: {
			id:   { type: 'id', readonly: true },
			code: { type: 'text', required: true },
			name: { type: 'text', required: true },
			ordre: { type: 'number' },
		},
		fks: {},
		template: { presentation: 'name code' },
	},

	"devis_type": {
		base: 'machine_base',
		isGroup:  true,
		fields: {
			id:   { type: 'id', readonly: true },
			code: { type: 'text', required: true },
			name: { type: 'text', required: true },
			ordre: { type: 'number' },
			// ── undeclared in registry, detected in _base — verify ──
			petitNom: { type: 'text' },
			description: { type: 'text' },
			iddevis_type_type: { type: 'text' },
		},
		fks: {},
		template: { presentation: 'name code' },
	},

	"document": {
		base: 'machine_base',
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
		isGroup:  true,
		fields: {
			id:   { type: 'id', readonly: true },
			code: { type: 'text', required: true },
			name: { type: 'text', required: true },
		},
		fks: {},
		template: { presentation: 'name code' },
	},

	"dossier_devis": {
		base: 'machine_base',
		fields: {
			id:   { type: 'id', readonly: true },
			code: { type: 'text', required: true },
			name: { type: 'text', required: true },
			// ── undeclared in registry, detected in _base — verify ──
			numeroDossierDevis: { type: 'text' },
			numero: { type: 'text' },
		},
		fks: {
				devis: { code: 'devis', multiple: false },
			},
		template: { presentation: 'name code' },
	},

	"facture": {
		base: 'machine_base',
		isType:   true,
		fields: {
			id:   { type: 'id', readonly: true },
			code: { type: 'text', required: true },
			name: { type: 'text', required: true },
			date: { type: 'date' },
			total: { type: 'currency' },
			// ── undeclared in registry, detected in _base — verify ──
			grille: { type: 'text' },
			numeroDossierDevis: { type: 'text' },
			numeroFactureDevis: { type: 'text' },
			pctTvaFR: { type: 'text' },
			pctTvaHUE: { type: 'text' },
			pctTvaUE: { type: 'text' },
			referenceExterne: { type: 'text' },
			titre: { type: 'text' },
			txn_id: { type: 'text' },
			type: { type: 'text' },
			numeroDossier_devis: { type: 'text' },
		},
		fks: {
				client: { code: 'client', multiple: false },
				devis: { code: 'devis', multiple: false },
				dossier_devis: { code: 'dossier_devis', multiple: false },
				facture_type: { code: 'facture_type', multiple: false },
			},
		template: { presentation: 'name code' },
	},

	"facture_ligne": {
		base: 'machine_base',
		fields: {
			id:   { type: 'id', readonly: true },
			code: { type: 'text', required: true },
			name: { type: 'text', required: true },
		},
		fks: {},
		template: { presentation: 'name code' },
	},

	"facture_type": {
		base: 'machine_base',
		isGroup:  true,
		fields: {
			id:   { type: 'id', readonly: true },
			code: { type: 'text', required: true },
			name: { type: 'text', required: true },
		},
		fks: {},
		template: { presentation: 'name code' },
	},

	"feed_header": {
		base: 'machine_base',
		fields: {
			id:   { type: 'id', readonly: true },
			code: { type: 'text', required: true },
			name: { type: 'text', required: true },
			description: { type: 'text-long' },
			url: { type: 'url' },
			estActif: { type: 'boolean' },
		},
		fks: {},
		template: { presentation: 'name code' },
	},

	"fleuve": {
		base: 'machine_base',
		isType:   true,
		fields: {
			id:   { type: 'id', readonly: true },
			code: { type: 'text', required: true },
			name: { type: 'text', required: true },
			image: { type: 'text' },
			description: { type: 'text-long' },
			// ── undeclared in registry, detected in _base — verify ──
			fleuve_id: { type: 'text' },
			idfleuve_trad: { type: 'text' },
			lang_idlang: { type: 'text' },
			ordre: { type: 'number' },
			url: { type: 'url' },
		},
		fks: {
				pays: { code: 'pays', multiple: false },
			},
		template: { presentation: 'name code' },
	},

	"fleuve_type": {
		base: 'machine_base',
		isGroup:  true,
		fields: {
			id:   { type: 'id', readonly: true },
			code: { type: 'text', required: true },
			name: { type: 'text', required: true },
		},
		fks: {},
		template: { presentation: 'name code' },
	},

	"fournisseur": {
		base: 'machine_base',
		isType:   true,
		fields: {
			id:   { type: 'id', readonly: true },
			code: { type: 'text', required: true },
			name: { type: 'text', required: true },
			color: { type: 'text' },
			petitNom: { type: 'text' },
			description: { type: 'text-long' },
		},
		fks: {},
		template: { presentation: 'name code' },
	},

	"fournisseur_clause": {
		base: 'machine_base',
		isType:   true,
		fields: {
			id:   { type: 'id', readonly: true },
			code: { type: 'text', required: true },
			name: { type: 'text', required: true },
			ordre: { type: 'number' },
			descriptionHTML: { type: 'text' },
		},
		fks: {},
		template: { presentation: 'name code' },
	},

	"fournisseur_clause_type": {
		base: 'machine_base',
		isGroup:  true,
		fields: {
			id:   { type: 'id', readonly: true },
			code: { type: 'text', required: true },
			name: { type: 'text', required: true },
		},
		fks: {},
		template: { presentation: 'name code' },
	},

	"fournisseur_presentation": {
		base: 'machine_base',
		fields: {
			id:   { type: 'id', readonly: true },
			code: { type: 'text', required: true },
			name: { type: 'text', required: true },
			description: { type: 'text-long' },
		},
		fks: {},
		template: { presentation: 'name code' },
	},

	"fournisseur_presentation_type": {
		base: 'machine_base',
		isGroup:  true,
		fields: {
			id:   { type: 'id', readonly: true },
			code: { type: 'text', required: true },
			name: { type: 'text', required: true },
			description: { type: 'text-long' },
		},
		fks: {},
		template: { presentation: 'name code' },
	},

	"fournisseur_type": {
		base: 'machine_base',
		isGroup:  true,
		fields: {
			id:   { type: 'id', readonly: true },
			code: { type: 'text', required: true },
			name: { type: 'text', required: true },
			// ── undeclared in registry, detected in _base — verify ──
			adjectif: { type: 'text' },
			pluriel: { type: 'text' },
			prefixe: { type: 'text' },
		},
		fks: {
				transport_type: { code: 'transport_type', multiple: false },
			},
		template: { presentation: 'name code' },
	},

	"gamme": {
		base: 'machine_base',
		fields: {
			id:   { type: 'id', readonly: true },
			code: { type: 'text', required: true },
			name: { type: 'text', required: true },
			image: { type: 'text' },
			ordre: { type: 'number' },
			description: { type: 'text-long' },
			// ── undeclared in registry, detected in _base — verify ──
			idgamme_trad: { type: 'text' },
			idlang: { type: 'text' },
			idtype_produit: { type: 'text' },
			visibleClient: { type: 'text' },
		},
		fks: {
				produit_type: { code: 'produit_type', multiple: false },
			},
		template: { presentation: 'name code' },
	},

	"groupe_agent": {
		base: 'machine_base',
		fields: {
			id:   { type: 'id', readonly: true },
			code: { type: 'text', required: true },
			name: { type: 'text', required: true },
		},
		fks: {},
		template: { presentation: 'name code' },
	},

	"hotel": {
		base: 'machine_base',
		isType:   true,
		fields: {
			id:   { type: 'id', readonly: true },
			code: { type: 'text', required: true },
			name: { type: 'text', required: true },
			image: { type: 'text' },
			codePostal: { type: 'text' },
			adresse: { type: 'text' },
			ville: { type: 'text' },
			// ── undeclared in registry, detected in _base — verify ──
			description: { type: 'text' },
			etoile: { type: 'text' },
			nombreVue: { type: 'number' },
		},
		fks: {
				ville: { code: 'ville', multiple: false },
			},
		template: { presentation: 'name code' },
	},

	"hotel_clause": {
		base: 'machine_base',
		fields: {
			id:   { type: 'id', readonly: true },
			code: { type: 'text', required: true },
			name: { type: 'text', required: true },
			description: { type: 'text-long' },
		},
		fks: {},
		template: { presentation: 'name code' },
	},

	"hotel_gamme": {
		base: 'machine_base',
		fields: {
			id:   { type: 'id', readonly: true },
			code: { type: 'text', required: true },
			name: { type: 'text', required: true },
			// ── undeclared in registry, detected in _base — verify ──
			ordreGamme: { type: 'text' },
		},
		fks: {
				gamme: { code: 'gamme', multiple: false },
				hotel: { code: 'hotel', multiple: false },
				produit_type: { code: 'produit_type', multiple: false },
			},
		template: { presentation: 'name code' },
	},

	"hotel_type": {
		base: 'machine_base',
		isGroup:  true,
		fields: {
			id:   { type: 'id', readonly: true },
			code: { type: 'text', required: true },
			name: { type: 'text', required: true },
			// ── undeclared in registry, detected in _base — verify ──
			petitNom: { type: 'text' },
			description: { type: 'text' },
		},
		fks: {},
		template: { presentation: 'name code' },
	},

	"mer": {
		base: 'machine_base',
		isType:   true,
		fields: {
			id:   { type: 'id', readonly: true },
			code: { type: 'text', required: true },
			name: { type: 'text', required: true },
			image: { type: 'text' },
			petitNom: { type: 'text' },
			description: { type: 'text-long' },
			// ── undeclared in registry, detected in _base — verify ──
			nombreVue: { type: 'number' },
		},
		fks: {
				mer_type: { code: 'mer_type', multiple: false },
			},
		template: { presentation: 'name code' },
	},

	"mer_type": {
		base: 'machine_base',
		isGroup:  true,
		fields: {
			id:   { type: 'id', readonly: true },
			code: { type: 'text', required: true },
			name: { type: 'text', required: true },
		},
		fks: {},
		template: { presentation: 'name code' },
	},

	"newsletter": {
		base: 'machine_base',
		isType:   true,
		fields: {
			id:   { type: 'id', readonly: true },
			code: { type: 'text', required: true },
			name: { type: 'text', required: true },
			color: { type: 'text' },
			date: { type: 'date' },
			description: { type: 'text-long' },
			url: { type: 'url' },
			bgcolor: { type: 'text' },
			// ── undeclared in registry, detected in _base — verify ──
			F_action: { type: 'text' },
			color_background: { type: 'text' },
			content: { type: 'text' },
			date_created: { type: 'text' },
			date_modified: { type: 'text' },
			date_: { type: 'text' },
			preview_content: { type: 'text' },
			title: { type: 'text' },
		},
		fks: {},
		template: { presentation: 'name code' },
	},

	"newsletter_block": {
		base: 'machine_base',
		fields: {
			id:   { type: 'id', readonly: true },
			code: { type: 'text', required: true },
			name: { type: 'text', required: true },
		},
		fks: {},
		template: { presentation: 'name code' },
	},

	"newsletter_item": {
		base: 'machine_base',
		isType:   true,
		fields: {
			id:   { type: 'id', readonly: true },
			code: { type: 'text', required: true },
			name: { type: 'text', required: true },
			description: { type: 'text-long' },
			ordre: { type: 'number' },
			url: { type: 'url' },
		},
		fks: {},
		template: { presentation: 'name code' },
	},

	"newsletter_item_type": {
		base: 'machine_base',
		isGroup:  true,
		fields: {
			id:   { type: 'id', readonly: true },
			code: { type: 'text', required: true },
			name: { type: 'text', required: true },
			quantite: { type: 'number', required: true },
		},
		fks: {},
		template: { presentation: 'name code' },
	},

	"newsletter_type": {
		base: 'machine_base',
		isGroup:  true,
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
			id:   { type: 'id', readonly: true },
			code: { type: 'text', required: true },
			name: { type: 'text', required: true },
			// ── undeclared in registry, detected in _base — verify ──
			estActif: { type: 'boolean' },
			idnote_origine: { type: 'text' },
			idagent_writer: { type: 'text' },
			texte: { type: 'text' },
		},
		fks: {},
		template: { presentation: 'name code' },
	},

	"paiement": {
		base: 'machine_base',
		fields: {
			id:   { type: 'id', readonly: true },
			code: { type: 'text', required: true },
			name: { type: 'text', required: true },
			// ── undeclared in registry, detected in _base — verify ──
			montant: { type: 'currency' },
			type: { type: 'text' },
			mode: { type: 'text' },
			referenceExterne: { type: 'text' },
			pseudoAgent: { type: 'text' },
			numeroDossierDevis: { type: 'text' },
		},
		fks: {
				devis: { code: 'devis', multiple: false },
				client: { code: 'client', multiple: false },
			},
		template: { presentation: 'name code' },
	},

	"pays": {
		base: 'machine_base',
		fields: {
			id:   { type: 'id', readonly: true },
			code: { type: 'text', required: true },
			name: { type: 'text', required: true },
			image: { type: 'text' },
			// ── undeclared in registry, detected in _base — verify ──
			aVisa: { type: 'text' },
			adjectifContinent: { type: 'text' },
			adjectifDestination: { type: 'text' },
			adjectif: { type: 'text' },
			count: { type: 'number' },
			countCF: { type: 'text' },
			countCR: { type: 'text' },
			countTR: { type: 'text' },
			description: { type: 'text' },
			infoVisa: { type: 'text' },
			ordre: { type: 'number' },
			prefixeContinent: { type: 'text' },
			prefixeDestination: { type: 'text' },
			prefixe: { type: 'text' },
			nombreVue: { type: 'number' },
		},
		fks: {
				continent: { code: 'continent', multiple: false },
				destination: { code: 'destination', multiple: false },
			},
		template: { presentation: 'name code' },
	},

	"prestataire": {
		base: 'machine_base',
		fields: {
			id:   { type: 'id', readonly: true },
			code: { type: 'text', required: true },
			name: { type: 'text', required: true },
			// ── undeclared in registry, detected in _base — verify ──
			commercial: { type: 'text' },
			commission: { type: 'text' },
			contact: { type: 'text' },
			description: { type: 'text' },
			fax: { type: 'phone' },
			lienweb: { type: 'url' },
			mailCommercial: { type: 'email' },
			scope: { type: 'text' },
			telephone: { type: 'phone' },
			telephoneResa: { type: 'phone' },
		},
		fks: {},
		template: { presentation: 'name code' },
	},

	"produit": {
		base: 'machine_base',
		isType:   true,
		fields: {
			id:   { type: 'id', readonly: true },
			code: { type: 'text', required: true },
			name: { type: 'text', required: true },
			prix: { type: 'currency' },
			date: { type: 'date' },
			duree: { type: 'number' },
			estTop: { type: 'boolean' },
			estVisible: { type: 'boolean' },
			estActif: { type: 'boolean' },
			// ── undeclared in registry, detected in _base — verify ──
			autreNom_Transport: { type: 'text' },
			description: { type: 'text' },
			dureeJour: { type: 'text' },
			estActifFournisseur: { type: 'boolean' },
			estTopDestination: { type: 'boolean' },
			estTopFournisseur: { type: 'boolean' },
			grilleClause: { type: 'text' },
			grilleDestination: { type: 'text' },
			grilleEtape: { type: 'text' },
			grillePrestation: { type: 'text' },
			grilleTheme: { type: 'text' },
			has_changed: { type: 'text' },
			idmarche: { type: 'text' },
			idpaysArrivee: { type: 'text' },
			idpaysDepart: { type: 'text' },
			idvilleArrivee: { type: 'text' },
			idvilleDepart: { type: 'text' },
			nombreVue: { type: 'number' },
			ordreFournisseur: { type: 'text' },
			ordreHomePage: { type: 'text' },
			pensionComplete: { type: 'text' },
			petitNomFournisseur: { type: 'text' },
			plurielProduit_type: { type: 'text' },
			plusPetitPrix: { type: 'text' },
			prefixeDestination: { type: 'text' },
			prefixeFournisseur_type: { type: 'text' },
			prefixeProduit_type: { type: 'text' },
			prixPromo: { type: 'currency' },
			promo: { type: 'text' },
			reference: { type: 'text' },
			scope: { type: 'text' },
			sousTitre: { type: 'text' },
			sousTitrePromo: { type: 'text' },
			texteProduit_clause: { type: 'text' },
			villeArrivee: { type: 'text' },
			villeDepart: { type: 'text' },
			webNomProduit_type: { type: 'text' },
			webPlurielProduit_type: { type: 'text' },
			grilleDate: { type: 'text' },
		},
		fks: {
				continent: { code: 'continent', multiple: false },
				destination: { code: 'destination', multiple: false },
				fournisseur: { code: 'fournisseur', multiple: false },
				fournisseur_type: { code: 'fournisseur_type', multiple: false },
				prestataire: { code: 'prestataire', multiple: false },
				produit_type: { code: 'produit_type', multiple: false },
				transport: { code: 'transport', multiple: false },
				transport_type: { code: 'transport_type', multiple: false },
				ville: { code: 'ville', multiple: false },
				pays: { code: 'pays', multiple: false },
			},
		template: { presentation: 'name code' },
	},

	"produit_etape": {
		base: 'machine_base',
		fields: {
			id:   { type: 'id', readonly: true },
			code: { type: 'text', required: true },
			name: { type: 'text', required: true },
			image: { type: 'text' },
			ordre: { type: 'number' },
			description: { type: 'text-long' },
			heureDebut: { type: 'date' },
			heureFin: { type: 'date' },
		},
		fks: {
				produit: { code: 'produit', multiple: false },
				ville: { code: 'ville', multiple: false },
			},
		template: { presentation: 'name code' },
	},

	"produit_selection": {
		base: 'machine_base',
		fields: {
			id:   { type: 'id', readonly: true },
			code: { type: 'text', required: true },
			name: { type: 'text', required: true },
			// ── undeclared in registry, detected in _base — verify ──
			F_action: { type: 'text' },
			actif: { type: 'boolean' },
			afterAction: { type: 'text' },
			description: { type: 'text' },
			reloadModule: { type: 'text' },
		},
		fks: {},
		template: { presentation: 'name code' },
	},

	"produit_tarif": {
		base: 'machine_base',
		fields: {
			id:   { type: 'id', readonly: true },
			code: { type: 'text', required: true },
			name: { type: 'text', required: true },
			prix: { type: 'currency' },
			date: { type: 'date' },
			// ── undeclared in registry, detected in _base — verify ──
			mongodate: { type: 'datetime' },
			annee: { type: 'text' },
			mois: { type: 'text' },
			mois_fr: { type: 'text' },
			mois_annee_fr: { type: 'text' },
		},
		fks: {
				produit: { code: 'produit', multiple: false },
			},
		template: { presentation: 'name code' },
	},

	"produit_tarif_gamme": {
		base: 'machine_base',
		isType:   true,
		fields: {
			id:   { type: 'id', readonly: true },
			code: { type: 'text', required: true },
			name: { type: 'text', required: true },
			prix: { type: 'currency' },
			// ── undeclared in registry, detected in _base — verify ──
			prixPromo: { type: 'currency' },
		},
		fks: {
				gamme: { code: 'gamme', multiple: false },
				produit: { code: 'produit', multiple: false },
				produit_tarif: { code: 'produit_tarif', multiple: false },
			},
		template: { presentation: 'name code' },
	},

	"produit_tarif_gamme_type": {
		base: 'machine_base',
		isGroup:  true,
		fields: {
			id:   { type: 'id', readonly: true },
			code: { type: 'text', required: true },
			name: { type: 'text', required: true },
		},
		fks: {},
		template: { presentation: 'name code' },
	},

	"produit_type": {
		base: 'machine_base',
		isType:   true,
		isGroup:  true,
		fields: {
			id:   { type: 'id', readonly: true },
			code: { type: 'text', required: true },
			name: { type: 'text', required: true },
			// ── undeclared in registry, detected in _base — verify ──
			description: { type: 'text' },
			estActif: { type: 'boolean' },
			estVisible: { type: 'boolean' },
			metaDescription: { type: 'text' },
			metaTitle: { type: 'text' },
			ordre: { type: 'number' },
			pluriel: { type: 'text' },
			webNom: { type: 'text' },
			webPluriel: { type: 'text' },
			nombreVue: { type: 'number' },
		},
		fks: {},
		template: { presentation: 'name code' },
	},

	"produit_type_type": {
		base: 'machine_base',
		isGroup:  true,
		fields: {
			id:   { type: 'id', readonly: true },
			code: { type: 'text', required: true },
			name: { type: 'text', required: true },
		},
		fks: {},
		template: { presentation: 'name code' },
	},

	"site": {
		base: 'machine_base',
		isType:   true,
		fields: {
			id:   { type: 'id', readonly: true },
			code: { type: 'text', required: true },
			name: { type: 'text', required: true },
			// ── undeclared in registry, detected in _base — verify ──
			ATTR: { type: 'text' },
			SERVER_ADDR: { type: 'text' },
			contact: { type: 'text' },
			domain: { type: 'text' },
			sousTitre: { type: 'text' },
			texteIntro: { type: 'text' },
			url: { type: 'url' },
		},
		fks: {},
		template: { presentation: 'name code' },
	},

	"site_type": {
		base: 'machine_base',
		isGroup:  true,
		fields: {
			id:   { type: 'id', readonly: true },
			code: { type: 'text', required: true },
			name: { type: 'text', required: true },
		},
		fks: {},
		template: { presentation: 'name code' },
	},

	"tache": {
		base: 'machine_base',
		isType:   true,
		isStatus: true,
		fields: {
			id:   { type: 'id', readonly: true },
			code: { type: 'text', required: true },
			name: { type: 'text', required: true },
			dateDebut: { type: 'date' },
			dateFin: { type: 'date' },
			description: { type: 'text-long' },
			heureDebut: { type: 'date' },
			heureFin: { type: 'date' },
		},
		fks: {
				client: { code: 'client', multiple: false },
				tache_type: { code: 'tache_type', multiple: false },
			},
		template: { presentation: 'name code' },
	},

	"tache_statut": {
		base: 'machine_base',
		isGroup:  true,
		fields: {
			id:   { type: 'id', readonly: true },
			code: { type: 'text', required: true },
			name: { type: 'text', required: true },
			ordre: { type: 'number' },
			color: { type: 'text' },
			icon: { type: 'text' },
		},
		fks: {},
		template: { presentation: 'name code' },
	},

	"tache_type": {
		base: 'machine_base',
		isGroup:  true,
		fields: {
			id:   { type: 'id', readonly: true },
			code: { type: 'text', required: true },
			name: { type: 'text', required: true },
			ordre: { type: 'number' },
			color: { type: 'text' },
			icon: { type: 'text' },
		},
		fks: {},
		template: { presentation: 'name code' },
	},

	"theme": {
		base: 'machine_base',
		isType:   true,
		fields: {
			id:   { type: 'id', readonly: true },
			code: { type: 'text', required: true },
			name: { type: 'text', required: true },
			// ── undeclared in registry, detected in _base — verify ──
			actifProduit_: { type: 'text' },
			actifProduit_theme_type: { type: 'text' },
			actif: { type: 'boolean' },
			actifTheme_type: { type: 'text' },
			descriptionProduit_: { type: 'text' },
			description: { type: 'text' },
			idproduit_: { type: 'text' },
			idproduit_theme_type: { type: 'text' },
			petitNom: { type: 'text' },
			atout: { type: 'text' },
			information: { type: 'text' },
		},
		fks: {
				theme_type: { code: 'theme_type', multiple: false },
			},
		template: { presentation: 'name code' },
	},

	"theme_type": {
		base: 'machine_base',
		isGroup:  true,
		fields: {
			id:   { type: 'id', readonly: true },
			code: { type: 'text', required: true },
			name: { type: 'text', required: true },
			// ── undeclared in registry, detected in _base — verify ──
			actifProduit_: { type: 'text' },
			actif: { type: 'boolean' },
			idproduit_: { type: 'text' },
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

	"transport": {
		base: 'machine_base',
		isType:   true,
		fields: {
			id:   { type: 'id', readonly: true },
			code: { type: 'text', required: true },
			name: { type: 'text', required: true },
			color: { type: 'text' },
			description: { type: 'text-long' },
			// ── undeclared in registry, detected in _base — verify ──
			autreNom_: { type: 'text' },
			countProduit: { type: 'text' },
			descriptionExt: { type: 'text' },
			estActifProduit_type: { type: 'boolean' },
			estTop: { type: 'boolean' },
			ordreProduit_type: { type: 'text' },
			plurielProduit_type: { type: 'text' },
			plurielTransport_type: { type: 'text' },
			prefixeProduit_type: { type: 'text' },
			scope: { type: 'text' },
			webNomProduit_type: { type: 'text' },
			webPlurielProduit_type: { type: 'text' },
		},
		fks: {
				fournisseur: { code: 'fournisseur', multiple: false },
				produit_type: { code: 'produit_type', multiple: false },
				transport_type: { code: 'transport_type', multiple: false },
			},
		template: { presentation: 'name code' },
	},

	"transport_cabine": {
		base: 'machine_base',
		fields: {
			id:   { type: 'id', readonly: true },
			code: { type: 'text', required: true },
			name: { type: 'text', required: true },
			ordre: { type: 'number' },
			description: { type: 'text-long' },
			// ── undeclared in registry, detected in _base — verify ──
			ordreGamme: { type: 'text' },
			descriptionExtTransport_gamme: { type: 'text' },
			idgamme_trad: { type: 'text' },
			idlang: { type: 'text' },
			visibleClientGamme: { type: 'text' },
		},
		fks: {
				transport: { code: 'transport', multiple: false },
				gamme: { code: 'gamme', multiple: false },
				produit_type: { code: 'produit_type', multiple: false },
			},
		template: { presentation: 'name code' },
	},

	"transport_gamme": {
		base: 'machine_base',
		fields: {
			id:   { type: 'id', readonly: true },
			code: { type: 'text', required: true },
			name: { type: 'text', required: true },
		},
		fks: {},
		template: { presentation: 'name code' },
	},

	"transport_pont": {
		base: 'machine_base',
		fields: {
			id:   { type: 'id', readonly: true },
			code: { type: 'text', required: true },
			name: { type: 'text', required: true },
			ordre: { type: 'number' },
		},
		fks: {},
		template: { presentation: 'name code' },
	},

	"transport_presentation": {
		base: 'machine_base',
		isType:   true,
		fields: {
			id:   { type: 'id', readonly: true },
			code: { type: 'text', required: true },
			name: { type: 'text', required: true },
		},
		fks: {},
		template: { presentation: 'name code' },
	},

	"transport_presentation_type": {
		base: 'machine_base',
		isGroup:  true,
		fields: {
			id:   { type: 'id', readonly: true },
			code: { type: 'text', required: true },
			name: { type: 'text', required: true },
		},
		fks: {},
		template: { presentation: 'name code' },
	},

	"transport_type": {
		base: 'machine_base',
		isGroup:  true,
		fields: {
			id:   { type: 'id', readonly: true },
			code: { type: 'text', required: true },
			name: { type: 'text', required: true },
			// ── undeclared in registry, detected in _base — verify ──
			pluriel: { type: 'text' },
		},
		fks: {},
		template: { presentation: 'name code' },
	},

	"type_activite": {
		base: 'machine_base',
		fields: {
			id:   { type: 'id', readonly: true },
			code: { type: 'text', required: true },
			name: { type: 'text', required: true },
			// ── undeclared in registry, detected in _base — verify ──
			petitNom: { type: 'text' },
			description: { type: 'text' },
		},
		fks: {},
		template: { presentation: 'name code' },
	},

	"vacance": {
		base: 'machine_base',
		fields: {
			id:   { type: 'id', readonly: true },
			code: { type: 'text', required: true },
			name: { type: 'text', required: true },
			dateDebut: { type: 'date' },
			dateFin: { type: 'date' },
			// ── undeclared in registry, detected in _base — verify ──
			F_action: { type: 'text' },
			afterAction: { type: 'text' },
			description: { type: 'text' },
			descriptionVance: { type: 'text' },
			reloadModule: { type: 'text' },
			zone: { type: 'text' },
		},
		fks: {},
		template: { presentation: 'name code' },
	},

	"ville": {
		base: 'machine_base',
		fields: {
			id:   { type: 'id', readonly: true },
			code: { type: 'text', required: true },
			name: { type: 'text', required: true },
			description: { type: 'text-long' },
			information: { type: 'text' },
			color: { type: 'text' },
			ref: { type: 'text' },
			latitude: { type: 'text' },
			longitude: { type: 'text' },
			estTop: { type: 'boolean' },
			// ── undeclared in registry, detected in _base — verify ──
			adjectifContinent: { type: 'text' },
			adjectifDestination: { type: 'text' },
			adjectifPays: { type: 'text' },
			estPort: { type: 'boolean' },
			ordrePays: { type: 'text' },
			ordre: { type: 'number' },
			prefixeContinent: { type: 'text' },
			prefixeDestination: { type: 'text' },
			prefixePays: { type: 'text' },
		},
		fks: {
				continent: { code: 'continent', multiple: false },
				destination: { code: 'destination', multiple: false },
				pays: { code: 'pays', multiple: false },
			},
		template: { presentation: 'name code' },
	},

	"xml_conf": {
		base: 'machine_base',
		fields: {
			id:   { type: 'id', readonly: true },
			code: { type: 'text', required: true },
			name: { type: 'text', required: true },
		},
		fks: {},
		template: { presentation: 'name code' },
	},

	"xml_cruise": {
		base: 'machine_base',
		fields: {
			id:   { type: 'id', readonly: true },
			code: { type: 'text', required: true },
			name: { type: 'text', required: true },
		},
		fks: {},
		template: { presentation: 'name code' },
	},

	"xml_destination": {
		base: 'machine_base',
		fields: {
			id:   { type: 'id', readonly: true },
			code: { type: 'text', required: true },
			name: { type: 'text', required: true },
		},
		fks: {},
		template: { presentation: 'name code' },
	},

	"xml_itinerary": {
		base: 'machine_base',
		fields: {
			id:   { type: 'id', readonly: true },
			code: { type: 'text', required: true },
			name: { type: 'text', required: true },
		},
		fks: {},
		template: { presentation: 'name code' },
	},

	"xml_job": {
		base: 'machine_base',
		fields: {
			id:   { type: 'id', readonly: true },
			code: { type: 'text', required: true },
			name: { type: 'text', required: true },
		},
		fks: {},
		template: { presentation: 'name code' },
	},

	"xml_price": {
		base: 'machine_base',
		fields: {
			id:   { type: 'id', readonly: true },
			code: { type: 'text', required: true },
			name: { type: 'text', required: true },
			prix: { type: 'currency' },
			dateDebut: { type: 'date' },
		},
		fks: {},
		template: { presentation: 'name code' },
	},

	"xml_ville": {
		base: 'machine_base',
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
