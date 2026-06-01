// AUTO-GENERATED from legacy MongoDB crfr_sitebase_app + sampled _base.
// Source: appscheme / appscheme_has_field / appscheme_field (+ FK & undeclared fields inferred from _base docs).
// Reconstructed in idae-machine model-core (MachineModel) shape. Review 'undeclared' fields before seeding.
import type { MachineModel } from '../../../../src/lib/types/machine-model.js';
import { field } from '../../../../src/lib/main/machine/fieldBuilder.js';

export const crfrScheme: MachineModel = {
	"aeroport": {
		keyPath: '++id',
		base: 'machine_base',
		fields: {
			id:   field('id', { readonly: true }),
			code: field('text', { required: true }),
			name: field('text', { required: true }),
			petitNom: field('text'),
			description: field('text-long'),
			image: field('text'),
		},
		fks: {},
		template: { presentation: 'name code' },
	},

	"agent": {
		keyPath: '++id',
		base: 'machine_base',
		isType:   true,
		fields: {
			id:   field('id', { readonly: true }),
			code: field('text', { required: true }),
			name: field('text', { required: true }),
			petitNom: field('text', { required: true }),
			estActif: field('text'),
			prenom: field('text', { required: true }),
			login: field('text', { required: true }),
			// ── undeclared in registry, detected in _base — verify ──
			email: field('email'),
			groupe: field('text'),
			mailPassword: field('email'),
			password: field('text'),
		},
		fks: {},
		template: { presentation: 'name code' },
	},

	"agent_groupe": {
		keyPath: '++id',
		base: 'machine_base',
		isGroup:  true,
		fields: {
			id:   field('id', { readonly: true }),
			code: field('text', { required: true }),
			name: field('text', { required: true }),
		},
		fks: {},
		template: { presentation: 'name code' },
	},

	"agent_groupe_droit": {
		keyPath: '++id',
		base: 'machine_base',
		isGroup:  true,
		fields: {
			id:   field('id', { readonly: true }),
			code: field('text', { required: true }),
			name: field('text', { required: true }),
			ordre: field('text'),
			// ── undeclared in registry, detected in _base — verify ──
			init: field('text'),
			D: field('text'),
			U: field('text'),
			L: field('text'),
			R: field('text'),
			C: field('text'),
		},
		fks: {
				agent_groupe: { code: 'agent_groupe', multiple: false },
				appscheme: { code: 'appscheme', multiple: false },
			},
		template: { presentation: 'name code' },
	},

	"agent_history": {
		keyPath: '++id',
		base: 'machine_base',
		fields: {
			id:   field('id', { readonly: true }),
			code: field('text', { required: true }),
			name: field('text', { required: true }),
		},
		fks: {},
		template: { presentation: 'name code' },
	},

	"agent_liste": {
		keyPath: '++id',
		base: 'machine_base',
		fields: {
			id:   field('id', { readonly: true }),
			code: field('text', { required: true }),
			name: field('text', { required: true }),
		},
		fks: {},
		template: { presentation: 'name code' },
	},

	"agent_note": {
		keyPath: '++id',
		base: 'machine_base',
		fields: {
			id:   field('id', { readonly: true }),
			code: field('text', { required: true }),
			name: field('text', { required: true }),
		},
		fks: {},
		template: { presentation: 'name code' },
	},

	"agent_recherche": {
		keyPath: '++id',
		base: 'machine_base',
		fields: {
			id:   field('id', { readonly: true }),
			code: field('text', { required: true }),
			name: field('text', { required: true }),
		},
		fks: {},
		template: { presentation: 'name code' },
	},

	"agent_table": {
		keyPath: '++id',
		base: 'machine_base',
		fields: {
			id:   field('id', { readonly: true }),
			code: field('text', { required: true }),
			name: field('text', { required: true }),
		},
		fks: {},
		template: { presentation: 'name code' },
	},

	"agent_tuile": {
		keyPath: '++id',
		base: 'machine_base',
		fields: {
			id:   field('id', { readonly: true }),
			code: field('text', { required: true }),
			name: field('text', { required: true }),
			// ── undeclared in registry, detected in _base — verify ──
			valeur: field('text'),
		},
		fks: {},
		template: { presentation: 'name code' },
	},

	"agent_type": {
		keyPath: '++id',
		base: 'machine_base',
		isGroup:  true,
		fields: {
			id:   field('id', { readonly: true }),
			code: field('text', { required: true }),
			name: field('text', { required: true }),
		},
		fks: {},
		template: { presentation: 'name code' },
	},

	"app_conf": {
		keyPath: '++id',
		base: 'machine_base',
		fields: {
			id:   field('id', { readonly: true }),
			code: field('text', { required: true }),
			name: field('text', { required: true }),
		},
		fks: {},
		template: { presentation: 'name code' },
	},

	"app_daemon": {
		keyPath: '++id',
		base: 'machine_base',
		fields: {
			id:   field('id', { readonly: true }),
			code: field('text', { required: true }),
			name: field('text', { required: true }),
		},
		fks: {},
		template: { presentation: 'name code' },
	},

	"app_version": {
		keyPath: '++id',
		base: 'machine_base',
		fields: {
			id:   field('id', { readonly: true }),
			code: field('text', { required: true }),
			name: field('text', { required: true }),
		},
		fks: {},
		template: { presentation: 'name code' },
	},

	"app_version_file": {
		keyPath: '++id',
		base: 'machine_base',
		fields: {
			id:   field('id', { readonly: true }),
			code: field('text', { required: true }),
			name: field('text', { required: true }),
		},
		fks: {},
		template: { presentation: 'name code' },
	},

	"app_version_file_preprod": {
		keyPath: '++id',
		base: 'machine_base',
		fields: {
			id:   field('id', { readonly: true }),
			code: field('text', { required: true }),
			name: field('text', { required: true }),
		},
		fks: {},
		template: { presentation: 'name code' },
	},

	"appscheme": {
		keyPath: '++id',
		base: 'machine_app',
		isType:   true,
		fields: {
			id:   field('id', { readonly: true }),
			code: field('text', { required: true }),
			name: field('text', { required: true }),
			icon: field('text'),
			estSite: field('url'),
			ordre: field('text'),
			// ── undeclared in registry, detected in _base — verify ──
			collection: field('text'),
			base: field('text'),
			namespace_app: field('text'),
			mainscope_app: field('text'),
			hasTypeScheme: field('text'),
			hasImageScheme: field('text'),
			hasColorScheme: field('text'),
			hasRefScheme: field('text'),
			grilleFK: field('text'),
		},
		fks: {
				appscheme_base: { code: 'appscheme_base', multiple: false },
				appscheme_type: { code: 'appscheme_type', multiple: false },
			},
		template: { presentation: 'name code' },
	},

	"appscheme_base": {
		keyPath: '++id',
		base: 'machine_app',
		fields: {
			id:   field('id', { readonly: true }),
			code: field('text', { required: true }),
			name: field('text', { required: true }),
			icon: field('text'),
			ordre: field('text'),
		},
		fks: {},
		template: { presentation: 'name code' },
	},

	"appscheme_field": {
		keyPath: '++id',
		base: 'machine_app',
		isType:   true,
		fields: {
			id:   field('id', { readonly: true }),
			code: field('text', { required: true }),
			name: field('text', { required: true }),
			icon: field('text'),
			ordre: field('text'),
			// ── undeclared in registry, detected in _base — verify ──
			field_title: field('text'),
			field_raw: field('text'),
			field_group: field('text'),
			field_type: field('text'),
			ordreAppscheme_field_group: field('text'),
			idappshemefield_type: field('text'),
			petitNom: field('text'),
		},
		fks: {
				appscheme_field_group: { code: 'appscheme_field_group', multiple: false },
				appscheme_field_type: { code: 'appscheme_field_type', multiple: false },
			},
		template: { presentation: 'name code' },
	},

	"appscheme_field_group": {
		keyPath: '++id',
		base: 'machine_app',
		isGroup:  true,
		fields: {
			id:   field('id', { readonly: true }),
			code: field('text', { required: true }),
			name: field('text', { required: true }),
			// ── undeclared in registry, detected in _base — verify ──
			group_name: field('text'),
			group_ordre: field('text'),
			ordre: field('text'),
		},
		fks: {},
		template: { presentation: 'name code' },
	},

	"appscheme_field_type": {
		keyPath: '++id',
		base: 'machine_app',
		isGroup:  true,
		fields: {
			id:   field('id', { readonly: true }),
			code: field('text', { required: true }),
			name: field('text', { required: true }),
			ordre: field('text'),
			// ── undeclared in registry, detected in _base — verify ──
			type_name: field('text'),
			type_ordre: field('text'),
		},
		fks: {},
		template: { presentation: 'name code' },
	},

	"appscheme_has_field": {
		keyPath: '++id',
		base: 'machine_app',
		fields: {
			id:   field('id', { readonly: true }),
			code: field('text', { required: true }),
			name: field('text', { required: true }),
			// ── undeclared in registry, detected in _base — verify ──
			field_raw: field('text'),
			collection: field('text'),
			required: field('text'),
			ordre: field('text'),
		},
		fks: {
				appscheme: { code: 'appscheme', multiple: false },
				appscheme_field: { code: 'appscheme_field', multiple: false },
			},
		template: { presentation: 'name code' },
	},

	"appscheme_has_table_field": {
		keyPath: '++id',
		base: 'machine_app',
		fields: {
			id:   field('id', { readonly: true }),
			code: field('text', { required: true }),
			name: field('text', { required: true }),
			ordre: field('text'),
			// ── undeclared in registry, detected in _base — verify ──
			idappscheme_link: field('text'),
			field_raw: field('text'),
			field_name: field('text'),
			collection: field('text'),
			petitNom: field('text'),
			ordreAppscheme_field: field('text'),
			petitNomAppscheme_field: field('text'),
		},
		fks: {
				appscheme: { code: 'appscheme', multiple: false },
				appscheme_field: { code: 'appscheme_field', multiple: false },
			},
		template: { presentation: 'name code' },
	},

	"appscheme_icon": {
		keyPath: '++id',
		base: 'machine_base',
		fields: {
			id:   field('id', { readonly: true }),
			code: field('text', { required: true }),
			name: field('text', { required: true }),
			icon: field('text'),
		},
		fks: {},
		template: { presentation: 'name code' },
	},

	"appscheme_type": {
		keyPath: '++id',
		base: 'machine_app',
		isGroup:  true,
		fields: {
			id:   field('id', { readonly: true }),
			code: field('text', { required: true }),
			name: field('text', { required: true }),
			icon: field('text'),
		},
		fks: {
				appscheme: { code: 'appscheme', multiple: false },
			},
		template: { presentation: 'name code' },
	},

	"appscheme_view": {
		keyPath: '++id',
		base: 'machine_base',
		fields: {
			id:   field('id', { readonly: true }),
			code: field('text', { required: true }),
			name: field('text', { required: true }),
		},
		fks: {},
		template: { presentation: 'name code' },
	},

	"appsite": {
		keyPath: '++id',
		base: 'machine_base',
		fields: {
			id:   field('id', { readonly: true }),
			code: field('text', { required: true }),
			name: field('text', { required: true }),
			url: field('url'),
		},
		fks: {},
		template: { presentation: 'name code' },
	},

	"appsite_page": {
		keyPath: '++id',
		base: 'machine_base',
		isType:   true,
		fields: {
			id:   field('id', { readonly: true }),
			code: field('text', { required: true }),
			name: field('text', { required: true }),
			ordre: field('text'),
		},
		fks: {},
		template: { presentation: 'name code' },
	},

	"appsite_page_ligne": {
		keyPath: '++id',
		base: 'machine_base',
		fields: {
			id:   field('id', { readonly: true }),
			code: field('text', { required: true }),
			name: field('text', { required: true }),
			ordre: field('text', { required: true }),
		},
		fks: {},
		template: { presentation: 'name code' },
	},

	"appsite_page_type": {
		keyPath: '++id',
		base: 'machine_base',
		isGroup:  true,
		fields: {
			id:   field('id', { readonly: true }),
			code: field('text', { required: true }),
			name: field('text', { required: true }),
		},
		fks: {},
		template: { presentation: 'name code' },
	},

	"appsite_template": {
		keyPath: '++id',
		base: 'machine_base',
		fields: {
			id:   field('id', { readonly: true }),
			code: field('text', { required: true }),
			name: field('text', { required: true }),
			description: field('text-long'),
		},
		fks: {},
		template: { presentation: 'name code' },
	},

	"appsite_template_type": {
		keyPath: '++id',
		base: 'machine_base',
		isGroup:  true,
		fields: {
			id:   field('id', { readonly: true }),
			code: field('text', { required: true }),
			name: field('text', { required: true }),
		},
		fks: {},
		template: { presentation: 'name code' },
	},

	"article": {
		keyPath: '++id',
		base: 'machine_base',
		isType:   true,
		fields: {
			id:   field('id', { readonly: true }),
			code: field('text', { required: true }),
			name: field('text', { required: true }),
			// ── undeclared in registry, detected in _base — verify ──
			categorie_idcategorie: field('text'),
			contenu: field('text'),
			description: field('text'),
			ordre: field('text'),
			vignette: field('text'),
		},
		fks: {
				categorie: { code: 'categorie', multiple: false },
				site: { code: 'site', multiple: false },
			},
		template: { presentation: 'name code' },
	},

	"article_type": {
		keyPath: '++id',
		base: 'machine_base',
		isGroup:  true,
		fields: {
			id:   field('id', { readonly: true }),
			code: field('text', { required: true }),
			name: field('text', { required: true }),
		},
		fks: {},
		template: { presentation: 'name code' },
	},

	"asavoir": {
		keyPath: '++id',
		base: 'machine_base',
		isType:   true,
		fields: {
			id:   field('id', { readonly: true }),
			code: field('text', { required: true }),
			name: field('text', { required: true }),
			// ── undeclared in registry, detected in _base — verify ──
			petitNom: field('text'),
			atout: field('text'),
			description: field('text'),
			information: field('text'),
		},
		fks: {
				asavoir_type: { code: 'asavoir_type', multiple: false },
			},
		template: { presentation: 'name code' },
	},

	"asavoir_type": {
		keyPath: '++id',
		base: 'machine_base',
		isGroup:  true,
		fields: {
			id:   field('id', { readonly: true }),
			code: field('text', { required: true }),
			name: field('text', { required: true }),
			// ── undeclared in registry, detected in _base — verify ──
			petitNom: field('text'),
			atout: field('text'),
			description: field('text'),
			information: field('text'),
		},
		fks: {},
		template: { presentation: 'name code' },
	},

	"categorie": {
		keyPath: '++id',
		base: 'machine_base',
		fields: {
			id:   field('id', { readonly: true }),
			code: field('text', { required: true }),
			name: field('text', { required: true }),
			// ── undeclared in registry, detected in _base — verify ──
			description: field('text'),
			ordre: field('text'),
		},
		fks: {
				site: { code: 'site', multiple: false },
			},
		template: { presentation: 'name code' },
	},

	"client": {
		keyPath: '++id',
		base: 'machine_base',
		isType:   true,
		fields: {
			id:   field('id', { readonly: true }),
			code: field('text', { required: true }),
			name: field('text', { required: true }),
			actif: field('text'),
			prenom: field('text'),
			dateCreation: field('date'),
			codePostal: field('text'),
			adresse: field('text'),
			ville: field('text'),
			email: field('email'),
			mobile: field('phone'),
			telephone: field('phone'),
			heureCreation: field('text'),
			// ── undeclared in registry, detected in _base — verify ──
			adressePlus: field('text'),
			estClient: field('text'),
			grilleDestination: field('text'),
			grilleFournisseur: field('text'),
			grilleProduitType: field('text'),
			ip: field('text'),
			scope: field('text'),
			sexe: field('text'),
		},
		fks: {},
		template: { presentation: 'name code' },
	},

	"client_type": {
		keyPath: '++id',
		base: 'machine_base',
		isGroup:  true,
		fields: {
			id:   field('id', { readonly: true }),
			code: field('text', { required: true }),
			name: field('text', { required: true }),
			ordre: field('text'),
		},
		fks: {},
		template: { presentation: 'name code' },
	},

	"conge": {
		keyPath: '++id',
		base: 'machine_base',
		isType:   true,
		isStatus: true,
		fields: {
			id:   field('id', { readonly: true }),
			code: field('text', { required: true }),
			name: field('text', { required: true }),
		},
		fks: {},
		template: { presentation: 'name code' },
	},

	"conge_statut": {
		keyPath: '++id',
		base: 'machine_base',
		isGroup:  true,
		fields: {
			id:   field('id', { readonly: true }),
			code: field('text', { required: true }),
			name: field('text', { required: true }),
		},
		fks: {},
		template: { presentation: 'name code' },
	},

	"conge_type": {
		keyPath: '++id',
		base: 'machine_base',
		isGroup:  true,
		fields: {
			id:   field('id', { readonly: true }),
			code: field('text', { required: true }),
			name: field('text', { required: true }),
		},
		fks: {},
		template: { presentation: 'name code' },
	},

	"continent": {
		keyPath: '++id',
		base: 'machine_base',
		fields: {
			id:   field('id', { readonly: true }),
			code: field('text', { required: true }),
			name: field('text', { required: true }),
			description: field('text-long'),
			color: field('text'),
			ref: field('text'),
			// ── undeclared in registry, detected in _base — verify ──
			adjectif: field('text'),
			ordre: field('text'),
			prefixe: field('text'),
			estTop: field('text'),
			estVisible: field('text'),
			estActif: field('text'),
			petitNom: field('text'),
			nombreVue: field('text'),
		},
		fks: {},
		template: { presentation: 'name code' },
	},

	"daemon": {
		keyPath: '++id',
		base: 'machine_base',
		fields: {
			id:   field('id', { readonly: true }),
			code: field('text', { required: true }),
			name: field('text', { required: true }),
			date: field('date'),
			dateDebut: field('date'),
			heureDebut: field('date'),
			heure: field('text'),
		},
		fks: {},
		template: { presentation: 'name code' },
	},

	"destination": {
		keyPath: '++id',
		base: 'machine_base',
		fields: {
			id:   field('id', { readonly: true }),
			code: field('text', { required: true }),
			name: field('text', { required: true }),
			color: field('text'),
			ref: field('text'),
			information: field('text'),
			description: field('text-long'),
			// ── undeclared in registry, detected in _base — verify ──
			adjectifContinent: field('text'),
			adjectif: field('text'),
			adjectifPays: field('text'),
			descriptionVille: field('text'),
			estTop: field('text'),
			latitudeVille: field('text'),
			longitudeVille: field('text'),
			ordrePays: field('text'),
			ordreVille: field('text'),
			prefixeContinent: field('text'),
			prefixe: field('text'),
			prefixePays: field('text'),
			nombreVue: field('text'),
		},
		fks: {
				continent: { code: 'continent', multiple: false },
				pays: { code: 'pays', multiple: false },
				ville: { code: 'ville', multiple: false },
			},
		template: { presentation: 'name code' },
	},

	"devis": {
		keyPath: '++id',
		base: 'machine_base',
		isType:   true,
		isStatus: true,
		fields: {
			id:   field('id', { readonly: true }),
			code: field('text', { required: true }),
			name: field('text', { required: true }),
			prix: field('currency'),
			dateCreation: field('date'),
			description: field('text-long'),
			email: field('email'),
			heureCreation: field('text'),
			dateDebut: field('date'),
			telephone: field('phone'),
			// ── undeclared in registry, detected in _base — verify ──
			archive: field('text'),
			devisCommentaire: field('text'),
			dreamLetter: field('text'),
			envie: field('text'),
			ipClient: field('text'),
			md5: field('text'),
			md5: field('text'),
			mongodate: field('text'),
			nombreAdulte: field('text'),
			nombreEnfant: field('text'),
			numero: field('text'),
			prixSite: field('url'),
			scope: field('text'),
			sexe: field('text'),
			timestamp: field('text'),
			type: field('text'),
			nbreAdulte: field('text'),
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
		keyPath: '++id',
		base: 'machine_base',
		isType:   true,
		fields: {
			id:   field('id', { readonly: true }),
			code: field('text', { required: true }),
			name: field('text', { required: true }),
			prix: field('currency'),
			date: field('date'),
		},
		fks: {},
		template: { presentation: 'name code' },
	},

	"devis_acompte_type": {
		keyPath: '++id',
		base: 'machine_base',
		isGroup:  true,
		fields: {
			id:   field('id', { readonly: true }),
			code: field('text', { required: true }),
			name: field('text', { required: true }),
			ordre: field('text'),
		},
		fks: {},
		template: { presentation: 'name code' },
	},

	"devis_annotation": {
		keyPath: '++id',
		base: 'machine_base',
		fields: {
			id:   field('id', { readonly: true }),
			code: field('text', { required: true }),
			name: field('text', { required: true }),
		},
		fks: {},
		template: { presentation: 'name code' },
	},

	"devis_envie": {
		keyPath: '++id',
		base: 'machine_base',
		fields: {
			id:   field('id', { readonly: true }),
			code: field('text', { required: true }),
			name: field('text', { required: true }),
		},
		fks: {},
		template: { presentation: 'name code' },
	},

	"devis_mail": {
		keyPath: '++id',
		base: 'machine_base',
		fields: {
			id:   field('id', { readonly: true }),
			code: field('text', { required: true }),
			name: field('text', { required: true }),
		},
		fks: {},
		template: { presentation: 'name code' },
	},

	"devis_marge": {
		keyPath: '++id',
		base: 'machine_base',
		isType:   true,
		fields: {
			id:   field('id', { readonly: true }),
			code: field('text', { required: true }),
			name: field('text', { required: true }),
			ordre: field('text'),
			prixAchat: field('text'),
			// ── undeclared in registry, detected in _base — verify ──
			iddevis_prestataire: field('text'),
		},
		fks: {},
		template: { presentation: 'name code' },
	},

	"devis_marge_type": {
		keyPath: '++id',
		base: 'machine_base',
		isGroup:  true,
		fields: {
			id:   field('id', { readonly: true }),
			code: field('text', { required: true }),
			name: field('text', { required: true }),
		},
		fks: {},
		template: { presentation: 'name code' },
	},

	"devis_passager": {
		keyPath: '++id',
		base: 'machine_base',
		fields: {
			id:   field('id', { readonly: true }),
			code: field('text', { required: true }),
			name: field('text', { required: true }),
			prenom: field('text'),
			email: field('email'),
			telephone: field('phone'),
		},
		fks: {},
		template: { presentation: 'name code' },
	},

	"devis_prestation": {
		keyPath: '++id',
		base: 'machine_base',
		fields: {
			id:   field('id', { readonly: true }),
			code: field('text', { required: true }),
			name: field('text', { required: true }),
			ordre: field('text'),
			prix: field('currency'),
			quantite: field('number'),
			description: field('text-long'),
			total: field('text'),
		},
		fks: {},
		template: { presentation: 'name code' },
	},

	"devis_statut": {
		keyPath: '++id',
		base: 'machine_base',
		isGroup:  true,
		fields: {
			id:   field('id', { readonly: true }),
			code: field('text', { required: true }),
			name: field('text', { required: true }),
			ordre: field('text'),
		},
		fks: {},
		template: { presentation: 'name code' },
	},

	"devis_type": {
		keyPath: '++id',
		base: 'machine_base',
		isGroup:  true,
		fields: {
			id:   field('id', { readonly: true }),
			code: field('text', { required: true }),
			name: field('text', { required: true }),
			ordre: field('text'),
			// ── undeclared in registry, detected in _base — verify ──
			petitNom: field('text'),
			description: field('text'),
			iddevis_type_type: field('text'),
		},
		fks: {},
		template: { presentation: 'name code' },
	},

	"document": {
		keyPath: '++id',
		base: 'machine_base',
		fields: {
			id:   field('id', { readonly: true }),
			code: field('text', { required: true }),
			name: field('text', { required: true }),
		},
		fks: {},
		template: { presentation: 'name code' },
	},

	"document_extension": {
		keyPath: '++id',
		base: 'machine_base',
		fields: {
			id:   field('id', { readonly: true }),
			code: field('text', { required: true }),
			name: field('text', { required: true }),
		},
		fks: {},
		template: { presentation: 'name code' },
	},

	"document_type": {
		keyPath: '++id',
		base: 'machine_base',
		isGroup:  true,
		fields: {
			id:   field('id', { readonly: true }),
			code: field('text', { required: true }),
			name: field('text', { required: true }),
		},
		fks: {},
		template: { presentation: 'name code' },
	},

	"dossier_devis": {
		keyPath: '++id',
		base: 'machine_base',
		fields: {
			id:   field('id', { readonly: true }),
			code: field('text', { required: true }),
			name: field('text', { required: true }),
			// ── undeclared in registry, detected in _base — verify ──
			numeroDossierDevis: field('text'),
			numero: field('text'),
		},
		fks: {
				devis: { code: 'devis', multiple: false },
			},
		template: { presentation: 'name code' },
	},

	"facture": {
		keyPath: '++id',
		base: 'machine_base',
		isType:   true,
		fields: {
			id:   field('id', { readonly: true }),
			code: field('text', { required: true }),
			name: field('text', { required: true }),
			date: field('date'),
			total: field('text'),
			// ── undeclared in registry, detected in _base — verify ──
			grille: field('text'),
			numeroDossierDevis: field('text'),
			numeroFactureDevis: field('text'),
			pctTvaFR: field('text'),
			pctTvaHUE: field('text'),
			pctTvaUE: field('text'),
			referenceExterne: field('text'),
			titre: field('text'),
			txn_id: field('text'),
			type: field('text'),
			numeroDossier_devis: field('text'),
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
		keyPath: '++id',
		base: 'machine_base',
		fields: {
			id:   field('id', { readonly: true }),
			code: field('text', { required: true }),
			name: field('text', { required: true }),
		},
		fks: {},
		template: { presentation: 'name code' },
	},

	"facture_type": {
		keyPath: '++id',
		base: 'machine_base',
		isGroup:  true,
		fields: {
			id:   field('id', { readonly: true }),
			code: field('text', { required: true }),
			name: field('text', { required: true }),
		},
		fks: {},
		template: { presentation: 'name code' },
	},

	"feed_header": {
		keyPath: '++id',
		base: 'machine_base',
		fields: {
			id:   field('id', { readonly: true }),
			code: field('text', { required: true }),
			name: field('text', { required: true }),
			description: field('text-long'),
			url: field('url'),
			estActif: field('text'),
		},
		fks: {},
		template: { presentation: 'name code' },
	},

	"fleuve": {
		keyPath: '++id',
		base: 'machine_base',
		isType:   true,
		fields: {
			id:   field('id', { readonly: true }),
			code: field('text', { required: true }),
			name: field('text', { required: true }),
			image: field('text'),
			description: field('text-long'),
			// ── undeclared in registry, detected in _base — verify ──
			fleuve_id: field('text'),
			idfleuve_trad: field('text'),
			lang_idlang: field('text'),
			ordre: field('text'),
			url: field('url'),
		},
		fks: {
				pays: { code: 'pays', multiple: false },
			},
		template: { presentation: 'name code' },
	},

	"fleuve_type": {
		keyPath: '++id',
		base: 'machine_base',
		isGroup:  true,
		fields: {
			id:   field('id', { readonly: true }),
			code: field('text', { required: true }),
			name: field('text', { required: true }),
		},
		fks: {},
		template: { presentation: 'name code' },
	},

	"fournisseur": {
		keyPath: '++id',
		base: 'machine_base',
		isType:   true,
		fields: {
			id:   field('id', { readonly: true }),
			code: field('text', { required: true }),
			name: field('text', { required: true }),
			color: field('text'),
			petitNom: field('text'),
			description: field('text-long'),
		},
		fks: {},
		template: { presentation: 'name code' },
	},

	"fournisseur_clause": {
		keyPath: '++id',
		base: 'machine_base',
		isType:   true,
		fields: {
			id:   field('id', { readonly: true }),
			code: field('text', { required: true }),
			name: field('text', { required: true }),
			ordre: field('text'),
			descriptionHTML: field('text'),
		},
		fks: {},
		template: { presentation: 'name code' },
	},

	"fournisseur_clause_type": {
		keyPath: '++id',
		base: 'machine_base',
		isGroup:  true,
		fields: {
			id:   field('id', { readonly: true }),
			code: field('text', { required: true }),
			name: field('text', { required: true }),
		},
		fks: {},
		template: { presentation: 'name code' },
	},

	"fournisseur_presentation": {
		keyPath: '++id',
		base: 'machine_base',
		fields: {
			id:   field('id', { readonly: true }),
			code: field('text', { required: true }),
			name: field('text', { required: true }),
			description: field('text-long'),
		},
		fks: {},
		template: { presentation: 'name code' },
	},

	"fournisseur_presentation_type": {
		keyPath: '++id',
		base: 'machine_base',
		isGroup:  true,
		fields: {
			id:   field('id', { readonly: true }),
			code: field('text', { required: true }),
			name: field('text', { required: true }),
			description: field('text-long'),
		},
		fks: {},
		template: { presentation: 'name code' },
	},

	"fournisseur_type": {
		keyPath: '++id',
		base: 'machine_base',
		isGroup:  true,
		fields: {
			id:   field('id', { readonly: true }),
			code: field('text', { required: true }),
			name: field('text', { required: true }),
			// ── undeclared in registry, detected in _base — verify ──
			adjectif: field('text'),
			pluriel: field('text'),
			prefixe: field('text'),
		},
		fks: {
				transport_type: { code: 'transport_type', multiple: false },
			},
		template: { presentation: 'name code' },
	},

	"gamme": {
		keyPath: '++id',
		base: 'machine_base',
		fields: {
			id:   field('id', { readonly: true }),
			code: field('text', { required: true }),
			name: field('text', { required: true }),
			image: field('text'),
			ordre: field('text'),
			description: field('text-long'),
			// ── undeclared in registry, detected in _base — verify ──
			idgamme_trad: field('text'),
			idlang: field('text'),
			idtype_produit: field('text'),
			visibleClient: field('text'),
		},
		fks: {
				produit_type: { code: 'produit_type', multiple: false },
			},
		template: { presentation: 'name code' },
	},

	"groupe_agent": {
		keyPath: '++id',
		base: 'machine_base',
		fields: {
			id:   field('id', { readonly: true }),
			code: field('text', { required: true }),
			name: field('text', { required: true }),
		},
		fks: {},
		template: { presentation: 'name code' },
	},

	"hotel": {
		keyPath: '++id',
		base: 'machine_base',
		isType:   true,
		fields: {
			id:   field('id', { readonly: true }),
			code: field('text', { required: true }),
			name: field('text', { required: true }),
			image: field('text'),
			codePostal: field('text'),
			adresse: field('text'),
			ville: field('text'),
			// ── undeclared in registry, detected in _base — verify ──
			description: field('text'),
			etoile: field('text'),
			nombreVue: field('text'),
		},
		fks: {
				ville: { code: 'ville', multiple: false },
			},
		template: { presentation: 'name code' },
	},

	"hotel_clause": {
		keyPath: '++id',
		base: 'machine_base',
		fields: {
			id:   field('id', { readonly: true }),
			code: field('text', { required: true }),
			name: field('text', { required: true }),
			description: field('text-long'),
		},
		fks: {},
		template: { presentation: 'name code' },
	},

	"hotel_gamme": {
		keyPath: '++id',
		base: 'machine_base',
		fields: {
			id:   field('id', { readonly: true }),
			code: field('text', { required: true }),
			name: field('text', { required: true }),
			// ── undeclared in registry, detected in _base — verify ──
			ordreGamme: field('text'),
		},
		fks: {
				gamme: { code: 'gamme', multiple: false },
				hotel: { code: 'hotel', multiple: false },
				produit_type: { code: 'produit_type', multiple: false },
			},
		template: { presentation: 'name code' },
	},

	"hotel_type": {
		keyPath: '++id',
		base: 'machine_base',
		isGroup:  true,
		fields: {
			id:   field('id', { readonly: true }),
			code: field('text', { required: true }),
			name: field('text', { required: true }),
			// ── undeclared in registry, detected in _base — verify ──
			petitNom: field('text'),
			description: field('text'),
		},
		fks: {},
		template: { presentation: 'name code' },
	},

	"mer": {
		keyPath: '++id',
		base: 'machine_base',
		isType:   true,
		fields: {
			id:   field('id', { readonly: true }),
			code: field('text', { required: true }),
			name: field('text', { required: true }),
			image: field('text'),
			petitNom: field('text'),
			description: field('text-long'),
			// ── undeclared in registry, detected in _base — verify ──
			nombreVue: field('text'),
		},
		fks: {
				mer_type: { code: 'mer_type', multiple: false },
			},
		template: { presentation: 'name code' },
	},

	"mer_type": {
		keyPath: '++id',
		base: 'machine_base',
		isGroup:  true,
		fields: {
			id:   field('id', { readonly: true }),
			code: field('text', { required: true }),
			name: field('text', { required: true }),
		},
		fks: {},
		template: { presentation: 'name code' },
	},

	"newsletter": {
		keyPath: '++id',
		base: 'machine_base',
		isType:   true,
		fields: {
			id:   field('id', { readonly: true }),
			code: field('text', { required: true }),
			name: field('text', { required: true }),
			color: field('text'),
			date: field('date'),
			description: field('text-long'),
			url: field('url'),
			bgcolor: field('text'),
			// ── undeclared in registry, detected in _base — verify ──
			F_action: field('text'),
			color_background: field('text'),
			content: field('text'),
			date_created: field('text'),
			date_modified: field('text'),
			date_: field('text'),
			preview_content: field('text'),
			title: field('text'),
		},
		fks: {},
		template: { presentation: 'name code' },
	},

	"newsletter_block": {
		keyPath: '++id',
		base: 'machine_base',
		fields: {
			id:   field('id', { readonly: true }),
			code: field('text', { required: true }),
			name: field('text', { required: true }),
		},
		fks: {},
		template: { presentation: 'name code' },
	},

	"newsletter_item": {
		keyPath: '++id',
		base: 'machine_base',
		isType:   true,
		fields: {
			id:   field('id', { readonly: true }),
			code: field('text', { required: true }),
			name: field('text', { required: true }),
			description: field('text-long'),
			ordre: field('text'),
			url: field('url'),
		},
		fks: {},
		template: { presentation: 'name code' },
	},

	"newsletter_item_type": {
		keyPath: '++id',
		base: 'machine_base',
		isGroup:  true,
		fields: {
			id:   field('id', { readonly: true }),
			code: field('text', { required: true }),
			name: field('text', { required: true }),
			quantite: field('number', { required: true }),
		},
		fks: {},
		template: { presentation: 'name code' },
	},

	"newsletter_type": {
		keyPath: '++id',
		base: 'machine_base',
		isGroup:  true,
		fields: {
			id:   field('id', { readonly: true }),
			code: field('text', { required: true }),
			name: field('text', { required: true }),
		},
		fks: {},
		template: { presentation: 'name code' },
	},

	"note": {
		keyPath: '++id',
		base: 'machine_base',
		fields: {
			id:   field('id', { readonly: true }),
			code: field('text', { required: true }),
			name: field('text', { required: true }),
			// ── undeclared in registry, detected in _base — verify ──
			estActif: field('text'),
			idnote_origine: field('text'),
			idagent_writer: field('text'),
			texte: field('text'),
		},
		fks: {},
		template: { presentation: 'name code' },
	},

	"paiement": {
		keyPath: '++id',
		base: 'machine_base',
		fields: {
			id:   field('id', { readonly: true }),
			code: field('text', { required: true }),
			name: field('text', { required: true }),
			// ── undeclared in registry, detected in _base — verify ──
			montant: field('text'),
			type: field('text'),
			mode: field('text'),
			referenceExterne: field('text'),
			pseudoAgent: field('text'),
			numeroDossierDevis: field('text'),
		},
		fks: {
				devis: { code: 'devis', multiple: false },
				client: { code: 'client', multiple: false },
			},
		template: { presentation: 'name code' },
	},

	"pays": {
		keyPath: '++id',
		base: 'machine_base',
		fields: {
			id:   field('id', { readonly: true }),
			code: field('text', { required: true }),
			name: field('text', { required: true }),
			image: field('text'),
			// ── undeclared in registry, detected in _base — verify ──
			aVisa: field('text'),
			adjectifContinent: field('text'),
			adjectifDestination: field('text'),
			adjectif: field('text'),
			count: field('text'),
			countCF: field('text'),
			countCR: field('text'),
			countTR: field('text'),
			description: field('text'),
			infoVisa: field('text'),
			ordre: field('text'),
			prefixeContinent: field('text'),
			prefixeDestination: field('text'),
			prefixe: field('text'),
			nombreVue: field('text'),
		},
		fks: {
				continent: { code: 'continent', multiple: false },
				destination: { code: 'destination', multiple: false },
			},
		template: { presentation: 'name code' },
	},

	"prestataire": {
		keyPath: '++id',
		base: 'machine_base',
		fields: {
			id:   field('id', { readonly: true }),
			code: field('text', { required: true }),
			name: field('text', { required: true }),
			// ── undeclared in registry, detected in _base — verify ──
			commercial: field('text'),
			commission: field('text'),
			contact: field('text'),
			description: field('text'),
			fax: field('phone'),
			lienweb: field('url'),
			mailCommercial: field('email'),
			scope: field('text'),
			telephone: field('phone'),
			telephoneResa: field('phone'),
		},
		fks: {},
		template: { presentation: 'name code' },
	},

	"produit": {
		keyPath: '++id',
		base: 'machine_base',
		isType:   true,
		fields: {
			id:   field('id', { readonly: true }),
			code: field('text', { required: true }),
			name: field('text', { required: true }),
			prix: field('currency'),
			date: field('date'),
			duree: field('text'),
			estTop: field('text'),
			estVisible: field('text'),
			estActif: field('text'),
			// ── undeclared in registry, detected in _base — verify ──
			autreNom_Transport: field('text'),
			description: field('text'),
			dureeJour: field('text'),
			estActifFournisseur: field('text'),
			estTopDestination: field('text'),
			estTopFournisseur: field('text'),
			grilleClause: field('text'),
			grilleDestination: field('text'),
			grilleEtape: field('text'),
			grillePrestation: field('text'),
			grilleTheme: field('text'),
			has_changed: field('text'),
			idmarche: field('text'),
			idpaysArrivee: field('text'),
			idpaysDepart: field('text'),
			idvilleArrivee: field('text'),
			idvilleDepart: field('text'),
			nombreVue: field('text'),
			ordreFournisseur: field('text'),
			ordreHomePage: field('text'),
			pensionComplete: field('text'),
			petitNomFournisseur: field('text'),
			plurielProduit_type: field('text'),
			plusPetitPrix: field('text'),
			prefixeDestination: field('text'),
			prefixeFournisseur_type: field('text'),
			prefixeProduit_type: field('text'),
			prixPromo: field('text'),
			promo: field('text'),
			reference: field('text'),
			scope: field('text'),
			sousTitre: field('text'),
			sousTitrePromo: field('text'),
			texteProduit_clause: field('text'),
			villeArrivee: field('text'),
			villeDepart: field('text'),
			webNomProduit_type: field('text'),
			webPlurielProduit_type: field('text'),
			grilleDate: field('text'),
			idvilleArrivee: field('text'),
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
		keyPath: '++id',
		base: 'machine_base',
		fields: {
			id:   field('id', { readonly: true }),
			code: field('text', { required: true }),
			name: field('text', { required: true }),
			image: field('text'),
			ordre: field('text'),
			description: field('text-long'),
			heureDebut: field('date'),
			heureFin: field('date'),
		},
		fks: {
				produit: { code: 'produit', multiple: false },
				ville: { code: 'ville', multiple: false },
			},
		template: { presentation: 'name code' },
	},

	"produit_selection": {
		keyPath: '++id',
		base: 'machine_base',
		fields: {
			id:   field('id', { readonly: true }),
			code: field('text', { required: true }),
			name: field('text', { required: true }),
			// ── undeclared in registry, detected in _base — verify ──
			F_action: field('text'),
			actif: field('text'),
			afterAction: field('text'),
			description: field('text'),
			reloadModule: field('text'),
		},
		fks: {},
		template: { presentation: 'name code' },
	},

	"produit_tarif": {
		keyPath: '++id',
		base: 'machine_base',
		fields: {
			id:   field('id', { readonly: true }),
			code: field('text', { required: true }),
			name: field('text', { required: true }),
			prix: field('currency'),
			date: field('date'),
			// ── undeclared in registry, detected in _base — verify ──
			mongodate: field('text'),
			annee: field('text'),
			mois: field('text'),
			mois_fr: field('text'),
			mois_annee_fr: field('text'),
		},
		fks: {
				produit: { code: 'produit', multiple: false },
			},
		template: { presentation: 'name code' },
	},

	"produit_tarif_gamme": {
		keyPath: '++id',
		base: 'machine_base',
		isType:   true,
		fields: {
			id:   field('id', { readonly: true }),
			code: field('text', { required: true }),
			name: field('text', { required: true }),
			prix: field('currency'),
			// ── undeclared in registry, detected in _base — verify ──
			prixPromo: field('text'),
		},
		fks: {
				gamme: { code: 'gamme', multiple: false },
				produit: { code: 'produit', multiple: false },
				produit_tarif: { code: 'produit_tarif', multiple: false },
			},
		template: { presentation: 'name code' },
	},

	"produit_tarif_gamme_type": {
		keyPath: '++id',
		base: 'machine_base',
		isGroup:  true,
		fields: {
			id:   field('id', { readonly: true }),
			code: field('text', { required: true }),
			name: field('text', { required: true }),
		},
		fks: {},
		template: { presentation: 'name code' },
	},

	"produit_type": {
		keyPath: '++id',
		base: 'machine_base',
		isType:   true,
		isGroup:  true,
		fields: {
			id:   field('id', { readonly: true }),
			code: field('text', { required: true }),
			name: field('text', { required: true }),
			// ── undeclared in registry, detected in _base — verify ──
			description: field('text'),
			estActif: field('text'),
			estVisible: field('text'),
			metaDescription: field('text'),
			metaTitle: field('text'),
			ordre: field('text'),
			pluriel: field('text'),
			webNom: field('text'),
			webPluriel: field('text'),
			nombreVue: field('text'),
		},
		fks: {},
		template: { presentation: 'name code' },
	},

	"produit_type_type": {
		keyPath: '++id',
		base: 'machine_base',
		isGroup:  true,
		fields: {
			id:   field('id', { readonly: true }),
			code: field('text', { required: true }),
			name: field('text', { required: true }),
		},
		fks: {},
		template: { presentation: 'name code' },
	},

	"site": {
		keyPath: '++id',
		base: 'machine_base',
		isType:   true,
		fields: {
			id:   field('id', { readonly: true }),
			code: field('text', { required: true }),
			name: field('text', { required: true }),
			// ── undeclared in registry, detected in _base — verify ──
			ATTR: field('text'),
			SERVER_ADDR: field('text'),
			contact: field('text'),
			domain: field('text'),
			sousTitre: field('text'),
			texteIntro: field('text'),
			url: field('url'),
		},
		fks: {},
		template: { presentation: 'name code' },
	},

	"site_type": {
		keyPath: '++id',
		base: 'machine_base',
		isGroup:  true,
		fields: {
			id:   field('id', { readonly: true }),
			code: field('text', { required: true }),
			name: field('text', { required: true }),
		},
		fks: {},
		template: { presentation: 'name code' },
	},

	"tache": {
		keyPath: '++id',
		base: 'machine_base',
		isType:   true,
		isStatus: true,
		fields: {
			id:   field('id', { readonly: true }),
			code: field('text', { required: true }),
			name: field('text', { required: true }),
			dateDebut: field('date'),
			dateFin: field('date'),
			description: field('text-long'),
			heureDebut: field('date'),
			heureFin: field('date'),
		},
		fks: {
				client: { code: 'client', multiple: false },
				tache_type: { code: 'tache_type', multiple: false },
			},
		template: { presentation: 'name code' },
	},

	"tache_statut": {
		keyPath: '++id',
		base: 'machine_base',
		isGroup:  true,
		fields: {
			id:   field('id', { readonly: true }),
			code: field('text', { required: true }),
			name: field('text', { required: true }),
			ordre: field('text'),
			color: field('text'),
			icon: field('text'),
		},
		fks: {},
		template: { presentation: 'name code' },
	},

	"tache_type": {
		keyPath: '++id',
		base: 'machine_base',
		isGroup:  true,
		fields: {
			id:   field('id', { readonly: true }),
			code: field('text', { required: true }),
			name: field('text', { required: true }),
			ordre: field('text'),
			color: field('text'),
			icon: field('text'),
		},
		fks: {},
		template: { presentation: 'name code' },
	},

	"theme": {
		keyPath: '++id',
		base: 'machine_base',
		isType:   true,
		fields: {
			id:   field('id', { readonly: true }),
			code: field('text', { required: true }),
			name: field('text', { required: true }),
			// ── undeclared in registry, detected in _base — verify ──
			actifProduit_: field('text'),
			actifProduit_theme_type: field('text'),
			actif: field('text'),
			actifTheme_type: field('text'),
			descriptionProduit_: field('text'),
			description: field('text'),
			idproduit_: field('text'),
			idproduit_theme_type: field('text'),
			petitNom: field('text'),
			atout: field('text'),
			information: field('text'),
		},
		fks: {
				theme_type: { code: 'theme_type', multiple: false },
			},
		template: { presentation: 'name code' },
	},

	"theme_type": {
		keyPath: '++id',
		base: 'machine_base',
		isGroup:  true,
		fields: {
			id:   field('id', { readonly: true }),
			code: field('text', { required: true }),
			name: field('text', { required: true }),
			// ── undeclared in registry, detected in _base — verify ──
			actifProduit_: field('text'),
			actif: field('text'),
			idproduit_: field('text'),
		},
		fks: {},
		template: { presentation: 'name code' },
	},

	"todo": {
		keyPath: '++id',
		base: 'machine_base',
		fields: {
			id:   field('id', { readonly: true }),
			code: field('text', { required: true }),
			name: field('text', { required: true }),
		},
		fks: {},
		template: { presentation: 'name code' },
	},

	"transport": {
		keyPath: '++id',
		base: 'machine_base',
		isType:   true,
		fields: {
			id:   field('id', { readonly: true }),
			code: field('text', { required: true }),
			name: field('text', { required: true }),
			color: field('text'),
			description: field('text-long'),
			// ── undeclared in registry, detected in _base — verify ──
			autreNom_: field('text'),
			countProduit: field('text'),
			descriptionExt: field('text'),
			estActifProduit_type: field('text'),
			estTop: field('text'),
			ordreProduit_type: field('text'),
			plurielProduit_type: field('text'),
			plurielTransport_type: field('text'),
			prefixeProduit_type: field('text'),
			scope: field('text'),
			webNomProduit_type: field('text'),
			webPlurielProduit_type: field('text'),
		},
		fks: {
				fournisseur: { code: 'fournisseur', multiple: false },
				produit_type: { code: 'produit_type', multiple: false },
				transport_type: { code: 'transport_type', multiple: false },
			},
		template: { presentation: 'name code' },
	},

	"transport_cabine": {
		keyPath: '++id',
		base: 'machine_base',
		fields: {
			id:   field('id', { readonly: true }),
			code: field('text', { required: true }),
			name: field('text', { required: true }),
			ordre: field('text'),
			description: field('text-long'),
			// ── undeclared in registry, detected in _base — verify ──
			ordreGamme: field('text'),
			descriptionExtTransport_gamme: field('text'),
			idgamme_trad: field('text'),
			idlang: field('text'),
			visibleClientGamme: field('text'),
		},
		fks: {
				transport: { code: 'transport', multiple: false },
				gamme: { code: 'gamme', multiple: false },
				produit_type: { code: 'produit_type', multiple: false },
			},
		template: { presentation: 'name code' },
	},

	"transport_gamme": {
		keyPath: '++id',
		base: 'machine_base',
		fields: {
			id:   field('id', { readonly: true }),
			code: field('text', { required: true }),
			name: field('text', { required: true }),
		},
		fks: {},
		template: { presentation: 'name code' },
	},

	"transport_pont": {
		keyPath: '++id',
		base: 'machine_base',
		fields: {
			id:   field('id', { readonly: true }),
			code: field('text', { required: true }),
			name: field('text', { required: true }),
			ordre: field('text'),
		},
		fks: {},
		template: { presentation: 'name code' },
	},

	"transport_presentation": {
		keyPath: '++id',
		base: 'machine_base',
		isType:   true,
		fields: {
			id:   field('id', { readonly: true }),
			code: field('text', { required: true }),
			name: field('text', { required: true }),
		},
		fks: {},
		template: { presentation: 'name code' },
	},

	"transport_presentation_type": {
		keyPath: '++id',
		base: 'machine_base',
		isGroup:  true,
		fields: {
			id:   field('id', { readonly: true }),
			code: field('text', { required: true }),
			name: field('text', { required: true }),
		},
		fks: {},
		template: { presentation: 'name code' },
	},

	"transport_type": {
		keyPath: '++id',
		base: 'machine_base',
		isGroup:  true,
		fields: {
			id:   field('id', { readonly: true }),
			code: field('text', { required: true }),
			name: field('text', { required: true }),
			// ── undeclared in registry, detected in _base — verify ──
			pluriel: field('text'),
		},
		fks: {},
		template: { presentation: 'name code' },
	},

	"type_activite": {
		keyPath: '++id',
		base: 'machine_base',
		fields: {
			id:   field('id', { readonly: true }),
			code: field('text', { required: true }),
			name: field('text', { required: true }),
			// ── undeclared in registry, detected in _base — verify ──
			petitNom: field('text'),
			description: field('text'),
		},
		fks: {},
		template: { presentation: 'name code' },
	},

	"vacance": {
		keyPath: '++id',
		base: 'machine_base',
		fields: {
			id:   field('id', { readonly: true }),
			code: field('text', { required: true }),
			name: field('text', { required: true }),
			dateDebut: field('date'),
			dateFin: field('date'),
			// ── undeclared in registry, detected in _base — verify ──
			F_action: field('text'),
			afterAction: field('text'),
			description: field('text'),
			descriptionVance: field('text'),
			reloadModule: field('text'),
			zone: field('text'),
		},
		fks: {},
		template: { presentation: 'name code' },
	},

	"ville": {
		keyPath: '++id',
		base: 'machine_base',
		fields: {
			id:   field('id', { readonly: true }),
			code: field('text', { required: true }),
			name: field('text', { required: true }),
			description: field('text-long'),
			information: field('text'),
			color: field('text'),
			ref: field('text'),
			latitude: field('text'),
			longitude: field('text'),
			estTop: field('text'),
			// ── undeclared in registry, detected in _base — verify ──
			adjectifContinent: field('text'),
			adjectifDestination: field('text'),
			adjectifPays: field('text'),
			estPort: field('text'),
			ordrePays: field('text'),
			ordre: field('text'),
			prefixeContinent: field('text'),
			prefixeDestination: field('text'),
			prefixePays: field('text'),
		},
		fks: {
				continent: { code: 'continent', multiple: false },
				destination: { code: 'destination', multiple: false },
				pays: { code: 'pays', multiple: false },
			},
		template: { presentation: 'name code' },
	},

	"xml_conf": {
		keyPath: '++id',
		base: 'machine_base',
		fields: {
			id:   field('id', { readonly: true }),
			code: field('text', { required: true }),
			name: field('text', { required: true }),
		},
		fks: {},
		template: { presentation: 'name code' },
	},

	"xml_cruise": {
		keyPath: '++id',
		base: 'machine_base',
		fields: {
			id:   field('id', { readonly: true }),
			code: field('text', { required: true }),
			name: field('text', { required: true }),
		},
		fks: {},
		template: { presentation: 'name code' },
	},

	"xml_destination": {
		keyPath: '++id',
		base: 'machine_base',
		fields: {
			id:   field('id', { readonly: true }),
			code: field('text', { required: true }),
			name: field('text', { required: true }),
		},
		fks: {},
		template: { presentation: 'name code' },
	},

	"xml_itinerary": {
		keyPath: '++id',
		base: 'machine_base',
		fields: {
			id:   field('id', { readonly: true }),
			code: field('text', { required: true }),
			name: field('text', { required: true }),
		},
		fks: {},
		template: { presentation: 'name code' },
	},

	"xml_job": {
		keyPath: '++id',
		base: 'machine_base',
		fields: {
			id:   field('id', { readonly: true }),
			code: field('text', { required: true }),
			name: field('text', { required: true }),
		},
		fks: {},
		template: { presentation: 'name code' },
	},

	"xml_price": {
		keyPath: '++id',
		base: 'machine_base',
		fields: {
			id:   field('id', { readonly: true }),
			code: field('text', { required: true }),
			name: field('text', { required: true }),
			prix: field('currency'),
			dateDebut: field('date'),
		},
		fks: {},
		template: { presentation: 'name code' },
	},

	"xml_ville": {
		keyPath: '++id',
		base: 'machine_base',
		fields: {
			id:   field('id', { readonly: true }),
			code: field('text', { required: true }),
			name: field('text', { required: true }),
		},
		fks: {},
		template: { presentation: 'name code' },
	},
};

export default crfrScheme;
