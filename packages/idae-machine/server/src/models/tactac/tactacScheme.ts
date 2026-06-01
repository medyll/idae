// AUTO-GENERATED from legacy MongoDB tactac_sitebase_app + sampled _base.
// Source: appscheme / appscheme_has_field / appscheme_field (+ FK & undeclared fields inferred from _base docs).
// Reconstructed in idae-machine model-core (MachineModel) shape. Review 'undeclared' fields before seeding.
import type { MachineModel } from '../../../../src/lib/types/machine-model.js';
import { field } from '../../../../src/lib/main/machine/fieldBuilder.js';

export const tactacScheme: MachineModel = {
	"adresse_type": {
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
			password: field('text'),
			image_small: field('text'),
			// ── undeclared in registry, detected in _base — verify ──
			estActif: field('text'),
			etatCivil: field('text'),
			PHPSESSID: field('text'),
			settings: field('text'),
			mailPassword: field('email'),
			droit_app: field('text'),
			identite: field('text'),
			online: field('text'),
			ordreAgent_groupe: field('text'),
			private_key: field('text'),
		},
		fks: {
				agent_groupe: { code: 'agent_groupe', multiple: false },
			},
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
			// ── undeclared in registry, detected in _base — verify ──
			isoDateCreation: field('text'),
		},
		fks: {
				agent_groupe_droit: { code: 'agent_groupe_droit', multiple: false },
			},
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
			// ── undeclared in registry, detected in _base — verify ──
			actifAgent: field('text'),
			petitNomAgent: field('text'),
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
			icon: field('text'),
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
			isCategorieScheme: field('text'),
			grouped_scheme: field('text'),
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

	"appscheme_field_droit": {
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

	"appscheme_field_droit_group": {
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

	"cart": {
		keyPath: '++id',
		base: 'machine_base',
		fields: {
			id:   field('id', { readonly: true }),
			code: field('text', { required: true }),
			name: field('text', { required: true }),
			totalTtc: field('currency'),
			// ── undeclared in registry, detected in _base — verify ──
			cart_id: field('text'),
			init_time: field('text'),
			cart_adresse: field('text'),
			cart_lines: field('text'),
			cart_sous_total: field('text'),
			cart_total: field('text'),
			cart_total_time: field('text'),
			cart_total_volume: field('text'),
			last_time: field('text'),
			shop: field('text'),
		},
		fks: {
				secteur: { code: 'secteur', multiple: false },
				shop: { code: 'shop', multiple: false },
			},
		template: { presentation: 'name code' },
	},

	"categorie_produit": {
		keyPath: '++id',
		base: 'machine_base',
		fields: {
			id:   field('id', { readonly: true }),
			code: field('text', { required: true }),
			name: field('text', { required: true }),
			ordre: field('text'),
			slug: field('text'),
		},
		fks: {},
		template: { presentation: 'name code' },
	},

	"client": {
		keyPath: '++id',
		base: 'machine_base',
		fields: {
			id:   field('id', { readonly: true }),
			code: field('text', { required: true }),
			name: field('text', { required: true }),
			dateFin: field('date'),
			codePostal: field('text'),
			telephone: field('phone'),
			adresse: field('text'),
			description: field('text-long'),
			email: field('email', { required: true }),
			mobile: field('phone'),
			ville: field('text'),
			fax: field('phone'),
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

	"comande_history": {
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

	"commande": {
		keyPath: '++id',
		base: 'machine_base',
		isStatus: true,
		fields: {
			id:   field('id', { readonly: true }),
			code: field('text', { required: true }),
			name: field('text', { required: true }),
			dateCreation: field('date'),
			description: field('text-long'),
			heure: field('text'),
			date: field('date'),
			email: field('email'),
			telephone: field('phone'),
			duree_realisation: field('text'),
			adresse: field('text'),
			codePostal: field('text'),
			ville: field('text'),
			prix: field('currency'),
			dureeLivraison: field('text'),
			distance: field('text'),
			heureFinPreparation: field('text'),
			heureLivraison: field('text'),
			ref: field('text'),
			// ── undeclared in registry, detected in _base — verify ──
			adresse2: field('text'),
			volume: field('text'),
			prixService: field('text'),
			rang: field('text'),
			ordre: field('text'),
			ordreCommande_statut: field('text'),
			reference: field('text'),
			tempsAnnonce: field('text'),
			actifShop: field('text'),
			isoDate: field('text'),
			isoDateCreation: field('text'),
			slugShop: field('text'),
			attentePreparation: field('text'),
			debugRang: field('text'),
			debugRangCommandeModulo: field('text'),
			dynSlot: field('text'),
			internalSlot: field('text'),
			ordreSecteur: field('text'),
			slot: field('text'),
		},
		fks: {
				client: { code: 'client', multiple: false },
				shop: { code: 'shop', multiple: false },
				secteur: { code: 'secteur', multiple: false },
				shop_jours_shift: { code: 'shop_jours_shift', multiple: false },
				commande_statut: { code: 'commande_statut', multiple: false },
				shop_jours_shift_run: { code: 'shop_jours_shift_run', multiple: false },
			},
		template: { presentation: 'name code' },
	},

	"commande_facture": {
		keyPath: '++id',
		base: 'machine_base',
		fields: {
			id:   field('id', { readonly: true }),
			code: field('text', { required: true }),
			name: field('text', { required: true }),
			marge: field('text'),
			date: field('date'),
			heure: field('text'),
			partLivreur: field('text'),
			partShop: field('text'),
			// ── undeclared in registry, detected in _base — verify ──
			total_commande_client: field('text'),
			total_livraison_commande: field('text'),
			total: field('text'),
			actifShop: field('text'),
			isoDate: field('text'),
			ordreCommande: field('text'),
			slugShop: field('text'),
		},
		fks: {
				shop: { code: 'shop', multiple: false },
				commande: { code: 'commande', multiple: false },
			},
		template: { presentation: 'name code' },
	},

	"commande_ligne": {
		keyPath: '++id',
		base: 'machine_base',
		fields: {
			id:   field('id', { readonly: true }),
			code: field('text', { required: true }),
			name: field('text', { required: true }),
			ordre: field('text'),
			prix: field('currency'),
			quantite: field('number'),
			total: field('text'),
			description: field('text-long'),
			// ── undeclared in registry, detected in _base — verify ──
			actifProduit: field('text'),
			ordreCommande: field('text'),
			slugProduit: field('text'),
		},
		fks: {
				commande: { code: 'commande', multiple: false },
				shop: { code: 'shop', multiple: false },
				client: { code: 'client', multiple: false },
				produit: { code: 'produit', multiple: false },
			},
		template: { presentation: 'name code' },
	},

	"commande_proposition": {
		keyPath: '++id',
		base: 'machine_base',
		fields: {
			id:   field('id', { readonly: true }),
			code: field('text', { required: true }),
			name: field('text', { required: true }),
			dateCreation: field('date'),
			actif: field('text'),
			vu: field('text'),
			ended: field('text'),
			heure: field('text'),
			date: field('date'),
			ref: field('text'),
			// ── undeclared in registry, detected in _base — verify ──
			reference: field('text'),
			actifLivreur: field('text'),
			isoDate: field('text'),
		},
		fks: {
				commande: { code: 'commande', multiple: false },
				secteur: { code: 'secteur', multiple: false },
				shop: { code: 'shop', multiple: false },
				livreur: { code: 'livreur', multiple: false },
			},
		template: { presentation: 'name code' },
	},

	"commande_slot": {
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

	"commande_slot_ligne": {
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
			icon: field('text'),
			// ── undeclared in registry, detected in _base — verify ──
			isoDateCreation: field('text'),
		},
		fks: {},
		template: { presentation: 'name code' },
	},

	"commune": {
		keyPath: '++id',
		base: 'machine_base',
		fields: {
			id:   field('id', { readonly: true }),
			code: field('text', { required: true }),
			name: field('text', { required: true }),
			slug: field('text'),
			gpsData: field('text'),
			codePostal: field('text'),
			ref: field('text'),
			// ── undeclared in registry, detected in _base — verify ──
			Libelle_acheminement: field('text'),
			gps: field('text'),
		},
		fks: {
				ville: { code: 'ville', multiple: false },
			},
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

	"cron": {
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

	"entite": {
		keyPath: '++id',
		base: 'machine_base',
		fields: {
			id:   field('id', { readonly: true }),
			code: field('text', { required: true }),
			name: field('text', { required: true }),
			adresse: field('text'),
			// ── undeclared in registry, detected in _base — verify ──
			isoDateCreation: field('text'),
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
		},
		fks: {},
		template: { presentation: 'name code' },
	},

	"facture_ligne": {
		keyPath: '++id',
		base: 'machine_base',
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
		},
		fks: {},
		template: { presentation: 'name code' },
	},

	"jours": {
		keyPath: '++id',
		base: 'machine_base',
		fields: {
			id:   field('id', { readonly: true }),
			code: field('text', { required: true }),
			name: field('text', { required: true }),
			slug: field('text'),
			ordre: field('text'),
			// ── undeclared in registry, detected in _base — verify ──
			isoDateCreation: field('text'),
		},
		fks: {},
		template: { presentation: 'name code' },
	},

	"livraison": {
		keyPath: '++id',
		base: 'machine_base',
		isStatus: true,
		fields: {
			id:   field('id', { readonly: true }),
			code: field('text', { required: true }),
			name: field('text', { required: true }),
			date: field('date'),
			heureDebut: field('date'),
			heureFin: field('date'),
		},
		fks: {},
		template: { presentation: 'name code' },
	},

	"livraison_statut": {
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

	"livreur": {
		keyPath: '++id',
		base: 'machine_base',
		fields: {
			id:   field('id', { readonly: true }),
			code: field('text', { required: true }),
			name: field('text', { required: true }),
			prenom: field('text'),
			codePostal: field('text'),
			adresse: field('text'),
			email: field('email'),
			mobile: field('phone'),
			dateDebut: field('date'),
			dateFin: field('date'),
			actif: field('text'),
			login: field('text'),
			password: field('text'),
			disponible: field('text'),
			// ── undeclared in registry, detected in _base — verify ──
			ville: field('text'),
			private_key: field('text'),
			slugSecteur: field('text'),
			isoDateCreation: field('text'),
		},
		fks: {
				secteur: { code: 'secteur', multiple: false },
			},
		template: { presentation: 'name code' },
	},

	"livreur_affectation": {
		keyPath: '++id',
		base: 'machine_base',
		fields: {
			id:   field('id', { readonly: true }),
			code: field('text', { required: true }),
			name: field('text', { required: true }),
			dateDebut: field('date', { required: true }),
			dateFin: field('date'),
			heureDebut: field('date', { required: true }),
			heureFin: field('date', { required: true }),
			actif: field('text'),
			// ── undeclared in registry, detected in _base — verify ──
			code_auto: field('text'),
			actifLivreur: field('text'),
			isoDateDebut: field('text'),
			isoDateFin: field('text'),
			slugSecteur: field('text'),
		},
		fks: {
				livreur: { code: 'livreur', multiple: false },
				secteur: { code: 'secteur', multiple: false },
			},
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
			description: field('text-long'),
			prix: field('currency', { required: true }),
			dateDebut: field('date'),
			dateFin: field('date'),
			slug: field('text'),
			actif: field('text'),
			duree_realisation: field('text', { required: true }),
			volume: field('text', { required: true }),
			stock: field('text'),
			// ── undeclared in registry, detected in _base — verify ──
			isoDateCreation: field('text'),
			ordreProduit_type: field('text'),
			ordreProduit_categorie: field('text'),
			slugProduit_categorie: field('text'),
			slugShop: field('text'),
			actifShop: field('text'),
			prix_site: field('url'),
			isoDateDebut: field('text'),
		},
		fks: {
				shop: { code: 'shop', multiple: false },
				produit_type: { code: 'produit_type', multiple: false },
				produit_categorie: { code: 'produit_categorie', multiple: false },
			},
		template: { presentation: 'name code' },
	},

	"produit_categorie": {
		keyPath: '++id',
		base: 'machine_base',
		isGroup:  true,
		fields: {
			id:   field('id', { readonly: true }),
			code: field('text', { required: true }),
			name: field('text', { required: true }),
			slug: field('text'),
			ordre: field('text'),
		},
		fks: {},
		template: { presentation: 'name code' },
	},

	"produit_type": {
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

	"secteur": {
		keyPath: '++id',
		base: 'machine_base',
		fields: {
			id:   field('id', { readonly: true }),
			code: field('text', { required: true }),
			name: field('text', { required: true }),
			codePostal: field('text'),
			gpsData: field('text'),
			slug: field('text'),
			// ── undeclared in registry, detected in _base — verify ──
			slugVille: field('text'),
			latitude: field('text'),
			longitude: field('text'),
			dezdezdez: field('text'),
			gps: field('text'),
			gps_index: field('text'),
			isoDateCreation: field('text'),
		},
		fks: {
				ville: { code: 'ville', multiple: false },
			},
		template: { presentation: 'name code' },
	},

	"secteur_jours_shift": {
		keyPath: '++id',
		base: 'machine_base',
		fields: {
			id:   field('id', { readonly: true }),
			code: field('text', { required: true }),
			name: field('text', { required: true }),
			heureDebut: field('date'),
			heureFin: field('date'),
			// ── undeclared in registry, detected in _base — verify ──
			code_auto: field('text'),
			ordreJours: field('text'),
			slugJours: field('text'),
			slugSecteur: field('text'),
		},
		fks: {
				secteur: { code: 'secteur', multiple: false },
				jours: { code: 'jours', multiple: false },
			},
		template: { presentation: 'name code' },
	},

	"shop": {
		keyPath: '++id',
		base: 'machine_base',
		isType:   true,
		fields: {
			id:   field('id', { readonly: true }),
			code: field('text', { required: true }),
			name: field('text', { required: true }),
			adresse: field('text'),
			codePostal: field('text', { required: true }),
			description: field('text-long'),
			telephone: field('phone', { required: true }),
			slug: field('text'),
			atout: field('text'),
			password: field('text'),
			login: field('text'),
			email: field('email'),
			gpsData: field('text'),
			actif: field('text'),
			strip_key: field('text'),
			// ── undeclared in registry, detected in _base — verify ──
			ville: field('text'),
			private_key: field('text'),
			slugVille: field('text'),
			slugSecteur: field('text'),
			gps: field('text'),
			latitude: field('text'),
			longitude: field('text'),
			tempsAttente: field('text'),
			isoDateCreation: field('text'),
		},
		fks: {
				shop_type: { code: 'shop_type', multiple: false },
				ville: { code: 'ville', multiple: false },
				secteur: { code: 'secteur', multiple: false },
				client: { code: 'client', multiple: false },
				shop_categorie: { code: 'shop_categorie', multiple: false },
				shop_client: { code: 'shop_client', multiple: false },
			},
		template: { presentation: 'name code' },
	},

	"shop_categorie": {
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

	"shop_client": {
		keyPath: '++id',
		base: 'machine_base',
		fields: {
			id:   field('id', { readonly: true }),
			code: field('text', { required: true }),
			name: field('text', { required: true }),
			adresse: field('text'),
			codePostal: field('text'),
			ville: field('text'),
			login: field('text'),
			email: field('email'),
			telephone: field('phone'),
			mobile: field('phone'),
			// ── undeclared in registry, detected in _base — verify ──
			isoDateCreation: field('text'),
		},
		fks: {},
		template: { presentation: 'name code' },
	},

	"shop_configuration": {
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

	"shop_configuration_ligne": {
		keyPath: '++id',
		base: 'machine_base',
		fields: {
			id:   field('id', { readonly: true }),
			code: field('text', { required: true }),
			name: field('text', { required: true }),
			valeur_texte: field('text', { required: true }),
		},
		fks: {},
		template: { presentation: 'name code' },
	},

	"shop_jours": {
		keyPath: '++id',
		base: 'machine_base',
		fields: {
			id:   field('id', { readonly: true }),
			code: field('text', { required: true }),
			name: field('text', { required: true }),
			actif: field('text'),
			ordre: field('text'),
			// ── undeclared in registry, detected in _base — verify ──
			slugShop: field('text'),
			actifShop: field('text'),
			ordreJours: field('text'),
			slugJours: field('text'),
		},
		fks: {
				jours: { code: 'jours', multiple: false },
				shop: { code: 'shop', multiple: false },
			},
		template: { presentation: 'name code' },
	},

	"shop_jours_shift": {
		keyPath: '++id',
		base: 'machine_base',
		fields: {
			id:   field('id', { readonly: true }),
			code: field('text', { required: true }),
			name: field('text', { required: true }),
			heureDebut: field('date'),
			heureFin: field('date'),
			actif: field('text'),
			ordre: field('text'),
			// ── undeclared in registry, detected in _base — verify ──
			ordreShop_jours: field('text'),
			actifShop_jours: field('text'),
			slugShop: field('text'),
			actifShop: field('text'),
		},
		fks: {
				shop_jours: { code: 'shop_jours', multiple: false },
				shop: { code: 'shop', multiple: false },
			},
		template: { presentation: 'name code' },
	},

	"shop_jours_shift_run": {
		keyPath: '++id',
		base: 'machine_base',
		fields: {
			id:   field('id', { readonly: true }),
			code: field('text', { required: true }),
			name: field('text', { required: true }),
			dateDebut: field('date'),
			dateFin: field('date'),
			heureDebut: field('date'),
			heureFin: field('date'),
			// ── undeclared in registry, detected in _base — verify ──
			slugShop: field('text'),
			actifShop: field('text'),
			ordreShop_jours_shift: field('text'),
			actifShop_jours_shift: field('text'),
		},
		fks: {
				shop: { code: 'shop', multiple: false },
				shop_jours_shift: { code: 'shop_jours_shift', multiple: false },
			},
		template: { presentation: 'name code' },
	},

	"shop_type": {
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
			resultat: field('text'),
		},
		fks: {},
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
			slug: field('text'),
			gpsData: field('text'),
		},
		fks: {},
		template: { presentation: 'name code' },
	},
};

export default tactacScheme;
