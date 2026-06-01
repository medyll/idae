// AUTO-GENERATED from legacy MongoDB idaenext_sitebase_app + sampled _base.
// Source: appscheme / appscheme_has_field / appscheme_field (+ FK & undeclared fields inferred from _base docs).
// Reconstructed in idae-machine model-core (MachineModel) shape. Review 'undeclared' fields before seeding.
import type { MachineModel } from '../../../../src/lib/types/machine-model.js';
import { field } from '../../../../src/lib/main/machine/fieldBuilder.js';

export const idaenextScheme: MachineModel = {
	"accessoire": {
		keyPath: '++id',
		base: 'machine_base',
		fields: {
			id:   field('id', { readonly: true }),
			code: field('text', { required: true }),
			name: field('text', { required: true }),
			// ── undeclared in registry, detected in _base — verify ──
			N_ID: field('text'),
		},
		fks: {
				marque: { code: 'marque', multiple: false },
			},
		template: { presentation: 'name code' },
	},

	"affaire": {
		keyPath: '++id',
		base: 'machine_base',
		fields: {
			id:   field('id', { readonly: true }),
			code: field('text', { required: true }),
			name: field('text', { required: true }),
			dateCreation: field('date'),
			dateDebut: field('date'),
			montantHt: field('currency'),
			totalTtc: field('currency'),
			totalTva: field('currency'),
			// ── undeclared in registry, detected in _base — verify ──
			description: field('text'),
			identite: field('text'),
			totalHt: field('text'),
			isoDateDebut: field('text'),
		},
		fks: {
				client: { code: 'client', multiple: false },
			},
		template: { presentation: 'name code' },
	},

	"agence": {
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

	"agent": {
		keyPath: '++id',
		base: 'machine_base',
		fields: {
			id:   field('id', { readonly: true }),
			code: field('text', { required: true }),
			name: field('text', { required: true }),
			prenom: field('text'),
			actif: field('text'),
			email: field('email'),
			mobile: field('phone'),
			petitNom: field('text'),
			telephone: field('phone'),
			login: field('text'),
			telephone2: field('phone'),
		},
		fks: {},
		template: { presentation: 'name code' },
	},

	"agent_activite": {
		keyPath: '++id',
		base: 'machine_user',
		fields: {
			id:   field('id', { readonly: true }),
			code: field('text', { required: true }),
			name: field('text', { required: true }),
			date: field('date'),
			valeur: field('number'),
			heure: field('text'),
			// ── undeclared in registry, detected in _base — verify ──
			uniqid: field('text'),
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
			description: field('text-long'),
			ordre: field('text'),
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
			// ── undeclared in registry, detected in _base — verify ──
			init: field('text'),
			C: field('text'),
			R: field('text'),
			L: field('text'),
			U: field('text'),
			D: field('text'),
			CONF: field('text'),
			ordreAgent_groupe: field('text'),
		},
		fks: {
				agent_groupe: { code: 'agent_groupe', multiple: false },
				appscheme: { code: 'appscheme', multiple: false },
			},
		template: { presentation: 'name code' },
	},

	"agent_history": {
		keyPath: '++id',
		base: 'machine_user',
		fields: {
			id:   field('id', { readonly: true }),
			code: field('text', { required: true }),
			name: field('text', { required: true }),
			valeur: field('number'),
			date: field('date'),
			heure: field('text'),
			// ── undeclared in registry, detected in _base — verify ──
			quantite: field('text'),
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
			ordre: field('text'),
		},
		fks: {},
		template: { presentation: 'name code' },
	},

	"agent_liste_ligne": {
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

	"agent_note": {
		keyPath: '++id',
		base: 'machine_user',
		fields: {
			id:   field('id', { readonly: true }),
			code: field('text', { required: true }),
			name: field('text', { required: true }),
			color: field('text'),
			dateCreation: field('date'),
			description: field('text-long'),
			petitNom: field('text'),
			// ── undeclared in registry, detected in _base — verify ──
			estActif: field('text'),
			idagent_writer: field('text'),
			valeur: field('text'),
			actifAgent: field('text'),
			petitNomAgent: field('text'),
		},
		fks: {},
		template: { presentation: 'name code' },
	},

	"agent_pref": {
		keyPath: '++id',
		base: 'machine_base',
		fields: {
			id:   field('id', { readonly: true }),
			code: field('text', { required: true }),
			name: field('text', { required: true }),
			valeur: field('number', { required: true }),
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
		base: 'machine_user',
		fields: {
			id:   field('id', { readonly: true }),
			code: field('text', { required: true }),
			name: field('text', { required: true }),
			valeur: field('number'),
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
			date: field('date'),
			dateCreation: field('date'),
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
			date: field('date'),
			heure: field('text'),
			dateCreation: field('date'),
			heureCreation: field('text'),
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
			date: field('date'),
			heure: field('text'),
			dateCreation: field('date'),
			heureCreation: field('text'),
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
			color: field('text'),
			// ── undeclared in registry, detected in _base — verify ──
			base: field('text'),
			collection: field('text'),
			hasTypeScheme: field('text'),
			mainscope_app: field('text'),
			hasStatutScheme: field('text'),
			hasLigneScheme: field('text'),
			hasBoolScheme: field('text'),
			hasImageScheme: field('text'),
			hasImageBigScheme: field('text'),
			grouped_scheme: field('text'),
			isCategorieScheme: field('text'),
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
			// ── undeclared in registry, detected in _base — verify ──
			isoDateCreation: field('text'),
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
			petitNom: field('text'),
			icon: field('text'),
			ordre: field('text'),
			// ── undeclared in registry, detected in _base — verify ──
			field_title: field('text'),
			field_raw: field('text'),
			field_group: field('text'),
			field_type: field('text'),
			ordreAppscheme_field_group: field('text'),
			idappshemefield_type: field('text'),
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
			icon: field('text'),
			ordre: field('text'),
			// ── undeclared in registry, detected in _base — verify ──
			group_name: field('text'),
			group_ordre: field('text'),
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
			// ── undeclared in registry, detected in _base — verify ──
			type_name: field('text'),
			type_ordre: field('text'),
			ordre: field('text'),
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
			ordre: field('text'),
			// ── undeclared in registry, detected in _base — verify ──
			field_raw: field('text'),
			collection: field('text'),
			required: field('text'),
			ordreAppscheme_field: field('text'),
			in_mini_fiche: field('text'),
			petitNomAppscheme_field: field('text'),
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
			field_raw: field('text'),
			field_name: field('text'),
			idappscheme_link: field('text'),
			collection: field('text'),
			petitNomAppscheme_field: field('text'),
			ordreAppscheme_field: field('text'),
			petitNom: field('text'),
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
		base: 'machine_base',
		isGroup:  true,
		fields: {
			id:   field('id', { readonly: true }),
			code: field('text', { required: true }),
			name: field('text', { required: true }),
			icon: field('text'),
		},
		fks: {},
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

	"categorie_produit": {
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

	"client": {
		keyPath: '++id',
		base: 'machine_base',
		isType:   true,
		fields: {
			id:   field('id', { readonly: true }),
			code: field('text', { required: true }),
			name: field('text', { required: true }),
			telephone2: field('phone'),
			dateFin: field('date'),
			codePostal: field('text'),
			telephone: field('phone'),
			adresse: field('text'),
			description: field('text-long'),
			email: field('email'),
			mobile2: field('phone'),
			mobile: field('phone'),
			ville: field('text'),
			// ── undeclared in registry, detected in _base — verify ──
			cp: field('text'),
			adresse2: field('text'),
			adresse3: field('text'),
			fax: field('phone'),
			email2: field('email'),
			identite: field('text'),
		},
		fks: {
				agence: { code: 'agence', multiple: false },
				client_type: { code: 'client_type', multiple: false },
				client_categorie: { code: 'client_categorie', multiple: false },
			},
		template: { presentation: 'name code' },
	},

	"client_activite": {
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

	"client_categorie": {
		keyPath: '++id',
		base: 'machine_base',
		isGroup:  true,
		fields: {
			id:   field('id', { readonly: true }),
			code: field('text', { required: true }),
			name: field('text', { required: true }),
			description: field('text-long'),
			ordre: field('text'),
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
			description: field('text-long'),
		},
		fks: {},
		template: { presentation: 'name code' },
	},

	"commande": {
		keyPath: '++id',
		base: 'machine_base',
		isStatus: true,
		fields: {
			id:   field('id', { readonly: true }),
			code: field('text', { required: true }),
			name: field('text', { required: true }),
			totalMarge: field('currency'),
			totalTtc: field('currency'),
			totalTva: field('currency'),
			dateCreation: field('date'),
			dateDebut: field('date'),
			description: field('text-long'),
			totalHt: field('currency'),
		},
		fks: {
				client: { code: 'client', multiple: false },
			},
		template: { presentation: 'name code' },
	},

	"commande_ligne": {
		keyPath: '++id',
		base: 'machine_base',
		isGroup:  true,
		fields: {
			id:   field('id', { readonly: true }),
			code: field('text', { required: true }),
			name: field('text', { required: true }),
			ordre: field('text'),
			prix: field('currency'),
			quantite: field('number'),
			total: field('text'),
			// ── undeclared in registry, detected in _base — verify ──
			N_ID: field('text'),
		},
		fks: {
				commande: { code: 'commande', multiple: false },
			},
		template: { presentation: 'name code' },
	},

	"commande_statut": {
		keyPath: '++id',
		base: 'machine_base',
		isGroup:  true,
		fields: {
			id:   field('id', { readonly: true }),
			code: field('text', { required: true }),
			name: field('text', { required: true }),
			color: field('text'),
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
			dateDebut: field('date'),
			dateFin: field('date'),
			description: field('text-long'),
			duree: field('text'),
			// ── undeclared in registry, detected in _base — verify ──
			idagent_writer: field('text'),
			estActif: field('text'),
			commentaire: field('text'),
			petitNomAgent: field('text'),
			actifAgent: field('text'),
		},
		fks: {
				conge_type: { code: 'conge_type', multiple: false },
			},
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
			icon: field('text'),
			color: field('text'),
			ordre: field('text'),
			// ── undeclared in registry, detected in _base — verify ──
			isoDateCreation: field('text'),
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
			color: field('text'),
			duree: field('text'),
		},
		fks: {},
		template: { presentation: 'name code' },
	},

	"contact": {
		keyPath: '++id',
		base: 'machine_base',
		isType:   true,
		fields: {
			id:   field('id', { readonly: true }),
			code: field('text', { required: true }),
			name: field('text', { required: true }),
			email: field('email'),
			prenom: field('text'),
			telephone: field('phone'),
			mobile: field('phone'),
		},
		fks: {},
		template: { presentation: 'name code' },
	},

	"contact_type": {
		keyPath: '++id',
		base: 'machine_base',
		isGroup:  true,
		fields: {
			id:   field('id', { readonly: true }),
			code: field('text', { required: true }),
			name: field('text', { required: true }),
			color: field('text'),
			icon: field('text'),
		},
		fks: {},
		template: { presentation: 'name code' },
	},

	"contrat": {
		keyPath: '++id',
		base: 'machine_base',
		isType:   true,
		isStatus: true,
		fields: {
			id:   field('id', { readonly: true }),
			code: field('text', { required: true }),
			name: field('text', { required: true }),
			cccoul: field('text'),
			ccn: field('text'),
			dateDebut: field('date'),
			dateFin: field('date'),
			description: field('text-long'),
			duree: field('text'),
			// ── undeclared in registry, detected in _base — verify ──
			commentaire: field('text'),
			aa_partie_n_id: field('text'),
			aa_partie_code: field('text'),
			aa_partie_site_n_id: field('text'),
		},
		fks: {
				client: { code: 'client', multiple: false },
				contrat_statut: { code: 'contrat_statut', multiple: false },
				contrat_type: { code: 'contrat_type', multiple: false },
			},
		template: { presentation: 'name code' },
	},

	"contrat_ligne": {
		keyPath: '++id',
		base: 'machine_base',
		isGroup:  true,
		fields: {
			id:   field('id', { readonly: true }),
			code: field('text', { required: true }),
			name: field('text', { required: true }),
			ordre: field('text'),
			valeur: field('number'),
		},
		fks: {
				contrat: { code: 'contrat', multiple: false },
			},
		template: { presentation: 'name code' },
	},

	"contrat_statut": {
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

	"contrat_type": {
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

	"cron": {
		keyPath: '++id',
		base: 'machine_base',
		isType:   true,
		fields: {
			id:   field('id', { readonly: true }),
			code: field('text', { required: true }),
			name: field('text', { required: true }),
			ville: field('text'),
			codePostal: field('text'),
			adresse: field('text'),
			ordre: field('text'),
		},
		fks: {},
		template: { presentation: 'name code' },
	},

	"cron_type": {
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

	"daemon": {
		keyPath: '++id',
		base: 'machine_base',
		fields: {
			id:   field('id', { readonly: true }),
			code: field('text', { required: true }),
			name: field('text', { required: true }),
			valeur: field('number'),
			dateDebut: field('date'),
			heureDebut: field('date'),
		},
		fks: {},
		template: { presentation: 'name code' },
	},

	"document": {
		keyPath: '++id',
		base: 'machine_base',
		isType:   true,
		fields: {
			id:   field('id', { readonly: true }),
			code: field('text', { required: true }),
			name: field('text', { required: true }),
			dateCreation: field('date'),
			heureCreation: field('text'),
			// ── undeclared in registry, detected in _base — verify ──
			table: field('text'),
			table_value: field('text'),
			description: field('text'),
			isoDateCreation: field('text'),
		},
		fks: {
				client: { code: 'client', multiple: false },
				document_type: { code: 'document_type', multiple: false },
				document_extension: { code: 'document_extension', multiple: false },
			},
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

	"email": {
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

	"email_mime": {
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

	"emailbox": {
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

	"entite": {
		keyPath: '++id',
		base: 'machine_base',
		fields: {
			id:   field('id', { readonly: true }),
			code: field('text', { required: true }),
			name: field('text', { required: true }),
			adresse: field('text'),
			// ── undeclared in registry, detected in _base — verify ──
			ville: field('text'),
			siren: field('text'),
			siret: field('text'),
		},
		fks: {},
		template: { presentation: 'name code' },
	},

	"facture": {
		keyPath: '++id',
		base: 'machine_base',
		fields: {
			id:   field('id', { readonly: true }),
			code: field('text', { required: true }),
			name: field('text', { required: true }),
			date: field('date'),
			totalHt: field('currency'),
			totalTva: field('currency'),
			totalTtc: field('currency'),
			// ── undeclared in registry, detected in _base — verify ──
			description: field('text'),
		},
		fks: {
				client: { code: 'client', multiple: false },
				contrat: { code: 'contrat', multiple: false },
			},
		template: { presentation: 'name code' },
	},

	"facture_ligne": {
		keyPath: '++id',
		base: 'machine_base',
		isGroup:  true,
		fields: {
			id:   field('id', { readonly: true }),
			code: field('text', { required: true }),
			name: field('text', { required: true }),
			ordre: field('text'),
			prix: field('currency'),
			totalHt: field('currency'),
			totalTtc: field('currency'),
			totalTva: field('currency'),
			quantite: field('number'),
			// ── undeclared in registry, detected in _base — verify ──
			description: field('text'),
		},
		fks: {
				facture: { code: 'facture', multiple: false },
			},
		template: { presentation: 'name code' },
	},

	"financement": {
		keyPath: '++id',
		base: 'machine_base',
		fields: {
			id:   field('id', { readonly: true }),
			code: field('text', { required: true }),
			name: field('text', { required: true }),
			dateQuantieme: field('text'),
			montantEcheance: field('currency'),
			taux: field('currency'),
			duree: field('text'),
			montant: field('currency'),
			ref: field('text'),
			dateFin: field('date'),
			// ── undeclared in registry, detected in _base — verify ──
			identite: field('text'),
			reference: field('text'),
			montantEchenace: field('text'),
			N_ID: field('text'),
		},
		fks: {
				client: { code: 'client', multiple: false },
				affaire: { code: 'affaire', multiple: false },
				leaser: { code: 'leaser', multiple: false },
				financement_type: { code: 'financement_type', multiple: false },
			},
		template: { presentation: 'name code' },
	},

	"financement_ligne": {
		keyPath: '++id',
		base: 'machine_base',
		isGroup:  true,
		fields: {
			id:   field('id', { readonly: true }),
			code: field('text', { required: true }),
			name: field('text', { required: true }),
			montantEcheance: field('currency'),
			montant: field('currency'),
			quantite: field('number'),
			total: field('text'),
			// ── undeclared in registry, detected in _base — verify ──
			N_ID: field('text'),
			prix: field('text'),
		},
		fks: {
				financement: { code: 'financement', multiple: false },
				commande_ligne: { code: 'commande_ligne', multiple: false },
			},
		template: { presentation: 'name code' },
	},

	"financement_type": {
		keyPath: '++id',
		base: 'machine_base',
		isGroup:  true,
		fields: {
			id:   field('id', { readonly: true }),
			code: field('text', { required: true }),
			name: field('text', { required: true }),
			// ── undeclared in registry, detected in _base — verify ──
			ordre: field('text'),
		},
		fks: {},
		template: { presentation: 'name code' },
	},

	"ged_bin": {
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

	"intervention_statut": {
		keyPath: '++id',
		base: 'machine_base',
		isGroup:  true,
		fields: {
			id:   field('id', { readonly: true }),
			code: field('text', { required: true }),
			name: field('text', { required: true }),
			color: field('text'),
			icon: field('text'),
			ordre: field('text'),
		},
		fks: {},
		template: { presentation: 'name code' },
	},

	"intervention_type": {
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

	"leaser": {
		keyPath: '++id',
		base: 'machine_base',
		fields: {
			id:   field('id', { readonly: true }),
			code: field('text', { required: true }),
			name: field('text', { required: true }),
			description: field('text-long'),
			ville: field('text'),
			fax: field('phone'),
		},
		fks: {},
		template: { presentation: 'name code' },
	},

	"marque": {
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

	"materiel": {
		keyPath: '++id',
		base: 'machine_base',
		fields: {
			id:   field('id', { readonly: true }),
			code: field('text', { required: true }),
			name: field('text', { required: true }),
			compteurNB: field('text'),
			compteurCouleur: field('text'),
			vmmCouleur: field('number'),
			vmmNB: field('number'),
			// ── undeclared in registry, detected in _base — verify ──
			reference: field('text'),
			N_ID: field('text'),
			commentaire: field('text'),
			idtypeprod: field('text'),
			idsite: field('url'),
			villeSite: field('url'),
			dureeContrat: field('text'),
			description: field('text'),
		},
		fks: {
				produit: { code: 'produit', multiple: false },
				client: { code: 'client', multiple: false },
				contrat: { code: 'contrat', multiple: false },
			},
		template: { presentation: 'name code' },
	},

	"materiel_compteur": {
		keyPath: '++id',
		base: 'machine_base',
		fields: {
			id:   field('id', { readonly: true }),
			code: field('text', { required: true }),
			name: field('text', { required: true }),
			valeur: field('number'),
			date: field('date'),
			// ── undeclared in registry, detected in _base — verify ──
			N_ID: field('text'),
			commentaire: field('text'),
			vmmCouleurMateriel: field('text'),
			vmmNBMateriel: field('text'),
		},
		fks: {
				materiel: { code: 'materiel', multiple: false },
			},
		template: { presentation: 'name code' },
	},

	"materiel_volume": {
		keyPath: '++id',
		base: 'machine_base',
		fields: {
			id:   field('id', { readonly: true }),
			code: field('text', { required: true }),
			name: field('text', { required: true }),
			dateCreation: field('date'),
			quantite: field('number'),
			// ── undeclared in registry, detected in _base — verify ──
			N_ID: field('text'),
			valeur: field('text'),
		},
		fks: {
				materiel: { code: 'materiel', multiple: false },
			},
		template: { presentation: 'name code' },
	},

	"opportunite": {
		keyPath: '++id',
		base: 'machine_base',
		isStatus: true,
		fields: {
			id:   field('id', { readonly: true }),
			code: field('text', { required: true }),
			name: field('text', { required: true }),
			cccoul: field('text'),
			actif: field('text'),
			rang: field('text'),
			ccn: field('text'),
			vmmCouleur: field('number'),
			vmmNB: field('number'),
			montant: field('currency'),
			dateFin: field('date'),
			description: field('text-long'),
			montantRachat: field('text'),
			marge: field('text'),
			// ── undeclared in registry, detected in _base — verify ──
			commentaire: field('text'),
			petitNomAgent: field('text'),
			actifAgent: field('text'),
			ordreOpportunite_statut: field('text'),
		},
		fks: {
				client: { code: 'client', multiple: false },
				opportunite_statut: { code: 'opportunite_statut', multiple: false },
			},
		template: { presentation: 'name code' },
	},

	"opportunite_ligne": {
		keyPath: '++id',
		base: 'machine_base',
		isGroup:  true,
		fields: {
			id:   field('id', { readonly: true }),
			code: field('text', { required: true }),
			name: field('text', { required: true }),
			quantite: field('number'),
		},
		fks: {
				opportunite: { code: 'opportunite', multiple: false },
				produit: { code: 'produit', multiple: false },
			},
		template: { presentation: 'name code' },
	},

	"opportunite_statut": {
		keyPath: '++id',
		base: 'machine_base',
		isGroup:  true,
		fields: {
			id:   field('id', { readonly: true }),
			code: field('text', { required: true }),
			name: field('text', { required: true }),
			ordre: field('text'),
			color: field('text'),
		},
		fks: {},
		template: { presentation: 'name code' },
	},

	"opportunite_type": {
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

	"prestataire": {
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

	"produit": {
		keyPath: '++id',
		base: 'machine_base',
		fields: {
			id:   field('id', { readonly: true }),
			code: field('text', { required: true }),
			name: field('text', { required: true }),
			description: field('text-long'),
			prix: field('currency'),
			ref: field('text'),
			// ── undeclared in registry, detected in _base — verify ──
			N_ID: field('text'),
		},
		fks: {
				marque: { code: 'marque', multiple: false },
			},
		template: { presentation: 'name code' },
	},

	"produit_gamme": {
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

	"prospect": {
		keyPath: '++id',
		base: 'machine_base',
		fields: {
			id:   field('id', { readonly: true }),
			code: field('text', { required: true }),
			name: field('text', { required: true }),
			adresse: field('text'),
			description: field('text-long'),
			email: field('email'),
			telephone: field('phone'),
			codePostal: field('text'),
			ville: field('text'),
			// ── undeclared in registry, detected in _base — verify ──
			identite: field('text'),
			adresse2: field('text'),
			cp: field('text'),
			pays: field('text'),
		},
		fks: {},
		template: { presentation: 'name code' },
	},

	"rachat": {
		keyPath: '++id',
		base: 'machine_base',
		fields: {
			id:   field('id', { readonly: true }),
			code: field('text', { required: true }),
			name: field('text', { required: true }),
			dateCreation: field('date'),
			description: field('text-long'),
			total: field('text'),
			// ── undeclared in registry, detected in _base — verify ──
			commentaire: field('text'),
		},
		fks: {
				client: { code: 'client', multiple: false },
				affaire: { code: 'affaire', multiple: false },
			},
		template: { presentation: 'name code' },
	},

	"rachat_ligne": {
		keyPath: '++id',
		base: 'machine_base',
		isGroup:  true,
		fields: {
			id:   field('id', { readonly: true }),
			code: field('text', { required: true }),
			name: field('text', { required: true }),
			// ── undeclared in registry, detected in _base — verify ──
			N_ID: field('text'),
			commentaire: field('text'),
			valeurArgus: field('text'),
		},
		fks: {
				rachat: { code: 'rachat', multiple: false },
			},
		template: { presentation: 'name code' },
	},

	"ressource": {
		keyPath: '++id',
		base: 'machine_base',
		fields: {
			id:   field('id', { readonly: true }),
			code: field('text', { required: true }),
			name: field('text', { required: true }),
			description: field('text-long'),
			dateDebut: field('date'),
			dateFin: field('date'),
			quantite: field('number'),
			dateInstallation: field('text'),
			// ── undeclared in registry, detected in _base — verify ──
			duree: field('text'),
		},
		fks: {
				prospect: { code: 'prospect', multiple: false },
			},
		template: { presentation: 'name code' },
	},

	"secteur": {
		keyPath: '++id',
		base: 'machine_base',
		fields: {
			id:   field('id', { readonly: true }),
			code: field('text', { required: true }),
			name: field('text', { required: true }),
			codePostal: field('text'),
			// ── undeclared in registry, detected in _base — verify ──
			N_ID: field('text'),
			isoDateCreation: field('text'),
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
			// ── undeclared in registry, detected in _base — verify ──
			resultat: field('text'),
		},
		fks: {
				prospect: { code: 'prospect', multiple: false },
				tache_statut: { code: 'tache_statut', multiple: false },
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
			color: field('text'),
			icon: field('text'),
			// ── undeclared in registry, detected in _base — verify ──
			commentaireStatut_tache: field('text'),
			idstatut_tache_has_type_suivi: field('text'),
			valeur: field('text'),
			ordre: field('text'),
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
			icon: field('text'),
			// ── undeclared in registry, detected in _base — verify ──
			ordreType_tache: field('text'),
			commentaireType_tache: field('text'),
			commentaireType_suivi: field('text'),
		},
		fks: {},
		template: { presentation: 'name code' },
	},
};

export default idaenextScheme;
