/**
 * crfr legacy → canonical mapping.
 *
 * Key      = legacy collection name (in the source DB).
 * sourceDb = legacy database suffix; full name = `crfr_${sourceDb}`.
 * pkField  = legacy PK field → renamed to `id` in output.
 * codeField= legacy semantic key → renamed to `code` in output.
 * fields   = other FR→EN renames (unlisted pass through).
 * drop     = explicit field drops (noise beyond dropNoise).
 * dropNoise= auto-drop date|heure+Creation|Modification, time[A-Z]* timestamps, updated_fields.
 * fks      = legacy id-column → canonical fk.code resolution.
 */
import type { OrgMapping } from './types.js';

export const crfrMapping: OrgMapping = {

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
			estActifAgent: 'isActive',
			loginAgent:  'login',
			groupeAgent: 'group',
		},
		drop: ['passwordAgent', 'mailPasswordAgent'],
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

	groupe_agent: {
		sourceDb: 'sitebase_base',
		target:   'appuser_group',
		pkField:  'idgroupe_agent',
		dropNoise: true,
		fields:   {},
	},

	agent_history: {
		sourceDb:  'sitebase_base',
		target:    'appuser_history',
		pkField:   'idagent_history',
		dropNoise: true,
		fields:    {},
	},

	// ── crfr-specific user extensions ─────────────────────────────────────────

	agent_tuile: {
		sourceDb:  'sitebase_base',
		target:    'user_tuile',
		pkField:   'idagent_tuile',
		codeField: 'codeAgent_tuile',
		dropNoise: true,
		fields: { nomAgent_tuile: 'name', valeurAgent_tuile: 'value' },
		fks: {
			appuser: { collection: 'appuser', from: 'idagent', on: 'id' },
		},
	},

	// agent_liste / agent_note / agent_table not in MongoDB — skipped at migration time (no source docs)

	// ── BASE ──────────────────────────────────────────────────────────────────

	note: {
		sourceDb:  'sitebase_base',
		target:    'note',
		pkField:   'idnote',
		codeField: 'codeNote',
		dropNoise: true,
		fields: {
			texteNote:    'text',
			estActifNote: 'isActive',
		},
		drop: ['idnote_origine'],
		fks: {
			appuser: { collection: 'appuser', from: 'idagent_writer', on: 'id' },
		},
	},

	tache: {
		sourceDb:  'sitebase_base',
		target:    'tache',
		pkField:   'idtache',
		dropNoise: true,
		fields: {
			nomTache:         'name',
			descriptionTache: 'description',
			dateDebutTache:   'startDate',
			dateFinTache:     'endDate',
			heureDebutTache:  'startTime',
			heureFinTache:    'endTime',
		},
		drop: ['m_mode', 'nomClient', 'codeClient', 'timeDebutTache', 'timeFinTache'],
		fks: {
			client:  { collection: 'client',  from: 'idclient',    on: 'id' },
			appuser: { collection: 'appuser',  from: 'idagent',     on: 'id' },
		},
	},

	vacance: {
		sourceDb:  'sitebase_base',
		target:    'vacance',
		pkField:   'idvacance',
		dropNoise: true,
		fields: {
			nomVacance:         'name',
			descriptionVacance: 'description',
			dateDebutVacance:   'startDate',
			dateFinVacance:     'endDate',
		},
		drop: ['F_action', 'afterAction', 'reloadModule', 'descriptionVance', 'zone'],
	},

	type_activite: {
		sourceDb:  'sitebase_base',
		target:    'type_activite',
		pkField:   'idtype_activite',
		codeField: 'codeType_activite',
		dropNoise: true,
		fields: {
			nomType_activite:         'name',
			petitNomType_activite:    'shortName',
			descriptionType_activite: 'description',
		},
	},

	// ── DEVIS ─────────────────────────────────────────────────────────────────

	client: {
		sourceDb:  'sitebase_devis',
		target:    'client',
		pkField:   'idclient',
		codeField: 'codeClient',
		dropNoise: true,
		fields: {
			nomClient:        'name',
			prenomClient:     'firstName',
			emailClient:      'email',
			telephoneClient:  'phone',
			mobileClient:     'mobilePhone',
			sexeClient:       'gender',
			estClientClient:  'isClient',
			codePostalClient: 'postalCode',
			adresseClient:    'address',
			adressePlusClient:'address2',
			villeClient:      'city',
		},
		drop: ['grilleDestination', 'grilleFournisseur', 'grilleProduitType', 'ipClient', 'scope'],
	},

	devis: {
		sourceDb:  'sitebase_devis',
		target:    'devis',
		pkField:   'iddevis',
		codeField: 'codeDevis',
		dropNoise: true,
		fields: {
			archive:          'isArchived',
			nomDevis:         'name',
			prenomDevis:      'firstName',
			emailDevis:       'email',
			telephoneDevis:   'phone',
			sexeDevis:        'gender',
			dateDepartDevis:  'departureDate',
			dateRetourDevis:  'returnDate',
			dateDebutDevis:   'startDate',
			dateFinDevis:     'endDate',
			devisCommentaire: 'comment',
			annotationDevis:  'annotation',
			ageEnfantDevis:   'childAges',
			codePromoDevis:   'promoCode',
			dreamLetter:      'wishLetter',
			envieDevis:       'desire',
			nombreAdulteDevis:'adultCount',
			nombreEnfantDevis:'childCount',
			numeroDevis:      'number',
			prixSiteDevis:    'sitePrice',
		},
		drop: [
			'ipClient', 'md5', 'md5Devis', 'mongodate', 'timestamp', 'scope', 'typeDevis',
			'nbreAdulteDevis', 'heureRappelDevis', 'timeFinDevis', 'SESSID',
			'nomFournisseur', 'nomDevis_statut', 'codeDevis_statut', 'nomDevis_type', 'codeDevis_type',
			'idhotel_gamme', 'idproduit_tarif', 'idproduit_tarif_gamme', 'idproduit_type',
		],
		fks: {
			client:       { collection: 'client',       from: 'idclient',       on: 'id' },
			devis_type:   { collection: 'devis_type',   from: 'iddevis_type',   on: 'id' },
			devis_statut: { collection: 'devis_statut', from: 'iddevis_statut', on: 'id' },
			produit:      { collection: 'produit',       from: 'idproduit',      on: 'id' },
			fournisseur:  { collection: 'fournisseur',   from: 'idfournisseur',  on: 'id' },
			transport:    { collection: 'transport',     from: 'idtransport',    on: 'id' },
		},
	},

	devis_acompte: {
		sourceDb:  'sitebase_devis',
		target:    'devis_acompte',
		pkField:   'iddevis_acompte',
		codeField: 'codeDevis_acompte',
		dropNoise: true,
		fields: {
			prixDevis_acompte: 'price',
			dateDevis_acompte: 'date',
		},
		drop: ['nomDevis', 'codeDevis', 'nomDevis_acompte_type', 'codeDevis_acompte_type', 'iddevis_acompte_type'],
		fks: {
			devis: { collection: 'devis', from: 'iddevis', on: 'id' },
		},
	},

	devis_marge: {
		sourceDb:  'sitebase_devis',
		target:    'devis_marge',
		pkField:   'iddevis_marge',
		dropNoise: true,
		fields:    {},
		drop:      ['iddevis_prestataire'],
		fks: {
			devis: { collection: 'devis', from: 'iddevis', on: 'id' },
		},
	},

	devis_passager: {
		sourceDb:  'sitebase_devis',
		target:    'devis_passager',
		pkField:   'iddevis_passager',
		dropNoise: true,
		fields: {
			nomDevis_passager:   'name',
			ordreDevis_passager: 'order',
		},
		fks: {
			devis: { collection: 'devis', from: 'iddevis', on: 'id' },
		},
	},

	devis_prestation: {
		sourceDb:  'sitebase_devis',
		target:    'devis_prestation',
		pkField:   'iddevis_prestation',
		codeField: 'codeDevis_prestation',
		dropNoise: true,
		fields: {
			nomDevis_prestation:         'name',
			descriptionDevis_prestation: 'description',
			ordreDevis_prestation:       'order',
			prixDevis_prestation:        'price',
			totalDevis_prestation:       'total',
			quantiteDevis_prestation:    'quantity',
		},
		drop: ['nomDevis', 'codeDevis'],
		fks: {
			devis: { collection: 'devis', from: 'iddevis', on: 'id' },
		},
	},

	devis_statut: {
		sourceDb:  'sitebase_devis',
		target:    'devis_statut',
		pkField:   'iddevis_statut',
		codeField: 'codeDevis_statut',
		dropNoise: true,
		fields: {
			nomDevis_statut: 'name',
		},
	},

	devis_acompte_type: {
		sourceDb:  'sitebase_devis',
		target:    'devis_acompte_type',
		pkField:   'iddevis_acompte_type',
		codeField: 'codeDevis_acompte_type',
		dropNoise: true,
		fields: {
			nomDevis_acompte_type: 'name',
		},
	},

	devis_type: {
		sourceDb:  'sitebase_devis',
		target:    'devis_type',
		pkField:   'iddevis_type',
		codeField: 'codeDevis_type',
		dropNoise: true,
		fields: {
			nomDevis_type:         'name',
			petitNomDevis_type:    'shortName',
			descriptionDevis_type: 'description',
		},
		drop: ['nomDevis_type_type', 'iddevis_type_type'],
	},

	dossier_devis: {
		sourceDb:  'sitebase_devis',
		target:    'dossier_devis',
		pkField:   'iddossier_devis',
		codeField: 'codeDossier_devis',
		dropNoise: true,
		fields: {
			numeroDossierDevis: 'dossierNumber',
			numeroDossier_devis:'number',
		},
		drop: ['nomDevis', 'codeDevis'],
		fks: {
			devis: { collection: 'devis', from: 'iddevis', on: 'id' },
		},
	},

	facture: {
		sourceDb:  'sitebase_devis',
		target:    'facture',
		pkField:   'idfacture',
		codeField: 'codeFacture',
		dropNoise: true,
		fields: {
			titreFacture:           'title',
			pctTvaFRFacture:        'vatRateFR',
			pctTvaHUEFacture:       'vatRateHUE',
			pctTvaUEFacture:        'vatRateUE',
			referenceExterneFacture:'externalRef',
			totalFacture:           'total',
			dateFacture:            'date',
		},
		drop: [
			'grilleFacture', 'numeroDossierDevis', 'numeroFactureDevis', 'txn_id', 'typeFacture',
			'numeroDossier_devis', 'nomFature', 'nomFacture', 'nomDevis', 'codeDevis',
			'nomClient', 'codeDossier_devis', 'nomDossier_devis', 'nomFacture_type', 'codeFacture_type',
		],
		fks: {
			devis:   { collection: 'devis',   from: 'iddevis',   on: 'id' },
			appuser: { collection: 'appuser', from: 'idagent',   on: 'id' },
		},
	},

	paiement: {
		sourceDb:  'sitebase_devis',
		target:    'paiement',
		pkField:   'idpaiement',
		dropNoise: true,
		fields: {
			montantPaiement:          'amount',
			referenceExternePaiement: 'externalRef',
			typePaiement:             'type',
			modePaiement:             'mode',
			datePaiement:             'date',
		},
		drop: ['pseudoAgent', 'numeroDossierDevis', 'nomClient', 'nomAgent', 'prenomAgent'],
		fks: {
			devis:   { collection: 'devis',   from: 'iddevis',   on: 'id' },
			appuser: { collection: 'appuser', from: 'idagent',   on: 'id' },
			client:  { collection: 'client',  from: 'idclient',  on: 'id' },
		},
	},

	prestataire: {
		sourceDb:  'sitebase_devis',
		target:    'prestataire',
		pkField:   'idprestataire',
		dropNoise: true,
		fields: {
			nomPrestataire:          'name',
			descriptionPrestataire:  'description',
			contactPrestataire:      'contact',
			telephonePrestataire:    'phone',
			telephoneResaPrestataire:'reservationPhone',
			mailCommercialPrestataire:'commercialEmail',
			lienwebPrestataire:      'website',
		},
		drop: ['scope', 'faxPrestataire', 'commissionPrestataire', 'commercialPrestataire'],
	},

	// ── NEWSLETTER ────────────────────────────────────────────────────────────

	newsletter: {
		sourceDb:  'sitebase_newsletter',
		target:    'newsletter',
		pkField:   'idnewsletter',
		dropNoise: true,
		fields: {
			nomNewsletter:       'name',
			dateDebutNewsletter: 'startDate',
			preview_content:     'previewContent',
		},
		drop: ['F_action', 'color_background', 'date_created', 'date_modified', 'date_', 'title', 'id', 'content', 'timeDebutNewsletter'],
	},

	newsletter_item: {
		sourceDb:  'sitebase_newsletter',
		target:    'newsletter_item',
		pkField:   'idnewsletter_item',
		dropNoise: true,
		fields: {
			nomNewsletter_item:   'name',
			ordreNewsletter_item: 'order',
		},
		drop: ['nomNewsletter_item_type', 'idnewsletter_item_type', 'idnewsletter_block'],
		fks: {
			newsletter: { collection: 'newsletter', from: 'idnewsletter', on: 'id' },
		},
	},

	// ── PRODUCTION ────────────────────────────────────────────────────────────

	aeroport: {
		sourceDb:  'sitebase_production',
		target:    'aeroport',
		pkField:   'idaeroport',
		codeField: 'codeAeroport',
		dropNoise: true,
		fields: {
			nomAeroport:      'name',
			nomCourtAeroport: 'shortName',
			pays:             'country',
		},
	},

	asavoir: {
		sourceDb:  'sitebase_production',
		target:    'asavoir',
		pkField:   'idasavoir',
		codeField: 'codeAsavoir',
		dropNoise: true,
		fields: {
			nomAsavoir:         'name',
			petitNomAsavoir:    'shortName',
			atoutAsavoir:       'asset',
			descriptionAsavoir: 'description',
			informationAsavoir: 'info',
		},
		drop: ['nomAsavoir_type'],
		fks: {
			asavoir_type: { collection: 'asavoir_type', from: 'idasavoir_type', on: 'id' },
		},
	},

	asavoir_type: {
		sourceDb:  'sitebase_production',
		target:    'asavoir_type',
		pkField:   'idasavoir_type',
		codeField: 'codeAsavoir_type',
		dropNoise: true,
		fields: {
			nomAsavoir_type:         'name',
			petitNomAsavoir_type:    'shortName',
			atoutAsavoir_type:       'asset',
			descriptionAsavoir_type: 'description',
			informationAsavoir_type: 'info',
		},
	},

	continent: {
		sourceDb:  'sitebase_production',
		target:    'continent',
		pkField:   'idcontinent',
		codeField: 'codeContinent',
		dropNoise: true,
		fields: {
			nomContinent:        'name',
			adjectifContinent:   'adjective',
			ordreContinent:      'order',
			petitNomContinent:   'shortName',
			prefixeContinent:    'prefix',
			estTopContinent:     'isFeatured',
			estVisibleContinent: 'isVisible',
			estActifContinent:   'isActive',
			nombreVueContinent:  'viewCount',
			descriptionContinent:'description',
		},
	},

	destination: {
		sourceDb:  'sitebase_production',
		target:    'destination',
		pkField:   'iddestination',
		dropNoise: true,
		fields: {
			nomDestination:      'name',
			adjectifDestination: 'adjective',
			descriptionDestination:'description',
			descriptionVille:    'cityDescription',
			estTopDestination:   'isFeatured',
			latitudeVille:       'cityLatitude',
			longitudeVille:      'cityLongitude',
			ordrePays:           'countryOrder',
			ordreVille:          'cityOrder',
			prefixeDestination:  'prefix',
			nombreVueDestination:'viewCount',
		},
		drop: ['adjectifContinent', 'adjectifPays', 'codePays', 'nomContinent', 'nomPays', 'nomVille',
		       'prefixeContinent', 'prefixePays', 'idcontinent', 'idpays', 'idville'],
	},

	fleuve: {
		sourceDb:  'sitebase_production',
		target:    'fleuve',
		pkField:   'idfleuve',
		dropNoise: true,
		fields: {
			nomFleuve:         'name',
			descriptionFleuve: 'description',
			ordreFleuve:       'order',
			urlFleuve:         'url',
		},
		drop: ['fleuve_idfleuve', 'idfleuve_trad', 'lang_idlang'],
		fks: {
			pays: { collection: 'pays', from: 'idpays', on: 'id' },
		},
	},

	fournisseur: {
		sourceDb:  'sitebase_production',
		target:    'fournisseur',
		pkField:   'idfournisseur',
		dropNoise: true,
		fields: {
			nomFournisseur: 'name',
		},
		drop: ['codeProduit_type'],
		fks: {
			fournisseur_type: { collection: 'fournisseur_type', from: 'idfournisseur_type', on: 'id' },
		},
	},

	fournisseur_clause: {
		sourceDb:  'sitebase_production',
		target:    'fournisseur_clause',
		pkField:   'idfournisseur_clause',
		dropNoise: true,
		fields: {
			nomFournisseur_clause:         'name',
			descriptionFournisseur_clause: 'description',
			descriptionHTMLFournisseur_clause: 'descriptionHtml',
			ordreFournisseur_clause:       'order',
		},
		drop: ['nomFournisseur', 'nomFournisseur_clause_type', 'codeFournisseur_clause_type', 'idfournisseur_clause_type'],
		fks: {
			fournisseur: { collection: 'fournisseur', from: 'idfournisseur', on: 'id' },
		},
	},

	fournisseur_type: {
		sourceDb:  'sitebase_production',
		target:    'fournisseur_type',
		pkField:   'idfournisseur_type',
		codeField: 'codeFournisseurType',
		dropNoise: true,
		fields: {
			nomFournisseur_type:    'name',
			adjectifFournisseur_type:'adjective',
			plurielFournisseur_type: 'plural',
			prefixeFournisseur_type: 'prefix',
		},
	},

	gamme: {
		sourceDb:  'sitebase_production',
		target:    'gamme',
		pkField:   'idgamme',
		codeField: 'codeGamme',
		dropNoise: true,
		fields: {
			nomGamme:         'name',
			descriptionGamme: 'description',
			ordreGamme:       'order',
		},
		drop: ['idgamme_trad', 'idlang', 'idproduit_type', 'idtype_produit', 'visibleClientGamme',
		       'codeLang', 'codeProduit_type', 'nomLang', 'nomProduit_type'],
	},

	hotel: {
		sourceDb:  'sitebase_production',
		target:    'hotel',
		pkField:   'idhotel',
		dropNoise: true,
		fields: {
			nomHotel:         'name',
			descriptionHotel: 'description',
			etoileHotel:      'stars',
			nombreVueHotel:   'viewCount',
		},
		drop: ['nomVille'],
		fks: {
			ville: { collection: 'ville', from: 'idville', on: 'id' },
		},
	},

	hotel_gamme: {
		sourceDb:  'sitebase_production',
		target:    'hotel_gamme',
		pkField:   'idhotel_gamme',
		dropNoise: true,
		fields: {
			ordreGamme: 'order',
		},
		drop: ['codeGamme', 'codeProduit_type', 'nomGamme', 'nomProduit_type', 'idproduit_type'],
		fks: {
			hotel: { collection: 'hotel', from: 'idhotel', on: 'id' },
			gamme: { collection: 'gamme', from: 'idgamme', on: 'id' },
		},
	},

	hotel_type: {
		sourceDb:  'sitebase_production',
		target:    'hotel_type',
		pkField:   'idhotel_type',
		codeField: 'codeHotel_type',
		dropNoise: true,
		fields: {
			nomHotel_type:         'name',
			petitNomHotel_type:    'shortName',
			descriptionHotel_type: 'description',
		},
	},

	mer: {
		sourceDb:  'sitebase_production',
		target:    'mer',
		pkField:   'idmer',
		codeField: 'codeMer',
		dropNoise: true,
		fields: {
			nomMer:         'name',
			petitNomMer:    'shortName',
			descriptionMer: 'description',
			nombreVueMer:   'viewCount',
		},
		drop: ['nomMer_type', 'idmer_type'],
	},

	pays: {
		sourceDb:  'sitebase_production',
		target:    'pays',
		pkField:   'idpays',
		codeField: 'codePays',
		dropNoise: true,
		fields: {
			nomPays:            'name',
			adjectifPays:       'adjective',
			aVisaPays:          'hasVisa',
			infoVisaPays:       'visaInfo',
			ordrePays:          'order',
			prefixePays:        'prefix',
			nombreVuePays:      'viewCount',
			descriptionPays:    'description',
		},
		drop: ['countCF', 'countCR', 'countTR', 'count',
		       'nomContinent', 'nomDestination', 'adjectifContinent', 'adjectifDestination',
		       'prefixeContinent', 'prefixeDestination', 'iddestination'],
		fks: {
			continent: { collection: 'continent', from: 'idcontinent', on: 'id' },
		},
	},

	produit: {
		sourceDb:  'sitebase_production',
		target:    'produit',
		pkField:   'idproduit',
		codeField: 'codeProduit',
		dropNoise: true,
		fields: {
			nomProduit:              'name',
			descriptionProduit:      'description',
			prixProduit:             'price',
			dureeJourProduit:        'durationDays',
			estActifProduit:         'isActive',
			estTopDestination:       'isFeaturedDestination',
			estTopFournisseur:       'isFeaturedFournisseur',
			estActifFournisseur:     'isActiveFournisseur',
			prixPromoProduit:        'promoPrice',
			promoProduit:            'promoText',
			sousTitreProduit:        'subtitle',
			sousTitrePromo:          'promoSubtitle',
			autreNom_Transport:      'altTransportName',
			pensionCompleteProduit:  'fullBoard',
			petitNomFournisseur:     'supplierShortName',
			plusPetitPrixProduit:    'lowestPrice',
			prefixeFournisseur_type: 'supplierTypePrefix',
			prefixeProduit_type:     'productTypePrefix',
			ordreHomePageProduit:    'homePageOrder',
			ordreFournisseur:        'supplierOrder',
			nombreVueProduit:        'viewCount',
			referenceProduit:        'reference',
			dateDebutProduit:        'startDate',
			dateFinValiditeProduit:  'endDate',
		},
		drop: [
			'grilleClauseProduit', 'grilleDestinationProduit', 'grilleEtapeProduit',
			'grillePrestationProduit', 'grilleThemeProduit', 'grilleDateProduit', 'has_changed',
			'idmarche', 'idpaysArriveeProduit', 'idpaysDepartProduit',
			'idvilleArriveeProduit', 'idvilleDepartProduit', 'idvilleArrivee', 'idville', 'idpays',
			'plurielProduit_type', 'texteProduit_clause', 'webNomProduit_type', 'webPlurielProduit_type', 'scope',
			'nomFournisseur', 'nomFournisseur_type', 'nomPrestataire', 'nomProduit_type', 'nomTransport', 'nomTransport_type',
			'nomContinent', 'nomDestination', 'nomPays', 'nomVilleArrivee', 'nomVille', 'codeVille',
			'codeFournisseur', 'codeTransport', 'codeTransport_type', 'codeXmlProduit', 'codeProduit_type', 'codeProduit_clause',
			'villeArriveeProduit', 'villeDepartProduit', 'dateDebutValiditeProduit',
			'idfournisseur_type', 'idtransport_type', 'idcontinent', 'idprestataire',
		],
		fks: {
			fournisseur:  { collection: 'fournisseur',  from: 'idfournisseur',  on: 'id' },
			produit_type: { collection: 'produit_type', from: 'idproduit_type', on: 'id' },
			destination:  { collection: 'destination',  from: 'iddestination',  on: 'id' },
			transport:    { collection: 'transport',     from: 'idtransport',    on: 'id' },
		},
	},

	produit_etape: {
		sourceDb:  'sitebase_production',
		target:    'produit_etape',
		pkField:   'idproduit_etape',
		dropNoise: true,
		fields: {
			nomProduit_etape:         'name',
			descriptionProduit_etape: 'description',
			ordreProduit_etape:       'order',
		},
		drop: ['nomVille', 'nomProduit'],
		fks: {
			produit: { collection: 'produit', from: 'idproduit', on: 'id' },
			ville:   { collection: 'ville',   from: 'idville',   on: 'id' },
		},
	},

	produit_selection: {
		sourceDb:  'sitebase_production',
		target:    'produit_selection',
		pkField:   'idproduit_selection',
		dropNoise: true,
		fields: {
			nomProduit_selection:         'name',
			descriptionProduit_selection: 'description',
			actifProduit_selection:       'isActive',
			dateDebutProduit_selection:   'startDate',
			dateFinProduit_selection:     'endDate',
		},
		drop: ['F_action', 'afterAction', 'reloadModule'],
	},

	produit_tarif: {
		sourceDb:  'sitebase_production',
		target:    'produit_tarif',
		pkField:   'idproduit_tarif',
		dropNoise: true,
		fields: {
			nomProduit_tarif: 'name',
			dateProduit_tarif:'date',
			annee:            'year',
			mois:             'month',
			mois_fr:          'monthFr',
			mois_annee_fr:    'monthYearFr',
		},
		drop: ['mongodate', 'timeProduit_tarif', 'nomProduit'],
		fks: {
			produit: { collection: 'produit', from: 'idproduit', on: 'id' },
		},
	},

	produit_tarif_gamme: {
		sourceDb:  'sitebase_production',
		target:    'produit_tarif_gamme',
		pkField:   'idproduit_tarif_gamme',
		dropNoise: true,
		fields: {
			nomProduit_tarif_gamme:    'name',
			prixProduit_tarif_gamme:   'price',
			prixPromoProduit_tarif_gamme:'promoPrice',
			dateDebutProduit_tarif_gamme:'startDate',
		},
		drop: ['dateProduit_tarif', 'timeDebutProduit_tarif_gamme', 'codeGamme', 'nomGamme', 'nomProduit'],
		fks: {
			produit_tarif: { collection: 'produit_tarif', from: 'idproduit_tarif', on: 'id' },
			gamme:         { collection: 'gamme',         from: 'idgamme',         on: 'id' },
		},
	},

	produit_type: {
		sourceDb:  'sitebase_production',
		target:    'produit_type',
		pkField:   'idproduit_type',
		codeField: 'codeProduit_type',
		dropNoise: true,
		fields: {
			nomProduit_type:             'name',
			descriptionProduit_type:     'description',
			metaDescriptionProduit_type: 'metaDescription',
			metaTitleProduit_type:       'metaTitle',
			estActifProduit_type:        'isActive',
			estVisibleProduit_type:      'isVisible',
			ordreProduit_type:           'order',
			plurielProduit_type:         'plural',
			webNomProduit_type:          'webName',
			webPlurielProduit_type:      'webPlural',
			nombreVueProduit_type:       'viewCount',
		},
	},

	theme: {
		sourceDb:  'sitebase_production',
		target:    'theme',
		pkField:   'idtheme',
		codeField: 'codeTheme',
		dropNoise: true,
		fields: {
			nomTheme:         'name',
			petitNomTheme:    'shortName',
			descriptionTheme: 'description',
			atoutTheme:       'asset',
			informationTheme: 'info',
			actifTheme:       'isActive',
		},
		drop: [
			'actifProduit_theme', 'actifProduit_theme_type', 'actifTheme_type',
			'codeProduit_theme_type', 'codeTheme_type', 'descriptionProduit_theme',
			'idproduit_theme', 'idproduit_theme_type', 'idtheme_type',
			'nomProduit_theme', 'nomProduit_theme_type', 'nomTheme_type',
		],
	},

	theme_type: {
		sourceDb:  'sitebase_production',
		target:    'theme_type',
		pkField:   'idtheme_type',
		codeField: 'codeTheme_type',
		dropNoise: true,
		fields: {
			nomTheme_type: 'name',
		},
		drop: ['actifProduit_theme_type', 'actifTheme_type', 'codeProduit_theme_type', 'idproduit_theme_type', 'nomProduit_theme_type'],
	},

	transport: {
		sourceDb:  'sitebase_production',
		target:    'transport',
		pkField:   'idtransport',
		codeField: 'codeTransport',
		dropNoise: true,
		fields: {
			nomTransport:              'name',
			descriptionTransport:      'description',
			descriptionExtTransport:   'descriptionExt',
			autreNom_Transport:        'altName',
			estTopTransport:           'isFeatured',
			estActifProduit_type:      'isActiveProduitType',
		},
		drop: [
			'countProduit', 'ordreProduit_type', 'plurielProduit_type', 'plurielTransport_type',
			'prefixeProduit_type', 'scope', 'webNomProduit_type', 'webPlurielProduit_type',
			'nomFournisseur', 'nomProduit_type', 'nomTransport_type',
			'codeFournisseur', 'codeProduit_type', 'codeTransport_type', 'codeFournisseur_type',
			'idfournisseur', 'idproduit_type', 'idtransport_type',
		],
		fks: {
			transport_type: { collection: 'transport_type', from: 'idtransport_type', on: 'id' },
		},
	},

	transport_cabine: {
		sourceDb:  'sitebase_production',
		target:    'transport_cabine',
		pkField:   'idtransport_cabine',
		codeField: 'codeTransport_cabine',
		dropNoise: true,
		fields: {
			nomTransport_cabine:         'name',
			descriptionTransport_cabine: 'description',
			ordreTransport_cabine:       'order',
		},
		drop: [
			'ordreGamme', 'descriptionExtTransport_gamme', 'idgamme_trad', 'idlang', 'visibleClientGamme',
			'codeGamme', 'codeLang', 'codeProduit_type', 'nomGamme', 'nomLang', 'nomProduit_type',
			'idgamme', 'idproduit_type',
		],
		fks: {
			transport: { collection: 'transport', from: 'idtransport', on: 'id' },
		},
	},

	transport_pont: {
		sourceDb:  'sitebase_production',
		target:    'transport_pont',
		pkField:   'idtransport_pont',
		codeField: 'codePont',
		dropNoise: true,
		fields: {
			nomTransport_pont:         'name',
			descriptionTransport_pont: 'description',
			ordreTransport_pont:       'order',
		},
		drop: ['nomTransport'],
		fks: {
			transport: { collection: 'transport', from: 'idtransport', on: 'id' },
		},
	},

	transport_type: {
		sourceDb:  'sitebase_production',
		target:    'transport_type',
		pkField:   'idtransport_type',
		codeField: 'codeTransport_type',
		dropNoise: true,
		fields: {
			nomTransport_type:    'name',
			plurielTransport_type:'plural',
		},
	},

	ville: {
		sourceDb:  'sitebase_production',
		target:    'ville',
		pkField:   'idville',
		codeField: 'codeVille',
		dropNoise: true,
		fields: {
			nomVille:           'name',
			descriptionVille:   'description',
			estPortVille:       'isPort',
			ordrePays:          'countryOrder',
			ordreVille:         'order',
			latitudeVille:      'latitude',
			longitudeVille:     'longitude',
		},
		drop: [
			'adjectifContinent', 'adjectifDestination', 'adjectifPays',
			'codePays', 'nomContinent', 'nomDestination', 'nomPays',
			'prefixeContinent', 'prefixeDestination', 'prefixePays',
			'idcontinent', 'iddestination',
		],
		fks: {
			pays: { collection: 'pays', from: 'idpays', on: 'id' },
		},
	},

	// ── SITE ──────────────────────────────────────────────────────────────────

	article: {
		sourceDb:  'sitebase_site',
		target:    'article',
		pkField:   'idarticle',
		dropNoise: true,
		fields: {
			nomArticle:         'name',
			descriptionArticle: 'description',
			contenuArticle:     'content',
			ordreArticle:       'order',
			vignetteArticle:    'thumbnail',
			dateParutionArticle:'publishDate',
		},
		drop: ['categorie_idcategorie', 'idsite'],
		fks: {
			categorie: { collection: 'categorie', from: 'idcategorie', on: 'id' },
		},
	},

	categorie: {
		sourceDb:  'sitebase_site',
		target:    'categorie',
		pkField:   'idcategorie',
		dropNoise: true,
		fields: {
			nomCategorie:         'name',
			descriptionCategorie: 'description',
			ordreCategorie:       'order',
			dateParutionCategorie:'publishDate',
		},
		drop: ['idsite'],
	},

	site: {
		sourceDb:  'sitebase_site',
		target:    'site',
		pkField:   'idsite',
		dropNoise: true,
		fields: {
			nomSite:       'name',
			sousTitreSite: 'subtitle',
			texteIntroSite:'intro',
			domainSite:    'domain',
			urlSite:       'url',
			contactSite:   'contact',
		},
		drop: ['ATTR', 'SERVER_ADDR'],
	},

	// ── WEB ───────────────────────────────────────────────────────────────────

	appsite_page: {
		sourceDb:  'sitebase_web',
		target:    'appsite_page',
		pkField:   'idappsite_page',
		codeField: 'codeAppsite_page',
		dropNoise: true,
		fields: {
			nomAppsite_page: 'name',
		},
		drop: ['nomAppsite_page_type', 'codeAppsite_page_type', 'idappsite_page_type', 'idsite'],
	},

	// ── XML ───────────────────────────────────────────────────────────────────

	feed_header: {
		sourceDb:  'sitebase_xml',
		target:    'feed_header',
		pkField:   'idfeed_header',
		codeField: 'codeFeed_header',
		dropNoise: true,
		fields: {
			nomFeed_header:         'name',
			petitNomFeed_header:    'shortName',
			atoutFeed_header:       'asset',
			descriptionFeed_header: 'description',
			informationFeed_header: 'info',
			urlFeed_header:         'url',
			ordreFeed_header:       'order',
			estActifFeed_header:    'isActive',
			dateRunFeed_header:     'lastRunDate',
		},
		drop: ['nomFournisseur', 'codeFournisseur', 'Feed_header', 'm_mode', 'heureRunFeed_header'],
		fks: {
			fournisseur: { collection: 'fournisseur', from: 'idfournisseur', on: 'id' },
		},
	},

	xml_price: {
		sourceDb:  'sitebase_xml',
		target:    'xml_price',
		pkField:   'idxml_price',
		codeField: 'codeXml_price',
		dropNoise: true,
		fields: {
			nomXml_price:        'name',
			prixXml_price:       'price',
			DepartureDate:       'departureDate',
			dateDebutXml_price:  'startDate',
			SailingID:           'sailingId',
			PackageId:           'packageId',
			CruiseLine:          'cruiseLine',
			ShipCode:            'shipCode',
			Category:            'category',
			LAFPrice:            'lafPrice',
			Gateway:             'gateway',
		},
		drop: [
			'LAFSt', 'PriceProgram', 'DeckLoc', 'PrecioCabina', 'PrecioTotal', 'PriceItems',
			'MandatoryFlight', 'HotelMandatory', 'Flight', 'LAFPricePax1', 'LAFPricePax2',
			'LAFPricePax3', 'LAFPricePax4', 'LAFPricePax5', 'LAFPricePax6',
			'DepartureTax', 'PortCharges', 'Gratuities', 'SupplementFuel',
			'timeDebutXml_price',
		],
		fks: {
			produit: { collection: 'produit', from: 'idxml_cruise', on: 'id' },
		},
	},
};

export default crfrMapping;
