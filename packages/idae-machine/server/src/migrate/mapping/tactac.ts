/**
 * tactac legacy → canonical mapping.
 *
 * Key      = legacy collection name (in the source DB).
 * sourceDb = legacy database suffix; full name = `tactac_${sourceDb}`.
 * pkField  = legacy PK field → renamed to `id` in output.
 * codeField= legacy semantic key → renamed to `code` in output.
 * fields   = other FR→EN renames (unlisted pass through).
 * drop     = explicit field drops (noise beyond dropNoise).
 * dropNoise= auto-drop date|heure+Creation|Modification, time[A-Z]* timestamps, updated_fields.
 * fks      = legacy id-column → canonical fk.code resolution.
 */
import type { OrgMapping } from './types.js';

export const tactacMapping: OrgMapping = {

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
			petitNomAgent: 'petitNom',
			telephone2Agent: 'telephone2',
			image_smallAgent: 'image_small',
		},
		drop: ['passwordAgent', 'mailPasswordAgent', 'PHPSESSIDAgent', 'private_keyAgent'],
		fks: {
			appuser_group: { collection: 'appuser_group', from: 'idagent_groupe', on: 'id' },
		},
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

	agent_activite: {
		sourceDb:  'sitebase_base',
		target:    'user_activite',
		pkField:   'idagent_activite',
		codeField: 'codeAgent_activite',
		dropNoise: true,
		fields: {
			nomAgent_activite: 'name',
			dateAgent_activite: 'date',
			valeurAgent_activite: 'valeur',
			heureAgent_activite: 'heure',
		},
	},

	agent_note: {
		sourceDb:  'sitebase_base',
		target:    'user_note',
		pkField:   'idagent_note',
		codeField: 'codeAgent_note',
		dropNoise: true,
		fields: {
			nomAgent_note: 'name',
			colorAgent_note: 'color',
			dateCreationAgent_note: 'dateCreation',
			descriptionAgent_note: 'description',
			petitNomAgent_note: 'petitNom',
		},
	},

	agent_tuile: {
		sourceDb:  'sitebase_base',
		target:    'user_tuile',
		pkField:   'idagent_tuile',
		codeField: 'codeAgent_tuile',
		dropNoise: true,
		fields: {
			nomAgent_tuile: 'name',
			valeurAgent_tuile: 'valeur',
		},
	},

	// ── tactac-specific collections ─────────────────────────────────────────

	adresse_type: {
		sourceDb:  'sitebase_base',
		target:    'adresse_type',
		pkField:   'idadresse_type',
		codeField: 'codeAdresse_type',
		dropNoise: true,
		fields: { nomAdresse_type: 'name' },
	},

	agence: {
		sourceDb:  'sitebase_base',
		target:    'agence',
		pkField:   'idagence',
		codeField: 'codeAgence',
		dropNoise: true,
		fields: { nomAgence: 'name' },
	},

	cart: {
		sourceDb:  'sitebase_base',
		target:    'cart',
		pkField:   'idcart',
		codeField: 'codeCart',
		dropNoise: true,
		fields: {
			nomCart: 'name',
			totalTtcCart: 'totalTtc',
		},
		fks: {
			secteur: { collection: 'secteur', from: 'idsecteur', on: 'id' },
			shop: { collection: 'shop', from: 'idshop', on: 'id' },
		},
	},

	categorie_produit: {
		sourceDb:  'sitebase_base',
		target:    'categorie_produit',
		pkField:   'idcategorie_produit',
		codeField: 'codeCategorie_produit',
		dropNoise: true,
		fields: {
			nomCategorie_produit: 'name',
			ordreCategorie_produit: 'ordre',
			slugCategorie_produit: 'slug',
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
			dateFinClient: 'dateFin',
			codePostalClient: 'codePostal',
			telephoneClient: 'telephone',
			adresseClient: 'adresse',
			descriptionClient: 'description',
			emailClient: 'email',
			mobileClient: 'mobile',
			villeClient: 'ville',
			faxClient: 'fax',
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
			descriptionClient_categorie: 'description',
			ordreClient_categorie: 'ordre',
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
			descriptionClient_type: 'description',
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
			dateCreationCommande: 'dateCreation',
			descriptionCommande: 'description',
			heureCommande: 'heure',
			dateCommande: 'date',
			emailCommande: 'email',
			telephoneCommande: 'telephone',
			duree_realisationCommande: 'duree_realisation',
			adresseCommande: 'adresse',
			codePostalCommande: 'codePostal',
			villeCommande: 'ville',
			prixCommande: 'prix',
			dureeLivraisonCommande: 'dureeLivraison',
			distanceCommande: 'distance',
			heureFinPreparationCommande: 'heureFinPreparation',
			heureLivraisonCommande: 'heureLivraison',
			refCommande: 'ref',
		},
		fks: {
			client: { collection: 'client', from: 'idclient', on: 'id' },
			shop: { collection: 'shop', from: 'idshop', on: 'id' },
			secteur: { collection: 'secteur', from: 'idsecteur', on: 'id' },
			commande_statut: { collection: 'commande_statut', from: 'idcommande_statut', on: 'id' },
		},
	},

	commande_facture: {
		sourceDb:  'sitebase_base',
		target:    'commande_facture',
		pkField:   'idcommande_facture',
		codeField: 'codeCommande_facture',
		dropNoise: true,
		fields: {
			nomCommande_facture: 'name',
			margeCommande_facture: 'marge',
			dateCommande_facture: 'date',
			heureCommande_facture: 'heure',
			partLivreurCommande_facture: 'partLivreur',
			partShopCommande_facture: 'partShop',
		},
		fks: {
			shop: { collection: 'shop', from: 'idshop', on: 'id' },
			commande: { collection: 'commande', from: 'idcommande', on: 'id' },
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
			descriptionCommande_ligne: 'description',
		},
		fks: {
			commande: { collection: 'commande', from: 'idcommande', on: 'id' },
			shop: { collection: 'shop', from: 'idshop', on: 'id' },
			client: { collection: 'client', from: 'idclient', on: 'id' },
			produit: { collection: 'produit', from: 'idproduit', on: 'id' },
		},
	},

	commande_proposition: {
		sourceDb:  'sitebase_base',
		target:    'commande_proposition',
		pkField:   'idcommande_proposition',
		codeField: 'codeCommande_proposition',
		dropNoise: true,
		fields: {
			nomCommande_proposition: 'name',
			dateCreationCommande_proposition: 'dateCreation',
			actifCommande_proposition: 'actif',
			vuCommande_proposition: 'vu',
			endedCommande_proposition: 'ended',
			heureCommande_proposition: 'heure',
			dateCommande_proposition: 'date',
			refCommande_proposition: 'ref',
		},
		fks: {
			commande: { collection: 'commande', from: 'idcommande', on: 'id' },
			secteur: { collection: 'secteur', from: 'idsecteur', on: 'id' },
			shop: { collection: 'shop', from: 'idshop', on: 'id' },
			livreur: { collection: 'livreur', from: 'idlivreur', on: 'id' },
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
			colorCommande_statut: 'color',
			ordreCommande_statut: 'ordre',
			iconCommande_statut: 'icon',
		},
	},

	commune: {
		sourceDb:  'sitebase_base',
		target:    'commune',
		pkField:   'idcommune',
		codeField: 'codeCommune',
		dropNoise: true,
		fields: {
			nomCommune: 'name',
			slugCommune: 'slug',
			gpsDataCommune: 'gpsData',
			codePostalCommune: 'codePostal',
			refCommune: 'ref',
		},
		fks: {
			ville: { collection: 'ville', from: 'idville', on: 'id' },
		},
	},

	contact_type: {
		sourceDb:  'sitebase_base',
		target:    'contact_type',
		pkField:   'idcontact_type',
		codeField: 'codeContact_type',
		dropNoise: true,
		fields: {
			nomContact_type: 'name',
			colorContact_type: 'color',
			iconContact_type: 'icon',
		},
	},

	livreur: {
		sourceDb:  'sitebase_base',
		target:    'livreur',
		pkField:   'idlivreur',
		codeField: 'codeLivreur',
		dropNoise: true,
		fields: {
			nomLivreur: 'name',
			prenomLivreur: 'prenom',
			codePostalLivreur: 'codePostal',
			adresseLivreur: 'adresse',
			emailLivreur: 'email',
			mobileLivreur: 'mobile',
			dateDebutLivreur: 'dateDebut',
			dateFinLivreur: 'dateFin',
			actifLivreur: 'actif',
			loginLivreur: 'login',
			passwordLivreur: 'password',
			disponibleLivreur: 'disponible',
		},
		drop: ['private_keyLivreur'],
		fks: {
			secteur: { collection: 'secteur', from: 'idsecteur', on: 'id' },
		},
	},

	livreur_affectation: {
		sourceDb:  'sitebase_base',
		target:    'livreur_affectation',
		pkField:   'idlivreur_affectation',
		codeField: 'codeLivreur_affectation',
		dropNoise: true,
		fields: {
			nomLivreur_affectation: 'name',
			dateDebutLivreur_affectation: 'dateDebut',
			dateFinLivreur_affectation: 'dateFin',
			heureDebutLivreur_affectation: 'heureDebut',
			heureFinLivreur_affectation: 'heureFin',
			actifLivreur_affectation: 'actif',
		},
		fks: {
			livreur: { collection: 'livreur', from: 'idlivreur', on: 'id' },
			secteur: { collection: 'secteur', from: 'idsecteur', on: 'id' },
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
			descriptionProduit: 'description',
			prixProduit: 'prix',
			dateDebutProduit: 'dateDebut',
			dateFinProduit: 'dateFin',
			slugProduit: 'slug',
			actifProduit: 'actif',
			duree_realisationProduit: 'duree_realisation',
			volumeProduit: 'volume',
			stockProduit: 'stock',
		},
		fks: {
			shop: { collection: 'shop', from: 'idshop', on: 'id' },
			produit_type: { collection: 'produit_type', from: 'idproduit_type', on: 'id' },
			produit_categorie: { collection: 'produit_categorie', from: 'idproduit_categorie', on: 'id' },
		},
	},

	produit_categorie: {
		sourceDb:  'sitebase_base',
		target:    'produit_categorie',
		pkField:   'idproduit_categorie',
		codeField: 'codeProduit_categorie',
		dropNoise: true,
		fields: {
			nomProduit_categorie: 'name',
			slugProduit_categorie: 'slug',
			ordreProduit_categorie: 'ordre',
		},
	},

	produit_type: {
		sourceDb:  'sitebase_base',
		target:    'produit_type',
		pkField:   'idproduit_type',
		codeField: 'codeProduit_type',
		dropNoise: true,
		fields: {
			nomProduit_type: 'name',
			ordreProduit_type: 'ordre',
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
			codePostalSecteur: 'codePostal',
			gpsDataSecteur: 'gpsData',
			slugSecteur: 'slug',
		},
		fks: {
			ville: { collection: 'ville', from: 'idville', on: 'id' },
		},
	},

	secteur_jours_shift: {
		sourceDb:  'sitebase_base',
		target:    'secteur_jours_shift',
		pkField:   'idsecteur_jours_shift',
		codeField: 'codeSecteur_jours_shift',
		dropNoise: true,
		fields: {
			nomSecteur_jours_shift: 'name',
			heureDebutSecteur_jours_shift: 'heureDebut',
			heureFinSecteur_jours_shift: 'heureFin',
		},
		fks: {
			secteur: { collection: 'secteur', from: 'idsecteur', on: 'id' },
			jours: { collection: 'jours', from: 'idjours', on: 'id' },
		},
	},

	shop: {
		sourceDb:  'sitebase_base',
		target:    'shop',
		pkField:   'idshop',
		codeField: 'codeShop',
		dropNoise: true,
		fields: {
			nomShop: 'name',
			adresseShop: 'adresse',
			codePostalShop: 'codePostal',
			descriptionShop: 'description',
			telephoneShop: 'telephone',
			slugShop: 'slug',
			atoutShop: 'atout',
			passwordShop: 'password',
			loginShop: 'login',
			emailShop: 'email',
			gpsDataShop: 'gpsData',
			actifShop: 'actif',
			strip_keyShop: 'strip_key',
		},
		drop: ['private_keyShop'],
		fks: {
			shop_type: { collection: 'shop_type', from: 'idshop_type', on: 'id' },
			ville: { collection: 'ville', from: 'idville', on: 'id' },
			secteur: { collection: 'secteur', from: 'idsecteur', on: 'id' },
			client: { collection: 'client', from: 'idclient', on: 'id' },
			shop_categorie: { collection: 'shop_categorie', from: 'idshop_categorie', on: 'id' },
			shop_client: { collection: 'shop_client', from: 'idshop_client', on: 'id' },
		},
	},

	shop_categorie: {
		sourceDb:  'sitebase_base',
		target:    'shop_categorie',
		pkField:   'idshop_categorie',
		codeField: 'codeShop_categorie',
		dropNoise: true,
		fields: { nomShop_categorie: 'name' },
	},

	shop_client: {
		sourceDb:  'sitebase_base',
		target:    'shop_client',
		pkField:   'idshop_client',
		codeField: 'codeShop_client',
		dropNoise: true,
		fields: {
			nomShop_client: 'name',
			adresseShop_client: 'adresse',
			codePostalShop_client: 'codePostal',
			villeShop_client: 'ville',
			loginShop_client: 'login',
			emailShop_client: 'email',
			telephoneShop_client: 'telephone',
			mobileShop_client: 'mobile',
		},
	},

	shop_configuration: {
		sourceDb:  'sitebase_base',
		target:    'shop_configuration',
		pkField:   'idshop_configuration',
		codeField: 'codeShop_configuration',
		dropNoise: true,
		fields: { nomShop_configuration: 'name' },
	},

	shop_configuration_ligne: {
		sourceDb:  'sitebase_base',
		target:    'shop_configuration_ligne',
		pkField:   'idshop_configuration_ligne',
		codeField: 'codeShop_configuration_ligne',
		dropNoise: true,
		fields: {
			nomShop_configuration_ligne: 'name',
			valeur_texteShop_configuration_ligne: 'valeur_texte',
		},
	},

	shop_jours: {
		sourceDb:  'sitebase_base',
		target:    'shop_jours',
		pkField:   'idshop_jours',
		codeField: 'codeShop_jours',
		dropNoise: true,
		fields: {
			nomShop_jours: 'name',
			actifShop_jours: 'actif',
			ordreShop_jours: 'ordre',
		},
		fks: {
			jours: { collection: 'jours', from: 'idjours', on: 'id' },
			shop: { collection: 'shop', from: 'idshop', on: 'id' },
		},
	},

	shop_jours_shift: {
		sourceDb:  'sitebase_base',
		target:    'shop_jours_shift',
		pkField:   'idshop_jours_shift',
		codeField: 'codeShop_jours_shift',
		dropNoise: true,
		fields: {
			nomShop_jours_shift: 'name',
			heureDebutShop_jours_shift: 'heureDebut',
			heureFinShop_jours_shift: 'heureFin',
			actifShop_jours_shift: 'actif',
			ordreShop_jours_shift: 'ordre',
		},
		fks: {
			shop_jours: { collection: 'shop_jours', from: 'idshop_jours', on: 'id' },
			shop: { collection: 'shop', from: 'idshop', on: 'id' },
		},
	},

	shop_jours_shift_run: {
		sourceDb:  'sitebase_base',
		target:    'shop_jours_shift_run',
		pkField:   'idshop_jours_shift_run',
		codeField: 'codeShop_jours_shift_run',
		dropNoise: true,
		fields: {
			nomShop_jours_shift_run: 'name',
			dateDebutShop_jours_shift_run: 'dateDebut',
			dateFinShop_jours_shift_run: 'dateFin',
			heureDebutShop_jours_shift_run: 'heureDebut',
			heureFinShop_jours_shift_run: 'heureFin',
		},
		fks: {
			shop: { collection: 'shop', from: 'idshop', on: 'id' },
			shop_jours_shift: { collection: 'shop_jours_shift', from: 'idshop_jours_shift', on: 'id' },
		},
	},

	shop_type: {
		sourceDb:  'sitebase_base',
		target:    'shop_type',
		pkField:   'idshop_type',
		codeField: 'codeShop_type',
		dropNoise: true,
		fields: { nomShop_type: 'name' },
	},

	ville: {
		sourceDb:  'sitebase_base',
		target:    'ville',
		pkField:   'idville',
		codeField: 'codeVille',
		dropNoise: true,
		fields: {
			nomVille: 'name',
			slugVille: 'slug',
			gpsDataVille: 'gpsData',
		},
	},

	jours: {
		sourceDb:  'sitebase_base',
		target:    'jours',
		pkField:   'idjours',
		codeField: 'codeJours',
		dropNoise: true,
		fields: {
			nomJours: 'name',
			slugJours: 'slug',
			ordreJours: 'ordre',
		},
	},

	// Group collections (isGroup: true)
	// commande_slot, commande_slot_ligne not in MongoDB — skipped at migration time

};

export default tactacMapping;