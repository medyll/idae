/**
 * idaenext legacy → canonical mapping.
 *
 * Key      = legacy collection name (in the source DB).
 * sourceDb = legacy database suffix; full name = `idaenext_${sourceDb}`.
 * pkField  = legacy PK field → renamed to `id` in output.
 * codeField= legacy semantic key → renamed to `code` in output.
 * fields   = other FR→EN renames (unlisted pass through).
 * drop     = explicit field drops (noise beyond dropNoise).
 * dropNoise= auto-drop date|heure+Creation|Modification, time[A-Z]* timestamps, updated_fields.
 * fks      = legacy id-column → canonical fk.code resolution.
 */
import type { OrgMapping } from './types.js';

export const idaenextMapping: OrgMapping = {

	// ── agent → appuser (core) ────────────────────────────────────────────────

	agent: {
		sourceDb:  'sitebase_base',
		target:    'appuser',
		pkField:   'idagent',
		codeField: 'loginAgent',
		dropNoise: true,
		fields: {
			nomAgent:    'name',
			prenomAgent: 'firstName',
			emailAgent:  'email',
			mobileAgent: 'mobile',
			telephoneAgent: 'telephone',
			loginAgent:  'login',
		},
		drop: ['passwordAgent'],
	},

	agent_type: {
		sourceDb:  'sitebase_base',
		target:    'appuser_type',
		pkField:   'idagent_type',
		codeField: 'codeAgent_type',
		dropNoise: true,
		fields: { nomAgent_type: 'name' },
	},

	agent_groupe: {
		sourceDb:  'sitebase_base',
		target:    'appuser_group',
		pkField:   'idagent_groupe',
		codeField: 'codeAgent_groupe',
		dropNoise: true,
		fields: { nomAgent_groupe: 'name' },
	},

	agent_history: {
		sourceDb:  'sitebase_base',
		target:    'appuser_history',
		pkField:   'idagent_history',
		dropNoise: true,
		fields:    {},
	},

	// ── idaenext-specific collections ─────────────────────────────────────────

	accessoire: {
		sourceDb:  'sitebase_base',
		target:    'accessoire',
		pkField:   'idaccessoire',
		codeField: 'codeAccessoire',
		dropNoise: true,
		fields: {
			nomAccessoire: 'name',
		},
		fks: {
			marque: { collection: 'marque', from: 'idmarque', on: 'id' },
		},
	},

	affaire: {
		sourceDb:  'sitebase_base',
		target:    'affaire',
		pkField:   'idaffaire',
		codeField: 'codeAffaire',
		dropNoise: true,
		fields: {
			nomAffaire: 'name',
			dateCreationAffaire: 'dateCreation',
			dateDebutAffaire: 'dateDebut',
			montantHtAffaire: 'montantHt',
			totalTtcAffaire: 'totalTtc',
			totalTvaAffaire: 'totalTva',
		},
		fks: {
			client: { collection: 'client', from: 'idclient', on: 'id' },
		},
	},

	agence: {
		sourceDb:  'sitebase_base',
		target:    'agence',
		pkField:   'idagence',
		codeField: 'codeAgence',
		dropNoise: true,
		fields: {
			nomAgence: 'name',
		},
	},

	client: {
		sourceDb:  'sitebase_base',
		target:    'client',
		pkField:   'idclient',
		codeField: 'codeClient',
		dropNoise: true,
		fields: {
			nomClient: 'name',
			telephone2Client: 'telephone2',
			dateFinClient: 'dateFin',
			codePostalClient: 'codePostal',
			telephoneClient: 'telephone',
			adresseClient: 'adresse',
			emailClient: 'email',
			mobile2Client: 'mobile2',
			mobileClient: 'mobile',
			villeClient: 'ville',
		},
		fks: {
			agence: { collection: 'agence', from: 'idagence', on: 'id' },
			client_type: { collection: 'client_type', from: 'idclient_type', on: 'id' },
			client_categorie: { collection: 'client_categorie', from: 'idclient_categorie', on: 'id' },
		},
	},

	client_type: {
		sourceDb:  'sitebase_base',
		target:    'client_type',
		pkField:   'idclient_type',
		codeField: 'codeClient_type',
		dropNoise: true,
		fields: {
			nomClient_type: 'name',
			ordreClient_type: 'ordre',
		},
	},

	client_categorie: {
		sourceDb:  'sitebase_base',
		target:    'client_categorie',
		pkField:   'idclient_categorie',
		codeField: 'codeClient_categorie',
		dropNoise: true,
		fields: {
			nomClient_categorie: 'name',
			ordreClient_categorie: 'ordre',
		},
	},

	commande: {
		sourceDb:  'sitebase_base',
		target:    'commande',
		pkField:   'idcommande',
		codeField: 'codeCommande',
		dropNoise: true,
		fields: {
			nomCommande: 'name',
			totalMargeCommande: 'totalMarge',
			totalTtcCommande: 'totalTtc',
			totalTvaCommande: 'totalTva',
			dateCreationCommande: 'dateCreation',
			dateDebutCommande: 'dateDebut',
		},
		fks: {
			client: { collection: 'client', from: 'idclient', on: 'id' },
		},
	},

	commande_ligne: {
		sourceDb:  'sitebase_base',
		target:    'commande_ligne',
		pkField:   'idcommande_ligne',
		codeField: 'codeCommande_ligne',
		dropNoise: true,
		fields: {
			nomCommande_ligne: 'name',
			ordreCommande_ligne: 'ordre',
			prixCommande_ligne: 'prix',
			quantiteCommande_ligne: 'quantite',
			totalCommande_ligne: 'total',
		},
		fks: {
			commande: { collection: 'commande', from: 'idcommande', on: 'id' },
		},
	},

	commande_statut: {
		sourceDb:  'sitebase_base',
		target:    'commande_statut',
		pkField:   'idcommande_statut',
		codeField: 'codeCommande_statut',
		dropNoise: true,
		fields: {
			nomCommande_statut: 'name',
			ordreCommande_statut: 'ordre',
		},
	},

	conge: {
		sourceDb:  'sitebase_base',
		target:    'conge',
		pkField:   'idconge',
		codeField: 'codeConge',
		dropNoise: true,
		fields: {
			nomConge: 'name',
			dateDebutConge: 'dateDebut',
			dateFinConge: 'dateFin',
		},
		fks: {
			conge_type: { collection: 'conge_type', from: 'idconge_type', on: 'id' },
		},
	},

	conge_type: {
		sourceDb:  'sitebase_base',
		target:    'conge_type',
		pkField:   'idconge_type',
		codeField: 'codeConge_type',
		dropNoise: true,
		fields: {
			nomConge_type: 'name',
		},
	},

	contact: {
		sourceDb:  'sitebase_base',
		target:    'contact',
		pkField:   'idcontact',
		codeField: 'codeContact',
		dropNoise: true,
		fields: {
			nomContact: 'name',
			emailContact: 'email',
			prenomContact: 'prenom',
			telephoneContact: 'telephone',
			mobileContact: 'mobile',
		},
	},

	contrat: {
		sourceDb:  'sitebase_base',
		target:    'contrat',
		pkField:   'idcontrat',
		codeField: 'codeContrat',
		dropNoise: true,
		fields: {
			nomContrat: 'name',
			dateDebutContrat: 'dateDebut',
			dateFinContrat: 'dateFin',
		},
		fks: {
			client: { collection: 'client', from: 'idclient', on: 'id' },
			contrat_statut: { collection: 'contrat_statut', from: 'idcontrat_statut', on: 'id' },
			contrat_type: { collection: 'contrat_type', from: 'idcontrat_type', on: 'id' },
		},
	},

	contrat_statut: {
		sourceDb:  'sitebase_base',
		target:    'contrat_statut',
		pkField:   'idcontrat_statut',
		codeField: 'codeContrat_statut',
		dropNoise: true,
		fields: {
			nomContrat_statut: 'name',
			ordreContrat_statut: 'ordre',
		},
	},

	contrat_type: {
		sourceDb:  'sitebase_base',
		target:    'contrat_type',
		pkField:   'idcontrat_type',
		codeField: 'codeContrat_type',
		dropNoise: true,
		fields: {
			nomContrat_type: 'name',
			ordreContrat_type: 'ordre',
		},
	},

	financement: {
		sourceDb:  'sitebase_base',
		target:    'financement',
		pkField:   'idfinancement',
		codeField: 'codeFinancement',
		dropNoise: true,
		fields: {
			nomFinancement: 'name',
			dateQuantiemeFinancement: 'dateQuantieme',
			montantEcheanceFinancement: 'montantEcheance',
			tauxFinancement: 'taux',
		},
		fks: {
			client: { collection: 'client', from: 'idclient', on: 'id' },
			affaire: { collection: 'affaire', from: 'idaffaire', on: 'id' },
			leaser: { collection: 'leaser', from: 'idleaser', on: 'id' },
			financement_type: { collection: 'financement_type', from: 'idfinancement_type', on: 'id' },
		},
	},

	financement_type: {
		sourceDb:  'sitebase_base',
		target:    'financement_type',
		pkField:   'idfinancement_type',
		codeField: 'codeFinancement_type',
		dropNoise: true,
		fields: {
			nomFinancement_type: 'name',
		},
	},

	leaser: {
		sourceDb:  'sitebase_base',
		target:    'leaser',
		pkField:   'idleaser',
		codeField: 'codeLeaser',
		dropNoise: true,
		fields: {
			nomLeaser: 'name',
		},
	},

	marque: {
		sourceDb:  'sitebase_base',
		target:    'marque',
		pkField:   'idmarque',
		codeField: 'codeMarque',
		dropNoise: true,
		fields: {
			nomMarque: 'name',
		},
	},

	materiel: {
		sourceDb:  'sitebase_base',
		target:    'materiel',
		pkField:   'idmateriel',
		codeField: 'codeMateriel',
		dropNoise: true,
		fields: {
			nomMateriel: 'name',
		},
		fks: {
			produit: { collection: 'produit', from: 'idproduit', on: 'id' },
			client: { collection: 'client', from: 'idclient', on: 'id' },
			contrat: { collection: 'contrat', from: 'idcontrat', on: 'id' },
		},
	},

	produit: {
		sourceDb:  'sitebase_base',
		target:    'produit',
		pkField:   'idproduit',
		codeField: 'codeProduit',
		dropNoise: true,
		fields: {
			nomProduit: 'name',
		},
		fks: {
			marque: { collection: 'marque', from: 'idmarque', on: 'id' },
		},
	},

	prospect: {
		sourceDb:  'sitebase_base',
		target:    'prospect',
		pkField:   'idprospect',
		codeField: 'codeProspect',
		dropNoise: true,
		fields: {
			nomProspect: 'name',
			adresseProspect: 'adresse',
			emailProspect: 'email',
			telephoneProspect: 'telephone',
			codePostalProspect: 'codePostal',
			villeProspect: 'ville',
		},
	},

	rachat: {
		sourceDb:  'sitebase_base',
		target:    'rachat',
		pkField:   'idrachat',
		codeField: 'codeRachat',
		dropNoise: true,
		fields: {
			nomRachat: 'name',
			dateCreationRachat: 'dateCreation',
		},
		fks: {
			client: { collection: 'client', from: 'idclient', on: 'id' },
			affaire: { collection: 'affaire', from: 'idaffaire', on: 'id' },
		},
	},

	secteur: {
		sourceDb:  'sitebase_base',
		target:    'secteur',
		pkField:   'idsecteur',
		codeField: 'codeSecteur',
		dropNoise: true,
		fields: {
			nomSecteur: 'name',
		},
	},

	// ── Group collections (isGroup: true) ────────────────────────────────────

	// commande_ligne already defined above (line 176)

	// Add other group collections following the same pattern
	// (conge_statut, contrat_ligne, financement_ligne, etc.)

};

export default idaenextMapping;