/**
 * Types generated from SCHEMA.md
 * TypeScript representations of schema-driven metadata collections
 */

// --- Reusable utility fields ---



/* Defaults available fields for all collections */
export const FieldList= {
  // AUDIT
  actorId: { code: 'actorId', name: "actor id", type: 'number', group: 'audit', description: "Unique identifier of the user or system process that performed the action" },
  changes: { code: 'changes', name: "changes", type: 'json', group: 'audit', description: "Detailed record of modified values comparing previous and current states" },
  createdBy: { code: 'createdBy', name: "created by", type: 'text', group: 'audit', description: "Username or ID of the person who originally created this record" },
  details: { code: 'details', name: "details", type: 'json', group: 'audit', description: "Additional contextual information related to the event or record" },
  scheme: { code: 'scheme', name: "collection name", type: 'text', group: 'audit', description: "Internal name of the data collection or table this record belongs to" },
  updatedBy: { code: 'updatedBy', name: "updated by", type: 'text', group: 'audit', description: "Username or ID of the person who last modified this record" },
  version: { code: 'version', name: "version", type: 'number', group: 'audit', description: "Incremental version number used for optimistic locking and tracking" },

  // CLASSIFICATION
  duree: { code: 'duree', name: "duration", type: 'number', group: 'classification', description: "Length of time or period associated with this item" },
  order: { code: 'order', name: "order", type: 'number', group: 'classification', description: "Numerical value used for custom sorting in lists" },
  ordre: { code: 'ordre', name: "rank order", type: 'number', group: 'classification', description: "Specific hierarchical position within a sorted group" },
  rang: { code: 'rang', name: "rank", type: 'number', group: 'classification', description: "Relative level or grade assigned to this item" },
  type: { code: 'type', name: "type", type: 'text', group: 'classification', description: "Category or classification of the record" },

  // CODIFICATION
  ccn: { code: 'ccn', name: "ccn", type: 'text', group: 'codification', description: "Collective bargaining agreement code (Convention Collective Nationale)" },
  code: { code: 'code', name: "code", type: 'text', group: 'codification', description: "Unique alphanumeric short identifier" },
  codeBarre: { code: 'codeBarre', name: "barcode", type: 'text', group: 'codification', description: "Standard barcode string for scanning and identification" },
  codeEan: { code: 'codeEan', name: "ean code", type: 'text', group: 'codification', description: "European Article Numbering for global product tracking" },
  ref: { code: 'ref', name: "ref", type: 'text', group: 'codification', description: "Short internal reference code" },
  reference: { code: 'reference', name: "reference", type: 'text', group: 'codification', description: "Official reference number or string" },
  slug: { code: 'slug', name: "slug", type: 'text', group: 'codification', description: "URL-friendly version of the name or title" },

  // CONTACT
  email: { code: 'email', name: "email", type: 'email', group: 'contact', description: "Main electronic mail address" },
  civilite: { code: 'civilite', name: "civility", type: 'text', group: 'contact', description: "Formal title or salutation (e.g., Mr, Ms)" },
  fax: { code: 'fax', name: "fax", type: 'text', group: 'contact', description: "Facsimile transmission number" },
  mobile: { code: 'mobile', name: "mobile", type: 'text', group: 'contact', description: "Primary mobile or cellular phone number" },
  mobile2: { code: 'mobile2', name: "mobile 2", type: 'text', group: 'contact', description: "Secondary mobile or cellular phone number" },
  telephone: { code: 'telephone', name: "phone", type: 'text', group: 'contact', description: "Primary landline or contact phone number" },
  telephone2: { code: 'telephone2', name: "phone 2", type: 'text', group: 'contact', description: "Secondary landline or contact phone number" },
  whatsapp: { code: 'whatsapp', name: "whatsapp", type: 'text', group: 'contact', description: "WhatsApp messaging ID or phone number" },
  linkedin: { code: 'linkedin', name: "linkedin", type: 'url', group: 'contact', description: "Link to public LinkedIn professional profile" },
  url: { code: 'url', name: "url", type: 'url', group: 'contact', description: "Website address or external resource link" },

  // DATE
  date: { code: 'date', name: "date", type: 'date', group: 'date', description: "Generic date value" },
  dateDebut: { code: 'dateDebut', name: "start date", type: 'date', group: 'date', description: "Effective beginning date of an event or period" },
  dateFin: { code: 'dateFin', name: "end date", type: 'date', group: 'date', description: "Expiration or completion date of an event or period" },
  dateInstallation: { code: 'dateInstallation', name: "installation date", type: 'date', group: 'date', description: "Date when the equipment or service was set up" },
  dateQuantieme: { code: 'dateQuantieme', name: "day of year", type: 'date', group: 'date', description: "Specific ordinal day within the calendar year" },
  dateCreation: { code: 'dateCreation', name: "creation date", type: 'datetime', group: 'date', description: "Exact timestamp when the record was first stored" },
  dateCreated: { code: 'dateCreated', name: "date created", type: 'datetime', group: 'date', description: "Audit date for initial record creation" },
  dateUpdated: { code: 'dateUpdated', name: "date updated", type: 'datetime', group: 'date', description: "Audit date for the most recent modification" },
  heureCreation: { code: 'heureCreation', name: "creation time", type: 'datetime', group: 'date', description: "Time part of the initial record creation" },
  timestamp: { code: 'timestamp', name: "timestamp", type: 'datetime', group: 'date', description: "Server-generated unique time identifier" },
  heure: { code: 'heure', name: "time", type: 'text', group: 'date', description: "Generic time of day" },
  heureDebut: { code: 'heureDebut', name: "start time", type: 'text', group: 'date', description: "Specific time when an event begins" },
  heureFin: { code: 'heureFin', name: "end time", type: 'text', group: 'date', description: "Specific time when an event ends" },

  // FINANCE
  bic: { code: 'bic', name: "bic", type: 'text', group: 'finance', description: "Bank Identifier Code for international transfers" },
  devise: { code: 'devise', name: "currency", type: 'text', group: 'finance', description: "Standard currency code (e.g., EUR, USD, GBP)" },
  iban: { code: 'iban', name: "iban", type: 'text', group: 'finance', description: "International Bank Account Number" },
  marge: { code: 'marge', name: "margin", type: 'number', group: 'finance', description: "Profit margin amount for this item" },
  montant: { code: 'montant', name: "amount", type: 'number', group: 'finance', description: "General monetary value" },
  montantEcheance: { code: 'montantEcheance', name: "due amount", type: 'number', group: 'finance', description: "Amount due for a specific payment deadline" },
  montantHt: { code: 'montantHt', name: "amount excl tax", type: 'number', group: 'finance', description: "Monetary total excluding value added tax" },
  montantRachat: { code: 'montantRachat', name: "buyback amount", type: 'number', group: 'finance', description: "Estimated or actual value for item buyback" },
  prix: { code: 'prix', name: "price", type: 'number', group: 'finance', description: "Standard unit price" },
  prixHt: { code: 'prixHt', name: "price excl tax", type: 'number', group: 'finance', description: "Unit price without taxes" },
  prixTtc: { code: 'prixTtc', name: "price incl tax", type: 'number', group: 'finance', description: "Unit price including all taxes" },
  taux: { code: 'taux', name: "rate", type: 'number', group: 'finance', description: "Interest or calculation rate percentage" },
  total: { code: 'total', name: "total", type: 'number', group: 'finance', description: "Grand total amount" },
  totalHt: { code: 'totalHt', name: "total excl tax", type: 'number', group: 'finance', description: "Aggregated total without taxes" },
  totalMarge: { code: 'totalMarge', name: "total margin", type: 'number', group: 'finance', description: "Aggregated profit margin" },
  totalTtc: { code: 'totalTtc', name: "total incl tax", type: 'number', group: 'finance', description: "Aggregated total including all taxes" },
  totalTva: { code: 'totalTva', name: "total vat", type: 'number', group: 'finance', description: "Aggregated value added tax amount" },
  tva: { code: 'tva', name: "vat rate", type: 'number', group: 'finance', description: "Tax percentage rate applied" },
  valeur: { code: 'valeur', name: "value", type: 'number', group: 'finance', description: "Appraised or numerical value" },

  // IDENTIFICATION
  id: { code: 'id', name: "id", type: 'number', group: 'identification', description: "Primary unique identifier for the record" },
  userName: { code: 'userName', name: "username", type: 'text', group: 'identification', description: "Login name or handle used to identify a user" },

  // INVENTORY
  quantite: { code: 'quantite', name: "quantity", type: 'number', group: 'inventory', description: "Current count or volume of items in stock" },

  // LOCATION
  latitude: { code: 'latitude', name: "latitude", type: 'number', group: 'location', description: "Geographic coordinate for north-south position" },
  longitude: { code: 'longitude', name: "longitude", type: 'number', group: 'location', description: "Geographic coordinate for east-west position" },
  adresse: { code: 'adresse', name: "address", type: 'text', group: 'location', description: "Full street address" },
  codePostal: { code: 'codePostal', name: "zip code", type: 'text', group: 'location', description: "Postal or zip code for the area" },
  complementAdresse: { code: 'complementAdresse', name: "address complement", type: 'text', group: 'location', description: "Additional building, floor, or suite details" },
  pays: { code: 'pays', name: "country", type: 'text', group: 'location', description: "Country name or code" },
  ville: { code: 'ville', name: "city", type: 'text', group: 'location', description: "Name of the city or municipality" },

  // METRICS
  compteurCouleur: { code: 'compteurCouleur', name: "color counter", type: 'number', group: 'metrics', description: "Accumulated count for color-specific printing or usage" },
  compteurNB: { code: 'compteurNB', name: "bw counter", type: 'number', group: 'metrics', description: "Accumulated count for black and white printing or usage" },
  height: { code: 'height', name: "height", type: 'number', group: 'metrics', description: "Vertical dimension of the object" },
  length: { code: 'length', name: "length", type: 'number', group: 'metrics', description: "Longest horizontal dimension of the object" },
  poids: { code: 'poids', name: "weight", type: 'number', group: 'metrics', description: "Generic mass or weight of the item" },
  poidsBrut: { code: 'poidsBrut', name: "gross weight", type: 'number', group: 'metrics', description: "Total weight including packaging and contents" },
  poidsNet: { code: 'poidsNet', name: "net weight", type: 'number', group: 'metrics', description: "Weight of the contents alone without packaging" },
  size: { code: 'size', name: "size", type: 'number', group: 'metrics', description: "General scale or size dimension" },
  surface: { code: 'surface', name: "surface", type: 'number', group: 'metrics', description: "Total area coverage" },
  vmmCouleur: { code: 'vmmCouleur', name: "vmm color", type: 'number', group: 'metrics', description: "Maintenance metric for color print volume" },
  vmmNB: { code: 'vmmNB', name: "vmm bw", type: 'number', group: 'metrics', description: "Maintenance metric for black and white print volume" },
  width: { code: 'width', name: "width", type: 'number', group: 'metrics', description: "Horizontal side-to-side dimension" },

  // PRESENTATION
  image: { code: 'image', name: "image", type: 'image', group: 'presentation', description: "Primary visual representation or photograph" },
  imageLarge: { code: 'imageLarge', name: "large image", type: 'image', group: 'presentation', description: "High-resolution wide-format image" },
  imageLong: { code: 'imageLong', name: "long image", type: 'image', group: 'presentation', description: "Vertical or panoramic tall image format" },
  imageMini: { code: 'imageMini', name: "mini image", type: 'image', group: 'presentation', description: "Small icon or preview image" },
  imageSquare: { code: 'imageSquare', name: "square image", type: 'image', group: 'presentation', description: "1:1 aspect ratio image" },
  thumbnail: { code: 'thumbnail', name: "thumbnail", type: 'image', group: 'presentation', description: "Small compressed preview of the original image" },
  atout: { code: 'atout', name: "asset", type: 'text', group: 'presentation', description: "Key benefit or specific asset value" },
  cccoul: { code: 'cccoul', name: "color code", type: 'text', group: 'presentation', description: "Hexadecimal or named color reference" },
  color: { code: 'color', name: "color", type: 'text', group: 'presentation', description: "Visual color attribute" },
  icon: { code: 'icon', name: "icon", type: 'text', group: 'presentation', description: "Graphical symbol name or reference" },
  lastName: { code: 'lastName', name: "last name", type: 'text', group: 'presentation', description: "Family or surname" },
  localization: { code: 'localization', name: "localization", type: 'text', group: 'presentation', description: "Language or region-specific setting" },
  name: { code: 'name', name: "name", type: 'text', group: 'presentation', description: "General title or label" },
  nom: { code: 'nom', name: "surname", type: 'text', group: 'presentation', description: "Alternative surname or name field" },
  petitNom: { code: 'petitNom', name: "nickname", type: 'text', group: 'presentation', description: "Informal or preferred name" },
  prenom: { code: 'prenom', name: "first name", type: 'text', group: 'presentation', description: "Given or individual name" },
  resultat: { code: 'resultat', name: "result", type: 'text', group: 'presentation', description: "The outcome or summary value of a process" },
  tags: { code: 'tags', name: "tags", type: 'text', group: 'presentation', description: "Keywords or labels for grouping and search" },
  description: { code: 'description', name: "description", type: 'text-block', group: 'presentation', description: "Detailed multi-line explanation or narrative" },
  legend: { code: 'legend', name: "legend", type: 'text-line', group: 'presentation', description: "Brief caption or explanatory text for visuals" },

  // PROGRESS
  range: { code: 'range', name: "range", type: 'range', group: 'progress', description: "Numerical interval or boundary for progress" },
  status: { code: 'status', name: "status", type: 'status', group: 'progress', description: "Current state in a lifecycle or workflow" },

  // QUANTITY
  gramme: { code: 'gramme', name: "grams", type: 'number', group: 'quantity', description: "Metric unit of mass (g)" },
  litre: { code: 'litre', name: "liters", type: 'number', group: 'quantity', description: "Metric unit of liquid volume (L)" },
  metre: { code: 'metre', name: "meters", type: 'number', group: 'quantity', description: "Metric unit of length (m)" },
  volume: { code: 'volume', name: "volume", type: 'number', group: 'quantity', description: "Total space occupied by an object" },

  // SECURITY
  mailPassword: { code: 'mailPassword', name: "mail password", type: 'password', group: 'security', description: "Encrypted password for email service access" },
  password: { code: 'password', name: "password", type: 'password', group: 'security', description: "Secret string for account authentication" },
  login: { code: 'login', name: "login", type: 'text', group: 'security', description: "Identifier used to initiate a secure session" },

  // STATUS
  actif: { code: 'actif', name: "active", type: 'boolean', group: 'status', description: "Indicates if the record is currently operational and in use" },
  isLocked: { code: 'isLocked', name: "is locked", type: 'boolean', group: 'status', description: "Prevents modification by unauthorized users" },
  isSystem: { code: 'isSystem', name: "is system", type: 'boolean', group: 'status', description: "Flags records that are vital for system operation" },

  // SYSTEM
  private: { code: 'private', name: "private", type: 'boolean', group: 'system', description: "Restricts visibility to internal or specific users" },
  readonly: { code: 'readonly', name: "read only", type: 'boolean', group: 'system', description: "Specifies that the field cannot be modified by the end-user" },
  required: { code: 'required', name: "required", type: 'boolean', group: 'system', description: "Mandates that this field must contain data before saving" },
  visible: { code: 'visible', name: "visible", type: 'boolean', group: 'system', description: "Toggles the field's presence in the user interface" }
} as const satisfies Record<string, Partial<AppSchemeField>>;


// --- Reusable utility fields ---
export type SchemeType = 'type' | 'group' | 'status' | 'range';
export type SchemeName = string;

export type Name = string;
export type Icon = string;
export type DateValue = string | Date;
export type Code = string;
export type ID = number | string;
export type Order = number;
export type Color = string;
export type Description = string;

export interface WithName { name?: Name; }
export interface WithIcon { icon?: Icon; }
export interface WithColor { color?: Color; }
export interface WithDate { dateCreated?: DateValue; dateUpdated?: DateValue; }
export interface WithCode { code?: Code; }
export interface WithID { id?: ID; }
export interface WithOrder { order?: Order; }

/** --- GENERAL TYPES --- **/

export type AppSchemeFieldTypeCode = 
  | 'text' | 'number' | 'date' | 'datetime' | 'boolean' 
  | 'select' | 'multiselect' | 'fk' | 'file' | 'image' 
  | 'textarea' | 'password' | 'email' | 'url'
  | (string & {});

export interface Extendable { [key: string]: unknown; }

export interface gridFksItem<T = any> extends Extendable {
  uid?: string;
  name: SchemeName;
  code: Code;
  icon: Icon;
  order: Order;
  multiple: boolean;
  required: boolean;
  scheme?: T;
}

export interface WithEssentials<T = any> extends Extendable, WithID, WithCode, WithName, WithColor, WithIcon, WithOrder {}

/** Base database definition */
export interface AppSchemeBase extends Extendable, WithID, WithCode, WithName {
  idappscheme_base: ID;
}

/** Main scheme definition */
export interface AppScheme<T = Record<string, any>> extends Extendable, WithEssentials<T> {
  idappscheme: ID;
  schemeType: SchemeType;
  gridFks?: { 
    [key: string]: gridFksItem
  };
}

/** Core scheme with explicit system relations */
export interface AppSchemeCore<T = Record<string, any>> extends AppScheme<T> {
  gridFks?: { 
    appscheme_base: gridFksItem<AppSchemeBase>, 
    appscheme_type: gridFksItem<AppSchemeType>,
    [key: string]: gridFksItem
  };
}

export interface AppSchemeType extends Extendable, WithEssentials {
  idappscheme_type: ID;
}

export interface AppSchemeFieldGroup extends Extendable, WithEssentials {
  idappscheme_field_group: ID;
}

export interface AppSchemeFieldType extends Extendable, WithEssentials {
  idappscheme_field_type: ID;
}

export interface AppSchemeField extends Extendable, WithEssentials {
  idappscheme_field: ID;
  description?: string;
  gridFks?: { 
    appscheme_field_type?: gridFksItem<AppSchemeFieldType>, 
    appscheme_field_group?: gridFksItem<AppSchemeFieldGroup> 
  };
}

export interface AppSchemeHasField extends Extendable, WithEssentials {
  idappscheme_has_field: ID;
  visible?: boolean;
  readonly?: boolean;
  required?: boolean;
  gridFks: { 
    appscheme: gridFksItem<AppScheme>, 
    appscheme_field: gridFksItem<AppSchemeField> 
  };
}

export interface AppSchemeHasTableField extends Extendable, WithEssentials {
  idappscheme_has_table_field: ID;
  gridFks: { 
    appscheme_field: gridFksItem<AppSchemeField>,
    appscheme_link: gridFksItem<AppScheme>
  };
}

export interface AppSchemeLog extends Extendable, WithID { 
  idappscheme_log: ID; 
  operation: 'create' | 'update' | 'delete'; 
  scheme?: SchemeName; 
  actorId?: ID; 
  timestamp?: DateValue; 
  details?: Extendable; 
  changes?: Extendable;
  gridFks?: {
    idappscheme: gridFksItem<AppScheme>
  };
}

export type AppSchemaCollection =
  | AppSchemeBase
  | AppScheme
  | AppSchemeField
  | AppSchemeFieldType
  | AppSchemeFieldGroup
  | AppSchemeHasField
  | AppSchemeHasTableField
  | AppSchemeType
  | AppSchemeLog;