/**
 * Field-definition catalog (FieldList) + FK reference helper (fkRef).
 *
 * Server seed core — source of truth for field metadata (type/group/description)
 * consumed by idaeModel, schemaWalker, syncFieldList and publishModel.
 */
import type { AppSchemeField } from '../../../src/lib/types/entity-types.js';

// --- Reusable utility fields ---

/* Defaults available fields for all collections */
export const FieldList = {
	// AUDIT
	actorId:           {
		code:        'actorId',
		name:        'actor id',
		type:        'number',
		group:       'audit',
		description: 'Unique identifier of the user or system process that performed the action'
	},
	changes:           {
		code:        'changes',
		name:        'changes',
		type:        'json',
		group:       'audit',
		description: 'Detailed record of modified values comparing previous and current states'
	},
	createdBy:         {
		code:        'createdBy',
		name:        'created by',
		type:        'text',
		group:       'audit',
		description: 'Username or ID of the person who originally created this record'
	},
	details:           {
		code:        'details',
		name:        'details',
		type:        'json',
		group:       'audit',
		description: 'Additional contextual information related to the event or record'
	},
	scheme:            {
		code:        'scheme',
		name:        'collection name',
		type:        'text',
		group:       'audit',
		description: 'Internal name of the data collection or table this record belongs to'
	},
	updatedBy:         {
		code:        'updatedBy',
		name:        'updated by',
		type:        'text',
		group:       'audit',
		description: 'Username or ID of the person who last modified this record'
	},
	version:           {
		code:        'version',
		name:        'version',
		type:        'number',
		group:       'audit',
		description: 'Incremental version number used for optimistic locking and tracking'
	},

	// CLASSIFICATION
	duree:             {
		code:        'duree',
		name:        'duration',
		type:        'number',
		group:       'classification',
		description: 'Length of time or period associated with this item'
	},
	order:             {
		code:        'order',
		name:        'order',
		type:        'number',
		group:       'classification',
		description: 'Numerical value used for custom sorting in lists'
	},
	ordre:             {
		code:        'ordre',
		name:        'rank order',
		type:        'number',
		group:       'classification',
		description: 'Specific hierarchical position within a sorted group'
	},
	rang:              {
		code:        'rang',
		name:        'rank',
		type:        'number',
		group:       'classification',
		description: 'Relative level or grade assigned to this item'
	},
	type:              {
		code:        'type',
		name:        'type',
		type:        'text',
		group:       'classification',
		description: 'Category or classification of the record'
	},

	// CODIFICATION
	ccn:               {
		code:        'ccn',
		name:        'ccn',
		type:        'text',
		group:       'codification',
		description: 'Collective bargaining agreement code (Convention Collective Nationale)'
	},
	code:              {
		code:        'code',
		name:        'code',
		type:        'text',
		group:       'codification',
		description: 'Unique alphanumeric short identifier'
	},
	codeBarre:         {
		code:        'codeBarre',
		name:        'barcode',
		type:        'text',
		group:       'codification',
		description: 'Standard barcode string for scanning and identification'
	},
	codeEan:           {
		code:        'codeEan',
		name:        'ean code',
		type:        'text',
		group:       'codification',
		description: 'European Article Numbering for global product tracking'
	},
	ref:               {
		code:        'ref',
		name:        'ref',
		type:        'text',
		group:       'codification',
		description: 'Short internal reference code'
	},
	reference:         {
		code:        'reference',
		name:        'reference',
		type:        'text',
		group:       'codification',
		description: 'Official reference number or string'
	},
	slug:              {
		code:        'slug',
		name:        'slug',
		type:        'text',
		group:       'codification',
		description: 'URL-friendly version of the name or title'
	},

	// CONTACT
	email:             {
		code:        'email',
		name:        'email',
		type:        'email',
		group:       'contact',
		description: 'Main electronic mail address'
	},
	civilite:          {
		code:        'civilite',
		name:        'civility',
		type:        'text',
		group:       'contact',
		description: 'Formal title or salutation (e.g., Mr, Ms)'
	},
	fax:               {
		code:        'fax',
		name:        'fax',
		type:        'text',
		group:       'contact',
		description: 'Facsimile transmission number'
	},
	mobile:            {
		code:        'mobile',
		name:        'mobile',
		type:        'text',
		group:       'contact',
		description: 'Primary mobile or cellular phone number'
	},
	mobile2:           {
		code:        'mobile2',
		name:        'mobile 2',
		type:        'text',
		group:       'contact',
		description: 'Secondary mobile or cellular phone number'
	},
	telephone:         {
		code:        'telephone',
		name:        'phone',
		type:        'text',
		group:       'contact',
		description: 'Primary landline or contact phone number'
	},
	telephone2:        {
		code:        'telephone2',
		name:        'phone 2',
		type:        'text',
		group:       'contact',
		description: 'Secondary landline or contact phone number'
	},
	whatsapp:          {
		code:        'whatsapp',
		name:        'whatsapp',
		type:        'text',
		group:       'contact',
		description: 'WhatsApp messaging ID or phone number'
	},
	linkedin:          {
		code:        'linkedin',
		name:        'linkedin',
		type:        'url',
		group:       'contact',
		description: 'Link to public LinkedIn professional profile'
	},
	url:               {
		code:        'url',
		name:        'url',
		type:        'url',
		group:       'contact',
		description: 'Website address or external resource link'
	},

	// DATE
	date:              {
		code:        'date',
		name:        'date',
		type:        'date',
		group:       'date',
		description: 'Generic date value'
	},
	dateDebut:         {
		code:        'dateDebut',
		name:        'start date',
		type:        'date',
		group:       'date',
		description: 'Effective beginning date of an event or period'
	},
	dateFin:           {
		code:        'dateFin',
		name:        'end date',
		type:        'date',
		group:       'date',
		description: 'Expiration or completion date of an event or period'
	},
	dateInstallation:  {
		code:        'dateInstallation',
		name:        'installation date',
		type:        'date',
		group:       'date',
		description: 'Date when the equipment or service was set up'
	},
	dateQuantieme:     {
		code:        'dateQuantieme',
		name:        'day of year',
		type:        'date',
		group:       'date',
		description: 'Specific ordinal day within the calendar year'
	},
	dateCreation:      {
		code:        'dateCreation',
		name:        'creation date',
		type:        'datetime',
		group:       'date',
		description: 'Exact timestamp when the record was first stored'
	},
	dateCreated:       {
		code:        'dateCreated',
		name:        'date created',
		type:        'datetime',
		group:       'date',
		description: 'Audit date for initial record creation'
	},
	dateUpdated:       {
		code:        'dateUpdated',
		name:        'date updated',
		type:        'datetime',
		group:       'date',
		description: 'Audit date for the most recent modification'
	},
	heureCreation:     {
		code:        'heureCreation',
		name:        'creation time',
		type:        'datetime',
		group:       'date',
		description: 'Time part of the initial record creation'
	},
	timestamp:         {
		code:        'timestamp',
		name:        'timestamp',
		type:        'datetime',
		group:       'date',
		description: 'Server-generated unique time identifier'
	},
	heure:             {
		code:        'heure',
		name:        'time',
		type:        'text',
		group:       'date',
		description: 'Generic time of day'
	},
	heureDebut:        {
		code:        'heureDebut',
		name:        'start time',
		type:        'text',
		group:       'date',
		description: 'Specific time when an event begins'
	},
	heureFin:          {
		code:        'heureFin',
		name:        'end time',
		type:        'text',
		group:       'date',
		description: 'Specific time when an event ends'
	},

	// FINANCE
	bic:               {
		code:        'bic',
		name:        'bic',
		type:        'text',
		group:       'finance',
		description: 'Bank Identifier Code for international transfers'
	},
	devise:            {
		code:        'devise',
		name:        'currency',
		type:        'text',
		group:       'finance',
		description: 'Standard currency code (e.g., EUR, USD, GBP)'
	},
	iban:              {
		code:        'iban',
		name:        'iban',
		type:        'text',
		group:       'finance',
		description: 'International Bank Account Number'
	},
	marge:             {
		code:        'marge',
		name:        'margin',
		type:        'number',
		group:       'finance',
		description: 'Profit margin amount for this item'
	},
	montant:           {
		code:        'montant',
		name:        'amount',
		type:        'number',
		group:       'finance',
		description: 'General monetary value'
	},
	montantEcheance:   {
		code:        'montantEcheance',
		name:        'due amount',
		type:        'number',
		group:       'finance',
		description: 'Amount due for a specific payment deadline'
	},
	montantHt:         {
		code:        'montantHt',
		name:        'amount excl tax',
		type:        'number',
		group:       'finance',
		description: 'Monetary total excluding value added tax'
	},
	montantRachat:     {
		code:        'montantRachat',
		name:        'buyback amount',
		type:        'number',
		group:       'finance',
		description: 'Estimated or actual value for item buyback'
	},
	prix:              {
		code:        'prix',
		name:        'price',
		type:        'number',
		group:       'finance',
		description: 'Standard unit price'
	},
	prixHt:            {
		code:        'prixHt',
		name:        'price excl tax',
		type:        'number',
		group:       'finance',
		description: 'Unit price without taxes'
	},
	prixTtc:           {
		code:        'prixTtc',
		name:        'price incl tax',
		type:        'number',
		group:       'finance',
		description: 'Unit price including all taxes'
	},
	taux:              {
		code:        'taux',
		name:        'rate',
		type:        'number',
		group:       'finance',
		description: 'Interest or calculation rate percentage'
	},
	total:             {
		code:        'total',
		name:        'total',
		type:        'number',
		group:       'finance',
		description: 'Grand total amount'
	},
	totalHt:           {
		code:        'totalHt',
		name:        'total excl tax',
		type:        'number',
		group:       'finance',
		description: 'Aggregated total without taxes'
	},
	totalMarge:        {
		code:        'totalMarge',
		name:        'total margin',
		type:        'number',
		group:       'finance',
		description: 'Aggregated profit margin'
	},
	totalTtc:          {
		code:        'totalTtc',
		name:        'total incl tax',
		type:        'number',
		group:       'finance',
		description: 'Aggregated total including all taxes'
	},
	totalTva:          {
		code:        'totalTva',
		name:        'total vat',
		type:        'number',
		group:       'finance',
		description: 'Aggregated value added tax amount'
	},
	tva:               {
		code:        'tva',
		name:        'vat rate',
		type:        'number',
		group:       'finance',
		description: 'Tax percentage rate applied'
	},
	valeur:            {
		code:        'valeur',
		name:        'value',
		type:        'number',
		group:       'finance',
		description: 'Appraised or numerical value'
	},

	// IDENTIFICATION
	id:                {
		code:        'id',
		name:        'id',
		type:        'number',
		group:       'identification',
		description: 'Primary unique identifier for the record'
	},
	userName:          {
		code:        'userName',
		name:        'username',
		type:        'text',
		group:       'identification',
		description: 'Login name or handle used to identify a user'
	},

	// INVENTORY
	quantite:          {
		code:        'quantite',
		name:        'quantity',
		type:        'number',
		group:       'inventory',
		description: 'Current count or volume of items in stock'
	},

	// LOCATION
	latitude:          {
		code:        'latitude',
		name:        'latitude',
		type:        'number',
		group:       'location',
		description: 'Geographic coordinate for north-south position'
	},
	longitude:         {
		code:        'longitude',
		name:        'longitude',
		type:        'number',
		group:       'location',
		description: 'Geographic coordinate for east-west position'
	},
	adresse:           {
		code:        'adresse',
		name:        'address',
		type:        'text',
		group:       'location',
		description: 'Full street address'
	},
	codePostal:        {
		code:        'codePostal',
		name:        'zip code',
		type:        'text',
		group:       'location',
		description: 'Postal or zip code for the area'
	},
	complementAdresse: {
		code:        'complementAdresse',
		name:        'address complement',
		type:        'text',
		group:       'location',
		description: 'Additional building, floor, or suite details'
	},
	pays:              {
		code:        'pays',
		name:        'country',
		type:        'text',
		group:       'location',
		description: 'Country name or code'
	},
	ville:             {
		code:        'ville',
		name:        'city',
		type:        'text',
		group:       'location',
		description: 'Name of the city or municipality'
	},

	// METRICS
	compteurCouleur:   {
		code:        'compteurCouleur',
		name:        'color counter',
		type:        'number',
		group:       'metrics',
		description: 'Accumulated count for color-specific printing or usage'
	},
	compteurNB:        {
		code:        'compteurNB',
		name:        'bw counter',
		type:        'number',
		group:       'metrics',
		description: 'Accumulated count for black and white printing or usage'
	},
	height:            {
		code:        'height',
		name:        'height',
		type:        'number',
		group:       'metrics',
		description: 'Vertical dimension of the object'
	},
	length:            {
		code:        'length',
		name:        'length',
		type:        'number',
		group:       'metrics',
		description: 'Longest horizontal dimension of the object'
	},
	poids:             {
		code:        'poids',
		name:        'weight',
		type:        'number',
		group:       'metrics',
		description: 'Generic mass or weight of the item'
	},
	poidsBrut:         {
		code:        'poidsBrut',
		name:        'gross weight',
		type:        'number',
		group:       'metrics',
		description: 'Total weight including packaging and contents'
	},
	poidsNet:          {
		code:        'poidsNet',
		name:        'net weight',
		type:        'number',
		group:       'metrics',
		description: 'Weight of the contents alone without packaging'
	},
	size:              {
		code:        'size',
		name:        'size',
		type:        'number',
		group:       'metrics',
		description: 'General scale or size dimension'
	},
	surface:           {
		code:        'surface',
		name:        'surface',
		type:        'number',
		group:       'metrics',
		description: 'Total area coverage'
	},
	vmmCouleur:        {
		code:        'vmmCouleur',
		name:        'vmm color',
		type:        'number',
		group:       'metrics',
		description: 'Maintenance metric for color print volume'
	},
	vmmNB:             {
		code:        'vmmNB',
		name:        'vmm bw',
		type:        'number',
		group:       'metrics',
		description: 'Maintenance metric for black and white print volume'
	},
	width:             {
		code:        'width',
		name:        'width',
		type:        'number',
		group:       'metrics',
		description: 'Horizontal side-to-side dimension'
	},

	// PRESENTATION
	image:             {
		code:        'image',
		name:        'image',
		type:        'image',
		group:       'presentation',
		description: 'Primary visual representation or photograph'
	},
	imageLarge:        {
		code:        'imageLarge',
		name:        'large image',
		type:        'image',
		group:       'presentation',
		description: 'High-resolution wide-format image'
	},
	imageLong:         {
		code:        'imageLong',
		name:        'long image',
		type:        'image',
		group:       'presentation',
		description: 'Vertical or panoramic tall image format'
	},
	imageMini:         {
		code:        'imageMini',
		name:        'mini image',
		type:        'image',
		group:       'presentation',
		description: 'Small icon or preview image'
	},
	imageSquare:       {
		code:        'imageSquare',
		name:        'square image',
		type:        'image',
		group:       'presentation',
		description: '1:1 aspect ratio image'
	},
	thumbnail:         {
		code:        'thumbnail',
		name:        'thumbnail',
		type:        'image',
		group:       'presentation',
		description: 'Small compressed preview of the original image'
	},
	atout:             {
		code:        'atout',
		name:        'asset',
		type:        'text',
		group:       'presentation',
		description: 'Key benefit or specific asset value'
	},
	cccoul:            {
		code:        'cccoul',
		name:        'color code',
		type:        'text',
		group:       'presentation',
		description: 'Hexadecimal or named color reference'
	},
	color:             {
		code:        'color',
		name:        'color',
		type:        'text',
		group:       'presentation',
		description: 'Visual color attribute'
	},
	icon:              {
		code:        'icon',
		name:        'icon',
		type:        'icon',
		group:       'presentation',
		description: 'Graphical symbol name or reference'
	},
	lastName:          {
		code:        'lastName',
		name:        'last name',
		type:        'text',
		group:       'presentation',
		description: 'Family or surname'
	},
	location:      {
		code:        'location',
		name:        'location',
		type:        'text',
		group:       'location',
		description: 'gps point'
	},
	name:              {
		code:        'name',
		name:        'name',
		type:        'text',
		group:       'presentation',
		description: 'General title or label'
	},
	nom:               {
		code:        'nom',
		name:        'surname',
		type:        'text',
		group:       'presentation',
		description: 'Alternative surname or name field'
	},
	petitNom:          {
		code:        'petitNom',
		name:        'nickname',
		type:        'text',
		group:       'presentation',
		description: 'Informal or preferred name'
	},
	prenom:            {
		code:        'prenom',
		name:        'first name',
		type:        'text',
		group:       'presentation',
		description: 'Given or individual name'
	},
	resultat:          {
		code:        'resultat',
		name:        'result',
		type:        'text',
		group:       'presentation',
		description: 'The outcome or summary value of a process'
	},
	tags:              {
		code:        'tags',
		name:        'tags',
		type:        'text',
		group:       'presentation',
		description: 'Keywords or labels for grouping and search'
	},
	description:       {
		code:        'description',
		name:        'description',
		type:        'text-block',
		group:       'presentation',
		description: 'Detailed multi-line explanation or narrative'
	},
	legend:            {
		code:        'legend',
		name:        'legend',
		type:        'text-line',
		group:       'presentation',
		description: 'Brief caption or explanatory text for visuals'
	},

	// PROGRESS
	range:             {
		code:        'range',
		name:        'range',
		type:        'range',
		group:       'progress',
		description: 'Numerical interval or boundary for progress'
	},
	status:            {
		code:        'status',
		name:        'status',
		type:        'status',
		group:       'progress',
		description: 'Current state in a lifecycle or workflow'
	},

	// QUANTITY
	gramme:            {
		code:        'gramme',
		name:        'grams',
		type:        'number',
		group:       'quantity',
		description: 'Metric unit of mass (g)'
	},
	litre:             {
		code:        'litre',
		name:        'liters',
		type:        'number',
		group:       'quantity',
		description: 'Metric unit of liquid volume (L)'
	},
	metre:             {
		code:        'metre',
		name:        'meters',
		type:        'number',
		group:       'quantity',
		description: 'Metric unit of length (m)'
	},
	volume:            {
		code:        'volume',
		name:        'volume',
		type:        'number',
		group:       'quantity',
		description: 'Total space occupied by an object'
	},

	// SECURITY
	mailPassword:      {
		code:        'mailPassword',
		name:        'mail password',
		type:        'password',
		group:       'security',
		description: 'Encrypted password for email service access'
	},
	password:          {
		code:        'password',
		name:        'password',
		type:        'password',
		group:       'security',
		description: 'Secret string for account authentication'
	},
	login:             {
		code:        'login',
		name:        'login',
		type:        'text',
		group:       'security',
		description: 'Identifier used to initiate a secure session'
	},

	// STATUS
	actif:             {
		code:        'actif',
		name:        'active',
		type:        'boolean',
		group:       'status',
		description: 'Indicates if the record is currently operational and in use'
	},
	isLocked:          {
		code:        'isLocked',
		name:        'is locked',
		type:        'boolean',
		group:       'status',
		description: 'Prevents modification by unauthorized users'
	},
	isSystem:          {
		code:        'isSystem',
		name:        'is system',
		type:        'boolean',
		group:       'status',
		description: 'Flags records that are vital for system operation'
	},

	// SYSTEM
	private:           {
		code:        'private',
		name:        'private',
		type:        'boolean',
		group:       'system',
		description: 'Restricts visibility to internal or specific users'
	},
	readonly:          {
		code:        'readonly',
		name:        'read only',
		type:        'boolean',
		group:       'system',
		description: 'Specifies that the field cannot be modified by the end-user'
	},
	required:          {
		code:        'required',
		name:        'required',
		type:        'boolean',
		group:       'system',
		description: 'Mandates that this field must contain data before saving'
	},
	visible:           {
		code:        'visible',
		name:        'visible',
		type:        'boolean',
		group:       'system',
		description: "Toggles the field's presence in the user interface"
	},
	// SYNCED — auto-generated by syncFieldList.ts
	action:            {
		code:        'action',
		name:        'action',
		type:        'text',
		group:       'data',
		description: ''
	},
	appPermissions:    {
		code:        'appPermissions',
		name:        'app permissions',
		type:        'json',
		group:       'meta',
		description: ''
	},
	assignedAt:        {
		code:        'assignedAt',
		name:        'assigned at',
		type:        'datetime',
		group:       'date',
		description: ''
	},
	assignedBy:        {
		code:        'assignedBy',
		name:        'assigned by',
		type:        'number',
		group:       'data',
		description: ''
	},
	assignmentType:    {
		code:        'assignmentType',
		name:        'assignment type',
		type:        'text',
		group:       'data',
		description: ''
	},
	audio_file_path:   {
		code:        'audio_file_path',
		name:        'audio_file_path',
		type:        'text',
		group:       'data',
		description: ''
	},
	auto:              {
		code:        'auto',
		name:        'auto',
		type:        'text',
		group:       'data',
		description: ''
	},
	avatar:            {
		code:        'avatar',
		name:        'avatar',
		type:        'text',
		group:       'data',
		description: ''
	},
	avatarUrl:         {
		code:        'avatarUrl',
		name:        'avatar url',
		type:        'text',
		group:       'data',
		description: ''
	},
	base:              {
		code:        'base',
		name:        'base',
		type:        'text',
		group:       'data',
		description: ''
	},
	category:          {
		code:        'category',
		name:        'category',
		type:        'text',
		group:       'data',
		description: ''
	},
	collection:        {
		code:        'collection',
		name:        'collection',
		type:        'text',
		group:       'data',
		description: ''
	},
	collection_value:  {
		code:        'collection_value',
		name:        'collection_value',
		type:        'text',
		group:       'data',
		description: ''
	},
	collection_vars:   {
		code:        'collection_vars',
		name:        'collection_vars',
		type:        'text',
		group:       'data',
		description: ''
	},
	constraints:       {
		code:        'constraints',
		name:        'constraints',
		type:        'json',
		group:       'meta',
		description: ''
	},
	content:           {
		code:        'content',
		name:        'content',
		type:        'text',
		group:       'data',
		description: ''
	},
	context:           {
		code:        'context',
		name:        'context',
		type:        'text',
		group:       'data',
		description: ''
	},
	context_size:      {
		code:        'context_size',
		name:        'context_size',
		type:        'text',
		group:       'data',
		description: ''
	},
	count:             {
		code:        'count',
		name:        'count',
		type:        'number',
		group:       'data',
		description: ''
	},
	deviceInfo:        {
		code:        'deviceInfo',
		name:        'device info',
		type:        'json',
		group:       'meta',
		description: ''
	},
	displayName:       {
		code:        'displayName',
		name:        'display name',
		type:        'text',
		group:       'data',
		description: ''
	},
	emailVerified:     {
		code:        'emailVerified',
		name:        'email verified',
		type:        'boolean',
		group:       'flags',
		description: ''
	},
	endpoint:          {
		code:        'endpoint',
		name:        'endpoint',
		type:        'text',
		group:       'data',
		description: ''
	},
	error:             {
		code:        'error',
		name:        'error',
		type:        'text',
		group:       'data',
		description: ''
	},
	expiresAt:         {
		code:        'expiresAt',
		name:        'expires at',
		type:        'datetime',
		group:       'date',
		description: ''
	},
	failedLoginCount:  {
		code:        'failedLoginCount',
		name:        'failed login count',
		type:        'number',
		group:       'data',
		description: ''
	},
	failureReason:     {
		code:        'failureReason',
		name:        'failure reason',
		type:        'text',
		group:       'data',
		description: ''
	},
	firstName:         {
		code:        'firstName',
		name:        'first name',
		type:        'text',
		group:       'data',
		description: ''
	},
	fit:               {
		code:        'fit',
		name:        'fit',
		type:        'text',
		group:       'data',
		description: ''
	},
	format:            {
		code:        'format',
		name:        'format',
		type:        'text',
		group:       'data',
		description: ''
	},
	grantType:         {
		code:        'grantType',
		name:        'grant type',
		type:        'text',
		group:       'data',
		description: ''
	},
	grantedAt:         {
		code:        'grantedAt',
		name:        'granted at',
		type:        'datetime',
		group:       'date',
		description: ''
	},
	grantedBy:         {
		code:        'grantedBy',
		name:        'granted by',
		type:        'number',
		group:       'data',
		description: ''
	},
	hook_log:          {
		code:        'hook_log',
		name:        'hook_log',
		type:        'text',
		group:       'data',
		description: ''
	},
	hooks:             {
		code:        'hooks',
		name:        'hooks',
		type:        'text',
		group:       'data',
		description: ''
	},
	images:            {
		code:        'images',
		name:        'images',
		type:        'text',
		group:       'data',
		description: ''
	},
	ipAddress:         {
		code:        'ipAddress',
		name:        'ip address',
		type:        'text',
		group:       'data',
		description: ''
	},
	isActive:          {
		code:        'isActive',
		name:        'is active',
		type:        'boolean',
		group:       'flags',
		description: ''
	},
	isGroup:           {
		code:        'isGroup',
		name:        'is group',
		type:        'boolean',
		group:       'flags',
		description: ''
	},
	isPrimary:         {
		code:        'isPrimary',
		name:        'is primary',
		type:        'boolean',
		group:       'flags',
		description: ''
	},
	isRevoked:         {
		code:        'isRevoked',
		name:        'is revoked',
		type:        'boolean',
		group:       'flags',
		description: ''
	},
	isStatus:          {
		code:        'isStatus',
		name:        'is status',
		type:        'boolean',
		group:       'flags',
		description: ''
	},
	isType:            {
		code:        'isType',
		name:        'is type',
		type:        'boolean',
		group:       'flags',
		description: ''
	},
	is_active:         {
		code:        'is_active',
		name:        'is_active',
		type:        'boolean',
		group:       'flags',
		description: ''
	},
	is_locked:         {
		code:        'is_locked',
		name:        'is_locked',
		type:        'boolean',
		group:       'flags',
		description: ''
	},
	keyPath:           {
		code:        'keyPath',
		name:        'key path',
		type:        'text',
		group:       'data',
		description: ''
	},
	label:             {
		code:        'label',
		name:        'label',
		type:        'text',
		group:       'data',
		description: ''
	},
	lastActivityAt:    {
		code:        'lastActivityAt',
		name:        'last activity at',
		type:        'datetime',
		group:       'date',
		description: ''
	},
	lastLoginAt:       {
		code:        'lastLoginAt',
		name:        'last login at',
		type:        'datetime',
		group:       'date',
		description: ''
	},
	lastLoginIp:       {
		code:        'lastLoginIp',
		name:        'last login ip',
		type:        'text',
		group:       'data',
		description: ''
	},
	lastSeen:          {
		code:        'lastSeen',
		name:        'last seen',
		type:        'text',
		group:       'data',
		description: ''
	},
	locale:            {
		code:        'locale',
		name:        'locale',
		type:        'text',
		group:       'data',
		description: ''
	},
	lockedUntil:       {
		code:        'lockedUntil',
		name:        'locked until',
		type:        'datetime',
		group:       'date',
		description: ''
	},
	max_tokens:        {
		code:        'max_tokens',
		name:        'max_tokens',
		type:        'number',
		group:       'data',
		description: ''
	},
	model:             {
		code:        'model',
		name:        'model',
		type:        'text',
		group:       'data',
		description: ''
	},
	mood:              {
		code:        'mood',
		name:        'mood',
		type:        'text',
		group:       'data',
		description: ''
	},
	mustChangePassword:{
		code:        'mustChangePassword',
		name:        'must change password',
		type:        'boolean',
		group:       'flags',
		description: ''
	},
	operation:         {
		code:        'operation',
		name:        'operation',
		type:        'text',
		group:       'data',
		description: ''
	},
	options:           {
		code:        'options',
		name:        'options',
		type:        'json',
		group:       'meta',
		description: ''
	},
	passwordHash:      {
		code:        'passwordHash',
		name:        'password hash',
		type:        'password',
		group:       'security',
		description: ''
	},
	performedAt:       {
		code:        'performedAt',
		name:        'performed at',
		type:        'datetime',
		group:       'date',
		description: ''
	},
	phone:             {
		code:        'phone',
		name:        'phone',
		type:        'text',
		group:       'data',
		description: ''
	},
	preferences:       {
		code:        'preferences',
		name:        'preferences',
		type:        'json',
		group:       'meta',
		description: ''
	},
	quality:           {
		code:        'quality',
		name:        'quality',
		type:        'text',
		group:       'data',
		description: ''
	},
	rated_at:          {
		code:        'rated_at',
		name:        'rated_at',
		type:        'text',
		group:       'data',
		description: ''
	},
	rating:            {
		code:        'rating',
		name:        'rating',
		type:        'number',
		group:       'data',
		description: ''
	},
	refreshToken:      {
		code:        'refreshToken',
		name:        'refresh token',
		type:        'text',
		group:       'data',
		description: ''
	},
	resourceId:        {
		code:        'resourceId',
		name:        'resource id',
		type:        'number',
		group:       'data',
		description: ''
	},
	resourceType:      {
		code:        'resourceType',
		name:        'resource type',
		type:        'text',
		group:       'data',
		description: ''
	},
	revocationReason:  {
		code:        'revocationReason',
		name:        'revocation reason',
		type:        'text',
		group:       'data',
		description: ''
	},
	revokedAt:         {
		code:        'revokedAt',
		name:        'revoked at',
		type:        'datetime',
		group:       'date',
		description: ''
	},
	revokedBy:         {
		code:        'revokedBy',
		name:        'revoked by',
		type:        'number',
		group:       'data',
		description: ''
	},
	role:              {
		code:        'role',
		name:        'role',
		type:        'text',
		group:       'data',
		description: ''
	},
	scope:             {
		code:        'scope',
		name:        'scope',
		type:        'text',
		group:       'data',
		description: ''
	},
	sentiment:         {
		code:        'sentiment',
		name:        'sentiment',
		type:        'text',
		group:       'data',
		description: ''
	},
	sessionId:         {
		code:        'sessionId',
		name:        'session id',
		type:        'number',
		group:       'data',
		description: ''
	},
	sessionToken:      {
		code:        'sessionToken',
		name:        'session token',
		type:        'text',
		group:       'data',
		description: ''
	},
	skill_invoked:     {
		code:        'skill_invoked',
		name:        'skill_invoked',
		type:        'text',
		group:       'data',
		description: ''
	},
	skills:            {
		code:        'skills',
		name:        'skills',
		type:        'text',
		group:       'data',
		description: ''
	},
	specialization:    {
		code:        'specialization',
		name:        'specialization',
		type:        'text',
		group:       'data',
		description: ''
	},
	startedAt:         {
		code:        'startedAt',
		name:        'started at',
		type:        'datetime',
		group:       'date',
		description: ''
	},
	system_prompt:     {
		code:        'system_prompt',
		name:        'system_prompt',
		type:        'text',
		group:       'data',
		description: ''
	},
	temperature:       {
		code:        'temperature',
		name:        'temperature',
		type:        'text',
		group:       'data',
		description: ''
	},
	timezone:          {
		code:        'timezone',
		name:        'timezone',
		type:        'text',
		group:       'data',
		description: ''
	},
	title:             {
		code:        'title',
		name:        'title',
		type:        'text',
		group:       'data',
		description: ''
	},
	token_count:       {
		code:        'token_count',
		name:        'token_count',
		type:        'number',
		group:       'data',
		description: ''
	},
	tokens:            {
		code:        'tokens',
		name:        'tokens',
		type:        'text',
		group:       'data',
		description: ''
	},
	typeLevel:         {
		code:        'typeLevel',
		name:        'type level',
		type:        'text',
		group:       'data',
		description: ''
	},
	urls:              {
		code:        'urls',
		name:        'urls',
		type:        'text',
		group:       'data',
		description: ''
	},
	userAgent:         {
		code:        'userAgent',
		name:        'user agent',
		type:        'text',
		group:       'data',
		description: ''
	},
	validFrom:         {
		code:        'validFrom',
		name:        'valid from',
		type:        'datetime',
		group:       'date',
		description: ''
	},
	validUntil:        {
		code:        'validUntil',
		name:        'valid until',
		type:        'datetime',
		group:       'date',
		description: ''
	},
	value:             {
		code:        'value',
		name:        'value',
		type:        'text',
		group:       'data',
		description: ''
	},
	voice_id:          {
		code:        'voice_id',
		name:        'voice_id',
		type:        'text',
		group:       'data',
		description: ''
	},
	voice_style:       {
		code:        'voice_style',
		name:        'voice_style',
		type:        'text',
		group:       'data',
		description: ''
	},
	voice_tone:        {
		code:        'voice_tone',
		name:        'voice_tone',
		type:        'text',
		group:       'data',
		description: ''
	},
	c:                 {
		code:        'c',
		name:        'c',
		type:        'boolean',
		group:       'rbac',
		description: ''
	},
	d:                 {
		code:        'd',
		name:        'd',
		type:        'boolean',
		group:       'rbac',
		description: ''
	},
	l:                 {
		code:        'l',
		name:        'l',
		type:        'boolean',
		group:       'rbac',
		description: ''
	},
	r:                 {
		code:        'r',
		name:        'r',
		type:        'boolean',
		group:       'rbac',
		description: ''
	},
	u:                 {
		code:        'u',
		name:        'u',
		type:        'boolean',
		group:       'rbac',
		description: ''
	},
	x:                 {
		code:        'x',
		name:        'x',
		type:        'boolean',
		group:       'rbac',
		description: ''
	},
} as const satisfies Record<string, Partial<AppSchemeField>>;

/**
 * Helper to generate FK reference objects for fks.
 * Centralizes the creation of FK references to avoid duplication.
 */
export interface FkRef {
	id:       number;
	code:     string;
	name:     string;
	icon:     string;
	color:    string;
	order:    number;
	multiple: boolean;
	required: boolean;
}

/**
 * Build a FK reference object. `id` is required — call embedFk() instead
 * when you only have a code and need to resolve/create the id from the DB.
 */
export function buildFkRef(overrides: { id: number; code: string; name: string } & Partial<Omit<FkRef, 'id' | 'code' | 'name'>>): FkRef {
	return {
		id:       overrides.id,
		code:     overrides.code,
		name:     overrides.name,
		icon:     overrides.icon ?? 'link',
		color:    overrides.color ?? '#888',
		order:    overrides.order ?? 0,
		multiple: overrides.multiple ?? false,
		required: overrides.required ?? false,
	};
}
