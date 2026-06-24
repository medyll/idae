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

	// --- BL-25 Added Fields (v2 — real types from model scan) ---
	Libelle_acheminement:{
		code:        'Libelle_acheminement',
		name:        'libelle Acheminement',
		type:        'text',
		group:       'data',
		description: ''
	},
	N_ID:              {
		code:        'N_ID',
		name:        'n id',
		type:        'text',
		group:       'data',
		description: ''
	},
	PHPSESSID:         {
		code:        'PHPSESSID',
		name:        'phpsessid',
		type:        'text',
		group:       'data',
		description: ''
	},
	aa_partie_code:    {
		code:        'aa_partie_code',
		name:        'aa Partie Code',
		type:        'text',
		group:       'data',
		description: ''
	},
	aa_partie_n_id:    {
		code:        'aa_partie_n_id',
		name:        'aa Partie N Id',
		type:        'text',
		group:       'data',
		description: ''
	},
	aa_partie_site_n_id:{
		code:        'aa_partie_site_n_id',
		name:        'aa Partie Site N Id',
		type:        'text',
		group:       'data',
		description: ''
	},
	acceptance_criteria:{
		code:        'acceptance_criteria',
		name:        'acceptance Criteria',
		type:        'text-lg',
		group:       'data',
		description: ''
	},
	accepts_marketing: {
		code:        'accepts_marketing',
		name:        'accepts Marketing',
		type:        'boolean',
		group:       'flags',
		description: ''
	},
	accepts_new_patients:{
		code:        'accepts_new_patients',
		name:        'accepts New Patients',
		type:        'boolean',
		group:       'flags',
		description: ''
	},
	account_number:    {
		code:        'account_number',
		name:        'account Number',
		type:        'text',
		group:       'data',
		description: ''
	},
	acked_at:          {
		code:        'acked_at',
		name:        'acked At',
		type:        'date',
		group:       'date',
		description: ''
	},
	acknowledged_at:   {
		code:        'acknowledged_at',
		name:        'acknowledged At',
		type:        'date',
		group:       'date',
		description: ''
	},
	acquisition_date:  {
		code:        'acquisition_date',
		name:        'acquisition Date',
		type:        'date',
		group:       'date',
		description: ''
	},
	actifAgent:        {
		code:        'actifAgent',
		name:        'actif agent',
		type:        'text',
		group:       'data',
		description: ''
	},
	actifLivreur:      {
		code:        'actifLivreur',
		name:        'actif livreur',
		type:        'text',
		group:       'data',
		description: ''
	},
	actifProduit:      {
		code:        'actifProduit',
		name:        'actif produit',
		type:        'text',
		group:       'data',
		description: ''
	},
	actifShop:         {
		code:        'actifShop',
		name:        'actif shop',
		type:        'text',
		group:       'data',
		description: ''
	},
	actifShop_jours:   {
		code:        'actifShop_jours',
		name:        'actifshop Jours',
		type:        'text',
		group:       'data',
		description: ''
	},
	actifShop_jours_shift:{
		code:        'actifShop_jours_shift',
		name:        'actifshop Jours Shift',
		type:        'text',
		group:       'data',
		description: ''
	},
	active:            {
		code:        'active',
		name:        'active',
		type:        'boolean',
		group:       'flags',
		description: ''
	},
	actual_behavior:   {
		code:        'actual_behavior',
		name:        'actual Behavior',
		type:        'text-lg',
		group:       'data',
		description: ''
	},
	actual_check_out:  {
		code:        'actual_check_out',
		name:        'actual Check Out',
		type:        'date',
		group:       'date',
		description: ''
	},
	actual_end:        {
		code:        'actual_end',
		name:        'actual End',
		type:        'date',
		group:       'date',
		description: ''
	},
	actual_hours:      {
		code:        'actual_hours',
		name:        'actual Hours',
		type:        'number',
		group:       'data',
		description: ''
	},
	actual_minutes:    {
		code:        'actual_minutes',
		name:        'actual Minutes',
		type:        'number',
		group:       'data',
		description: ''
	},
	actual_start:      {
		code:        'actual_start',
		name:        'actual Start',
		type:        'date',
		group:       'date',
		description: ''
	},
	ad_supported:      {
		code:        'ad_supported',
		name:        'ad Supported',
		type:        'boolean',
		group:       'flags',
		description: ''
	},
	added_at:          {
		code:        'added_at',
		name:        'added At',
		type:        'date',
		group:       'date',
		description: ''
	},
	address:           {
		code:        'address',
		name:        'address',
		type:        'text',
		group:       'data',
		description: ''
	},
	address2:          {
		code:        'address2',
		name:        'address2',
		type:        'text',
		group:       'data',
		description: ''
	},
	adeli_number:      {
		code:        'adeli_number',
		name:        'adeli Number',
		type:        'text',
		group:       'data',
		description: ''
	},
	adjectifContinent: {
		code:        'adjectifContinent',
		name:        'adjectif continent',
		type:        'text',
		group:       'data',
		description: ''
	},
	adjectifDestination:{
		code:        'adjectifDestination',
		name:        'adjectif destination',
		type:        'text',
		group:       'data',
		description: ''
	},
	adjectifPays:      {
		code:        'adjectifPays',
		name:        'adjectif pays',
		type:        'text',
		group:       'data',
		description: ''
	},
	adjective:         {
		code:        'adjective',
		name:        'adjective',
		type:        'text',
		group:       'data',
		description: ''
	},
	adresse2:          {
		code:        'adresse2',
		name:        'adresse2',
		type:        'text',
		group:       'data',
		description: ''
	},
	adresse3:          {
		code:        'adresse3',
		name:        'adresse3',
		type:        'text',
		group:       'data',
		description: ''
	},
	adultCount:        {
		code:        'adultCount',
		name:        'adult count',
		type:        'number',
		group:       'data',
		description: ''
	},
	adults:            {
		code:        'adults',
		name:        'adults',
		type:        'number',
		group:       'data',
		description: ''
	},
	air_date:          {
		code:        'air_date',
		name:        'air Date',
		type:        'date',
		group:       'date',
		description: ''
	},
	aisle:             {
		code:        'aisle',
		name:        'aisle',
		type:        'text',
		group:       'data',
		description: ''
	},
	alias:             {
		code:        'alias',
		name:        'alias',
		type:        'text',
		group:       'data',
		description: ''
	},
	aliases:           {
		code:        'aliases',
		name:        'aliases',
		type:        'text-lg',
		group:       'data',
		description: ''
	},
	allergies:         {
		code:        'allergies',
		name:        'allergies',
		type:        'text-lg',
		group:       'data',
		description: ''
	},
	alt:               {
		code:        'alt',
		name:        'alt',
		type:        'text',
		group:       'data',
		description: ''
	},
	altName:           {
		code:        'altName',
		name:        'alt name',
		type:        'text',
		group:       'data',
		description: ''
	},
	altTransportName:  {
		code:        'altTransportName',
		name:        'alt transport name',
		type:        'text',
		group:       'data',
		description: ''
	},
	amount:            {
		code:        'amount',
		name:        'amount',
		type:        'currency',
		group:       'pricing',
		description: ''
	},
	amount_paid:       {
		code:        'amount_paid',
		name:        'amount Paid',
		type:        'currency',
		group:       'pricing',
		description: ''
	},
	angle:             {
		code:        'angle',
		name:        'angle',
		type:        'text',
		group:       'data',
		description: ''
	},
	annual_premium:    {
		code:        'annual_premium',
		name:        'annual Premium',
		type:        'currency',
		group:       'pricing',
		description: ''
	},
	arrivalCityName:   {
		code:        'arrivalCityName',
		name:        'arrival city name',
		type:        'text',
		group:       'data',
		description: ''
	},
	asset:             {
		code:        'asset',
		name:        'asset',
		type:        'text',
		group:       'data',
		description: ''
	},
	assigned_at:       {
		code:        'assigned_at',
		name:        'assigned At',
		type:        'date',
		group:       'date',
		description: ''
	},
	assigned_to:       {
		code:        'assigned_to',
		name:        'assigned To',
		type:        'text',
		group:       'data',
		description: ''
	},
	at:                {
		code:        'at',
		name:        'at',
		type:        'datetime',
		group:       'date',
		description: ''
	},
	attachment:        {
		code:        'attachment',
		name:        'attachment',
		type:        'url',
		group:       'contact',
		description: ''
	},
	attentePreparation:{
		code:        'attentePreparation',
		name:        'attente preparation',
		type:        'text',
		group:       'data',
		description: ''
	},
	audioLanes:        {
		code:        'audioLanes',
		name:        'audio lanes',
		type:        'text',
		group:       'data',
		description: ''
	},
	audio_reactive_param:{
		code:        'audio_reactive_param',
		name:        'audio Reactive Param',
		type:        'text',
		group:       'data',
		description: ''
	},
	audio_reactive_strength:{
		code:        'audio_reactive_strength',
		name:        'audio Reactive Strength',
		type:        'number',
		group:       'data',
		description: ''
	},
	audio_reactive_target:{
		code:        'audio_reactive_target',
		name:        'audio Reactive Target',
		type:        'text',
		group:       'data',
		description: ''
	},
	author_email:      {
		code:        'author_email',
		name:        'author Email',
		type:        'email',
		group:       'contact',
		description: ''
	},
	author_name:       {
		code:        'author_name',
		name:        'author Name',
		type:        'text',
		group:       'data',
		description: ''
	},
	author_url:        {
		code:        'author_url',
		name:        'author Url',
		type:        'url',
		group:       'contact',
		description: ''
	},
	avail_date:        {
		code:        'avail_date',
		name:        'avail Date',
		type:        'date',
		group:       'date',
		description: ''
	},
	available:         {
		code:        'available',
		name:        'available',
		type:        'boolean',
		group:       'flags',
		description: ''
	},
	available_rooms:   {
		code:        'available_rooms',
		name:        'available Rooms',
		type:        'number',
		group:       'data',
		description: ''
	},
	avg_score:         {
		code:        'avg_score',
		name:        'avg Score',
		type:        'number',
		group:       'data',
		description: ''
	},
	avg_value:         {
		code:        'avg_value',
		name:        'avg Value',
		type:        'number',
		group:       'data',
		description: ''
	},
	backdrop:          {
		code:        'backdrop',
		name:        'backdrop',
		type:        'image',
		group:       'data',
		description: ''
	},
	balance:           {
		code:        'balance',
		name:        'balance',
		type:        'currency',
		group:       'pricing',
		description: ''
	},
	banner:            {
		code:        'banner',
		name:        'banner',
		type:        'image',
		group:       'data',
		description: ''
	},
	barcode:           {
		code:        'barcode',
		name:        'barcode',
		type:        'text',
		group:       'data',
		description: ''
	},
	base_cost:         {
		code:        'base_cost',
		name:        'base Cost',
		type:        'currency',
		group:       'pricing',
		description: ''
	},
	base_rate:         {
		code:        'base_rate',
		name:        'base Rate',
		type:        'currency',
		group:       'pricing',
		description: ''
	},
	battery_pct:       {
		code:        'battery_pct',
		name:        'battery Pct',
		type:        'number',
		group:       'data',
		description: ''
	},
	bgColor:           {
		code:        'bgColor',
		name:        'bg color',
		type:        'text',
		group:       'data',
		description: ''
	},
	billing_cycle:     {
		code:        'billing_cycle',
		name:        'billing Cycle',
		type:        'text',
		group:       'data',
		description: ''
	},
	bin:               {
		code:        'bin',
		name:        'bin',
		type:        'text',
		group:       'data',
		description: ''
	},
	bio:               {
		code:        'bio',
		name:        'bio',
		type:        'text-lg',
		group:       'data',
		description: ''
	},
	birth_date:        {
		code:        'birth_date',
		name:        'birth Date',
		type:        'date',
		group:       'date',
		description: ''
	},
	birth_place:       {
		code:        'birth_place',
		name:        'birth Place',
		type:        'text',
		group:       'data',
		description: ''
	},
	birth_year:        {
		code:        'birth_year',
		name:        'birth Year',
		type:        'number',
		group:       'data',
		description: ''
	},
	bitrate_kbps:      {
		code:        'bitrate_kbps',
		name:        'bitrate Kbps',
		type:        'number',
		group:       'data',
		description: ''
	},
	blood_pressure_dia:{
		code:        'blood_pressure_dia',
		name:        'blood Pressure Dia',
		type:        'number',
		group:       'data',
		description: ''
	},
	blood_pressure_sys:{
		code:        'blood_pressure_sys',
		name:        'blood Pressure Sys',
		type:        'number',
		group:       'data',
		description: ''
	},
	blood_type:        {
		code:        'blood_type',
		name:        'blood Type',
		type:        'text',
		group:       'data',
		description: ''
	},
	bmi:               {
		code:        'bmi',
		name:        'bmi',
		type:        'number',
		group:       'data',
		description: ''
	},
	body:              {
		code:        'body',
		name:        'body',
		type:        'text-lg',
		group:       'data',
		description: ''
	},
	booked_at:         {
		code:        'booked_at',
		name:        'booked At',
		type:        'date',
		group:       'date',
		description: ''
	},
	booked_online:     {
		code:        'booked_online',
		name:        'booked Online',
		type:        'boolean',
		group:       'flags',
		description: ''
	},
	booked_rooms:      {
		code:        'booked_rooms',
		name:        'booked Rooms',
		type:        'number',
		group:       'data',
		description: ''
	},
	booking_number:    {
		code:        'booking_number',
		name:        'booking Number',
		type:        'text',
		group:       'data',
		description: ''
	},
	brand:             {
		code:        'brand',
		name:        'brand',
		type:        'text',
		group:       'data',
		description: ''
	},
	breed:             {
		code:        'breed',
		name:        'breed',
		type:        'text',
		group:       'data',
		description: ''
	},
	bucket:            {
		code:        'bucket',
		name:        'bucket',
		type:        'text',
		group:       'data',
		description: ''
	},
	bucket_start:      {
		code:        'bucket_start',
		name:        'bucket Start',
		type:        'date',
		group:       'date',
		description: ''
	},
	budget:            {
		code:        'budget',
		name:        'budget',
		type:        'currency',
		group:       'pricing',
		description: ''
	},
	bumped_at:         {
		code:        'bumped_at',
		name:        'bumped At',
		type:        'date',
		group:       'date',
		description: ''
	},
	calibration_offset:{
		code:        'calibration_offset',
		name:        'calibration Offset',
		type:        'number',
		group:       'data',
		description: ''
	},
	calories:          {
		code:        'calories',
		name:        'calories',
		type:        'number',
		group:       'data',
		description: ''
	},
	camera_pan_x:      {
		code:        'camera_pan_x',
		name:        'camera Pan X',
		type:        'number',
		group:       'data',
		description: ''
	},
	camera_pan_y:      {
		code:        'camera_pan_y',
		name:        'camera Pan Y',
		type:        'number',
		group:       'data',
		description: ''
	},
	camera_tilt:       {
		code:        'camera_tilt',
		name:        'camera Tilt',
		type:        'number',
		group:       'data',
		description: ''
	},
	camera_zoom:       {
		code:        'camera_zoom',
		name:        'camera Zoom',
		type:        'number',
		group:       'data',
		description: ''
	},
	can_pickup:        {
		code:        'can_pickup',
		name:        'can Pickup',
		type:        'boolean',
		group:       'flags',
		description: ''
	},
	cancellation_policy:{
		code:        'cancellation_policy',
		name:        'cancellation Policy',
		type:        'text-lg',
		group:       'data',
		description: ''
	},
	cancelled:         {
		code:        'cancelled',
		name:        'cancelled',
		type:        'boolean',
		group:       'flags',
		description: ''
	},
	cancelled_at:      {
		code:        'cancelled_at',
		name:        'cancelled At',
		type:        'date',
		group:       'date',
		description: ''
	},
	capacity:          {
		code:        'capacity',
		name:        'capacity',
		type:        'number',
		group:       'data',
		description: ''
	},
	capacity_hours_day:{
		code:        'capacity_hours_day',
		name:        'capacity Hours Day',
		type:        'number',
		group:       'data',
		description: ''
	},
	capacity_hours_week:{
		code:        'capacity_hours_week',
		name:        'capacity Hours Week',
		type:        'number',
		group:       'data',
		description: ''
	},
	capacity_points:   {
		code:        'capacity_points',
		name:        'capacity Points',
		type:        'number',
		group:       'data',
		description: ''
	},
	caption:           {
		code:        'caption',
		name:        'caption',
		type:        'text-lg',
		group:       'data',
		description: ''
	},
	career_earnings:   {
		code:        'career_earnings',
		name:        'career Earnings',
		type:        'currency',
		group:       'pricing',
		description: ''
	},
	career_runs:       {
		code:        'career_runs',
		name:        'career Runs',
		type:        'number',
		group:       'data',
		description: ''
	},
	career_starts:     {
		code:        'career_starts',
		name:        'career Starts',
		type:        'number',
		group:       'data',
		description: ''
	},
	career_wins:       {
		code:        'career_wins',
		name:        'career Wins',
		type:        'number',
		group:       'data',
		description: ''
	},
	carrier:           {
		code:        'carrier',
		name:        'carrier',
		type:        'text',
		group:       'data',
		description: ''
	},
	cart_adresse:      {
		code:        'cart_adresse',
		name:        'cart Adresse',
		type:        'text',
		group:       'data',
		description: ''
	},
	cart_id:           {
		code:        'cart_id',
		name:        'cart Id',
		type:        'text',
		group:       'data',
		description: ''
	},
	cart_lines:        {
		code:        'cart_lines',
		name:        'cart Lines',
		type:        'text',
		group:       'data',
		description: ''
	},
	cart_sous_total:   {
		code:        'cart_sous_total',
		name:        'cart Sous Total',
		type:        'currency',
		group:       'pricing',
		description: ''
	},
	cart_total:        {
		code:        'cart_total',
		name:        'cart Total',
		type:        'currency',
		group:       'pricing',
		description: ''
	},
	cart_total_time:   {
		code:        'cart_total_time',
		name:        'cart Total Time',
		type:        'text',
		group:       'data',
		description: ''
	},
	cart_total_volume: {
		code:        'cart_total_volume',
		name:        'cart Total Volume',
		type:        'text',
		group:       'data',
		description: ''
	},
	changelog:         {
		code:        'changelog',
		name:        'changelog',
		type:        'text-lg',
		group:       'data',
		description: ''
	},
	channel:           {
		code:        'channel',
		name:        'channel',
		type:        'text',
		group:       'data',
		description: ''
	},
	character_name:    {
		code:        'character_name',
		name:        'character Name',
		type:        'text',
		group:       'data',
		description: ''
	},
	charged_at:        {
		code:        'charged_at',
		name:        'charged At',
		type:        'date',
		group:       'date',
		description: ''
	},
	charged_to_customer:{
		code:        'charged_to_customer',
		name:        'charged To Customer',
		type:        'boolean',
		group:       'flags',
		description: ''
	},
	check_in:          {
		code:        'check_in',
		name:        'check In',
		type:        'date',
		group:       'date',
		description: ''
	},
	check_in_time:     {
		code:        'check_in_time',
		name:        'check In Time',
		type:        'text',
		group:       'data',
		description: ''
	},
	check_out:         {
		code:        'check_out',
		name:        'check Out',
		type:        'date',
		group:       'date',
		description: ''
	},
	check_out_time:    {
		code:        'check_out_time',
		name:        'check Out Time',
		type:        'text',
		group:       'data',
		description: ''
	},
	checked_at:        {
		code:        'checked_at',
		name:        'checked At',
		type:        'date',
		group:       'date',
		description: ''
	},
	checked_in_at:     {
		code:        'checked_in_at',
		name:        'checked In At',
		type:        'date',
		group:       'date',
		description: ''
	},
	checked_out_at:    {
		code:        'checked_out_at',
		name:        'checked Out At',
		type:        'date',
		group:       'date',
		description: ''
	},
	checkpoint:        {
		code:        'checkpoint',
		name:        'checkpoint',
		type:        'text',
		group:       'data',
		description: ''
	},
	checksum:          {
		code:        'checksum',
		name:        'checksum',
		type:        'text',
		group:       'data',
		description: ''
	},
	chief_complaint:   {
		code:        'chief_complaint',
		name:        'chief Complaint',
		type:        'text-lg',
		group:       'data',
		description: ''
	},
	childCount:        {
		code:        'childCount',
		name:        'child count',
		type:        'number',
		group:       'data',
		description: ''
	},
	children:          {
		code:        'children',
		name:        'children',
		type:        'number',
		group:       'data',
		description: ''
	},
	chronic_conditions:{
		code:        'chronic_conditions',
		name:        'chronic Conditions',
		type:        'text-lg',
		group:       'data',
		description: ''
	},
	city:              {
		code:        'city',
		name:        'city',
		type:        'text',
		group:       'data',
		description: ''
	},
	cityDescription:   {
		code:        'cityDescription',
		name:        'city description',
		type:        'text',
		group:       'data',
		description: ''
	},
	cityLatitude:      {
		code:        'cityLatitude',
		name:        'city latitude',
		type:        'text',
		group:       'data',
		description: ''
	},
	cityLongitude:     {
		code:        'cityLongitude',
		name:        'city longitude',
		type:        'text',
		group:       'data',
		description: ''
	},
	cityOrder:         {
		code:        'cityOrder',
		name:        'city order',
		type:        'text',
		group:       'data',
		description: ''
	},
	class_avg:         {
		code:        'class_avg',
		name:        'class Avg',
		type:        'number',
		group:       'data',
		description: ''
	},
	closed:            {
		code:        'closed',
		name:        'closed',
		type:        'boolean',
		group:       'flags',
		description: ''
	},
	closed_at:         {
		code:        'closed_at',
		name:        'closed At',
		type:        'date',
		group:       'date',
		description: ''
	},
	closing_balance:   {
		code:        'closing_balance',
		name:        'closing Balance',
		type:        'currency',
		group:       'pricing',
		description: ''
	},
	cloth_number:      {
		code:        'cloth_number',
		name:        'cloth Number',
		type:        'number',
		group:       'data',
		description: ''
	},
	coat_color:        {
		code:        'coat_color',
		name:        'coat Color',
		type:        'text',
		group:       'data',
		description: ''
	},
	code_auto:         {
		code:        'code_auto',
		name:        'code Auto',
		type:        'text',
		group:       'data',
		description: ''
	},
	codec:             {
		code:        'codec',
		name:        'codec',
		type:        'text',
		group:       'data',
		description: ''
	},
	coefficient:       {
		code:        'coefficient',
		name:        'coefficient',
		type:        'number',
		group:       'data',
		description: ''
	},
	collection_count:  {
		code:        'collection_count',
		name:        'collection Count',
		type:        'number',
		group:       'data',
		description: ''
	},
	color_image:       {
		code:        'color_image',
		name:        'color Image',
		type:        'image',
		group:       'data',
		description: ''
	},
	color_palette:     {
		code:        'color_palette',
		name:        'color Palette',
		type:        'text',
		group:       'data',
		description: ''
	},
	comment:           {
		code:        'comment',
		name:        'comment',
		type:        'text-lg',
		group:       'data',
		description: ''
	},
	commentaire:       {
		code:        'commentaire',
		name:        'commentaire',
		type:        'text',
		group:       'data',
		description: ''
	},
	commentaireStatut_tache:{
		code:        'commentaireStatut_tache',
		name:        'commentairestatut Tache',
		type:        'text',
		group:       'data',
		description: ''
	},
	commentaireType_suivi:{
		code:        'commentaireType_suivi',
		name:        'commentairetype Suivi',
		type:        'text',
		group:       'data',
		description: ''
	},
	commentaireType_tache:{
		code:        'commentaireType_tache',
		name:        'commentairetype Tache',
		type:        'text',
		group:       'data',
		description: ''
	},
	commercialEmail:   {
		code:        'commercialEmail',
		name:        'commercial email',
		type:        'email',
		group:       'contact',
		description: ''
	},
	commission:        {
		code:        'commission',
		name:        'commission',
		type:        'text',
		group:       'data',
		description: ''
	},
	commission_pct:    {
		code:        'commission_pct',
		name:        'commission Pct',
		type:        'number',
		group:       'data',
		description: ''
	},
	company:           {
		code:        'company',
		name:        'company',
		type:        'text',
		group:       'data',
		description: ''
	},
	compare_at_price:  {
		code:        'compare_at_price',
		name:        'compare At Price',
		type:        'currency',
		group:       'pricing',
		description: ''
	},
	completed:         {
		code:        'completed',
		name:        'completed',
		type:        'boolean',
		group:       'flags',
		description: ''
	},
	completed_at:      {
		code:        'completed_at',
		name:        'completed At',
		type:        'date',
		group:       'date',
		description: ''
	},
	conditions:        {
		code:        'conditions',
		name:        'conditions',
		type:        'text-lg',
		group:       'data',
		description: ''
	},
	confirmed_at:      {
		code:        'confirmed_at',
		name:        'confirmed At',
		type:        'date',
		group:       'date',
		description: ''
	},
	consulted_at:      {
		code:        'consulted_at',
		name:        'consulted At',
		type:        'date',
		group:       'date',
		description: ''
	},
	consumed_at:       {
		code:        'consumed_at',
		name:        'consumed At',
		type:        'date',
		group:       'date',
		description: ''
	},
	consumed_qty:      {
		code:        'consumed_qty',
		name:        'consumed Qty',
		type:        'number',
		group:       'data',
		description: ''
	},
	contact:           {
		code:        'contact',
		name:        'contact',
		type:        'text',
		group:       'data',
		description: ''
	},
	contact_email:     {
		code:        'contact_email',
		name:        'contact Email',
		type:        'email',
		group:       'contact',
		description: ''
	},
	contact_name:      {
		code:        'contact_name',
		name:        'contact Name',
		type:        'text',
		group:       'data',
		description: ''
	},
	container:         {
		code:        'container',
		name:        'container',
		type:        'text',
		group:       'data',
		description: ''
	},
	continentPrefix:   {
		code:        'continentPrefix',
		name:        'continent prefix',
		type:        'text',
		group:       'data',
		description: ''
	},
	controlnet_strength:{
		code:        'controlnet_strength',
		name:        'controlnet Strength',
		type:        'number',
		group:       'data',
		description: ''
	},
	controlnet_type:   {
		code:        'controlnet_type',
		name:        'controlnet Type',
		type:        'text',
		group:       'data',
		description: ''
	},
	cooldown_sec:      {
		code:        'cooldown_sec',
		name:        'cooldown Sec',
		type:        'number',
		group:       'data',
		description: ''
	},
	cost:              {
		code:        'cost',
		name:        'cost',
		type:        'currency',
		group:       'pricing',
		description: ''
	},
	country:           {
		code:        'country',
		name:        'country',
		type:        'text',
		group:       'data',
		description: ''
	},
	countryOrder:      {
		code:        'countryOrder',
		name:        'country order',
		type:        'text',
		group:       'data',
		description: ''
	},
	countryPrefix:     {
		code:        'countryPrefix',
		name:        'country prefix',
		type:        'text',
		group:       'data',
		description: ''
	},
	cover:             {
		code:        'cover',
		name:        'cover',
		type:        'image',
		group:       'data',
		description: ''
	},
	cover_back:        {
		code:        'cover_back',
		name:        'cover Back',
		type:        'image',
		group:       'data',
		description: ''
	},
	cover_front:       {
		code:        'cover_front',
		name:        'cover Front',
		type:        'image',
		group:       'data',
		description: ''
	},
	cover_image:       {
		code:        'cover_image',
		name:        'cover Image',
		type:        'image',
		group:       'data',
		description: ''
	},
	coverage_type:     {
		code:        'coverage_type',
		name:        'coverage Type',
		type:        'text',
		group:       'data',
		description: ''
	},
	covers:            {
		code:        'covers',
		name:        'covers',
		type:        'number',
		group:       'data',
		description: ''
	},
	cp:                {
		code:        'cp',
		name:        'cp',
		type:        'text',
		group:       'data',
		description: ''
	},
	createdAt:         {
		code:        'createdAt',
		name:        'created at',
		type:        'date',
		group:       'date',
		description: ''
	},
	created_at:        {
		code:        'created_at',
		name:        'created At',
		type:        'date',
		group:       'date',
		description: ''
	},
	credit:            {
		code:        'credit',
		name:        'credit',
		type:        'currency',
		group:       'pricing',
		description: ''
	},
	current:           {
		code:        'current',
		name:        'current',
		type:        'boolean',
		group:       'flags',
		description: ''
	},
	customer_note:     {
		code:        'customer_note',
		name:        'customer Note',
		type:        'text-lg',
		group:       'data',
		description: ''
	},
	daily_rate_base:   {
		code:        'daily_rate_base',
		name:        'daily Rate Base',
		type:        'number',
		group:       'data',
		description: ''
	},
	dam:               {
		code:        'dam',
		name:        'dam',
		type:        'text',
		group:       'data',
		description: ''
	},
	deadline:          {
		code:        'deadline',
		name:        'deadline',
		type:        'date',
		group:       'date',
		description: ''
	},
	death_date:        {
		code:        'death_date',
		name:        'death Date',
		type:        'date',
		group:       'date',
		description: ''
	},
	debit:             {
		code:        'debit',
		name:        'debit',
		type:        'currency',
		group:       'pricing',
		description: ''
	},
	debugRang:         {
		code:        'debugRang',
		name:        'debug rang',
		type:        'text',
		group:       'data',
		description: ''
	},
	debugRangCommandeModulo:{
		code:        'debugRangCommandeModulo',
		name:        'debug rang commande modulo',
		type:        'text',
		group:       'data',
		description: ''
	},
	decimals:          {
		code:        'decimals',
		name:        'decimals',
		type:        'number',
		group:       'data',
		description: ''
	},
	default_fee:       {
		code:        'default_fee',
		name:        'default Fee',
		type:        'currency',
		group:       'pricing',
		description: ''
	},
	delivered_at:      {
		code:        'delivered_at',
		name:        'delivered At',
		type:        'date',
		group:       'date',
		description: ''
	},
	departureCityName: {
		code:        'departureCityName',
		name:        'departure city name',
		type:        'text',
		group:       'data',
		description: ''
	},
	deployed_at:       {
		code:        'deployed_at',
		name:        'deployed At',
		type:        'date',
		group:       'date',
		description: ''
	},
	deposit:           {
		code:        'deposit',
		name:        'deposit',
		type:        'currency',
		group:       'pricing',
		description: ''
	},
	descriptionExt:    {
		code:        'descriptionExt',
		name:        'description ext',
		type:        'text',
		group:       'data',
		description: ''
	},
	descriptionHTML:   {
		code:        'descriptionHTML',
		name:        'description h t m l',
		type:        'text',
		group:       'data',
		description: ''
	},
	desire:            {
		code:        'desire',
		name:        'desire',
		type:        'text',
		group:       'data',
		description: ''
	},
	destinationPrefix: {
		code:        'destinationPrefix',
		name:        'destination prefix',
		type:        'text',
		group:       'data',
		description: ''
	},
	device:            {
		code:        'device',
		name:        'device',
		type:        'text',
		group:       'data',
		description: ''
	},
	dezdezdez:         {
		code:        'dezdezdez',
		name:        'dezdezdez',
		type:        'text',
		group:       'data',
		description: ''
	},
	diagnosis:         {
		code:        'diagnosis',
		name:        'diagnosis',
		type:        'text-lg',
		group:       'data',
		description: ''
	},
	direction:         {
		code:        'direction',
		name:        'direction',
		type:        'text',
		group:       'data',
		description: ''
	},
	discount:          {
		code:        'discount',
		name:        'discount',
		type:        'currency',
		group:       'pricing',
		description: ''
	},
	discount_pct:      {
		code:        'discount_pct',
		name:        'discount Pct',
		type:        'number',
		group:       'data',
		description: ''
	},
	discount_type:     {
		code:        'discount_type',
		name:        'discount Type',
		type:        'text',
		group:       'data',
		description: ''
	},
	discount_value:    {
		code:        'discount_value',
		name:        'discount Value',
		type:        'currency',
		group:       'pricing',
		description: ''
	},
	discovered_at:     {
		code:        'discovered_at',
		name:        'discovered At',
		type:        'datetime',
		group:       'date',
		description: ''
	},
	disponible:        {
		code:        'disponible',
		name:        'disponible',
		type:        'text',
		group:       'data',
		description: ''
	},
	disqualified:      {
		code:        'disqualified',
		name:        'disqualified',
		type:        'boolean',
		group:       'flags',
		description: ''
	},
	distance:          {
		code:        'distance',
		name:        'distance',
		type:        'text',
		group:       'data',
		description: ''
	},
	distance_meters:   {
		code:        'distance_meters',
		name:        'distance Meters',
		type:        'number',
		group:       'data',
		description: ''
	},
	document:          {
		code:        'document',
		name:        'document',
		type:        'image',
		group:       'data',
		description: ''
	},
	domain:            {
		code:        'domain',
		name:        'domain',
		type:        'text',
		group:       'data',
		description: ''
	},
	dosage:            {
		code:        'dosage',
		name:        'dosage',
		type:        'text',
		group:       'data',
		description: ''
	},
	dossierNumber:     {
		code:        'dossierNumber',
		name:        'dossier number',
		type:        'text',
		group:       'data',
		description: ''
	},
	download_allowed:  {
		code:        'download_allowed',
		name:        'download Allowed',
		type:        'boolean',
		group:       'flags',
		description: ''
	},
	drivers_license:   {
		code:        'drivers_license',
		name:        'drivers License',
		type:        'text',
		group:       'data',
		description: ''
	},
	droit_app:         {
		code:        'droit_app',
		name:        'droit App',
		type:        'text',
		group:       'data',
		description: ''
	},
	drug_name:         {
		code:        'drug_name',
		name:        'drug Name',
		type:        'text',
		group:       'data',
		description: ''
	},
	due_date:          {
		code:        'due_date',
		name:        'due Date',
		type:        'date',
		group:       'date',
		description: ''
	},
	duration:          {
		code:        'duration',
		name:        'duration',
		type:        'number',
		group:       'data',
		description: ''
	},
	durationDays:      {
		code:        'durationDays',
		name:        'duration days',
		type:        'text',
		group:       'data',
		description: ''
	},
	duration_days:     {
		code:        'duration_days',
		name:        'duration Days',
		type:        'number',
		group:       'data',
		description: ''
	},
	duration_min:      {
		code:        'duration_min',
		name:        'duration Min',
		type:        'number',
		group:       'data',
		description: ''
	},
	duration_sec:      {
		code:        'duration_sec',
		name:        'duration Sec',
		type:        'number',
		group:       'data',
		description: ''
	},
	dureeContrat:      {
		code:        'dureeContrat',
		name:        'duree contrat',
		type:        'text',
		group:       'data',
		description: ''
	},
	dureeLivraison:    {
		code:        'dureeLivraison',
		name:        'duree livraison',
		type:        'text',
		group:       'data',
		description: ''
	},
	duree_realisation: {
		code:        'duree_realisation',
		name:        'duree Realisation',
		type:        'text',
		group:       'data',
		description: ''
	},
	dynSlot:           {
		code:        'dynSlot',
		name:        'dyn slot',
		type:        'text',
		group:       'data',
		description: ''
	},
	edited_at:         {
		code:        'edited_at',
		name:        'edited At',
		type:        'date',
		group:       'date',
		description: ''
	},
	email2:            {
		code:        'email2',
		name:        'email2',
		type:        'email',
		group:       'contact',
		description: ''
	},
	emergency_contact: {
		code:        'emergency_contact',
		name:        'emergency Contact',
		type:        'text',
		group:       'data',
		description: ''
	},
	emergency_phone:   {
		code:        'emergency_phone',
		name:        'emergency Phone',
		type:        'phone',
		group:       'contact',
		description: ''
	},
	emotion:           {
		code:        'emotion',
		name:        'emotion',
		type:        'text',
		group:       'data',
		description: ''
	},
	enabled:           {
		code:        'enabled',
		name:        'enabled',
		type:        'boolean',
		group:       'flags',
		description: ''
	},
	endDate:           {
		code:        'endDate',
		name:        'end date',
		type:        'date',
		group:       'date',
		description: ''
	},
	endTime:           {
		code:        'endTime',
		name:        'end time',
		type:        'datetime',
		group:       'date',
		description: ''
	},
	end_date:          {
		code:        'end_date',
		name:        'end Date',
		type:        'date',
		group:       'date',
		description: ''
	},
	end_time:          {
		code:        'end_time',
		name:        'end Time',
		type:        'text',
		group:       'data',
		description: ''
	},
	ended:             {
		code:        'ended',
		name:        'ended',
		type:        'text',
		group:       'data',
		description: ''
	},
	ended_at:          {
		code:        'ended_at',
		name:        'ended At',
		type:        'date',
		group:       'date',
		description: ''
	},
	ended_year:        {
		code:        'ended_year',
		name:        'ended Year',
		type:        'number',
		group:       'data',
		description: ''
	},
	enrolled_at:       {
		code:        'enrolled_at',
		name:        'enrolled At',
		type:        'date',
		group:       'date',
		description: ''
	},
	entry_date:        {
		code:        'entry_date',
		name:        'entry Date',
		type:        'date',
		group:       'date',
		description: ''
	},
	entry_number:      {
		code:        'entry_number',
		name:        'entry Number',
		type:        'text',
		group:       'data',
		description: ''
	},
	environment:       {
		code:        'environment',
		name:        'environment',
		type:        'text',
		group:       'data',
		description: ''
	},
	equipment:         {
		code:        'equipment',
		name:        'equipment',
		type:        'text-lg',
		group:       'data',
		description: ''
	},
	estActif:          {
		code:        'estActif',
		name:        'est actif',
		type:        'boolean',
		group:       'flags',
		description: ''
	},
	estimate_hours:    {
		code:        'estimate_hours',
		name:        'estimate Hours',
		type:        'number',
		group:       'data',
		description: ''
	},
	estimated_cost:    {
		code:        'estimated_cost',
		name:        'estimated Cost',
		type:        'currency',
		group:       'pricing',
		description: ''
	},
	etatCivil:         {
		code:        'etatCivil',
		name:        'etat civil',
		type:        'text',
		group:       'data',
		description: ''
	},
	examination:       {
		code:        'examination',
		name:        'examination',
		type:        'text-lg',
		group:       'data',
		description: ''
	},
	excerpt:           {
		code:        'excerpt',
		name:        'excerpt',
		type:        'text-lg',
		group:       'data',
		description: ''
	},
	expected_behavior: {
		code:        'expected_behavior',
		name:        'expected Behavior',
		type:        'text-lg',
		group:       'data',
		description: ''
	},
	expected_date:     {
		code:        'expected_date',
		name:        'expected Date',
		type:        'date',
		group:       'date',
		description: ''
	},
	expires_at:        {
		code:        'expires_at',
		name:        'expires At',
		type:        'date',
		group:       'date',
		description: ''
	},
	externalRef:       {
		code:        'externalRef',
		name:        'external ref',
		type:        'text',
		group:       'data',
		description: ''
	},
	extras_total:      {
		code:        'extras_total',
		name:        'extras Total',
		type:        'currency',
		group:       'pricing',
		description: ''
	},
	fade_in:           {
		code:        'fade_in',
		name:        'fade In',
		type:        'number',
		group:       'data',
		description: ''
	},
	favorite:          {
		code:        'favorite',
		name:        'favorite',
		type:        'boolean',
		group:       'flags',
		description: ''
	},
	featured:          {
		code:        'featured',
		name:        'featured',
		type:        'boolean',
		group:       'flags',
		description: ''
	},
	fee:               {
		code:        'fee',
		name:        'fee',
		type:        'currency',
		group:       'pricing',
		description: ''
	},
	field_count:       {
		code:        'field_count',
		name:        'field Count',
		type:        'number',
		group:       'data',
		description: ''
	},
	filename:          {
		code:        'filename',
		name:        'filename',
		type:        'text',
		group:       'data',
		description: ''
	},
	final_image:       {
		code:        'final_image',
		name:        'final Image',
		type:        'image',
		group:       'data',
		description: ''
	},
	finish_position:   {
		code:        'finish_position',
		name:        'finish Position',
		type:        'number',
		group:       'data',
		description: ''
	},
	finish_time_sec:   {
		code:        'finish_time_sec',
		name:        'finish Time Sec',
		type:        'number',
		group:       'data',
		description: ''
	},
	fired_at:          {
		code:        'fired_at',
		name:        'fired At',
		type:        'date',
		group:       'date',
		description: ''
	},
	first_appearance:  {
		code:        'first_appearance',
		name:        'first Appearance',
		type:        'text',
		group:       'data',
		description: ''
	},
	first_name:        {
		code:        'first_name',
		name:        'first Name',
		type:        'text',
		group:       'data',
		description: ''
	},
	first_visit:       {
		code:        'first_visit',
		name:        'first Visit',
		type:        'boolean',
		group:       'flags',
		description: ''
	},
	fk_count:          {
		code:        'fk_count',
		name:        'fk Count',
		type:        'number',
		group:       'data',
		description: ''
	},
	floor:             {
		code:        'floor',
		name:        'floor',
		type:        'number',
		group:       'data',
		description: ''
	},
	folder:            {
		code:        'folder',
		name:        'folder',
		type:        'text',
		group:       'data',
		description: ''
	},
	follow_up_date:    {
		code:        'follow_up_date',
		name:        'follow Up Date',
		type:        'date',
		group:       'date',
		description: ''
	},
	font:              {
		code:        'font',
		name:        'font',
		type:        'text',
		group:       'data',
		description: ''
	},
	forced:            {
		code:        'forced',
		name:        'forced',
		type:        'boolean',
		group:       'flags',
		description: ''
	},
	founded:           {
		code:        'founded',
		name:        'founded',
		type:        'number',
		group:       'data',
		description: ''
	},
	fps:               {
		code:        'fps',
		name:        'fps',
		type:        'number',
		group:       'data',
		description: ''
	},
	frequency:         {
		code:        'frequency',
		name:        'frequency',
		type:        'text',
		group:       'data',
		description: ''
	},
	fuel_type:         {
		code:        'fuel_type',
		name:        'fuel Type',
		type:        'text',
		group:       'data',
		description: ''
	},
	fullBoard:         {
		code:        'fullBoard',
		name:        'full board',
		type:        'text',
		group:       'data',
		description: ''
	},
	full_name:         {
		code:        'full_name',
		name:        'full Name',
		type:        'text',
		group:       'data',
		description: ''
	},
	fx_bloom:          {
		code:        'fx_bloom',
		name:        'fx Bloom',
		type:        'number',
		group:       'data',
		description: ''
	},
	fx_motion_blur:    {
		code:        'fx_motion_blur',
		name:        'fx Motion Blur',
		type:        'number',
		group:       'data',
		description: ''
	},
	gammeOrder:        {
		code:        'gammeOrder',
		name:        'gamme order',
		type:        'text',
		group:       'data',
		description: ''
	},
	gaps:              {
		code:        'gaps',
		name:        'gaps',
		type:        'text-lg',
		group:       'data',
		description: ''
	},
	gate:              {
		code:        'gate',
		name:        'gate',
		type:        'number',
		group:       'data',
		description: ''
	},
	gender:            {
		code:        'gender',
		name:        'gender',
		type:        'text',
		group:       'data',
		description: ''
	},
	github:            {
		code:        'github',
		name:        'github',
		type:        'url',
		group:       'contact',
		description: ''
	},
	goal:              {
		code:        'goal',
		name:        'goal',
		type:        'text-lg',
		group:       'data',
		description: ''
	},
	gps:               {
		code:        'gps',
		name:        'gps',
		type:        'text',
		group:       'data',
		description: ''
	},
	gpsData:           {
		code:        'gpsData',
		name:        'gps data',
		type:        'text',
		group:       'data',
		description: ''
	},
	gps_index:         {
		code:        'gps_index',
		name:        'gps Index',
		type:        'text',
		group:       'data',
		description: ''
	},
	graded_at:         {
		code:        'graded_at',
		name:        'graded At',
		type:        'date',
		group:       'date',
		description: ''
	},
	guest_name:        {
		code:        'guest_name',
		name:        'guest Name',
		type:        'text',
		group:       'data',
		description: ''
	},
	handicap:          {
		code:        'handicap',
		name:        'handicap',
		type:        'boolean',
		group:       'flags',
		description: ''
	},
	handle:            {
		code:        'handle',
		name:        'handle',
		type:        'text',
		group:       'data',
		description: ''
	},
	hasVisa:           {
		code:        'hasVisa',
		name:        'has visa',
		type:        'text',
		group:       'data',
		description: ''
	},
	has_custody:       {
		code:        'has_custody',
		name:        'has Custody',
		type:        'boolean',
		group:       'flags',
		description: ''
	},
	hdr:               {
		code:        'hdr',
		name:        'hdr',
		type:        'boolean',
		group:       'flags',
		description: ''
	},
	headline:          {
		code:        'headline',
		name:        'headline',
		type:        'text',
		group:       'data',
		description: ''
	},
	heart_rate_bpm:    {
		code:        'heart_rate_bpm',
		name:        'heart Rate Bpm',
		type:        'number',
		group:       'data',
		description: ''
	},
	height_cm:         {
		code:        'height_cm',
		name:        'height Cm',
		type:        'number',
		group:       'data',
		description: ''
	},
	height_pct:        {
		code:        'height_pct',
		name:        'height Pct',
		type:        'number',
		group:       'data',
		description: ''
	},
	height_px:         {
		code:        'height_px',
		name:        'height Px',
		type:        'number',
		group:       'data',
		description: ''
	},
	heureFinPreparation:{
		code:        'heureFinPreparation',
		name:        'heure fin preparation',
		type:        'datetime',
		group:       'date',
		description: ''
	},
	heureLivraison:    {
		code:        'heureLivraison',
		name:        'heure livraison',
		type:        'datetime',
		group:       'date',
		description: ''
	},
	hire_date:         {
		code:        'hire_date',
		name:        'hire Date',
		type:        'date',
		group:       'date',
		description: ''
	},
	history:           {
		code:        'history',
		name:        'history',
		type:        'text-lg',
		group:       'data',
		description: ''
	},
	homePageOrder:     {
		code:        'homePageOrder',
		name:        'home page order',
		type:        'text',
		group:       'data',
		description: ''
	},
	honorific:         {
		code:        'honorific',
		name:        'honorific',
		type:        'text',
		group:       'data',
		description: ''
	},
	hourly_rate:       {
		code:        'hourly_rate',
		name:        'hourly Rate',
		type:        'currency',
		group:       'pricing',
		description: ''
	},
	hours:             {
		code:        'hours',
		name:        'hours',
		type:        'number',
		group:       'data',
		description: ''
	},
	hours_per_week:    {
		code:        'hours_per_week',
		name:        'hours Per Week',
		type:        'number',
		group:       'data',
		description: ''
	},
	idagent_writer:    {
		code:        'idagent_writer',
		name:        'idagent Writer',
		type:        'text',
		group:       'data',
		description: ''
	},
	identite:          {
		code:        'identite',
		name:        'identite',
		type:        'text',
		group:       'data',
		description: ''
	},
	idsite:            {
		code:        'idsite',
		name:        'idsite',
		type:        'url',
		group:       'contact',
		description: ''
	},
	idstatut_tache_has_type_suivi:{
		code:        'idstatut_tache_has_type_suivi',
		name:        'idstatut Tache Has Type Suivi',
		type:        'text',
		group:       'data',
		description: ''
	},
	idtypeprod:        {
		code:        'idtypeprod',
		name:        'idtypeprod',
		type:        'text',
		group:       'data',
		description: ''
	},
	image_small:       {
		code:        'image_small',
		name:        'image Small',
		type:        'text',
		group:       'data',
		description: ''
	},
	imdb_id:           {
		code:        'imdb_id',
		name:        'imdb Id',
		type:        'text',
		group:       'data',
		description: ''
	},
	information:       {
		code:        'information',
		name:        'information',
		type:        'text',
		group:       'data',
		description: ''
	},
	init_time:         {
		code:        'init_time',
		name:        'init Time',
		type:        'text',
		group:       'data',
		description: ''
	},
	ink_image:         {
		code:        'ink_image',
		name:        'ink Image',
		type:        'image',
		group:       'data',
		description: ''
	},
	installed_at:      {
		code:        'installed_at',
		name:        'installed At',
		type:        'date',
		group:       'date',
		description: ''
	},
	instructions:      {
		code:        'instructions',
		name:        'instructions',
		type:        'text-lg',
		group:       'data',
		description: ''
	},
	interest:          {
		code:        'interest',
		name:        'interest',
		type:        'text',
		group:       'data',
		description: ''
	},
	internalSlot:      {
		code:        'internalSlot',
		name:        'internal slot',
		type:        'text',
		group:       'data',
		description: ''
	},
	internal_note:     {
		code:        'internal_note',
		name:        'internal Note',
		type:        'text-lg',
		group:       'data',
		description: ''
	},
	intro:             {
		code:        'intro',
		name:        'intro',
		type:        'text-long',
		group:       'data',
		description: ''
	},
	invoice_number:    {
		code:        'invoice_number',
		name:        'invoice Number',
		type:        'text',
		group:       'data',
		description: ''
	},
	invoice_ref:       {
		code:        'invoice_ref',
		name:        'invoice Ref',
		type:        'text',
		group:       'data',
		description: ''
	},
	ip:                {
		code:        'ip',
		name:        'ip',
		type:        'text',
		group:       'data',
		description: ''
	},
	ip_address:        {
		code:        'ip_address',
		name:        'ip Address',
		type:        'text',
		group:       'data',
		description: ''
	},
	isActiveFournisseur:{
		code:        'isActiveFournisseur',
		name:        'is active fournisseur',
		type:        'boolean',
		group:       'flags',
		description: ''
	},
	isArchived:        {
		code:        'isArchived',
		name:        'is archived',
		type:        'boolean',
		group:       'flags',
		description: ''
	},
	isClient:          {
		code:        'isClient',
		name:        'is client',
		type:        'boolean',
		group:       'flags',
		description: ''
	},
	isFeatured:        {
		code:        'isFeatured',
		name:        'is featured',
		type:        'boolean',
		group:       'flags',
		description: ''
	},
	isFeaturedDestination:{
		code:        'isFeaturedDestination',
		name:        'is featured destination',
		type:        'boolean',
		group:       'flags',
		description: ''
	},
	isFeaturedFournisseur:{
		code:        'isFeaturedFournisseur',
		name:        'is featured fournisseur',
		type:        'boolean',
		group:       'flags',
		description: ''
	},
	isPort:            {
		code:        'isPort',
		name:        'is port',
		type:        'boolean',
		group:       'flags',
		description: ''
	},
	isVisible:         {
		code:        'isVisible',
		name:        'is visible',
		type:        'boolean',
		group:       'flags',
		description: ''
	},
	is_gluten_free:    {
		code:        'is_gluten_free',
		name:        'is Gluten Free',
		type:        'boolean',
		group:       'flags',
		description: ''
	},
	is_group:          {
		code:        'is_group',
		name:        'is Group',
		type:        'boolean',
		group:       'flags',
		description: ''
	},
	is_kid:            {
		code:        'is_kid',
		name:        'is Kid',
		type:        'boolean',
		group:       'flags',
		description: ''
	},
	is_primary:        {
		code:        'is_primary',
		name:        'is Primary',
		type:        'boolean',
		group:       'flags',
		description: ''
	},
	is_reconcilable:   {
		code:        'is_reconcilable',
		name:        'is Reconcilable',
		type:        'boolean',
		group:       'flags',
		description: ''
	},
	is_recurring:      {
		code:        'is_recurring',
		name:        'is Recurring',
		type:        'boolean',
		group:       'flags',
		description: ''
	},
	is_status:         {
		code:        'is_status',
		name:        'is Status',
		type:        'boolean',
		group:       'flags',
		description: ''
	},
	is_type:           {
		code:        'is_type',
		name:        'is Type',
		type:        'boolean',
		group:       'flags',
		description: ''
	},
	is_vegan:          {
		code:        'is_vegan',
		name:        'is Vegan',
		type:        'boolean',
		group:       'flags',
		description: ''
	},
	is_vegetarian:     {
		code:        'is_vegetarian',
		name:        'is Vegetarian',
		type:        'boolean',
		group:       'flags',
		description: ''
	},
	isbn:              {
		code:        'isbn',
		name:        'isbn',
		type:        'text',
		group:       'data',
		description: ''
	},
	isoDate:           {
		code:        'isoDate',
		name:        'iso date',
		type:        'datetime',
		group:       'date',
		description: ''
	},
	isoDateCreation:   {
		code:        'isoDateCreation',
		name:        'iso date creation',
		type:        'datetime',
		group:       'date',
		description: ''
	},
	isoDateDebut:      {
		code:        'isoDateDebut',
		name:        'iso date debut',
		type:        'datetime',
		group:       'date',
		description: ''
	},
	isoDateFin:        {
		code:        'isoDateFin',
		name:        'iso date fin',
		type:        'datetime',
		group:       'date',
		description: ''
	},
	issue_date:        {
		code:        'issue_date',
		name:        'issue Date',
		type:        'date',
		group:       'date',
		description: ''
	},
	issued_at:         {
		code:        'issued_at',
		name:        'issued At',
		type:        'date',
		group:       'date',
		description: ''
	},
	job_count:         {
		code:        'job_count',
		name:        'job Count',
		type:        'number',
		group:       'data',
		description: ''
	},
	joined_at:         {
		code:        'joined_at',
		name:        'joined At',
		type:        'date',
		group:       'date',
		description: ''
	},
	justified:         {
		code:        'justified',
		name:        'justified',
		type:        'boolean',
		group:       'flags',
		description: ''
	},
	justified_default: {
		code:        'justified_default',
		name:        'justified Default',
		type:        'boolean',
		group:       'flags',
		description: ''
	},
	key_cards:         {
		code:        'key_cards',
		name:        'key Cards',
		type:        'number',
		group:       'data',
		description: ''
	},
	kind:              {
		code:        'kind',
		name:        'kind',
		type:        'text',
		group:       'data',
		description: ''
	},
	language_pref:     {
		code:        'language_pref',
		name:        'language Pref',
		type:        'text',
		group:       'data',
		description: ''
	},
	languages_spoken:  {
		code:        'languages_spoken',
		name:        'languages Spoken',
		type:        'text',
		group:       'data',
		description: ''
	},
	last_login:        {
		code:        'last_login',
		name:        'last Login',
		type:        'date',
		group:       'date',
		description: ''
	},
	last_maintenance:  {
		code:        'last_maintenance',
		name:        'last Maintenance',
		type:        'date',
		group:       'date',
		description: ''
	},
	last_name:         {
		code:        'last_name',
		name:        'last Name',
		type:        'text',
		group:       'data',
		description: ''
	},
	last_seen_at:      {
		code:        'last_seen_at',
		name:        'last Seen At',
		type:        'date',
		group:       'date',
		description: ''
	},
	last_time:         {
		code:        'last_time',
		name:        'last Time',
		type:        'text',
		group:       'data',
		description: ''
	},
	layout_notes:      {
		code:        'layout_notes',
		name:        'layout Notes',
		type:        'text-lg',
		group:       'data',
		description: ''
	},
	lead_time_days:    {
		code:        'lead_time_days',
		name:        'lead Time Days',
		type:        'number',
		group:       'data',
		description: ''
	},
	length_behind:     {
		code:        'length_behind',
		name:        'length Behind',
		type:        'number',
		group:       'data',
		description: ''
	},
	length_meters:     {
		code:        'length_meters',
		name:        'length Meters',
		type:        'number',
		group:       'data',
		description: ''
	},
	lesson_date:       {
		code:        'lesson_date',
		name:        'lesson Date',
		type:        'date',
		group:       'date',
		description: ''
	},
	level:             {
		code:        'level',
		name:        'level',
		type:        'number',
		group:       'data',
		description: ''
	},
	licence:           {
		code:        'licence',
		name:        'licence',
		type:        'text',
		group:       'data',
		description: ''
	},
	license_plate:     {
		code:        'license_plate',
		name:        'license Plate',
		type:        'text',
		group:       'data',
		description: ''
	},
	lighting_intensity:{
		code:        'lighting_intensity',
		name:        'lighting Intensity',
		type:        'number',
		group:       'data',
		description: ''
	},
	lighting_type:     {
		code:        'lighting_type',
		name:        'lighting Type',
		type:        'text',
		group:       'data',
		description: ''
	},
	line_number:       {
		code:        'line_number',
		name:        'line Number',
		type:        'number',
		group:       'data',
		description: ''
	},
	line_total:        {
		code:        'line_total',
		name:        'line Total',
		type:        'currency',
		group:       'pricing',
		description: ''
	},
	link:              {
		code:        'link',
		name:        'link',
		type:        'url',
		group:       'contact',
		description: ''
	},
	liters:            {
		code:        'liters',
		name:        'liters',
		type:        'number',
		group:       'data',
		description: ''
	},
	location_on_vehicle:{
		code:        'location_on_vehicle',
		name:        'location On Vehicle',
		type:        'text',
		group:       'data',
		description: ''
	},
	locked:            {
		code:        'locked',
		name:        'locked',
		type:        'boolean',
		group:       'flags',
		description: ''
	},
	logo:              {
		code:        'logo',
		name:        'logo',
		type:        'image',
		group:       'data',
		description: ''
	},
	loop:              {
		code:        'loop',
		name:        'loop',
		type:        'boolean',
		group:       'flags',
		description: ''
	},
	lora:              {
		code:        'lora',
		name:        'lora',
		type:        'text',
		group:       'data',
		description: ''
	},
	lot_number:        {
		code:        'lot_number',
		name:        'lot Number',
		type:        'text',
		group:       'data',
		description: ''
	},
	lot_tracked:       {
		code:        'lot_tracked',
		name:        'lot Tracked',
		type:        'boolean',
		group:       'flags',
		description: ''
	},
	low_stock_alert:   {
		code:        'low_stock_alert',
		name:        'low Stock Alert',
		type:        'number',
		group:       'data',
		description: ''
	},
	lowestPrice:       {
		code:        'lowestPrice',
		name:        'lowest price',
		type:        'text',
		group:       'data',
		description: ''
	},
	loyalty_points:    {
		code:        'loyalty_points',
		name:        'loyalty Points',
		type:        'number',
		group:       'data',
		description: ''
	},
	mac_address:       {
		code:        'mac_address',
		name:        'mac Address',
		type:        'text',
		group:       'data',
		description: ''
	},
	manager:           {
		code:        'manager',
		name:        'manager',
		type:        'text',
		group:       'data',
		description: ''
	},
	manufacturer:      {
		code:        'manufacturer',
		name:        'manufacturer',
		type:        'text',
		group:       'data',
		description: ''
	},
	max_age:           {
		code:        'max_age',
		name:        'max Age',
		type:        'number',
		group:       'data',
		description: ''
	},
	max_days:          {
		code:        'max_days',
		name:        'max Days',
		type:        'number',
		group:       'data',
		description: ''
	},
	max_occupancy:     {
		code:        'max_occupancy',
		name:        'max Occupancy',
		type:        'number',
		group:       'data',
		description: ''
	},
	max_profiles:      {
		code:        'max_profiles',
		name:        'max Profiles',
		type:        'number',
		group:       'data',
		description: ''
	},
	max_quality:       {
		code:        'max_quality',
		name:        'max Quality',
		type:        'text',
		group:       'data',
		description: ''
	},
	max_score:         {
		code:        'max_score',
		name:        'max Score',
		type:        'number',
		group:       'data',
		description: ''
	},
	max_select:        {
		code:        'max_select',
		name:        'max Select',
		type:        'number',
		group:       'data',
		description: ''
	},
	max_uses:          {
		code:        'max_uses',
		name:        'max Uses',
		type:        'number',
		group:       'data',
		description: ''
	},
	max_value:         {
		code:        'max_value',
		name:        'max Value',
		type:        'number',
		group:       'data',
		description: ''
	},
	measured_at:       {
		code:        'measured_at',
		name:        'measured At',
		type:        'date',
		group:       'date',
		description: ''
	},
	measured_value:    {
		code:        'measured_value',
		name:        'measured Value',
		type:        'number',
		group:       'data',
		description: ''
	},
	meeting_date:      {
		code:        'meeting_date',
		name:        'meeting Date',
		type:        'date',
		group:       'date',
		description: ''
	},
	memo:              {
		code:        'memo',
		name:        'memo',
		type:        'text-lg',
		group:       'data',
		description: ''
	},
	message:           {
		code:        'message',
		name:        'message',
		type:        'text-lg',
		group:       'data',
		description: ''
	},
	message_id:        {
		code:        'message_id',
		name:        'message Id',
		type:        'text',
		group:       'data',
		description: ''
	},
	message_template:  {
		code:        'message_template',
		name:        'message Template',
		type:        'text-lg',
		group:       'data',
		description: ''
	},
	metaDescription:   {
		code:        'metaDescription',
		name:        'meta description',
		type:        'text',
		group:       'data',
		description: ''
	},
	metaTitle:         {
		code:        'metaTitle',
		name:        'meta title',
		type:        'text',
		group:       'data',
		description: ''
	},
	meta_description:  {
		code:        'meta_description',
		name:        'meta Description',
		type:        'text-lg',
		group:       'data',
		description: ''
	},
	meta_title:        {
		code:        'meta_title',
		name:        'meta Title',
		type:        'text',
		group:       'data',
		description: ''
	},
	method:            {
		code:        'method',
		name:        'method',
		type:        'text',
		group:       'data',
		description: ''
	},
	mileage:           {
		code:        'mileage',
		name:        'mileage',
		type:        'number',
		group:       'data',
		description: ''
	},
	mileage_at_service:{
		code:        'mileage_at_service',
		name:        'mileage At Service',
		type:        'number',
		group:       'data',
		description: ''
	},
	mime:              {
		code:        'mime',
		name:        'mime',
		type:        'text',
		group:       'data',
		description: ''
	},
	min_age:           {
		code:        'min_age',
		name:        'min Age',
		type:        'number',
		group:       'data',
		description: ''
	},
	min_days:          {
		code:        'min_days',
		name:        'min Days',
		type:        'number',
		group:       'data',
		description: ''
	},
	min_order_qty:     {
		code:        'min_order_qty',
		name:        'min Order Qty',
		type:        'number',
		group:       'data',
		description: ''
	},
	min_order_total:   {
		code:        'min_order_total',
		name:        'min Order Total',
		type:        'currency',
		group:       'pricing',
		description: ''
	},
	min_qty:           {
		code:        'min_qty',
		name:        'min Qty',
		type:        'number',
		group:       'data',
		description: ''
	},
	min_select:        {
		code:        'min_select',
		name:        'min Select',
		type:        'number',
		group:       'data',
		description: ''
	},
	min_stay:          {
		code:        'min_stay',
		name:        'min Stay',
		type:        'number',
		group:       'data',
		description: ''
	},
	min_stock:         {
		code:        'min_stock',
		name:        'min Stock',
		type:        'number',
		group:       'data',
		description: ''
	},
	min_value:         {
		code:        'min_value',
		name:        'min Value',
		type:        'number',
		group:       'data',
		description: ''
	},
	minutes_late:      {
		code:        'minutes_late',
		name:        'minutes Late',
		type:        'number',
		group:       'data',
		description: ''
	},
	mobilePhone:       {
		code:        'mobilePhone',
		name:        'mobile phone',
		type:        'phone',
		group:       'contact',
		description: ''
	},
	mode:              {
		code:        'mode',
		name:        'mode',
		type:        'text',
		group:       'data',
		description: ''
	},
	mongo_prefix:      {
		code:        'mongo_prefix',
		name:        'mongo Prefix',
		type:        'text',
		group:       'data',
		description: ''
	},
	montantEchenace:   {
		code:        'montantEchenace',
		name:        'montant echenace',
		type:        'currency',
		group:       'pricing',
		description: ''
	},
	month:             {
		code:        'month',
		name:        'month',
		type:        'text',
		group:       'data',
		description: ''
	},
	monthFr:           {
		code:        'monthFr',
		name:        'month fr',
		type:        'text',
		group:       'data',
		description: ''
	},
	monthYearFr:       {
		code:        'monthYearFr',
		name:        'month year fr',
		type:        'text',
		group:       'data',
		description: ''
	},
	move_type:         {
		code:        'move_type',
		name:        'move Type',
		type:        'text',
		group:       'data',
		description: ''
	},
	moved_at:          {
		code:        'moved_at',
		name:        'moved At',
		type:        'date',
		group:       'date',
		description: ''
	},
	name_snapshot:     {
		code:        'name_snapshot',
		name:        'name Snapshot',
		type:        'text',
		group:       'data',
		description: ''
	},
	national_id:       {
		code:        'national_id',
		name:        'national Id',
		type:        'text',
		group:       'data',
		description: ''
	},
	native_name:       {
		code:        'native_name',
		name:        'native Name',
		type:        'text',
		group:       'data',
		description: ''
	},
	next_maintenance:  {
		code:        'next_maintenance',
		name:        'next Maintenance',
		type:        'date',
		group:       'date',
		description: ''
	},
	ngap_code:         {
		code:        'ngap_code',
		name:        'ngap Code',
		type:        'text',
		group:       'data',
		description: ''
	},
	nights:            {
		code:        'nights',
		name:        'nights',
		type:        'number',
		group:       'data',
		description: ''
	},
	normal_side:       {
		code:        'normal_side',
		name:        'normal Side',
		type:        'text',
		group:       'data',
		description: ''
	},
	note:              {
		code:        'note',
		name:        'note',
		type:        'text-lg',
		group:       'data',
		description: ''
	},
	notes:             {
		code:        'notes',
		name:        'notes',
		type:        'text-lg',
		group:       'data',
		description: ''
	},
	number:            {
		code:        'number',
		name:        'number',
		type:        'number',
		group:       'data',
		description: ''
	},
	odds_final:        {
		code:        'odds_final',
		name:        'odds Final',
		type:        'number',
		group:       'data',
		description: ''
	},
	odds_morning:      {
		code:        'odds_morning',
		name:        'odds Morning',
		type:        'number',
		group:       'data',
		description: ''
	},
	office:            {
		code:        'office',
		name:        'office',
		type:        'text',
		group:       'data',
		description: ''
	},
	ongoing:           {
		code:        'ongoing',
		name:        'ongoing',
		type:        'boolean',
		group:       'flags',
		description: ''
	},
	online:            {
		code:        'online',
		name:        'online',
		type:        'boolean',
		group:       'flags',
		description: ''
	},
	online_booking:    {
		code:        'online_booking',
		name:        'online Booking',
		type:        'boolean',
		group:       'flags',
		description: ''
	},
	opened_at:         {
		code:        'opened_at',
		name:        'opened At',
		type:        'date',
		group:       'date',
		description: ''
	},
	opening_balance:   {
		code:        'opening_balance',
		name:        'opening Balance',
		type:        'currency',
		group:       'pricing',
		description: ''
	},
	operator:          {
		code:        'operator',
		name:        'operator',
		type:        'text',
		group:       'data',
		description: ''
	},
	option_color:      {
		code:        'option_color',
		name:        'option Color',
		type:        'text',
		group:       'data',
		description: ''
	},
	option_size:       {
		code:        'option_size',
		name:        'option Size',
		type:        'text',
		group:       'data',
		description: ''
	},
	order_date:        {
		code:        'order_date',
		name:        'order Date',
		type:        'date',
		group:       'date',
		description: ''
	},
	order_number:      {
		code:        'order_number',
		name:        'order Number',
		type:        'text',
		group:       'data',
		description: ''
	},
	ordreAgent_groupe: {
		code:        'ordreAgent_groupe',
		name:        'ordreagent Groupe',
		type:        'text',
		group:       'data',
		description: ''
	},
	ordreCommande:     {
		code:        'ordreCommande',
		name:        'ordre commande',
		type:        'text',
		group:       'data',
		description: ''
	},
	ordreCommande_statut:{
		code:        'ordreCommande_statut',
		name:        'ordrecommande Statut',
		type:        'text',
		group:       'data',
		description: ''
	},
	ordreJours:        {
		code:        'ordreJours',
		name:        'ordre jours',
		type:        'text',
		group:       'data',
		description: ''
	},
	ordreOpportunite_statut:{
		code:        'ordreOpportunite_statut',
		name:        'ordreopportunite Statut',
		type:        'text',
		group:       'data',
		description: ''
	},
	ordreProduit_categorie:{
		code:        'ordreProduit_categorie',
		name:        'ordreproduit Categorie',
		type:        'text',
		group:       'data',
		description: ''
	},
	ordreProduit_type: {
		code:        'ordreProduit_type',
		name:        'ordreproduit Type',
		type:        'text',
		group:       'data',
		description: ''
	},
	ordreSecteur:      {
		code:        'ordreSecteur',
		name:        'ordre secteur',
		type:        'text',
		group:       'data',
		description: ''
	},
	ordreShop_jours:   {
		code:        'ordreShop_jours',
		name:        'ordreshop Jours',
		type:        'text',
		group:       'data',
		description: ''
	},
	ordreShop_jours_shift:{
		code:        'ordreShop_jours_shift',
		name:        'ordreshop Jours Shift',
		type:        'text',
		group:       'data',
		description: ''
	},
	ordreType_tache:   {
		code:        'ordreType_tache',
		name:        'ordretype Tache',
		type:        'text',
		group:       'data',
		description: ''
	},
	original_name:     {
		code:        'original_name',
		name:        'original Name',
		type:        'text',
		group:       'data',
		description: ''
	},
	outfit:            {
		code:        'outfit',
		name:        'outfit',
		type:        'text',
		group:       'data',
		description: ''
	},
	output_qty:        {
		code:        'output_qty',
		name:        'output Qty',
		type:        'number',
		group:       'data',
		description: ''
	},
	oxygen_saturation: {
		code:        'oxygen_saturation',
		name:        'oxygen Saturation',
		type:        'number',
		group:       'data',
		description: ''
	},
	page_count:        {
		code:        'page_count',
		name:        'page Count',
		type:        'number',
		group:       'data',
		description: ''
	},
	paid_at:           {
		code:        'paid_at',
		name:        'paid At',
		type:        'date',
		group:       'date',
		description: ''
	},
	panel_count:       {
		code:        'panel_count',
		name:        'panel Count',
		type:        'number',
		group:       'data',
		description: ''
	},
	parsed_at:         {
		code:        'parsed_at',
		name:        'parsed At',
		type:        'datetime',
		group:       'date',
		description: ''
	},
	partLivreur:       {
		code:        'partLivreur',
		name:        'part livreur',
		type:        'text',
		group:       'data',
		description: ''
	},
	partShop:          {
		code:        'partShop',
		name:        'part shop',
		type:        'text',
		group:       'data',
		description: ''
	},
	party_size:        {
		code:        'party_size',
		name:        'party Size',
		type:        'number',
		group:       'data',
		description: ''
	},
	passport:          {
		code:        'passport',
		name:        'passport',
		type:        'text',
		group:       'data',
		description: ''
	},
	passport_no:       {
		code:        'passport_no',
		name:        'passport No',
		type:        'text',
		group:       'data',
		description: ''
	},
	payload:           {
		code:        'payload',
		name:        'payload',
		type:        'text-lg',
		group:       'data',
		description: ''
	},
	payment_date:      {
		code:        'payment_date',
		name:        'payment Date',
		type:        'date',
		group:       'date',
		description: ''
	},
	payout:            {
		code:        'payout',
		name:        'payout',
		type:        'currency',
		group:       'pricing',
		description: ''
	},
	pdf:               {
		code:        'pdf',
		name:        'pdf',
		type:        'url',
		group:       'contact',
		description: ''
	},
	pdf_url:           {
		code:        'pdf_url',
		name:        'pdf Url',
		type:        'url',
		group:       'contact',
		description: ''
	},
	pencil_image:      {
		code:        'pencil_image',
		name:        'pencil Image',
		type:        'image',
		group:       'data',
		description: ''
	},
	performed_at:      {
		code:        'performed_at',
		name:        'performed At',
		type:        'date',
		group:       'date',
		description: ''
	},
	petitNomAgent:     {
		code:        'petitNomAgent',
		name:        'petit nom agent',
		type:        'text',
		group:       'data',
		description: ''
	},
	phone2:            {
		code:        'phone2',
		name:        'phone2',
		type:        'phone',
		group:       'contact',
		description: ''
	},
	phone_mobile:      {
		code:        'phone_mobile',
		name:        'phone Mobile',
		type:        'phone',
		group:       'contact',
		description: ''
	},
	photo:             {
		code:        'photo',
		name:        'photo',
		type:        'image',
		group:       'data',
		description: ''
	},
	pickup_mileage:    {
		code:        'pickup_mileage',
		name:        'pickup Mileage',
		type:        'number',
		group:       'data',
		description: ''
	},
	pin:               {
		code:        'pin',
		name:        'pin',
		type:        'text',
		group:       'data',
		description: ''
	},
	placed_at:         {
		code:        'placed_at',
		name:        'placed At',
		type:        'date',
		group:       'date',
		description: ''
	},
	planned_at:        {
		code:        'planned_at',
		name:        'planned At',
		type:        'date',
		group:       'date',
		description: ''
	},
	planned_minutes:   {
		code:        'planned_minutes',
		name:        'planned Minutes',
		type:        'number',
		group:       'data',
		description: ''
	},
	planned_qty:       {
		code:        'planned_qty',
		name:        'planned Qty',
		type:        'number',
		group:       'data',
		description: ''
	},
	planned_return:    {
		code:        'planned_return',
		name:        'planned Return',
		type:        'date',
		group:       'date',
		description: ''
	},
	plural:            {
		code:        'plural',
		name:        'plural',
		type:        'text',
		group:       'data',
		description: ''
	},
	po_number:         {
		code:        'po_number',
		name:        'po Number',
		type:        'text',
		group:       'data',
		description: ''
	},
	policy_number:     {
		code:        'policy_number',
		name:        'policy Number',
		type:        'text',
		group:       'data',
		description: ''
	},
	pos_scale:         {
		code:        'pos_scale',
		name:        'pos Scale',
		type:        'number',
		group:       'data',
		description: ''
	},
	pos_x:             {
		code:        'pos_x',
		name:        'pos X',
		type:        'number',
		group:       'data',
		description: ''
	},
	pos_y:             {
		code:        'pos_y',
		name:        'pos Y',
		type:        'number',
		group:       'data',
		description: ''
	},
	pose:              {
		code:        'pose',
		name:        'pose',
		type:        'text',
		group:       'data',
		description: ''
	},
	position:          {
		code:        'position',
		name:        'position',
		type:        'number',
		group:       'data',
		description: ''
	},
	position_sec:      {
		code:        'position_sec',
		name:        'position Sec',
		type:        'number',
		group:       'data',
		description: ''
	},
	postalCode:        {
		code:        'postalCode',
		name:        'postal code',
		type:        'text',
		group:       'data',
		description: ''
	},
	postal_code:       {
		code:        'postal_code',
		name:        'postal Code',
		type:        'text',
		group:       'data',
		description: ''
	},
	posted_at:         {
		code:        'posted_at',
		name:        'posted At',
		type:        'date',
		group:       'date',
		description: ''
	},
	poster:            {
		code:        'poster',
		name:        'poster',
		type:        'image',
		group:       'data',
		description: ''
	},
	powers:            {
		code:        'powers',
		name:        'powers',
		type:        'text-lg',
		group:       'data',
		description: ''
	},
	preferred:         {
		code:        'preferred',
		name:        'preferred',
		type:        'boolean',
		group:       'flags',
		description: ''
	},
	prefix:            {
		code:        'prefix',
		name:        'prefix',
		type:        'text',
		group:       'data',
		description: ''
	},
	prep_minutes:      {
		code:        'prep_minutes',
		name:        'prep Minutes',
		type:        'number',
		group:       'data',
		description: ''
	},
	previewContent:    {
		code:        'previewContent',
		name:        'preview content',
		type:        'text',
		group:       'data',
		description: ''
	},
	price:             {
		code:        'price',
		name:        'price',
		type:        'currency',
		group:       'pricing',
		description: ''
	},
	price_delta:       {
		code:        'price_delta',
		name:        'price Delta',
		type:        'currency',
		group:       'pricing',
		description: ''
	},
	price_monthly:     {
		code:        'price_monthly',
		name:        'price Monthly',
		type:        'currency',
		group:       'pricing',
		description: ''
	},
	price_per_day:     {
		code:        'price_per_day',
		name:        'price Per Day',
		type:        'currency',
		group:       'pricing',
		description: ''
	},
	price_yearly:      {
		code:        'price_yearly',
		name:        'price Yearly',
		type:        'currency',
		group:       'pricing',
		description: ''
	},
	priority:          {
		code:        'priority',
		name:        'priority',
		type:        'number',
		group:       'data',
		description: ''
	},
	private_key:       {
		code:        'private_key',
		name:        'private Key',
		type:        'text',
		group:       'data',
		description: ''
	},
	prixService:       {
		code:        'prixService',
		name:        'prix service',
		type:        'currency',
		group:       'pricing',
		description: ''
	},
	prix_site:         {
		code:        'prix_site',
		name:        'prix Site',
		type:        'url',
		group:       'contact',
		description: ''
	},
	prize_total:       {
		code:        'prize_total',
		name:        'prize Total',
		type:        'currency',
		group:       'pricing',
		description: ''
	},
	prize_won:         {
		code:        'prize_won',
		name:        'prize Won',
		type:        'currency',
		group:       'pricing',
		description: ''
	},
	processed:         {
		code:        'processed',
		name:        'processed',
		type:        'boolean',
		group:       'flags',
		description: ''
	},
	produced_at:       {
		code:        'produced_at',
		name:        'produced At',
		type:        'date',
		group:       'date',
		description: ''
	},
	productTypePrefix: {
		code:        'productTypePrefix',
		name:        'product type prefix',
		type:        'text',
		group:       'data',
		description: ''
	},
	profession:        {
		code:        'profession',
		name:        'profession',
		type:        'text',
		group:       'data',
		description: ''
	},
	promoPrice:        {
		code:        'promoPrice',
		name:        'promo price',
		type:        'currency',
		group:       'pricing',
		description: ''
	},
	promoSubtitle:     {
		code:        'promoSubtitle',
		name:        'promo subtitle',
		type:        'text',
		group:       'data',
		description: ''
	},
	promoText:         {
		code:        'promoText',
		name:        'promo text',
		type:        'text',
		group:       'data',
		description: ''
	},
	prompt:            {
		code:        'prompt',
		name:        'prompt',
		type:        'text',
		group:       'data',
		description: ''
	},
	protocol:          {
		code:        'protocol',
		name:        'protocol',
		type:        'text',
		group:       'data',
		description: ''
	},
	provider:          {
		code:        'provider',
		name:        'provider',
		type:        'text',
		group:       'data',
		description: ''
	},
	published_at:      {
		code:        'published_at',
		name:        'published At',
		type:        'date',
		group:       'date',
		description: ''
	},
	purchasePrice:     {
		code:        'purchasePrice',
		name:        'purchase price',
		type:        'currency',
		group:       'pricing',
		description: ''
	},
	purchase_price:    {
		code:        'purchase_price',
		name:        'purchase Price',
		type:        'currency',
		group:       'pricing',
		description: ''
	},
	qty:               {
		code:        'qty',
		name:        'qty',
		type:        'number',
		group:       'data',
		description: ''
	},
	quantity:          {
		code:        'quantity',
		name:        'quantity',
		type:        'number',
		group:       'data',
		description: ''
	},
	quantity_done:     {
		code:        'quantity_done',
		name:        'quantity Done',
		type:        'number',
		group:       'data',
		description: ''
	},
	race_number:       {
		code:        'race_number',
		name:        'race Number',
		type:        'number',
		group:       'data',
		description: ''
	},
	rank:              {
		code:        'rank',
		name:        'rank',
		type:        'number',
		group:       'data',
		description: ''
	},
	rate_date:         {
		code:        'rate_date',
		name:        'rate Date',
		type:        'date',
		group:       'date',
		description: ''
	},
	rate_pct:          {
		code:        'rate_pct',
		name:        'rate Pct',
		type:        'number',
		group:       'data',
		description: ''
	},
	rate_total:        {
		code:        'rate_total',
		name:        'rate Total',
		type:        'currency',
		group:       'pricing',
		description: ''
	},
	rating_avg:        {
		code:        'rating_avg',
		name:        'rating Avg',
		type:        'number',
		group:       'data',
		description: ''
	},
	rating_count:      {
		code:        'rating_count',
		name:        'rating Count',
		type:        'number',
		group:       'data',
		description: ''
	},
	raw_text:          {
		code:        'raw_text',
		name:        'raw Text',
		type:        'text-long',
		group:       'data',
		description: ''
	},
	read_at:           {
		code:        'read_at',
		name:        'read At',
		type:        'date',
		group:       'date',
		description: ''
	},
	ready_at:          {
		code:        'ready_at',
		name:        'ready At',
		type:        'date',
		group:       'date',
		description: ''
	},
	real_name:         {
		code:        'real_name',
		name:        'real Name',
		type:        'text',
		group:       'data',
		description: ''
	},
	reason:            {
		code:        'reason',
		name:        'reason',
		type:        'text',
		group:       'data',
		description: ''
	},
	received_at:       {
		code:        'received_at',
		name:        'received At',
		type:        'datetime',
		group:       'date',
		description: ''
	},
	received_qty:      {
		code:        'received_qty',
		name:        'received Qty',
		type:        'number',
		group:       'data',
		description: ''
	},
	reconciled:        {
		code:        'reconciled',
		name:        'reconciled',
		type:        'boolean',
		group:       'flags',
		description: ''
	},
	recorded_at:       {
		code:        'recorded_at',
		name:        'recorded At',
		type:        'date',
		group:       'date',
		description: ''
	},
	ref_image:         {
		code:        'ref_image',
		name:        'ref Image',
		type:        'image',
		group:       'data',
		description: ''
	},
	refundable:        {
		code:        'refundable',
		name:        'refundable',
		type:        'boolean',
		group:       'flags',
		description: ''
	},
	region:            {
		code:        'region',
		name:        'region',
		type:        'text',
		group:       'data',
		description: ''
	},
	registered_at:     {
		code:        'registered_at',
		name:        'registered At',
		type:        'date',
		group:       'date',
		description: ''
	},
	reimbursable:      {
		code:        'reimbursable',
		name:        'reimbursable',
		type:        'boolean',
		group:       'flags',
		description: ''
	},
	reimbursed:        {
		code:        'reimbursed',
		name:        'reimbursed',
		type:        'currency',
		group:       'pricing',
		description: ''
	},
	release_date:      {
		code:        'release_date',
		name:        'release Date',
		type:        'date',
		group:       'date',
		description: ''
	},
	release_year:      {
		code:        'release_year',
		name:        'release Year',
		type:        'number',
		group:       'data',
		description: ''
	},
	released_at:       {
		code:        'released_at',
		name:        'released At',
		type:        'date',
		group:       'date',
		description: ''
	},
	reminder_sent_at:  {
		code:        'reminder_sent_at',
		name:        'reminder Sent At',
		type:        'date',
		group:       'date',
		description: ''
	},
	remote:            {
		code:        'remote',
		name:        'remote',
		type:        'boolean',
		group:       'flags',
		description: ''
	},
	renews_at:         {
		code:        'renews_at',
		name:        'renews At',
		type:        'date',
		group:       'date',
		description: ''
	},
	reorder_qty:       {
		code:        'reorder_qty',
		name:        'reorder Qty',
		type:        'number',
		group:       'data',
		description: ''
	},
	repair_cost:       {
		code:        'repair_cost',
		name:        'repair Cost',
		type:        'currency',
		group:       'pricing',
		description: ''
	},
	reported_at:       {
		code:        'reported_at',
		name:        'reported At',
		type:        'date',
		group:       'date',
		description: ''
	},
	res_h:             {
		code:        'res_h',
		name:        'res H',
		type:        'number',
		group:       'data',
		description: ''
	},
	res_w:             {
		code:        'res_w',
		name:        'res W',
		type:        'number',
		group:       'data',
		description: ''
	},
	reservationPhone:  {
		code:        'reservationPhone',
		name:        'reservation phone',
		type:        'phone',
		group:       'contact',
		description: ''
	},
	reserved_at:       {
		code:        'reserved_at',
		name:        'reserved At',
		type:        'date',
		group:       'date',
		description: ''
	},
	resolved:          {
		code:        'resolved',
		name:        'resolved',
		type:        'boolean',
		group:       'flags',
		description: ''
	},
	resolved_at:       {
		code:        'resolved_at',
		name:        'resolved At',
		type:        'date',
		group:       'date',
		description: ''
	},
	response:          {
		code:        'response',
		name:        'response',
		type:        'text-lg',
		group:       'data',
		description: ''
	},
	resume_file:       {
		code:        'resume_file',
		name:        'resume File',
		type:        'url',
		group:       'contact',
		description: ''
	},
	return_mileage:    {
		code:        'return_mileage',
		name:        'return Mileage',
		type:        'number',
		group:       'data',
		description: ''
	},
	reversed:          {
		code:        'reversed',
		name:        'reversed',
		type:        'boolean',
		group:       'flags',
		description: ''
	},
	review:            {
		code:        'review',
		name:        'review',
		type:        'text-lg',
		group:       'data',
		description: ''
	},
	revision_number:   {
		code:        'revision_number',
		name:        'revision Number',
		type:        'number',
		group:       'data',
		description: ''
	},
	room_total:        {
		code:        'room_total',
		name:        'room Total',
		type:        'currency',
		group:       'pricing',
		description: ''
	},
	route:             {
		code:        'route',
		name:        'route',
		type:        'text',
		group:       'data',
		description: ''
	},
	rpps_number:       {
		code:        'rpps_number',
		name:        'rpps Number',
		type:        'text',
		group:       'data',
		description: ''
	},
	run_minutes:       {
		code:        'run_minutes',
		name:        'run Minutes',
		type:        'number',
		group:       'data',
		description: ''
	},
	salary_max:        {
		code:        'salary_max',
		name:        'salary Max',
		type:        'currency',
		group:       'pricing',
		description: ''
	},
	salary_min:        {
		code:        'salary_min',
		name:        'salary Min',
		type:        'currency',
		group:       'pricing',
		description: ''
	},
	salary_period:     {
		code:        'salary_period',
		name:        'salary Period',
		type:        'text',
		group:       'data',
		description: ''
	},
	sample_count:      {
		code:        'sample_count',
		name:        'sample Count',
		type:        'number',
		group:       'data',
		description: ''
	},
	sampler:           {
		code:        'sampler',
		name:        'sampler',
		type:        'text',
		group:       'data',
		description: ''
	},
	sampling_sec:      {
		code:        'sampling_sec',
		name:        'sampling Sec',
		type:        'number',
		group:       'data',
		description: ''
	},
	scheduled_at:      {
		code:        'scheduled_at',
		name:        'scheduled At',
		type:        'date',
		group:       'date',
		description: ''
	},
	scheduled_end:     {
		code:        'scheduled_end',
		name:        'scheduled End',
		type:        'date',
		group:       'date',
		description: ''
	},
	scheduled_start:   {
		code:        'scheduled_start',
		name:        'scheduled Start',
		type:        'date',
		group:       'date',
		description: ''
	},
	score:             {
		code:        'score',
		name:        'score',
		type:        'number',
		group:       'data',
		description: ''
	},
	scrap_pct:         {
		code:        'scrap_pct',
		name:        'scrap Pct',
		type:        'number',
		group:       'data',
		description: ''
	},
	scratched:         {
		code:        'scratched',
		name:        'scratched',
		type:        'boolean',
		group:       'flags',
		description: ''
	},
	sdh:               {
		code:        'sdh',
		name:        'sdh',
		type:        'boolean',
		group:       'flags',
		description: ''
	},
	season_code:       {
		code:        'season_code',
		name:        'season Code',
		type:        'text',
		group:       'data',
		description: ''
	},
	seat_number:       {
		code:        'seat_number',
		name:        'seat Number',
		type:        'number',
		group:       'data',
		description: ''
	},
	seats:             {
		code:        'seats',
		name:        'seats',
		type:        'number',
		group:       'data',
		description: ''
	},
	seed:              {
		code:        'seed',
		name:        'seed',
		type:        'number',
		group:       'data',
		description: ''
	},
	sender:            {
		code:        'sender',
		name:        'sender',
		type:        'email',
		group:       'contact',
		description: ''
	},
	sender_domain:     {
		code:        'sender_domain',
		name:        'sender Domain',
		type:        'text',
		group:       'data',
		description: ''
	},
	sent_at:           {
		code:        'sent_at',
		name:        'sent At',
		type:        'date',
		group:       'date',
		description: ''
	},
	sequence:          {
		code:        'sequence',
		name:        'sequence',
		type:        'number',
		group:       'data',
		description: ''
	},
	serial_number:     {
		code:        'serial_number',
		name:        'serial Number',
		type:        'text',
		group:       'data',
		description: ''
	},
	session_id:        {
		code:        'session_id',
		name:        'session Id',
		type:        'text',
		group:       'data',
		description: ''
	},
	settings:          {
		code:        'settings',
		name:        'settings',
		type:        'text',
		group:       'data',
		description: ''
	},
	settled_at:        {
		code:        'settled_at',
		name:        'settled At',
		type:        'date',
		group:       'date',
		description: ''
	},
	setup_minutes:     {
		code:        'setup_minutes',
		name:        'setup Minutes',
		type:        'number',
		group:       'data',
		description: ''
	},
	sfx:               {
		code:        'sfx',
		name:        'sfx',
		type:        'text',
		group:       'data',
		description: ''
	},
	shape:             {
		code:        'shape',
		name:        'shape',
		type:        'text',
		group:       'data',
		description: ''
	},
	shipped_at:        {
		code:        'shipped_at',
		name:        'shipped At',
		type:        'date',
		group:       'date',
		description: ''
	},
	shipping_cost:     {
		code:        'shipping_cost',
		name:        'shipping Cost',
		type:        'currency',
		group:       'pricing',
		description: ''
	},
	shop:              {
		code:        'shop',
		name:        'shop',
		type:        'text',
		group:       'data',
		description: ''
	},
	shortName:         {
		code:        'shortName',
		name:        'short name',
		type:        'text',
		group:       'data',
		description: ''
	},
	short_description: {
		code:        'short_description',
		name:        'short Description',
		type:        'text-lg',
		group:       'data',
		description: ''
	},
	signal_dbm:        {
		code:        'signal_dbm',
		name:        'signal Dbm',
		type:        'number',
		group:       'data',
		description: ''
	},
	silks_colors:      {
		code:        'silks_colors',
		name:        'silks Colors',
		type:        'text',
		group:       'data',
		description: ''
	},
	silks_image:       {
		code:        'silks_image',
		name:        'silks Image',
		type:        'image',
		group:       'data',
		description: ''
	},
	sire:              {
		code:        'sire',
		name:        'sire',
		type:        'text',
		group:       'data',
		description: ''
	},
	siren:             {
		code:        'siren',
		name:        'siren',
		type:        'text',
		group:       'data',
		description: ''
	},
	siret:             {
		code:        'siret',
		name:        'siret',
		type:        'text',
		group:       'data',
		description: ''
	},
	siteUrl:           {
		code:        'siteUrl',
		name:        'site url',
		type:        'url',
		group:       'contact',
		description: ''
	},
	size_bytes:        {
		code:        'size_bytes',
		name:        'size Bytes',
		type:        'number',
		group:       'data',
		description: ''
	},
	size_sqm:          {
		code:        'size_sqm',
		name:        'size Sqm',
		type:        'number',
		group:       'data',
		description: ''
	},
	sku:               {
		code:        'sku',
		name:        'sku',
		type:        'text',
		group:       'data',
		description: ''
	},
	sku_snapshot:      {
		code:        'sku_snapshot',
		name:        'sku Snapshot',
		type:        'text',
		group:       'data',
		description: ''
	},
	slot:              {
		code:        'slot',
		name:        'slot',
		type:        'text',
		group:       'data',
		description: ''
	},
	slot_minutes:      {
		code:        'slot_minutes',
		name:        'slot Minutes',
		type:        'number',
		group:       'data',
		description: ''
	},
	slugJours:         {
		code:        'slugJours',
		name:        'slug jours',
		type:        'text',
		group:       'data',
		description: ''
	},
	slugProduit:       {
		code:        'slugProduit',
		name:        'slug produit',
		type:        'text',
		group:       'data',
		description: ''
	},
	slugProduit_categorie:{
		code:        'slugProduit_categorie',
		name:        'slugproduit Categorie',
		type:        'text',
		group:       'data',
		description: ''
	},
	slugSecteur:       {
		code:        'slugSecteur',
		name:        'slug secteur',
		type:        'text',
		group:       'data',
		description: ''
	},
	slugShop:          {
		code:        'slugShop',
		name:        'slug shop',
		type:        'text',
		group:       'data',
		description: ''
	},
	slugVille:         {
		code:        'slugVille',
		name:        'slug ville',
		type:        'text',
		group:       'data',
		description: ''
	},
	social_security_no:{
		code:        'social_security_no',
		name:        'social Security No',
		type:        'text',
		group:       'data',
		description: ''
	},
	source:            {
		code:        'source',
		name:        'source',
		type:        'text',
		group:       'data',
		description: ''
	},
	special_requests:  {
		code:        'special_requests',
		name:        'special Requests',
		type:        'text-lg',
		group:       'data',
		description: ''
	},
	specialty:         {
		code:        'specialty',
		name:        'specialty',
		type:        'text',
		group:       'data',
		description: ''
	},
	speech_lip_sync:   {
		code:        'speech_lip_sync',
		name:        'speech Lip Sync',
		type:        'boolean',
		group:       'flags',
		description: ''
	},
	speech_mood:       {
		code:        'speech_mood',
		name:        'speech Mood',
		type:        'text',
		group:       'data',
		description: ''
	},
	speech_style:      {
		code:        'speech_style',
		name:        'speech Style',
		type:        'text',
		group:       'data',
		description: ''
	},
	speech_text:       {
		code:        'speech_text',
		name:        'speech Text',
		type:        'text',
		group:       'data',
		description: ''
	},
	speech_volume:     {
		code:        'speech_volume',
		name:        'speech Volume',
		type:        'number',
		group:       'data',
		description: ''
	},
	stake:             {
		code:        'stake',
		name:        'stake',
		type:        'currency',
		group:       'pricing',
		description: ''
	},
	standard_cost:     {
		code:        'standard_cost',
		name:        'standard Cost',
		type:        'currency',
		group:       'pricing',
		description: ''
	},
	stars:             {
		code:        'stars',
		name:        'stars',
		type:        'number',
		group:       'data',
		description: ''
	},
	startDate:         {
		code:        'startDate',
		name:        'start date',
		type:        'date',
		group:       'date',
		description: ''
	},
	startTime:         {
		code:        'startTime',
		name:        'start time',
		type:        'datetime',
		group:       'date',
		description: ''
	},
	start_date:        {
		code:        'start_date',
		name:        'start Date',
		type:        'date',
		group:       'date',
		description: ''
	},
	start_ms:          {
		code:        'start_ms',
		name:        'start Ms',
		type:        'number',
		group:       'data',
		description: ''
	},
	start_time:        {
		code:        'start_time',
		name:        'start Time',
		type:        'text',
		group:       'data',
		description: ''
	},
	started_at:        {
		code:        'started_at',
		name:        'started At',
		type:        'date',
		group:       'date',
		description: ''
	},
	started_year:      {
		code:        'started_year',
		name:        'started Year',
		type:        'number',
		group:       'data',
		description: ''
	},
	statement_date:    {
		code:        'statement_date',
		name:        'statement Date',
		type:        'date',
		group:       'date',
		description: ''
	},
	station:           {
		code:        'station',
		name:        'station',
		type:        'text',
		group:       'data',
		description: ''
	},
	steps_to_reproduce:{
		code:        'steps_to_reproduce',
		name:        'steps To Reproduce',
		type:        'text-lg',
		group:       'data',
		description: ''
	},
	still_image:       {
		code:        'still_image',
		name:        'still Image',
		type:        'image',
		group:       'data',
		description: ''
	},
	stock:             {
		code:        'stock',
		name:        'stock',
		type:        'number',
		group:       'data',
		description: ''
	},
	stock_qty:         {
		code:        'stock_qty',
		name:        'stock Qty',
		type:        'number',
		group:       'data',
		description: ''
	},
	stop_sell:         {
		code:        'stop_sell',
		name:        'stop Sell',
		type:        'boolean',
		group:       'flags',
		description: ''
	},
	story_points:      {
		code:        'story_points',
		name:        'story Points',
		type:        'number',
		group:       'data',
		description: ''
	},
	street:            {
		code:        'street',
		name:        'street',
		type:        'text',
		group:       'data',
		description: ''
	},
	street2:           {
		code:        'street2',
		name:        'street2',
		type:        'text',
		group:       'data',
		description: ''
	},
	strengths:         {
		code:        'strengths',
		name:        'strengths',
		type:        'text-lg',
		group:       'data',
		description: ''
	},
	strip_key:         {
		code:        'strip_key',
		name:        'strip Key',
		type:        'text',
		group:       'data',
		description: ''
	},
	subject:           {
		code:        'subject',
		name:        'subject',
		type:        'text',
		group:       'data',
		description: ''
	},
	subtitle:          {
		code:        'subtitle',
		name:        'subtitle',
		type:        'text',
		group:       'data',
		description: ''
	},
	subtotal:          {
		code:        'subtotal',
		name:        'subtotal',
		type:        'currency',
		group:       'pricing',
		description: ''
	},
	sum_value:         {
		code:        'sum_value',
		name:        'sum Value',
		type:        'number',
		group:       'data',
		description: ''
	},
	summary:           {
		code:        'summary',
		name:        'summary',
		type:        'text-lg',
		group:       'data',
		description: ''
	},
	supplierOrder:     {
		code:        'supplierOrder',
		name:        'supplier order',
		type:        'text',
		group:       'data',
		description: ''
	},
	supplierShortName: {
		code:        'supplierShortName',
		name:        'supplier short name',
		type:        'text',
		group:       'data',
		description: ''
	},
	supplierTypePrefix:{
		code:        'supplierTypePrefix',
		name:        'supplier type prefix',
		type:        'text',
		group:       'data',
		description: ''
	},
	supplier_sku:      {
		code:        'supplier_sku',
		name:        'supplier Sku',
		type:        'text',
		group:       'data',
		description: ''
	},
	symbol:            {
		code:        'symbol',
		name:        'symbol',
		type:        'text',
		group:       'data',
		description: ''
	},
	synopsis:          {
		code:        'synopsis',
		name:        'synopsis',
		type:        'text-lg',
		group:       'data',
		description: ''
	},
	table:             {
		code:        'table',
		name:        'table',
		type:        'text',
		group:       'data',
		description: ''
	},
	table_value:       {
		code:        'table_value',
		name:        'table Value',
		type:        'text',
		group:       'data',
		description: ''
	},
	tagline:           {
		code:        'tagline',
		name:        'tagline',
		type:        'text',
		group:       'data',
		description: ''
	},
	tail_dir:          {
		code:        'tail_dir',
		name:        'tail Dir',
		type:        'text',
		group:       'data',
		description: ''
	},
	target_date:       {
		code:        'target_date',
		name:        'target Date',
		type:        'date',
		group:       'date',
		description: ''
	},
	task_date:         {
		code:        'task_date',
		name:        'task Date',
		type:        'date',
		group:       'date',
		description: ''
	},
	tax:               {
		code:        'tax',
		name:        'tax',
		type:        'currency',
		group:       'pricing',
		description: ''
	},
	tax_amount:        {
		code:        'tax_amount',
		name:        'tax Amount',
		type:        'currency',
		group:       'pricing',
		description: ''
	},
	tax_id:            {
		code:        'tax_id',
		name:        'tax Id',
		type:        'text',
		group:       'data',
		description: ''
	},
	tax_total:         {
		code:        'tax_total',
		name:        'tax Total',
		type:        'currency',
		group:       'pricing',
		description: ''
	},
	technician:        {
		code:        'technician',
		name:        'technician',
		type:        'text',
		group:       'data',
		description: ''
	},
	temp_celsius:      {
		code:        'temp_celsius',
		name:        'temp Celsius',
		type:        'number',
		group:       'data',
		description: ''
	},
	temperature_c:     {
		code:        'temperature_c',
		name:        'temperature C',
		type:        'number',
		group:       'data',
		description: ''
	},
	tempsAnnonce:      {
		code:        'tempsAnnonce',
		name:        'temps annonce',
		type:        'text',
		group:       'data',
		description: ''
	},
	tempsAttente:      {
		code:        'tempsAttente',
		name:        'temps attente',
		type:        'text',
		group:       'data',
		description: ''
	},
	text:              {
		code:        'text',
		name:        'text',
		type:        'text-lg',
		group:       'data',
		description: ''
	},
	threshold:         {
		code:        'threshold',
		name:        'threshold',
		type:        'number',
		group:       'data',
		description: ''
	},
	threshold_high:    {
		code:        'threshold_high',
		name:        'threshold High',
		type:        'number',
		group:       'data',
		description: ''
	},
	ticket_number:     {
		code:        'ticket_number',
		name:        'ticket Number',
		type:        'text',
		group:       'data',
		description: ''
	},
	ticket_ref:        {
		code:        'ticket_ref',
		name:        'ticket Ref',
		type:        'text',
		group:       'data',
		description: ''
	},
	tier_1_sector:     {
		code:        'tier_1_sector',
		name:        'tier 1 Sector',
		type:        'boolean',
		group:       'flags',
		description: ''
	},
	time:              {
		code:        'time',
		name:        'time',
		type:        'number',
		group:       'data',
		description: ''
	},
	tip:               {
		code:        'tip',
		name:        'tip',
		type:        'currency',
		group:       'pricing',
		description: ''
	},
	tmdb_id:           {
		code:        'tmdb_id',
		name:        'tmdb Id',
		type:        'text',
		group:       'data',
		description: ''
	},
	topic:             {
		code:        'topic',
		name:        'topic',
		type:        'text',
		group:       'data',
		description: ''
	},
	total_commande_client:{
		code:        'total_commande_client',
		name:        'total Commande Client',
		type:        'text',
		group:       'data',
		description: ''
	},
	total_credit:      {
		code:        'total_credit',
		name:        'total Credit',
		type:        'currency',
		group:       'pricing',
		description: ''
	},
	total_debit:       {
		code:        'total_debit',
		name:        'total Debit',
		type:        'currency',
		group:       'pricing',
		description: ''
	},
	total_livraison_commande:{
		code:        'total_livraison_commande',
		name:        'total Livraison Commande',
		type:        'text',
		group:       'data',
		description: ''
	},
	total_price:       {
		code:        'total_price',
		name:        'total Price',
		type:        'currency',
		group:       'pricing',
		description: ''
	},
	total_rooms:       {
		code:        'total_rooms',
		name:        'total Rooms',
		type:        'number',
		group:       'data',
		description: ''
	},
	track_stock:       {
		code:        'track_stock',
		name:        'track Stock',
		type:        'boolean',
		group:       'flags',
		description: ''
	},
	trailer_url:       {
		code:        'trailer_url',
		name:        'trailer Url',
		type:        'url',
		group:       'contact',
		description: ''
	},
	treatment_plan:    {
		code:        'treatment_plan',
		name:        'treatment Plan',
		type:        'text-lg',
		group:       'data',
		description: ''
	},
	triggered_at:      {
		code:        'triggered_at',
		name:        'triggered At',
		type:        'date',
		group:       'date',
		description: ''
	},
	triggered_value:   {
		code:        'triggered_value',
		name:        'triggered Value',
		type:        'number',
		group:       'data',
		description: ''
	},
	tts_engine:        {
		code:        'tts_engine',
		name:        'tts Engine',
		type:        'text',
		group:       'data',
		description: ''
	},
	twitter:           {
		code:        'twitter',
		name:        'twitter',
		type:        'text',
		group:       'data',
		description: ''
	},
	uniqid:            {
		code:        'uniqid',
		name:        'uniqid',
		type:        'text',
		group:       'data',
		description: ''
	},
	unit:              {
		code:        'unit',
		name:        'unit',
		type:        'text',
		group:       'data',
		description: ''
	},
	unit_price:        {
		code:        'unit_price',
		name:        'unit Price',
		type:        'currency',
		group:       'pricing',
		description: ''
	},
	updatedAt:         {
		code:        'updatedAt',
		name:        'updated at',
		type:        'date',
		group:       'date',
		description: ''
	},
	updated_at:        {
		code:        'updated_at',
		name:        'updated At',
		type:        'date',
		group:       'date',
		description: ''
	},
	uploaded_at:       {
		code:        'uploaded_at',
		name:        'uploaded At',
		type:        'date',
		group:       'date',
		description: ''
	},
	used_count:        {
		code:        'used_count',
		name:        'used Count',
		type:        'number',
		group:       'data',
		description: ''
	},
	valeurArgus:       {
		code:        'valeurArgus',
		name:        'valeur argus',
		type:        'text',
		group:       'data',
		description: ''
	},
	valeur_texte:      {
		code:        'valeur_texte',
		name:        'valeur Texte',
		type:        'text',
		group:       'data',
		description: ''
	},
	valid_from:        {
		code:        'valid_from',
		name:        'valid From',
		type:        'date',
		group:       'date',
		description: ''
	},
	valid_until:       {
		code:        'valid_until',
		name:        'valid Until',
		type:        'date',
		group:       'date',
		description: ''
	},
	value_date:        {
		code:        'value_date',
		name:        'value Date',
		type:        'date',
		group:       'date',
		description: ''
	},
	vatRateFR:         {
		code:        'vatRateFR',
		name:        'vat rate f r',
		type:        'text',
		group:       'data',
		description: ''
	},
	vatRateHUE:        {
		code:        'vatRateHUE',
		name:        'vat rate h u e',
		type:        'text',
		group:       'data',
		description: ''
	},
	vatRateUE:         {
		code:        'vatRateUE',
		name:        'vat rate u e',
		type:        'text',
		group:       'data',
		description: ''
	},
	verified:          {
		code:        'verified',
		name:        'verified',
		type:        'boolean',
		group:       'flags',
		description: ''
	},
	viewCount:         {
		code:        'viewCount',
		name:        'view count',
		type:        'number',
		group:       'data',
		description: ''
	},
	view_count:        {
		code:        'view_count',
		name:        'view Count',
		type:        'number',
		group:       'data',
		description: ''
	},
	villeSite:         {
		code:        'villeSite',
		name:        'ville site',
		type:        'url',
		group:       'contact',
		description: ''
	},
	vip:               {
		code:        'vip',
		name:        'vip',
		type:        'boolean',
		group:       'flags',
		description: ''
	},
	visaInfo:          {
		code:        'visaInfo',
		name:        'visa info',
		type:        'text',
		group:       'data',
		description: ''
	},
	visit_count:       {
		code:        'visit_count',
		name:        'visit Count',
		type:        'number',
		group:       'data',
		description: ''
	},
	vmmCouleurMateriel:{
		code:        'vmmCouleurMateriel',
		name:        'vmm couleur materiel',
		type:        'text',
		group:       'data',
		description: ''
	},
	vmmNBMateriel:     {
		code:        'vmmNBMateriel',
		name:        'vmm n b materiel',
		type:        'text',
		group:       'data',
		description: ''
	},
	vu:                {
		code:        'vu',
		name:        'vu',
		type:        'text',
		group:       'data',
		description: ''
	},
	warranty_months:   {
		code:        'warranty_months',
		name:        'warranty Months',
		type:        'number',
		group:       'data',
		description: ''
	},
	watched_at:        {
		code:        'watched_at',
		name:        'watched At',
		type:        'date',
		group:       'date',
		description: ''
	},
	weather:           {
		code:        'weather',
		name:        'weather',
		type:        'text',
		group:       'data',
		description: ''
	},
	webName:           {
		code:        'webName',
		name:        'web name',
		type:        'text',
		group:       'data',
		description: ''
	},
	webPlural:         {
		code:        'webPlural',
		name:        'web plural',
		type:        'text',
		group:       'data',
		description: ''
	},
	website:           {
		code:        'website',
		name:        'website',
		type:        'url',
		group:       'contact',
		description: ''
	},
	weight:            {
		code:        'weight',
		name:        'weight',
		type:        'number',
		group:       'data',
		description: ''
	},
	weight_kg:         {
		code:        'weight_kg',
		name:        'weight Kg',
		type:        'number',
		group:       'data',
		description: ''
	},
	width_pct:         {
		code:        'width_pct',
		name:        'width Pct',
		type:        'number',
		group:       'data',
		description: ''
	},
	width_px:          {
		code:        'width_px',
		name:        'width Px',
		type:        'number',
		group:       'data',
		description: ''
	},
	win_count:         {
		code:        'win_count',
		name:        'win Count',
		type:        'number',
		group:       'data',
		description: ''
	},
	window_sec:        {
		code:        'window_sec',
		name:        'window Sec',
		type:        'number',
		group:       'data',
		description: ''
	},
	wishLetter:        {
		code:        'wishLetter',
		name:        'wish letter',
		type:        'text-long',
		group:       'data',
		description: ''
	},
	wo_number:         {
		code:        'wo_number',
		name:        'wo Number',
		type:        'text',
		group:       'data',
		description: ''
	},
	word_count:        {
		code:        'word_count',
		name:        'word Count',
		type:        'number',
		group:       'data',
		description: ''
	},
	work_date:         {
		code:        'work_date',
		name:        'work Date',
		type:        'date',
		group:       'date',
		description: ''
	},
	x_pct:             {
		code:        'x_pct',
		name:        'x Pct',
		type:        'number',
		group:       'data',
		description: ''
	},
	x_pos:             {
		code:        'x_pos',
		name:        'x Pos',
		type:        'number',
		group:       'data',
		description: ''
	},
	y_pct:             {
		code:        'y_pct',
		name:        'y Pct',
		type:        'number',
		group:       'data',
		description: ''
	},
	y_pos:             {
		code:        'y_pos',
		name:        'y Pos',
		type:        'number',
		group:       'data',
		description: ''
	},
	year:              {
		code:        'year',
		name:        'year',
		type:        'number',
		group:       'data',
		description: ''
	},
	years:             {
		code:        'years',
		name:        'years',
		type:        'number',
		group:       'data',
		description: ''
	},
	years_experience:  {
		code:        'years_experience',
		name:        'years Experience',
		type:        'number',
		group:       'data',
		description: ''
	},
	zone:              {
		code:        'zone',
		name:        'zone',
		type:        'text',
		group:       'data',
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
