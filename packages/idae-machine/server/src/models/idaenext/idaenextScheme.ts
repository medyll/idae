// AUTO-GENERATED from legacy MongoDB idaenext_sitebase_app + sampled _base.
// Source: appscheme / appscheme_has_field / appscheme_field (+ FK & undeclared fields inferred from _base docs).
// Reconstructed in idae-machine model-core (MachineModel) shape. Review 'undeclared' fields before seeding.
import type { MachineModel } from '../../../../src/lib/types/machine-model.js';

export const idaenextScheme: MachineModel = {
	"accessoire": {
		base: 'machine_base',
		fields: {
			id:   { type: 'id', readonly: true },
			code: { type: 'text', required: true },
			name: { type: 'text', required: true },
			// ── undeclared in registry, detected in _base — verify ──
			N_ID: { type: 'text' },
		},
		fkRelations: {
				marque: { code: 'marque', multiple: false },
			},
		template: { presentation: 'name code' },
	},

	"affaire": {
		base: 'machine_base',
		fields: {
			id:   { type: 'id', readonly: true },
			code: { type: 'text', required: true },
			name: { type: 'text', required: true },
			dateCreation: { type: 'date' },
			dateDebut: { type: 'date' },
			montantHt: { type: 'currency' },
			totalTtc: { type: 'currency' },
			totalTva: { type: 'currency' },
			// ── undeclared in registry, detected in _base — verify ──
			description: { type: 'text' },
			identite: { type: 'text' },
			totalHt: { type: 'currency' },
			isoDateDebut: { type: 'datetime' },
		},
		fkRelations: {
				client: { code: 'client', multiple: false },
			},
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
		},
		fkRelations: {},
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
			// ── undeclared in registry, detected in _base — verify ──
			uniqid: { type: 'text' },
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
		isGroup:  true,
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
			// ── undeclared in registry, detected in _base — verify ──
			estActif: { type: 'boolean' },
			idagent_writer: { type: 'text' },
			valeur: { type: 'text' },
			actifAgent: { type: 'text' },
			petitNomAgent: { type: 'text' },
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
			valeur: { type: 'number', required: true },
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

	"categorie_produit": {
		base: 'machine_base',
		fields: {
			id:   { type: 'id', readonly: true },
			code: { type: 'text', required: true },
			name: { type: 'text', required: true },
		},
		fkRelations: {},
		template: { presentation: 'name code' },
	},

	"client": {
		base: 'machine_base',
		isType:   true,
		fields: {
			id:   { type: 'id', readonly: true },
			code: { type: 'text', required: true },
			name: { type: 'text', required: true },
			telephone2: { type: 'phone' },
			dateFin: { type: 'date' },
			codePostal: { type: 'text' },
			telephone: { type: 'phone' },
			adresse: { type: 'text' },
			description: { type: 'text-long' },
			email: { type: 'email' },
			mobile2: { type: 'phone' },
			mobile: { type: 'phone' },
			ville: { type: 'text' },
			// ── undeclared in registry, detected in _base — verify ──
			cp: { type: 'text' },
			adresse2: { type: 'text' },
			adresse3: { type: 'text' },
			fax: { type: 'phone' },
			email2: { type: 'email' },
			identite: { type: 'text' },
		},
		fkRelations: {
				agence: { code: 'agence', multiple: false },
				client_type: { code: 'client_type', multiple: false },
				client_categorie: { code: 'client_categorie', multiple: false },
			},
		template: { presentation: 'name code' },
	},

	"client_activite": {
		base: 'machine_base',
		fields: {
			id:   { type: 'id', readonly: true },
			code: { type: 'text', required: true },
			name: { type: 'text', required: true },
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

	"commande": {
		base: 'machine_base',
		isStatus: true,
		fields: {
			id:   { type: 'id', readonly: true },
			code: { type: 'text', required: true },
			name: { type: 'text', required: true },
			totalMarge: { type: 'currency' },
			totalTtc: { type: 'currency' },
			totalTva: { type: 'currency' },
			dateCreation: { type: 'date' },
			dateDebut: { type: 'date' },
			description: { type: 'text-long' },
			totalHt: { type: 'currency' },
		},
		fkRelations: {
				client: { code: 'client', multiple: false },
			},
		template: { presentation: 'name code' },
	},

	"commande_ligne": {
		base: 'machine_base',
		isGroup:  true,
		fields: {
			id:   { type: 'id', readonly: true },
			code: { type: 'text', required: true },
			name: { type: 'text', required: true },
			ordre: { type: 'number' },
			prix: { type: 'currency' },
			quantite: { type: 'number' },
			total: { type: 'currency' },
			// ── undeclared in registry, detected in _base — verify ──
			N_ID: { type: 'text' },
		},
		fkRelations: {
				commande: { code: 'commande', multiple: false },
			},
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
		},
		fkRelations: {},
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
			dateDebut: { type: 'date' },
			dateFin: { type: 'date' },
			description: { type: 'text-long' },
			duree: { type: 'number' },
			// ── undeclared in registry, detected in _base — verify ──
			idagent_writer: { type: 'text' },
			estActif: { type: 'boolean' },
			commentaire: { type: 'text' },
			petitNomAgent: { type: 'text' },
			actifAgent: { type: 'text' },
		},
		fkRelations: {
				conge_type: { code: 'conge_type', multiple: false },
			},
		template: { presentation: 'name code' },
	},

	"conge_statut": {
		base: 'machine_base',
		isGroup:  true,
		fields: {
			id:   { type: 'id', readonly: true },
			code: { type: 'text', required: true },
			name: { type: 'text', required: true },
			icon: { type: 'text' },
			color: { type: 'text' },
			ordre: { type: 'number' },
			// ── undeclared in registry, detected in _base — verify ──
			isoDateCreation: { type: 'datetime' },
		},
		fkRelations: {},
		template: { presentation: 'name code' },
	},

	"conge_type": {
		base: 'machine_base',
		isGroup:  true,
		fields: {
			id:   { type: 'id', readonly: true },
			code: { type: 'text', required: true },
			name: { type: 'text', required: true },
			color: { type: 'text' },
			duree: { type: 'number' },
		},
		fkRelations: {},
		template: { presentation: 'name code' },
	},

	"contact": {
		base: 'machine_base',
		isType:   true,
		fields: {
			id:   { type: 'id', readonly: true },
			code: { type: 'text', required: true },
			name: { type: 'text', required: true },
			email: { type: 'email' },
			prenom: { type: 'text' },
			telephone: { type: 'phone' },
			mobile: { type: 'phone' },
		},
		fkRelations: {},
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

	"contrat": {
		base: 'machine_base',
		isType:   true,
		isStatus: true,
		fields: {
			id:   { type: 'id', readonly: true },
			code: { type: 'text', required: true },
			name: { type: 'text', required: true },
			cccoul: { type: 'text' },
			ccn: { type: 'text' },
			dateDebut: { type: 'date' },
			dateFin: { type: 'date' },
			description: { type: 'text-long' },
			duree: { type: 'number' },
			// ── undeclared in registry, detected in _base — verify ──
			commentaire: { type: 'text' },
			aa_partie_n_id: { type: 'text' },
			aa_partie_code: { type: 'text' },
			aa_partie_site_n_id: { type: 'text' },
		},
		fkRelations: {
				client: { code: 'client', multiple: false },
				contrat_statut: { code: 'contrat_statut', multiple: false },
				contrat_type: { code: 'contrat_type', multiple: false },
			},
		template: { presentation: 'name code' },
	},

	"contrat_ligne": {
		base: 'machine_base',
		isGroup:  true,
		fields: {
			id:   { type: 'id', readonly: true },
			code: { type: 'text', required: true },
			name: { type: 'text', required: true },
			ordre: { type: 'number' },
			valeur: { type: 'number' },
		},
		fkRelations: {
				contrat: { code: 'contrat', multiple: false },
			},
		template: { presentation: 'name code' },
	},

	"contrat_statut": {
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
		fkRelations: {},
		template: { presentation: 'name code' },
	},

	"contrat_type": {
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

	"cron": {
		base: 'machine_base',
		isType:   true,
		fields: {
			id:   { type: 'id', readonly: true },
			code: { type: 'text', required: true },
			name: { type: 'text', required: true },
			ville: { type: 'text' },
			codePostal: { type: 'text' },
			adresse: { type: 'text' },
			ordre: { type: 'number' },
		},
		fkRelations: {},
		template: { presentation: 'name code' },
	},

	"cron_type": {
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

	"document": {
		base: 'machine_base',
		isType:   true,
		fields: {
			id:   { type: 'id', readonly: true },
			code: { type: 'text', required: true },
			name: { type: 'text', required: true },
			dateCreation: { type: 'date' },
			heureCreation: { type: 'datetime' },
			// ── undeclared in registry, detected in _base — verify ──
			table: { type: 'text' },
			table_value: { type: 'text' },
			description: { type: 'text' },
			isoDateCreation: { type: 'datetime' },
		},
		fkRelations: {
				client: { code: 'client', multiple: false },
				document_type: { code: 'document_type', multiple: false },
				document_extension: { code: 'document_extension', multiple: false },
			},
		template: { presentation: 'name code' },
	},

	"document_extension": {
		base: 'machine_base',
		fields: {
			id:   { type: 'id', readonly: true },
			code: { type: 'text', required: true },
			name: { type: 'text', required: true },
		},
		fkRelations: {},
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
		fkRelations: {},
		template: { presentation: 'name code' },
	},

	"email": {
		base: 'machine_base',
		fields: {
			id:   { type: 'id', readonly: true },
			code: { type: 'text', required: true },
			name: { type: 'text', required: true },
		},
		fkRelations: {},
		template: { presentation: 'name code' },
	},

	"email_mime": {
		base: 'machine_base',
		fields: {
			id:   { type: 'id', readonly: true },
			code: { type: 'text', required: true },
			name: { type: 'text', required: true },
		},
		fkRelations: {},
		template: { presentation: 'name code' },
	},

	"emailbox": {
		base: 'machine_base',
		fields: {
			id:   { type: 'id', readonly: true },
			code: { type: 'text', required: true },
			name: { type: 'text', required: true },
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
			ville: { type: 'text' },
			siren: { type: 'text' },
			siret: { type: 'text' },
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
			// ── undeclared in registry, detected in _base — verify ──
			description: { type: 'text' },
		},
		fkRelations: {
				client: { code: 'client', multiple: false },
				contrat: { code: 'contrat', multiple: false },
			},
		template: { presentation: 'name code' },
	},

	"facture_ligne": {
		base: 'machine_base',
		isGroup:  true,
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
			// ── undeclared in registry, detected in _base — verify ──
			description: { type: 'text' },
		},
		fkRelations: {
				facture: { code: 'facture', multiple: false },
			},
		template: { presentation: 'name code' },
	},

	"financement": {
		base: 'machine_base',
		fields: {
			id:   { type: 'id', readonly: true },
			code: { type: 'text', required: true },
			name: { type: 'text', required: true },
			dateQuantieme: { type: 'date' },
			montantEcheance: { type: 'currency' },
			taux: { type: 'currency' },
			duree: { type: 'number' },
			montant: { type: 'currency' },
			ref: { type: 'text' },
			dateFin: { type: 'date' },
			// ── undeclared in registry, detected in _base — verify ──
			identite: { type: 'text' },
			reference: { type: 'text' },
			montantEchenace: { type: 'currency' },
			N_ID: { type: 'text' },
		},
		fkRelations: {
				client: { code: 'client', multiple: false },
				affaire: { code: 'affaire', multiple: false },
				leaser: { code: 'leaser', multiple: false },
				financement_type: { code: 'financement_type', multiple: false },
			},
		template: { presentation: 'name code' },
	},

	"financement_ligne": {
		base: 'machine_base',
		isGroup:  true,
		fields: {
			id:   { type: 'id', readonly: true },
			code: { type: 'text', required: true },
			name: { type: 'text', required: true },
			montantEcheance: { type: 'currency' },
			montant: { type: 'currency' },
			quantite: { type: 'number' },
			total: { type: 'currency' },
			// ── undeclared in registry, detected in _base — verify ──
			N_ID: { type: 'text' },
			prix: { type: 'currency' },
		},
		fkRelations: {
				financement: { code: 'financement', multiple: false },
				commande_ligne: { code: 'commande_ligne', multiple: false },
			},
		template: { presentation: 'name code' },
	},

	"financement_type": {
		base: 'machine_base',
		isGroup:  true,
		fields: {
			id:   { type: 'id', readonly: true },
			code: { type: 'text', required: true },
			name: { type: 'text', required: true },
			// ── undeclared in registry, detected in _base — verify ──
			ordre: { type: 'number' },
		},
		fkRelations: {},
		template: { presentation: 'name code' },
	},

	"ged_bin": {
		base: 'machine_base',
		fields: {
			id:   { type: 'id', readonly: true },
			code: { type: 'text', required: true },
			name: { type: 'text', required: true },
		},
		fkRelations: {},
		template: { presentation: 'name code' },
	},

	"intervention_statut": {
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

	"intervention_type": {
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

	"leaser": {
		base: 'machine_base',
		fields: {
			id:   { type: 'id', readonly: true },
			code: { type: 'text', required: true },
			name: { type: 'text', required: true },
			description: { type: 'text-long' },
			ville: { type: 'text' },
			fax: { type: 'phone' },
		},
		fkRelations: {},
		template: { presentation: 'name code' },
	},

	"marque": {
		base: 'machine_base',
		fields: {
			id:   { type: 'id', readonly: true },
			code: { type: 'text', required: true },
			name: { type: 'text', required: true },
			description: { type: 'text-long' },
		},
		fkRelations: {},
		template: { presentation: 'name code' },
	},

	"materiel": {
		base: 'machine_base',
		fields: {
			id:   { type: 'id', readonly: true },
			code: { type: 'text', required: true },
			name: { type: 'text', required: true },
			compteurNB: { type: 'text' },
			compteurCouleur: { type: 'text' },
			vmmCouleur: { type: 'number' },
			vmmNB: { type: 'number' },
			// ── undeclared in registry, detected in _base — verify ──
			reference: { type: 'text' },
			N_ID: { type: 'text' },
			commentaire: { type: 'text' },
			idtypeprod: { type: 'text' },
			idsite: { type: 'url' },
			villeSite: { type: 'url' },
			dureeContrat: { type: 'text' },
			description: { type: 'text' },
		},
		fkRelations: {
				produit: { code: 'produit', multiple: false },
				client: { code: 'client', multiple: false },
				contrat: { code: 'contrat', multiple: false },
			},
		template: { presentation: 'name code' },
	},

	"materiel_compteur": {
		base: 'machine_base',
		fields: {
			id:   { type: 'id', readonly: true },
			code: { type: 'text', required: true },
			name: { type: 'text', required: true },
			valeur: { type: 'number' },
			date: { type: 'date' },
			// ── undeclared in registry, detected in _base — verify ──
			N_ID: { type: 'text' },
			commentaire: { type: 'text' },
			vmmCouleurMateriel: { type: 'text' },
			vmmNBMateriel: { type: 'text' },
		},
		fkRelations: {
				materiel: { code: 'materiel', multiple: false },
			},
		template: { presentation: 'name code' },
	},

	"materiel_volume": {
		base: 'machine_base',
		fields: {
			id:   { type: 'id', readonly: true },
			code: { type: 'text', required: true },
			name: { type: 'text', required: true },
			dateCreation: { type: 'date' },
			quantite: { type: 'number' },
			// ── undeclared in registry, detected in _base — verify ──
			N_ID: { type: 'text' },
			valeur: { type: 'text' },
		},
		fkRelations: {
				materiel: { code: 'materiel', multiple: false },
			},
		template: { presentation: 'name code' },
	},

	"opportunite": {
		base: 'machine_base',
		isStatus: true,
		fields: {
			id:   { type: 'id', readonly: true },
			code: { type: 'text', required: true },
			name: { type: 'text', required: true },
			cccoul: { type: 'text' },
			actif: { type: 'boolean' },
			rang: { type: 'text' },
			ccn: { type: 'text' },
			vmmCouleur: { type: 'number' },
			vmmNB: { type: 'number' },
			montant: { type: 'currency' },
			dateFin: { type: 'date' },
			description: { type: 'text-long' },
			montantRachat: { type: 'currency' },
			marge: { type: 'text' },
			// ── undeclared in registry, detected in _base — verify ──
			commentaire: { type: 'text' },
			petitNomAgent: { type: 'text' },
			actifAgent: { type: 'text' },
			ordreOpportunite_statut: { type: 'text' },
		},
		fkRelations: {
				client: { code: 'client', multiple: false },
				opportunite_statut: { code: 'opportunite_statut', multiple: false },
			},
		template: { presentation: 'name code' },
	},

	"opportunite_ligne": {
		base: 'machine_base',
		isGroup:  true,
		fields: {
			id:   { type: 'id', readonly: true },
			code: { type: 'text', required: true },
			name: { type: 'text', required: true },
			quantite: { type: 'number' },
		},
		fkRelations: {
				opportunite: { code: 'opportunite', multiple: false },
				produit: { code: 'produit', multiple: false },
			},
		template: { presentation: 'name code' },
	},

	"opportunite_statut": {
		base: 'machine_base',
		isGroup:  true,
		fields: {
			id:   { type: 'id', readonly: true },
			code: { type: 'text', required: true },
			name: { type: 'text', required: true },
			ordre: { type: 'number' },
			color: { type: 'text' },
		},
		fkRelations: {},
		template: { presentation: 'name code' },
	},

	"opportunite_type": {
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

	"prestataire": {
		base: 'machine_base',
		fields: {
			id:   { type: 'id', readonly: true },
			code: { type: 'text', required: true },
			name: { type: 'text', required: true },
		},
		fkRelations: {},
		template: { presentation: 'name code' },
	},

	"produit": {
		base: 'machine_base',
		fields: {
			id:   { type: 'id', readonly: true },
			code: { type: 'text', required: true },
			name: { type: 'text', required: true },
			description: { type: 'text-long' },
			prix: { type: 'currency' },
			ref: { type: 'text' },
			// ── undeclared in registry, detected in _base — verify ──
			N_ID: { type: 'text' },
		},
		fkRelations: {
				marque: { code: 'marque', multiple: false },
			},
		template: { presentation: 'name code' },
	},

	"produit_gamme": {
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

	"prospect": {
		base: 'machine_base',
		fields: {
			id:   { type: 'id', readonly: true },
			code: { type: 'text', required: true },
			name: { type: 'text', required: true },
			adresse: { type: 'text' },
			description: { type: 'text-long' },
			email: { type: 'email' },
			telephone: { type: 'phone' },
			codePostal: { type: 'text' },
			ville: { type: 'text' },
			// ── undeclared in registry, detected in _base — verify ──
			identite: { type: 'text' },
			adresse2: { type: 'text' },
			cp: { type: 'text' },
			pays: { type: 'text' },
		},
		fkRelations: {},
		template: { presentation: 'name code' },
	},

	"rachat": {
		base: 'machine_base',
		fields: {
			id:   { type: 'id', readonly: true },
			code: { type: 'text', required: true },
			name: { type: 'text', required: true },
			dateCreation: { type: 'date' },
			description: { type: 'text-long' },
			total: { type: 'currency' },
			// ── undeclared in registry, detected in _base — verify ──
			commentaire: { type: 'text' },
		},
		fkRelations: {
				client: { code: 'client', multiple: false },
				affaire: { code: 'affaire', multiple: false },
			},
		template: { presentation: 'name code' },
	},

	"rachat_ligne": {
		base: 'machine_base',
		isGroup:  true,
		fields: {
			id:   { type: 'id', readonly: true },
			code: { type: 'text', required: true },
			name: { type: 'text', required: true },
			// ── undeclared in registry, detected in _base — verify ──
			N_ID: { type: 'text' },
			commentaire: { type: 'text' },
			valeurArgus: { type: 'text' },
		},
		fkRelations: {
				rachat: { code: 'rachat', multiple: false },
			},
		template: { presentation: 'name code' },
	},

	"ressource": {
		base: 'machine_base',
		fields: {
			id:   { type: 'id', readonly: true },
			code: { type: 'text', required: true },
			name: { type: 'text', required: true },
			description: { type: 'text-long' },
			dateDebut: { type: 'date' },
			dateFin: { type: 'date' },
			quantite: { type: 'number' },
			dateInstallation: { type: 'date' },
			// ── undeclared in registry, detected in _base — verify ──
			duree: { type: 'number' },
		},
		fkRelations: {
				prospect: { code: 'prospect', multiple: false },
			},
		template: { presentation: 'name code' },
	},

	"secteur": {
		base: 'machine_base',
		fields: {
			id:   { type: 'id', readonly: true },
			code: { type: 'text', required: true },
			name: { type: 'text', required: true },
			codePostal: { type: 'text' },
			// ── undeclared in registry, detected in _base — verify ──
			N_ID: { type: 'text' },
			isoDateCreation: { type: 'datetime' },
		},
		fkRelations: {},
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
			// ── undeclared in registry, detected in _base — verify ──
			resultat: { type: 'text' },
		},
		fkRelations: {
				prospect: { code: 'prospect', multiple: false },
				tache_statut: { code: 'tache_statut', multiple: false },
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
			color: { type: 'text' },
			icon: { type: 'text' },
			// ── undeclared in registry, detected in _base — verify ──
			commentaireStatut_tache: { type: 'text' },
			idstatut_tache_has_type_suivi: { type: 'text' },
			valeur: { type: 'text' },
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
			icon: { type: 'text' },
			// ── undeclared in registry, detected in _base — verify ──
			ordreType_tache: { type: 'text' },
			commentaireType_tache: { type: 'text' },
			commentaireType_suivi: { type: 'text' },
		},
		fkRelations: {},
		template: { presentation: 'name code' },
	},
};

export default idaenextScheme;
