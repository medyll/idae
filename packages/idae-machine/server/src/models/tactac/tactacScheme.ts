// AUTO-GENERATED from legacy MongoDB tactac_sitebase_app + sampled _base.
// Source: appscheme / appscheme_has_field / appscheme_field (+ FK & undeclared fields inferred from _base docs).
// Reconstructed in idae-machine model-core (MachineModel) shape. Review 'undeclared' fields before seeding.
import type { MachineModel } from '../../../../src/lib/types/machine-model.js';

export const tactacScheme: MachineModel = {
	"adresse_type": {
		base: 'machine_base',
		isGroup:  true,
		fields: {
			id:   { type: 'id', readonly: true },
			code: { type: 'text', required: true },
			name: { type: 'text', required: true },
		},
		fkRelations: {},
		template: { presentation: 'name code' },
	},

	"agence": {
		base: 'machine_base',
		fields: {
			id:   { type: 'id', readonly: true },
			code: { type: 'text', required: true },
			name: { type: 'text', required: true },
		},
		fkRelations: {},
		template: { presentation: 'name code' },
	},

	"agent": {
		base: 'machine_base',
		fields: {
			id:   { type: 'id', readonly: true },
			code: { type: 'text', required: true },
			name: { type: 'text', required: true },
			prenom: { type: 'text' },
			actif: { type: 'boolean' },
			email: { type: 'email' },
			mobile: { type: 'phone' },
			petitNom: { type: 'text' },
			telephone: { type: 'phone' },
			login: { type: 'text' },
			telephone2: { type: 'phone' },
			password: { type: 'text' },
			image_small: { type: 'text' },
			// ── undeclared in registry, detected in _base — verify ──
			estActif: { type: 'boolean' },
			etatCivil: { type: 'text' },
			PHPSESSID: { type: 'text' },
			settings: { type: 'text' },
			mailPassword: { type: 'email' },
			droit_app: { type: 'text' },
			identite: { type: 'text' },
			online: { type: 'boolean' },
			ordreAgent_groupe: { type: 'text' },
			private_key: { type: 'text' },
		},
		fkRelations: {
				appuser_group: { code: 'appuser_group', multiple: false },
			},
		template: { presentation: 'name code' },
	},

	"agent_activite": {
		base: 'machine_user',
		fields: {
			id:   { type: 'id', readonly: true },
			code: { type: 'text', required: true },
			name: { type: 'text', required: true },
			date: { type: 'date' },
			valeur: { type: 'number' },
			heure: { type: 'datetime' },
		},
		fkRelations: {},
		template: { presentation: 'name code' },
	},

	"agent_history": {
		base: 'machine_user',
		fields: {
			id:   { type: 'id', readonly: true },
			code: { type: 'text', required: true },
			name: { type: 'text', required: true },
			valeur: { type: 'number' },
			date: { type: 'date' },
			heure: { type: 'datetime' },
			// ── undeclared in registry, detected in _base — verify ──
			quantite: { type: 'number' },
		},
		fkRelations: {},
		template: { presentation: 'name code' },
	},

	"agent_liste": {
		base: 'machine_base',
		fields: {
			id:   { type: 'id', readonly: true },
			code: { type: 'text', required: true },
			name: { type: 'text', required: true },
			ordre: { type: 'number' },
		},
		fkRelations: {},
		template: { presentation: 'name code' },
	},

	"agent_liste_ligne": {
		base: 'machine_base',
		fields: {
			id:   { type: 'id', readonly: true },
			code: { type: 'text', required: true },
			name: { type: 'text', required: true },
		},
		fkRelations: {},
		template: { presentation: 'name code' },
	},

	"agent_note": {
		base: 'machine_user',
		fields: {
			id:   { type: 'id', readonly: true },
			code: { type: 'text', required: true },
			name: { type: 'text', required: true },
			color: { type: 'text' },
			dateCreation: { type: 'date' },
			description: { type: 'text-long' },
			petitNom: { type: 'text' },
		},
		fkRelations: {},
		template: { presentation: 'name code' },
	},

	"agent_pref": {
		base: 'machine_base',
		fields: {
			id:   { type: 'id', readonly: true },
			code: { type: 'text', required: true },
			name: { type: 'text', required: true },
		},
		fkRelations: {},
		template: { presentation: 'name code' },
	},

	"agent_recherche": {
		base: 'machine_base',
		fields: {
			id:   { type: 'id', readonly: true },
			code: { type: 'text', required: true },
			name: { type: 'text', required: true },
		},
		fkRelations: {},
		template: { presentation: 'name code' },
	},

	"agent_table": {
		base: 'machine_base',
		fields: {
			id:   { type: 'id', readonly: true },
			code: { type: 'text', required: true },
			name: { type: 'text', required: true },
		},
		fkRelations: {},
		template: { presentation: 'name code' },
	},

	"agent_tuile": {
		base: 'machine_user',
		fields: {
			id:   { type: 'id', readonly: true },
			code: { type: 'text', required: true },
			name: { type: 'text', required: true },
			valeur: { type: 'number' },
			// ── undeclared in registry, detected in _base — verify ──
			actifAgent: { type: 'text' },
			petitNomAgent: { type: 'text' },
		},
		fkRelations: {},
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
		fkRelations: {},
		template: { presentation: 'name code' },
	},

	"app_conf": {
		base: 'machine_base',
		fields: {
			id:   { type: 'id', readonly: true },
			code: { type: 'text', required: true },
			name: { type: 'text', required: true },
		},
		fkRelations: {},
		template: { presentation: 'name code' },
	},

	"app_daemon": {
		base: 'machine_base',
		fields: {
			id:   { type: 'id', readonly: true },
			code: { type: 'text', required: true },
			name: { type: 'text', required: true },
		},
		fkRelations: {},
		template: { presentation: 'name code' },
	},

	"app_version": {
		base: 'machine_base',
		fields: {
			id:   { type: 'id', readonly: true },
			code: { type: 'text', required: true },
			name: { type: 'text', required: true },
			date: { type: 'date' },
			dateCreation: { type: 'date' },
		},
		fkRelations: {},
		template: { presentation: 'name code' },
	},

	"app_version_file": {
		base: 'machine_base',
		fields: {
			id:   { type: 'id', readonly: true },
			code: { type: 'text', required: true },
			name: { type: 'text', required: true },
			date: { type: 'date' },
			heure: { type: 'datetime' },
			dateCreation: { type: 'date' },
			heureCreation: { type: 'datetime' },
		},
		fkRelations: {},
		template: { presentation: 'name code' },
	},

	"app_version_file_preprod": {
		base: 'machine_base',
		fields: {
			id:   { type: 'id', readonly: true },
			code: { type: 'text', required: true },
			name: { type: 'text', required: true },
			date: { type: 'date' },
			heure: { type: 'datetime' },
			dateCreation: { type: 'date' },
			heureCreation: { type: 'datetime' },
		},
		fkRelations: {},
		template: { presentation: 'name code' },
	},

	"cart": {
		base: 'machine_base',
		fields: {
			id:   { type: 'id', readonly: true },
			code: { type: 'text', required: true },
			name: { type: 'text', required: true },
			totalTtc: { type: 'currency' },
			// ── undeclared in registry, detected in _base — verify ──
			cart_id: { type: 'text' },
			init_time: { type: 'text' },
			cart_adresse: { type: 'text' },
			cart_lines: { type: 'text' },
			cart_sous_total: { type: 'currency' },
			cart_total: { type: 'currency' },
			cart_total_time: { type: 'text' },
			cart_total_volume: { type: 'text' },
			last_time: { type: 'text' },
			shop: { type: 'text' },
		},
		fkRelations: {
				secteur: { code: 'secteur', multiple: false },
				shop: { code: 'shop', multiple: false },
			},
		template: { presentation: 'name code' },
	},

	"categorie_produit": {
		base: 'machine_base',
		fields: {
			id:   { type: 'id', readonly: true },
			code: { type: 'text', required: true },
			name: { type: 'text', required: true },
			ordre: { type: 'number' },
			slug: { type: 'text' },
		},
		fkRelations: {},
		template: { presentation: 'name code' },
	},

	"client": {
		base: 'machine_base',
		fields: {
			id:   { type: 'id', readonly: true },
			code: { type: 'text', required: true },
			name: { type: 'text', required: true },
			dateFin: { type: 'date' },
			codePostal: { type: 'text' },
			telephone: { type: 'phone' },
			adresse: { type: 'text' },
			description: { type: 'text-long' },
			email: { type: 'email', required: true },
			mobile: { type: 'phone' },
			ville: { type: 'text' },
			fax: { type: 'phone' },
		},
		fkRelations: {},
		template: { presentation: 'name code' },
	},

	"client_categorie": {
		base: 'machine_base',
		isGroup:  true,
		fields: {
			id:   { type: 'id', readonly: true },
			code: { type: 'text', required: true },
			name: { type: 'text', required: true },
			description: { type: 'text-long' },
			ordre: { type: 'number' },
		},
		fkRelations: {},
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
			description: { type: 'text-long' },
		},
		fkRelations: {},
		template: { presentation: 'name code' },
	},

	"comande_history": {
		base: 'machine_base',
		fields: {
			id:   { type: 'id', readonly: true },
			code: { type: 'text', required: true },
			name: { type: 'text', required: true },
		},
		fkRelations: {},
		template: { presentation: 'name code' },
	},

	"commande": {
		base: 'machine_base',
		isStatus: true,
		fields: {
			id:   { type: 'id', readonly: true },
			code: { type: 'text', required: true },
			name: { type: 'text', required: true },
			dateCreation: { type: 'date' },
			description: { type: 'text-long' },
			heure: { type: 'datetime' },
			date: { type: 'date' },
			email: { type: 'email' },
			telephone: { type: 'phone' },
			duree_realisation: { type: 'text' },
			adresse: { type: 'text' },
			codePostal: { type: 'text' },
			ville: { type: 'text' },
			prix: { type: 'currency' },
			dureeLivraison: { type: 'text' },
			distance: { type: 'text' },
			heureFinPreparation: { type: 'datetime' },
			heureLivraison: { type: 'datetime' },
			ref: { type: 'text' },
			// ── undeclared in registry, detected in _base — verify ──
			adresse2: { type: 'text' },
			volume: { type: 'number' },
			prixService: { type: 'currency' },
			rang: { type: 'text' },
			ordre: { type: 'number' },
			ordreCommande_statut: { type: 'text' },
			reference: { type: 'text' },
			tempsAnnonce: { type: 'text' },
			actifShop: { type: 'text' },
			isoDate: { type: 'datetime' },
			isoDateCreation: { type: 'datetime' },
			slugShop: { type: 'text' },
			attentePreparation: { type: 'text' },
			debugRang: { type: 'text' },
			debugRangCommandeModulo: { type: 'text' },
			dynSlot: { type: 'text' },
			internalSlot: { type: 'text' },
			ordreSecteur: { type: 'text' },
			slot: { type: 'text' },
		},
		fkRelations: {
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
		base: 'machine_base',
		fields: {
			id:   { type: 'id', readonly: true },
			code: { type: 'text', required: true },
			name: { type: 'text', required: true },
			marge: { type: 'text' },
			date: { type: 'date' },
			heure: { type: 'datetime' },
			partLivreur: { type: 'text' },
			partShop: { type: 'text' },
			// ── undeclared in registry, detected in _base — verify ──
			total_commande_client: { type: 'text' },
			total_livraison_commande: { type: 'text' },
			total: { type: 'currency' },
			actifShop: { type: 'text' },
			isoDate: { type: 'datetime' },
			ordreCommande: { type: 'text' },
			slugShop: { type: 'text' },
		},
		fkRelations: {
				shop: { code: 'shop', multiple: false },
				commande: { code: 'commande', multiple: false },
			},
		template: { presentation: 'name code' },
	},

	"commande_ligne": {
		base: 'machine_base',
		fields: {
			id:   { type: 'id', readonly: true },
			code: { type: 'text', required: true },
			name: { type: 'text', required: true },
			ordre: { type: 'number' },
			prix: { type: 'currency' },
			quantite: { type: 'number' },
			total: { type: 'currency' },
			description: { type: 'text-long' },
			// ── undeclared in registry, detected in _base — verify ──
			actifProduit: { type: 'text' },
			ordreCommande: { type: 'text' },
			slugProduit: { type: 'text' },
		},
		fkRelations: {
				commande: { code: 'commande', multiple: false },
				shop: { code: 'shop', multiple: false },
				client: { code: 'client', multiple: false },
				produit: { code: 'produit', multiple: false },
			},
		template: { presentation: 'name code' },
	},

	"commande_proposition": {
		base: 'machine_base',
		fields: {
			id:   { type: 'id', readonly: true },
			code: { type: 'text', required: true },
			name: { type: 'text', required: true },
			dateCreation: { type: 'date' },
			actif: { type: 'boolean' },
			vu: { type: 'text' },
			ended: { type: 'text' },
			heure: { type: 'datetime' },
			date: { type: 'date' },
			ref: { type: 'text' },
			// ── undeclared in registry, detected in _base — verify ──
			reference: { type: 'text' },
			actifLivreur: { type: 'text' },
			isoDate: { type: 'datetime' },
		},
		fkRelations: {
				commande: { code: 'commande', multiple: false },
				secteur: { code: 'secteur', multiple: false },
				shop: { code: 'shop', multiple: false },
				livreur: { code: 'livreur', multiple: false },
			},
		template: { presentation: 'name code' },
	},

	"commande_slot": {
		base: 'machine_base',
		fields: {
			id:   { type: 'id', readonly: true },
			code: { type: 'text', required: true },
			name: { type: 'text', required: true },
		},
		fkRelations: {},
		template: { presentation: 'name code' },
	},

	"commande_slot_ligne": {
		base: 'machine_base',
		fields: {
			id:   { type: 'id', readonly: true },
			code: { type: 'text', required: true },
			name: { type: 'text', required: true },
		},
		fkRelations: {},
		template: { presentation: 'name code' },
	},

	"commande_statut": {
		base: 'machine_base',
		isGroup:  true,
		fields: {
			id:   { type: 'id', readonly: true },
			code: { type: 'text', required: true },
			name: { type: 'text', required: true },
			color: { type: 'text' },
			ordre: { type: 'number' },
			icon: { type: 'text' },
			// ── undeclared in registry, detected in _base — verify ──
			isoDateCreation: { type: 'datetime' },
		},
		fkRelations: {},
		template: { presentation: 'name code' },
	},

	"commune": {
		base: 'machine_base',
		fields: {
			id:   { type: 'id', readonly: true },
			code: { type: 'text', required: true },
			name: { type: 'text', required: true },
			slug: { type: 'text' },
			gpsData: { type: 'text' },
			codePostal: { type: 'text' },
			ref: { type: 'text' },
			// ── undeclared in registry, detected in _base — verify ──
			Libelle_acheminement: { type: 'text' },
			gps: { type: 'text' },
		},
		fkRelations: {
				ville: { code: 'ville', multiple: false },
			},
		template: { presentation: 'name code' },
	},

	"contact_type": {
		base: 'machine_base',
		isGroup:  true,
		fields: {
			id:   { type: 'id', readonly: true },
			code: { type: 'text', required: true },
			name: { type: 'text', required: true },
			color: { type: 'text' },
			icon: { type: 'text' },
		},
		fkRelations: {},
		template: { presentation: 'name code' },
	},

	"cron": {
		base: 'machine_base',
		fields: {
			id:   { type: 'id', readonly: true },
			code: { type: 'text', required: true },
			name: { type: 'text', required: true },
		},
		fkRelations: {},
		template: { presentation: 'name code' },
	},

	"daemon": {
		base: 'machine_base',
		fields: {
			id:   { type: 'id', readonly: true },
			code: { type: 'text', required: true },
			name: { type: 'text', required: true },
			valeur: { type: 'number' },
			dateDebut: { type: 'date' },
			heureDebut: { type: 'date' },
		},
		fkRelations: {},
		template: { presentation: 'name code' },
	},

	"entite": {
		base: 'machine_base',
		fields: {
			id:   { type: 'id', readonly: true },
			code: { type: 'text', required: true },
			name: { type: 'text', required: true },
			adresse: { type: 'text' },
			// ── undeclared in registry, detected in _base — verify ──
			isoDateCreation: { type: 'datetime' },
		},
		fkRelations: {},
		template: { presentation: 'name code' },
	},

	"facture": {
		base: 'machine_base',
		fields: {
			id:   { type: 'id', readonly: true },
			code: { type: 'text', required: true },
			name: { type: 'text', required: true },
			date: { type: 'date' },
			totalHt: { type: 'currency' },
			totalTva: { type: 'currency' },
			totalTtc: { type: 'currency' },
		},
		fkRelations: {},
		template: { presentation: 'name code' },
	},

	"facture_ligne": {
		base: 'machine_base',
		fields: {
			id:   { type: 'id', readonly: true },
			code: { type: 'text', required: true },
			name: { type: 'text', required: true },
			ordre: { type: 'number' },
			prix: { type: 'currency' },
			totalHt: { type: 'currency' },
			totalTtc: { type: 'currency' },
			totalTva: { type: 'currency' },
			quantite: { type: 'number' },
		},
		fkRelations: {},
		template: { presentation: 'name code' },
	},

	"jours": {
		base: 'machine_base',
		fields: {
			id:   { type: 'id', readonly: true },
			code: { type: 'text', required: true },
			name: { type: 'text', required: true },
			slug: { type: 'text' },
			ordre: { type: 'number' },
			// ── undeclared in registry, detected in _base — verify ──
			isoDateCreation: { type: 'datetime' },
		},
		fkRelations: {},
		template: { presentation: 'name code' },
	},

	"livraison": {
		base: 'machine_base',
		isStatus: true,
		fields: {
			id:   { type: 'id', readonly: true },
			code: { type: 'text', required: true },
			name: { type: 'text', required: true },
			date: { type: 'date' },
			heureDebut: { type: 'date' },
			heureFin: { type: 'date' },
		},
		fkRelations: {},
		template: { presentation: 'name code' },
	},

	"livraison_statut": {
		base: 'machine_base',
		isGroup:  true,
		fields: {
			id:   { type: 'id', readonly: true },
			code: { type: 'text', required: true },
			name: { type: 'text', required: true },
			ordre: { type: 'number' },
		},
		fkRelations: {},
		template: { presentation: 'name code' },
	},

	"livreur": {
		base: 'machine_base',
		fields: {
			id:   { type: 'id', readonly: true },
			code: { type: 'text', required: true },
			name: { type: 'text', required: true },
			prenom: { type: 'text' },
			codePostal: { type: 'text' },
			adresse: { type: 'text' },
			email: { type: 'email' },
			mobile: { type: 'phone' },
			dateDebut: { type: 'date' },
			dateFin: { type: 'date' },
			actif: { type: 'boolean' },
			login: { type: 'text' },
			password: { type: 'text' },
			disponible: { type: 'text' },
			// ── undeclared in registry, detected in _base — verify ──
			ville: { type: 'text' },
			private_key: { type: 'text' },
			slugSecteur: { type: 'text' },
			isoDateCreation: { type: 'datetime' },
		},
		fkRelations: {
				secteur: { code: 'secteur', multiple: false },
			},
		template: { presentation: 'name code' },
	},

	"livreur_affectation": {
		base: 'machine_base',
		fields: {
			id:   { type: 'id', readonly: true },
			code: { type: 'text', required: true },
			name: { type: 'text', required: true },
			dateDebut: { type: 'date', required: true },
			dateFin: { type: 'date' },
			heureDebut: { type: 'date', required: true },
			heureFin: { type: 'date', required: true },
			actif: { type: 'boolean' },
			// ── undeclared in registry, detected in _base — verify ──
			code_auto: { type: 'text' },
			actifLivreur: { type: 'text' },
			isoDateDebut: { type: 'datetime' },
			isoDateFin: { type: 'datetime' },
			slugSecteur: { type: 'text' },
		},
		fkRelations: {
				livreur: { code: 'livreur', multiple: false },
				secteur: { code: 'secteur', multiple: false },
			},
		template: { presentation: 'name code' },
	},

	"produit": {
		base: 'machine_base',
		isType:   true,
		fields: {
			id:   { type: 'id', readonly: true },
			code: { type: 'text', required: true },
			name: { type: 'text', required: true },
			description: { type: 'text-long' },
			prix: { type: 'currency', required: true },
			dateDebut: { type: 'date' },
			dateFin: { type: 'date' },
			slug: { type: 'text' },
			actif: { type: 'boolean' },
			duree_realisation: { type: 'text', required: true },
			volume: { type: 'number', required: true },
			stock: { type: 'number' },
			// ── undeclared in registry, detected in _base — verify ──
			isoDateCreation: { type: 'datetime' },
			ordreProduit_type: { type: 'text' },
			ordreProduit_categorie: { type: 'text' },
			slugProduit_categorie: { type: 'text' },
			slugShop: { type: 'text' },
			actifShop: { type: 'text' },
			prix_site: { type: 'url' },
			isoDateDebut: { type: 'datetime' },
		},
		fkRelations: {
				shop: { code: 'shop', multiple: false },
				produit_type: { code: 'produit_type', multiple: false },
				produit_categorie: { code: 'produit_categorie', multiple: false },
			},
		template: { presentation: 'name code' },
	},

	"produit_categorie": {
		base: 'machine_base',
		isGroup:  true,
		fields: {
			id:   { type: 'id', readonly: true },
			code: { type: 'text', required: true },
			name: { type: 'text', required: true },
			slug: { type: 'text' },
			ordre: { type: 'number' },
		},
		fkRelations: {},
		template: { presentation: 'name code' },
	},

	"produit_type": {
		base: 'machine_base',
		isGroup:  true,
		fields: {
			id:   { type: 'id', readonly: true },
			code: { type: 'text', required: true },
			name: { type: 'text', required: true },
			ordre: { type: 'number' },
		},
		fkRelations: {},
		template: { presentation: 'name code' },
	},

	"secteur": {
		base: 'machine_base',
		fields: {
			id:   { type: 'id', readonly: true },
			code: { type: 'text', required: true },
			name: { type: 'text', required: true },
			codePostal: { type: 'text' },
			gpsData: { type: 'text' },
			slug: { type: 'text' },
			// ── undeclared in registry, detected in _base — verify ──
			slugVille: { type: 'text' },
			latitude: { type: 'text' },
			longitude: { type: 'text' },
			dezdezdez: { type: 'text' },
			gps: { type: 'text' },
			gps_index: { type: 'text' },
			isoDateCreation: { type: 'datetime' },
		},
		fkRelations: {
				ville: { code: 'ville', multiple: false },
			},
		template: { presentation: 'name code' },
	},

	"secteur_jours_shift": {
		base: 'machine_base',
		fields: {
			id:   { type: 'id', readonly: true },
			code: { type: 'text', required: true },
			name: { type: 'text', required: true },
			heureDebut: { type: 'date' },
			heureFin: { type: 'date' },
			// ── undeclared in registry, detected in _base — verify ──
			code_auto: { type: 'text' },
			ordreJours: { type: 'text' },
			slugJours: { type: 'text' },
			slugSecteur: { type: 'text' },
		},
		fkRelations: {
				secteur: { code: 'secteur', multiple: false },
				jours: { code: 'jours', multiple: false },
			},
		template: { presentation: 'name code' },
	},

	"shop": {
		base: 'machine_base',
		isType:   true,
		fields: {
			id:   { type: 'id', readonly: true },
			code: { type: 'text', required: true },
			name: { type: 'text', required: true },
			adresse: { type: 'text' },
			codePostal: { type: 'text', required: true },
			description: { type: 'text-long' },
			telephone: { type: 'phone', required: true },
			slug: { type: 'text' },
			atout: { type: 'text' },
			password: { type: 'text' },
			login: { type: 'text' },
			email: { type: 'email' },
			gpsData: { type: 'text' },
			actif: { type: 'boolean' },
			strip_key: { type: 'text' },
			// ── undeclared in registry, detected in _base — verify ──
			ville: { type: 'text' },
			private_key: { type: 'text' },
			slugVille: { type: 'text' },
			slugSecteur: { type: 'text' },
			gps: { type: 'text' },
			latitude: { type: 'text' },
			longitude: { type: 'text' },
			tempsAttente: { type: 'text' },
			isoDateCreation: { type: 'datetime' },
		},
		fkRelations: {
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
		base: 'machine_base',
		isGroup:  true,
		fields: {
			id:   { type: 'id', readonly: true },
			code: { type: 'text', required: true },
			name: { type: 'text', required: true },
		},
		fkRelations: {},
		template: { presentation: 'name code' },
	},

	"shop_client": {
		base: 'machine_base',
		fields: {
			id:   { type: 'id', readonly: true },
			code: { type: 'text', required: true },
			name: { type: 'text', required: true },
			adresse: { type: 'text' },
			codePostal: { type: 'text' },
			ville: { type: 'text' },
			login: { type: 'text' },
			email: { type: 'email' },
			telephone: { type: 'phone' },
			mobile: { type: 'phone' },
			// ── undeclared in registry, detected in _base — verify ──
			isoDateCreation: { type: 'datetime' },
		},
		fkRelations: {},
		template: { presentation: 'name code' },
	},

	"shop_configuration": {
		base: 'machine_base',
		fields: {
			id:   { type: 'id', readonly: true },
			code: { type: 'text', required: true },
			name: { type: 'text', required: true },
		},
		fkRelations: {},
		template: { presentation: 'name code' },
	},

	"shop_configuration_ligne": {
		base: 'machine_base',
		fields: {
			id:   { type: 'id', readonly: true },
			code: { type: 'text', required: true },
			name: { type: 'text', required: true },
			valeur_texte: { type: 'text', required: true },
		},
		fkRelations: {},
		template: { presentation: 'name code' },
	},

	"shop_jours": {
		base: 'machine_base',
		fields: {
			id:   { type: 'id', readonly: true },
			code: { type: 'text', required: true },
			name: { type: 'text', required: true },
			actif: { type: 'boolean' },
			ordre: { type: 'number' },
			// ── undeclared in registry, detected in _base — verify ──
			slugShop: { type: 'text' },
			actifShop: { type: 'text' },
			ordreJours: { type: 'text' },
			slugJours: { type: 'text' },
		},
		fkRelations: {
				jours: { code: 'jours', multiple: false },
				shop: { code: 'shop', multiple: false },
			},
		template: { presentation: 'name code' },
	},

	"shop_jours_shift": {
		base: 'machine_base',
		fields: {
			id:   { type: 'id', readonly: true },
			code: { type: 'text', required: true },
			name: { type: 'text', required: true },
			heureDebut: { type: 'date' },
			heureFin: { type: 'date' },
			actif: { type: 'boolean' },
			ordre: { type: 'number' },
			// ── undeclared in registry, detected in _base — verify ──
			ordreShop_jours: { type: 'text' },
			actifShop_jours: { type: 'text' },
			slugShop: { type: 'text' },
			actifShop: { type: 'text' },
		},
		fkRelations: {
				shop_jours: { code: 'shop_jours', multiple: false },
				shop: { code: 'shop', multiple: false },
			},
		template: { presentation: 'name code' },
	},

	"shop_jours_shift_run": {
		base: 'machine_base',
		fields: {
			id:   { type: 'id', readonly: true },
			code: { type: 'text', required: true },
			name: { type: 'text', required: true },
			dateDebut: { type: 'date' },
			dateFin: { type: 'date' },
			heureDebut: { type: 'date' },
			heureFin: { type: 'date' },
			// ── undeclared in registry, detected in _base — verify ──
			slugShop: { type: 'text' },
			actifShop: { type: 'text' },
			ordreShop_jours_shift: { type: 'text' },
			actifShop_jours_shift: { type: 'text' },
		},
		fkRelations: {
				shop: { code: 'shop', multiple: false },
				shop_jours_shift: { code: 'shop_jours_shift', multiple: false },
			},
		template: { presentation: 'name code' },
	},

	"shop_type": {
		base: 'machine_base',
		isGroup:  true,
		fields: {
			id:   { type: 'id', readonly: true },
			code: { type: 'text', required: true },
			name: { type: 'text', required: true },
		},
		fkRelations: {},
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
			resultat: { type: 'text' },
		},
		fkRelations: {},
		template: { presentation: 'name code' },
	},

	"tache_statut": {
		base: 'machine_base',
		isGroup:  true,
		fields: {
			id:   { type: 'id', readonly: true },
			code: { type: 'text', required: true },
			name: { type: 'text', required: true },
			color: { type: 'text' },
			icon: { type: 'text' },
			ordre: { type: 'number' },
		},
		fkRelations: {},
		template: { presentation: 'name code' },
	},

	"tache_type": {
		base: 'machine_base',
		isGroup:  true,
		fields: {
			id:   { type: 'id', readonly: true },
			code: { type: 'text', required: true },
			name: { type: 'text', required: true },
		},
		fkRelations: {},
		template: { presentation: 'name code' },
	},

	"ville": {
		base: 'machine_base',
		fields: {
			id:   { type: 'id', readonly: true },
			code: { type: 'text', required: true },
			name: { type: 'text', required: true },
			slug: { type: 'text' },
			gpsData: { type: 'text' },
		},
		fkRelations: {},
		template: { presentation: 'name code' },
	},
};

export default tactacScheme;
