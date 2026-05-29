/**
 * Types generated from SCHEMA.md
 * TypeScript representations of schema-driven metadata collections
 */
export declare const FieldList: {
    readonly actorId: {
        readonly code: "actorId";
        readonly name: "actor id";
        readonly type: "number";
        readonly group: "audit";
        readonly description: "Unique identifier of the user or system process that performed the action";
    };
    readonly changes: {
        readonly code: "changes";
        readonly name: "changes";
        readonly type: "json";
        readonly group: "audit";
        readonly description: "Detailed record of modified values comparing previous and current states";
    };
    readonly createdBy: {
        readonly code: "createdBy";
        readonly name: "created by";
        readonly type: "text";
        readonly group: "audit";
        readonly description: "Username or ID of the person who originally created this record";
    };
    readonly details: {
        readonly code: "details";
        readonly name: "details";
        readonly type: "json";
        readonly group: "audit";
        readonly description: "Additional contextual information related to the event or record";
    };
    readonly scheme: {
        readonly code: "scheme";
        readonly name: "collection name";
        readonly type: "text";
        readonly group: "audit";
        readonly description: "Internal name of the data collection or table this record belongs to";
    };
    readonly updatedBy: {
        readonly code: "updatedBy";
        readonly name: "updated by";
        readonly type: "text";
        readonly group: "audit";
        readonly description: "Username or ID of the person who last modified this record";
    };
    readonly version: {
        readonly code: "version";
        readonly name: "version";
        readonly type: "number";
        readonly group: "audit";
        readonly description: "Incremental version number used for optimistic locking and tracking";
    };
    readonly duree: {
        readonly code: "duree";
        readonly name: "duration";
        readonly type: "number";
        readonly group: "classification";
        readonly description: "Length of time or period associated with this item";
    };
    readonly order: {
        readonly code: "order";
        readonly name: "order";
        readonly type: "number";
        readonly group: "classification";
        readonly description: "Numerical value used for custom sorting in lists";
    };
    readonly ordre: {
        readonly code: "ordre";
        readonly name: "rank order";
        readonly type: "number";
        readonly group: "classification";
        readonly description: "Specific hierarchical position within a sorted group";
    };
    readonly rang: {
        readonly code: "rang";
        readonly name: "rank";
        readonly type: "number";
        readonly group: "classification";
        readonly description: "Relative level or grade assigned to this item";
    };
    readonly type: {
        readonly code: "type";
        readonly name: "type";
        readonly type: "text";
        readonly group: "classification";
        readonly description: "Category or classification of the record";
    };
    readonly ccn: {
        readonly code: "ccn";
        readonly name: "ccn";
        readonly type: "text";
        readonly group: "codification";
        readonly description: "Collective bargaining agreement code (Convention Collective Nationale)";
    };
    readonly code: {
        readonly code: "code";
        readonly name: "code";
        readonly type: "text";
        readonly group: "codification";
        readonly description: "Unique alphanumeric short identifier";
    };
    readonly codeBarre: {
        readonly code: "codeBarre";
        readonly name: "barcode";
        readonly type: "text";
        readonly group: "codification";
        readonly description: "Standard barcode string for scanning and identification";
    };
    readonly codeEan: {
        readonly code: "codeEan";
        readonly name: "ean code";
        readonly type: "text";
        readonly group: "codification";
        readonly description: "European Article Numbering for global product tracking";
    };
    readonly ref: {
        readonly code: "ref";
        readonly name: "ref";
        readonly type: "text";
        readonly group: "codification";
        readonly description: "Short internal reference code";
    };
    readonly reference: {
        readonly code: "reference";
        readonly name: "reference";
        readonly type: "text";
        readonly group: "codification";
        readonly description: "Official reference number or string";
    };
    readonly slug: {
        readonly code: "slug";
        readonly name: "slug";
        readonly type: "text";
        readonly group: "codification";
        readonly description: "URL-friendly version of the name or title";
    };
    readonly email: {
        readonly code: "email";
        readonly name: "email";
        readonly type: "email";
        readonly group: "contact";
        readonly description: "Main electronic mail address";
    };
    readonly civilite: {
        readonly code: "civilite";
        readonly name: "civility";
        readonly type: "text";
        readonly group: "contact";
        readonly description: "Formal title or salutation (e.g., Mr, Ms)";
    };
    readonly fax: {
        readonly code: "fax";
        readonly name: "fax";
        readonly type: "text";
        readonly group: "contact";
        readonly description: "Facsimile transmission number";
    };
    readonly mobile: {
        readonly code: "mobile";
        readonly name: "mobile";
        readonly type: "text";
        readonly group: "contact";
        readonly description: "Primary mobile or cellular phone number";
    };
    readonly mobile2: {
        readonly code: "mobile2";
        readonly name: "mobile 2";
        readonly type: "text";
        readonly group: "contact";
        readonly description: "Secondary mobile or cellular phone number";
    };
    readonly telephone: {
        readonly code: "telephone";
        readonly name: "phone";
        readonly type: "text";
        readonly group: "contact";
        readonly description: "Primary landline or contact phone number";
    };
    readonly telephone2: {
        readonly code: "telephone2";
        readonly name: "phone 2";
        readonly type: "text";
        readonly group: "contact";
        readonly description: "Secondary landline or contact phone number";
    };
    readonly whatsapp: {
        readonly code: "whatsapp";
        readonly name: "whatsapp";
        readonly type: "text";
        readonly group: "contact";
        readonly description: "WhatsApp messaging ID or phone number";
    };
    readonly linkedin: {
        readonly code: "linkedin";
        readonly name: "linkedin";
        readonly type: "url";
        readonly group: "contact";
        readonly description: "Link to public LinkedIn professional profile";
    };
    readonly url: {
        readonly code: "url";
        readonly name: "url";
        readonly type: "url";
        readonly group: "contact";
        readonly description: "Website address or external resource link";
    };
    readonly date: {
        readonly code: "date";
        readonly name: "date";
        readonly type: "date";
        readonly group: "date";
        readonly description: "Generic date value";
    };
    readonly dateDebut: {
        readonly code: "dateDebut";
        readonly name: "start date";
        readonly type: "date";
        readonly group: "date";
        readonly description: "Effective beginning date of an event or period";
    };
    readonly dateFin: {
        readonly code: "dateFin";
        readonly name: "end date";
        readonly type: "date";
        readonly group: "date";
        readonly description: "Expiration or completion date of an event or period";
    };
    readonly dateInstallation: {
        readonly code: "dateInstallation";
        readonly name: "installation date";
        readonly type: "date";
        readonly group: "date";
        readonly description: "Date when the equipment or service was set up";
    };
    readonly dateQuantieme: {
        readonly code: "dateQuantieme";
        readonly name: "day of year";
        readonly type: "date";
        readonly group: "date";
        readonly description: "Specific ordinal day within the calendar year";
    };
    readonly dateCreation: {
        readonly code: "dateCreation";
        readonly name: "creation date";
        readonly type: "datetime";
        readonly group: "date";
        readonly description: "Exact timestamp when the record was first stored";
    };
    readonly dateCreated: {
        readonly code: "dateCreated";
        readonly name: "date created";
        readonly type: "datetime";
        readonly group: "date";
        readonly description: "Audit date for initial record creation";
    };
    readonly dateUpdated: {
        readonly code: "dateUpdated";
        readonly name: "date updated";
        readonly type: "datetime";
        readonly group: "date";
        readonly description: "Audit date for the most recent modification";
    };
    readonly heureCreation: {
        readonly code: "heureCreation";
        readonly name: "creation time";
        readonly type: "datetime";
        readonly group: "date";
        readonly description: "Time part of the initial record creation";
    };
    readonly timestamp: {
        readonly code: "timestamp";
        readonly name: "timestamp";
        readonly type: "datetime";
        readonly group: "date";
        readonly description: "Server-generated unique time identifier";
    };
    readonly heure: {
        readonly code: "heure";
        readonly name: "time";
        readonly type: "text";
        readonly group: "date";
        readonly description: "Generic time of day";
    };
    readonly heureDebut: {
        readonly code: "heureDebut";
        readonly name: "start time";
        readonly type: "text";
        readonly group: "date";
        readonly description: "Specific time when an event begins";
    };
    readonly heureFin: {
        readonly code: "heureFin";
        readonly name: "end time";
        readonly type: "text";
        readonly group: "date";
        readonly description: "Specific time when an event ends";
    };
    readonly bic: {
        readonly code: "bic";
        readonly name: "bic";
        readonly type: "text";
        readonly group: "finance";
        readonly description: "Bank Identifier Code for international transfers";
    };
    readonly devise: {
        readonly code: "devise";
        readonly name: "currency";
        readonly type: "text";
        readonly group: "finance";
        readonly description: "Standard currency code (e.g., EUR, USD, GBP)";
    };
    readonly iban: {
        readonly code: "iban";
        readonly name: "iban";
        readonly type: "text";
        readonly group: "finance";
        readonly description: "International Bank Account Number";
    };
    readonly marge: {
        readonly code: "marge";
        readonly name: "margin";
        readonly type: "number";
        readonly group: "finance";
        readonly description: "Profit margin amount for this item";
    };
    readonly montant: {
        readonly code: "montant";
        readonly name: "amount";
        readonly type: "number";
        readonly group: "finance";
        readonly description: "General monetary value";
    };
    readonly montantEcheance: {
        readonly code: "montantEcheance";
        readonly name: "due amount";
        readonly type: "number";
        readonly group: "finance";
        readonly description: "Amount due for a specific payment deadline";
    };
    readonly montantHt: {
        readonly code: "montantHt";
        readonly name: "amount excl tax";
        readonly type: "number";
        readonly group: "finance";
        readonly description: "Monetary total excluding value added tax";
    };
    readonly montantRachat: {
        readonly code: "montantRachat";
        readonly name: "buyback amount";
        readonly type: "number";
        readonly group: "finance";
        readonly description: "Estimated or actual value for item buyback";
    };
    readonly prix: {
        readonly code: "prix";
        readonly name: "price";
        readonly type: "number";
        readonly group: "finance";
        readonly description: "Standard unit price";
    };
    readonly prixHt: {
        readonly code: "prixHt";
        readonly name: "price excl tax";
        readonly type: "number";
        readonly group: "finance";
        readonly description: "Unit price without taxes";
    };
    readonly prixTtc: {
        readonly code: "prixTtc";
        readonly name: "price incl tax";
        readonly type: "number";
        readonly group: "finance";
        readonly description: "Unit price including all taxes";
    };
    readonly taux: {
        readonly code: "taux";
        readonly name: "rate";
        readonly type: "number";
        readonly group: "finance";
        readonly description: "Interest or calculation rate percentage";
    };
    readonly total: {
        readonly code: "total";
        readonly name: "total";
        readonly type: "number";
        readonly group: "finance";
        readonly description: "Grand total amount";
    };
    readonly totalHt: {
        readonly code: "totalHt";
        readonly name: "total excl tax";
        readonly type: "number";
        readonly group: "finance";
        readonly description: "Aggregated total without taxes";
    };
    readonly totalMarge: {
        readonly code: "totalMarge";
        readonly name: "total margin";
        readonly type: "number";
        readonly group: "finance";
        readonly description: "Aggregated profit margin";
    };
    readonly totalTtc: {
        readonly code: "totalTtc";
        readonly name: "total incl tax";
        readonly type: "number";
        readonly group: "finance";
        readonly description: "Aggregated total including all taxes";
    };
    readonly totalTva: {
        readonly code: "totalTva";
        readonly name: "total vat";
        readonly type: "number";
        readonly group: "finance";
        readonly description: "Aggregated value added tax amount";
    };
    readonly tva: {
        readonly code: "tva";
        readonly name: "vat rate";
        readonly type: "number";
        readonly group: "finance";
        readonly description: "Tax percentage rate applied";
    };
    readonly valeur: {
        readonly code: "valeur";
        readonly name: "value";
        readonly type: "number";
        readonly group: "finance";
        readonly description: "Appraised or numerical value";
    };
    readonly id: {
        readonly code: "id";
        readonly name: "id";
        readonly type: "number";
        readonly group: "identification";
        readonly description: "Primary unique identifier for the record";
    };
    readonly userName: {
        readonly code: "userName";
        readonly name: "username";
        readonly type: "text";
        readonly group: "identification";
        readonly description: "Login name or handle used to identify a user";
    };
    readonly quantite: {
        readonly code: "quantite";
        readonly name: "quantity";
        readonly type: "number";
        readonly group: "inventory";
        readonly description: "Current count or volume of items in stock";
    };
    readonly latitude: {
        readonly code: "latitude";
        readonly name: "latitude";
        readonly type: "number";
        readonly group: "location";
        readonly description: "Geographic coordinate for north-south position";
    };
    readonly longitude: {
        readonly code: "longitude";
        readonly name: "longitude";
        readonly type: "number";
        readonly group: "location";
        readonly description: "Geographic coordinate for east-west position";
    };
    readonly adresse: {
        readonly code: "adresse";
        readonly name: "address";
        readonly type: "text";
        readonly group: "location";
        readonly description: "Full street address";
    };
    readonly codePostal: {
        readonly code: "codePostal";
        readonly name: "zip code";
        readonly type: "text";
        readonly group: "location";
        readonly description: "Postal or zip code for the area";
    };
    readonly complementAdresse: {
        readonly code: "complementAdresse";
        readonly name: "address complement";
        readonly type: "text";
        readonly group: "location";
        readonly description: "Additional building, floor, or suite details";
    };
    readonly pays: {
        readonly code: "pays";
        readonly name: "country";
        readonly type: "text";
        readonly group: "location";
        readonly description: "Country name or code";
    };
    readonly ville: {
        readonly code: "ville";
        readonly name: "city";
        readonly type: "text";
        readonly group: "location";
        readonly description: "Name of the city or municipality";
    };
    readonly compteurCouleur: {
        readonly code: "compteurCouleur";
        readonly name: "color counter";
        readonly type: "number";
        readonly group: "metrics";
        readonly description: "Accumulated count for color-specific printing or usage";
    };
    readonly compteurNB: {
        readonly code: "compteurNB";
        readonly name: "bw counter";
        readonly type: "number";
        readonly group: "metrics";
        readonly description: "Accumulated count for black and white printing or usage";
    };
    readonly height: {
        readonly code: "height";
        readonly name: "height";
        readonly type: "number";
        readonly group: "metrics";
        readonly description: "Vertical dimension of the object";
    };
    readonly length: {
        readonly code: "length";
        readonly name: "length";
        readonly type: "number";
        readonly group: "metrics";
        readonly description: "Longest horizontal dimension of the object";
    };
    readonly poids: {
        readonly code: "poids";
        readonly name: "weight";
        readonly type: "number";
        readonly group: "metrics";
        readonly description: "Generic mass or weight of the item";
    };
    readonly poidsBrut: {
        readonly code: "poidsBrut";
        readonly name: "gross weight";
        readonly type: "number";
        readonly group: "metrics";
        readonly description: "Total weight including packaging and contents";
    };
    readonly poidsNet: {
        readonly code: "poidsNet";
        readonly name: "net weight";
        readonly type: "number";
        readonly group: "metrics";
        readonly description: "Weight of the contents alone without packaging";
    };
    readonly size: {
        readonly code: "size";
        readonly name: "size";
        readonly type: "number";
        readonly group: "metrics";
        readonly description: "General scale or size dimension";
    };
    readonly surface: {
        readonly code: "surface";
        readonly name: "surface";
        readonly type: "number";
        readonly group: "metrics";
        readonly description: "Total area coverage";
    };
    readonly vmmCouleur: {
        readonly code: "vmmCouleur";
        readonly name: "vmm color";
        readonly type: "number";
        readonly group: "metrics";
        readonly description: "Maintenance metric for color print volume";
    };
    readonly vmmNB: {
        readonly code: "vmmNB";
        readonly name: "vmm bw";
        readonly type: "number";
        readonly group: "metrics";
        readonly description: "Maintenance metric for black and white print volume";
    };
    readonly width: {
        readonly code: "width";
        readonly name: "width";
        readonly type: "number";
        readonly group: "metrics";
        readonly description: "Horizontal side-to-side dimension";
    };
    readonly image: {
        readonly code: "image";
        readonly name: "image";
        readonly type: "image";
        readonly group: "presentation";
        readonly description: "Primary visual representation or photograph";
    };
    readonly imageLarge: {
        readonly code: "imageLarge";
        readonly name: "large image";
        readonly type: "image";
        readonly group: "presentation";
        readonly description: "High-resolution wide-format image";
    };
    readonly imageLong: {
        readonly code: "imageLong";
        readonly name: "long image";
        readonly type: "image";
        readonly group: "presentation";
        readonly description: "Vertical or panoramic tall image format";
    };
    readonly imageMini: {
        readonly code: "imageMini";
        readonly name: "mini image";
        readonly type: "image";
        readonly group: "presentation";
        readonly description: "Small icon or preview image";
    };
    readonly imageSquare: {
        readonly code: "imageSquare";
        readonly name: "square image";
        readonly type: "image";
        readonly group: "presentation";
        readonly description: "1:1 aspect ratio image";
    };
    readonly thumbnail: {
        readonly code: "thumbnail";
        readonly name: "thumbnail";
        readonly type: "image";
        readonly group: "presentation";
        readonly description: "Small compressed preview of the original image";
    };
    readonly atout: {
        readonly code: "atout";
        readonly name: "asset";
        readonly type: "text";
        readonly group: "presentation";
        readonly description: "Key benefit or specific asset value";
    };
    readonly cccoul: {
        readonly code: "cccoul";
        readonly name: "color code";
        readonly type: "text";
        readonly group: "presentation";
        readonly description: "Hexadecimal or named color reference";
    };
    readonly color: {
        readonly code: "color";
        readonly name: "color";
        readonly type: "text";
        readonly group: "presentation";
        readonly description: "Visual color attribute";
    };
    readonly icon: {
        readonly code: "icon";
        readonly name: "icon";
        readonly type: "text";
        readonly group: "presentation";
        readonly description: "Graphical symbol name or reference";
    };
    readonly lastName: {
        readonly code: "lastName";
        readonly name: "last name";
        readonly type: "text";
        readonly group: "presentation";
        readonly description: "Family or surname";
    };
    readonly localization: {
        readonly code: "localization";
        readonly name: "localization";
        readonly type: "text";
        readonly group: "presentation";
        readonly description: "Language or region-specific setting";
    };
    readonly name: {
        readonly code: "name";
        readonly name: "name";
        readonly type: "text";
        readonly group: "presentation";
        readonly description: "General title or label";
    };
    readonly nom: {
        readonly code: "nom";
        readonly name: "surname";
        readonly type: "text";
        readonly group: "presentation";
        readonly description: "Alternative surname or name field";
    };
    readonly petitNom: {
        readonly code: "petitNom";
        readonly name: "nickname";
        readonly type: "text";
        readonly group: "presentation";
        readonly description: "Informal or preferred name";
    };
    readonly prenom: {
        readonly code: "prenom";
        readonly name: "first name";
        readonly type: "text";
        readonly group: "presentation";
        readonly description: "Given or individual name";
    };
    readonly resultat: {
        readonly code: "resultat";
        readonly name: "result";
        readonly type: "text";
        readonly group: "presentation";
        readonly description: "The outcome or summary value of a process";
    };
    readonly tags: {
        readonly code: "tags";
        readonly name: "tags";
        readonly type: "text";
        readonly group: "presentation";
        readonly description: "Keywords or labels for grouping and search";
    };
    readonly description: {
        readonly code: "description";
        readonly name: "description";
        readonly type: "text-block";
        readonly group: "presentation";
        readonly description: "Detailed multi-line explanation or narrative";
    };
    readonly legend: {
        readonly code: "legend";
        readonly name: "legend";
        readonly type: "text-line";
        readonly group: "presentation";
        readonly description: "Brief caption or explanatory text for visuals";
    };
    readonly range: {
        readonly code: "range";
        readonly name: "range";
        readonly type: "range";
        readonly group: "progress";
        readonly description: "Numerical interval or boundary for progress";
    };
    readonly status: {
        readonly code: "status";
        readonly name: "status";
        readonly type: "status";
        readonly group: "progress";
        readonly description: "Current state in a lifecycle or workflow";
    };
    readonly gramme: {
        readonly code: "gramme";
        readonly name: "grams";
        readonly type: "number";
        readonly group: "quantity";
        readonly description: "Metric unit of mass (g)";
    };
    readonly litre: {
        readonly code: "litre";
        readonly name: "liters";
        readonly type: "number";
        readonly group: "quantity";
        readonly description: "Metric unit of liquid volume (L)";
    };
    readonly metre: {
        readonly code: "metre";
        readonly name: "meters";
        readonly type: "number";
        readonly group: "quantity";
        readonly description: "Metric unit of length (m)";
    };
    readonly volume: {
        readonly code: "volume";
        readonly name: "volume";
        readonly type: "number";
        readonly group: "quantity";
        readonly description: "Total space occupied by an object";
    };
    readonly mailPassword: {
        readonly code: "mailPassword";
        readonly name: "mail password";
        readonly type: "password";
        readonly group: "security";
        readonly description: "Encrypted password for email service access";
    };
    readonly password: {
        readonly code: "password";
        readonly name: "password";
        readonly type: "password";
        readonly group: "security";
        readonly description: "Secret string for account authentication";
    };
    readonly login: {
        readonly code: "login";
        readonly name: "login";
        readonly type: "text";
        readonly group: "security";
        readonly description: "Identifier used to initiate a secure session";
    };
    readonly actif: {
        readonly code: "actif";
        readonly name: "active";
        readonly type: "boolean";
        readonly group: "status";
        readonly description: "Indicates if the record is currently operational and in use";
    };
    readonly isLocked: {
        readonly code: "isLocked";
        readonly name: "is locked";
        readonly type: "boolean";
        readonly group: "status";
        readonly description: "Prevents modification by unauthorized users";
    };
    readonly isSystem: {
        readonly code: "isSystem";
        readonly name: "is system";
        readonly type: "boolean";
        readonly group: "status";
        readonly description: "Flags records that are vital for system operation";
    };
    readonly private: {
        readonly code: "private";
        readonly name: "private";
        readonly type: "boolean";
        readonly group: "system";
        readonly description: "Restricts visibility to internal or specific users";
    };
    readonly readonly: {
        readonly code: "readonly";
        readonly name: "read only";
        readonly type: "boolean";
        readonly group: "system";
        readonly description: "Specifies that the field cannot be modified by the end-user";
    };
    readonly required: {
        readonly code: "required";
        readonly name: "required";
        readonly type: "boolean";
        readonly group: "system";
        readonly description: "Mandates that this field must contain data before saving";
    };
    readonly visible: {
        readonly code: "visible";
        readonly name: "visible";
        readonly type: "boolean";
        readonly group: "system";
        readonly description: "Toggles the field's presence in the user interface";
    };
};
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
export interface WithName {
    name?: Name;
}
export interface WithIcon {
    icon?: Icon;
}
export interface WithColor {
    color?: Color;
}
export interface WithDate {
    dateCreated?: DateValue;
    dateUpdated?: DateValue;
}
export interface WithCode {
    code?: Code;
}
export interface WithID {
    id?: ID;
}
export interface WithOrder {
    order?: Order;
}
/** --- GENERAL TYPES --- **/
export type AppSchemeFieldTypeCode = 'text' | 'number' | 'date' | 'datetime' | 'boolean' | 'select' | 'multiselect' | 'fk' | 'file' | 'image' | 'textarea' | 'password' | 'email' | 'url' | (string & {});
export interface Extendable {
    [key: string]: unknown;
}
export interface gridFksItem<T = unknown> extends Extendable {
    id?: unknown;
    uid?: string;
    name: SchemeName;
    code: Code;
    icon: Icon;
    order: Order;
    multiple: boolean;
    required: boolean;
    scheme?: T;
}
export interface WithEssentials<T = any> extends Extendable, WithID, WithCode, WithName, WithColor, WithIcon, WithOrder {
}
/** Base database definition */
export interface AppSchemeBase extends Extendable, WithEssentials {
}
/** Main scheme definition */
export interface AppScheme<T = Record<string, any>> extends Extendable, WithEssentials<T> {
    schemeType?: SchemeType;
    /**
     * Dynamic views registry - populated at runtime from appscheme_view.
     * Keys are appscheme_view_type.code values ('list', 'mini', 'form', 'custom', 'fk_label', etc.)
     * @see FieldViews for standard view type definitions
     */
    _views?: Partial<FieldViews>;
    gridFks?: {
        [key: string]: gridFksItem;
    };
}
/** Core scheme with explicit system relations */
export interface AppSchemeCore<T = Record<string, any>> extends AppScheme<T> {
    gridFks?: {
        appscheme_base: gridFksItem<AppSchemeBase>;
        appscheme_type: gridFksItem<AppSchemeType>;
        [key: string]: gridFksItem;
    };
}
export interface AppSchemeType extends Extendable, WithEssentials {
}
export interface AppSchemeFieldGroup extends Extendable, WithEssentials {
}
export interface AppSchemeFieldType extends Extendable, WithEssentials {
}
export interface AppSchemeField extends Extendable, WithEssentials {
    description?: string;
    field_type?: string;
    field_group?: string;
    required?: boolean | 0 | 1;
    readonly?: boolean | 0 | 1;
    private?: boolean | 0 | 1;
    fkTargetCol?: string | null;
    fkTargetField?: string | null;
    gridFks?: {
        appscheme_field_type?: gridFksItem<AppSchemeFieldType>;
        appscheme_field_group?: gridFksItem<AppSchemeFieldGroup>;
    };
}
export interface AppSchemeHasField extends Extendable, WithEssentials {
    visible?: boolean | 0 | 1;
    readonly?: boolean | 0 | 1;
    required?: boolean | 0 | 1;
    gridFks: {
        appscheme: gridFksItem<AppScheme>;
        appscheme_field: gridFksItem<AppSchemeField>;
    };
}
export interface AppSchemeLog extends Extendable, WithID {
    operation: 'create' | 'update' | 'delete';
    scheme?: SchemeName;
    actorId?: ID;
    timestamp?: DateValue;
    details?: Extendable;
    changes?: Extendable;
    gridFks?: {
        appscheme: gridFksItem<AppScheme>;
    };
}
export type AppSchemaCollection = AppSchemeBase | AppScheme | AppSchemeField | AppSchemeFieldType | AppSchemeFieldGroup | AppSchemeHasField | AppSchemeType | AppSchemeLog | AppSchemeViewType | AppSchemeView | AppUser | AppUserProfile | AppUserGroup | AppUserType | AppUserAssignment | AppUserGrant | AppUserSession | AppUserAudit;
/**
 * Permission codes following CRUD + extensions pattern.
 */
export type PermissionCode = 'C' | 'R' | 'U' | 'D' | 'L' | 'X';
export declare const PERMISSION_CODES: Record<PermissionCode, {
    name: string;
}>;
/**
 * Boolean permission value for modern APIs.
 */
export type PermissionBoolean = boolean;
/**
 * Legacy permission value (1 = granted, 0 = denied) for backward compatibility.
 */
export type PermissionValue = 1 | 0;
/**
 * App-level permissions stored as JSON blob in appuser.appPermissions.
 * These override table-level permissions.
 */
export interface AppPermissions extends Extendable {
    ADMIN?: boolean;
    DEV?: boolean;
    CONF?: boolean;
    BYPASS_AUDIT?: boolean;
    IMPERSONATE?: boolean;
    [key: string]: boolean | undefined;
}
/**
 * Grant constraints - fine-grained access restrictions.
 * @example { "territory": "EU", "maxAmount": 10000, "departments": ["sales", "marketing"] }
 */
export interface GrantConstraints extends Extendable {
    territory?: string;
    maxAmount?: number;
    departments?: string[];
    businessUnits?: string[];
    [key: string]: unknown;
}
/**
 * Core user account - authentication & authorization entry point.
 * Separated from profile for security (PII isolation) and performance.
 */
export interface AppUser extends Extendable, WithEssentials {
    login: string;
    passwordHash: string;
    email: string;
    emailVerified: boolean;
    isActive: boolean;
    isLocked: boolean;
    failedLoginCount?: number;
    lockedUntil?: DateValue;
    lastLoginAt?: DateValue;
    lastLoginIp?: string;
    mustChangePassword?: boolean;
    /**
     * App-level permissions as JSON blob.
     * These override table-level permissions.
     * @example { "ADMIN": true, "DEV": false, "BYPASS_AUDIT": true }
     */
    appPermissions?: AppPermissions;
    gridFks: {
        appuser_profile?: gridFksItem<AppUserProfile>;
    };
}
/**
 * User profile - personal data and preferences.
 * Separated from AppUser for GDPR/privacy compliance.
 * Can be extended without affecting auth flows.
 */
export interface AppUserProfile extends Extendable, WithID {
    firstName?: string;
    lastName?: string;
    displayName?: string;
    avatarUrl?: string;
    phone?: string;
    mobile?: string;
    locale?: string;
    timezone?: string;
    /**
     * User preferences as JSON blob.
     * @example { "theme": "dark", "notifications": { "email": true, "sms": false } }
     */
    preferences?: Extendable;
    gridFks: {};
}
/**
 * User groups - collections of users (teams, departments).
 * Users can belong to multiple groups via AppUserAssignment.
 */
export interface AppUserGroup extends Extendable, WithEssentials {
    code: Code;
    name: Name;
    description?: Description;
    /**
     * System groups cannot be deleted (e.g., "Administrators", "Everyone").
     */
    isSystem: boolean;
}
/**
 * User types — reusable classification templates (formerly AppUserRole).
 * Examples: "Data Administrator", "Report Viewer", "Content Editor"
 * Types can be assigned directly to users or inherited from groups.
 */
export interface AppUserType extends Extendable, WithEssentials {
    code: Code;
    name: Name;
    description?: Description;
    /** System types cannot be deleted (e.g., "Admin", "User"). */
    isSystem: boolean;
    /** Type level for hierarchy resolution. Higher level = more privileges. */
    typeLevel?: number;
}
/** Backward-compatible alias of AppUserType. */
export type AppUserRole = AppUserType;
/**
 * Assignment type - distinguishes between role and group assignments.
 */
export type AssignmentType = 'role' | 'group';
/**
 * Assignment table - many-to-many link between users and roles/groups.
 * Enables: one user, multiple roles; one role, multiple users.
 * Temporal scope: assignments can be temporary (internships, projects).
 */
export interface AppUserAssignment extends Extendable, WithID {
    assignmentType: AssignmentType;
    /**
     * Primary group for UI defaults and fallback permissions.
     */
    isPrimary?: boolean;
    /**
     * When the assignment becomes active (null = immediately).
     */
    validFrom?: DateValue;
    /**
     * When the assignment expires (null = permanent).
     */
    validUntil?: DateValue;
    /**
     * Who granted this assignment.
     */
    assignedBy: ID;
    assignedAt: DateValue;
    /**
     * Revocation tracking.
     */
    revokedBy?: ID;
    revokedAt?: DateValue;
    revocationReason?: string;
    gridFks: {
        appuser: gridFksItem<AppUser>;
        appuser_type?: gridFksItem<AppUserType>;
        appuser_group?: gridFksItem<AppUserGroup>;
    };
}
/**
 * Grant type - distinguishes which entity receives the grant.
 */
export type GrantType = 'role' | 'group' | 'user';
/**
 * Permission grants - fine-grained access control per scheme/resource.
 * Can be assigned to roles, groups, or individual users.
 * Temporal scope enables temporary access (projects, substitutions).
 */
export interface AppUserGrant extends Extendable, WithID {
    grantType: GrantType;
    c: PermissionBoolean;
    r: PermissionBoolean;
    u: PermissionBoolean;
    d: PermissionBoolean;
    l: PermissionBoolean;
    x: PermissionBoolean;
    validFrom?: DateValue;
    validUntil?: DateValue;
    grantedBy: ID;
    grantedAt: DateValue;
    revokedBy?: ID;
    revokedAt?: DateValue;
    revocationReason?: string;
    /**
     * Constraints as JSON - restricts grant scope.
     * @example { "territory": "EU", "maxAmount": 10000 }
     */
    constraints?: GrantConstraints;
    gridFks: {
        appscheme: gridFksItem<AppScheme>;
        appuser_type?: gridFksItem<AppUserType>;
        appuser_group?: gridFksItem<AppUserGroup>;
        appuser?: gridFksItem<AppUser>;
    };
}
/**
 * Active user sessions for tracking and security.
 * Enables "logout everywhere" and concurrent session limits.
 */
export interface AppUserSession extends Extendable, WithID {
    sessionToken: string;
    refreshToken?: string;
    ipAddress?: string;
    userAgent?: string;
    deviceInfo?: Extendable;
    startedAt: DateValue;
    expiresAt: DateValue;
    lastActivityAt: DateValue;
    isRevoked: boolean;
    revokedAt?: DateValue;
    /**
     * Reason for revocation: 'logout', 'timeout', 'security', 'admin_action'
     */
    revocationReason?: string;
    gridFks: {
        appuser: gridFksItem<AppUser>;
    };
}
/**
 * Audit action types.
 */
export type AuditAction = 'login' | 'logout' | 'create' | 'update' | 'delete' | 'view' | 'export' | 'import' | 'execute' | 'permission_denied';
/**
 * Audit status types.
 */
export type AuditStatus = 'success' | 'failure' | 'denied';
/**
 * Audit trail for user actions.
 * Immutable log of who did what, when, from where.
 */
export interface AppUserAudit extends Extendable, WithID {
    action: AuditAction;
    resourceType: string;
    resourceId?: ID;
    /**
     * Action details as JSON.
     * @example { "fields": ["name", "email"], "before": {...}, "after": {...} }
     */
    details?: Extendable;
    ipAddress?: string;
    userAgent?: string;
    sessionId?: ID;
    status: AuditStatus;
    failureReason?: string;
    performedAt: DateValue;
    gridFks: {
        appuser: gridFksItem<AppUser>;
    };
}
/**
 * Hierarchical permission check result.
 */
export interface PermissionCheckResult {
    granted: boolean;
    /**
     * Source of the permission decision.
     */
    source: 'app_permissions' | 'direct_grant' | 'role_grant' | 'group_grant' | 'none';
    /**
     * Which grant/assignment provided the permission.
     */
    grantId?: ID;
    /**
     * Constraints that apply to this permission.
     */
    constraints?: GrantConstraints;
    /**
     * Reason for denial (if granted = false).
     */
    reason?: string;
}
/**
 * Standard view type codes defined in appscheme_view_type.
 * Extensible - new view types can be added without schema migration.
 */
export type ViewTypeCode = 'list' | 'mini' | 'form' | 'custom' | 'fk_label' | (string & {});
/**
 * Display options for a field within a view.
 * Stored in appscheme_view.options JSON blob.
 */
export interface ViewOptions extends Extendable {
    width?: number;
    sortable?: boolean;
    className?: string;
    visible?: boolean;
    editable?: boolean;
}
/**
 * Field definition as resolved for a specific view.
 * Combines field metadata from appscheme_field with view-specific options.
 */
export interface ViewFieldDef extends Extendable {
    name: string;
    code: string;
    group: string;
    title: string;
    type?: string;
    icon?: string;
    order?: number;
    options?: ViewOptions;
}
/**
 * Named field selections for different display contexts.
 * Populated at runtime from appscheme_view data.
 *
 * - fullView : all fields + fks (view_type 'list')
 * - miniView : all primitive fields, no fks (view_type 'mini')
 * - fkView   : fk fields only (view_type 'fk')
 */
export interface FieldViews extends Extendable {
    fullView?: ViewFieldDef[];
    miniView?: ViewFieldDef[];
    fkView?: ViewFieldDef[];
    [key: string]: ViewFieldDef[] | undefined;
}
/**
 * View type registry entry.
 * Defines available view contexts. Extensible without schema migration.
 */
export interface AppSchemeViewType extends Extendable, WithEssentials {
    description?: Description;
}
/**
 * View instance - binds a field to a view type for an entity.
 * Pivot table: appscheme_view
 */
export interface AppSchemeView extends Extendable, WithEssentials {
    options?: ViewOptions;
    gridFks: {
        appscheme: gridFksItem<AppScheme>;
        appscheme_view_type: gridFksItem<AppSchemeViewType>;
        appscheme_field: gridFksItem<AppSchemeField>;
    };
}
/**
 * Enhanced AppScheme with the fieldViews registry.
 * The _views property is populated at runtime from appscheme_view data.
 */
export interface AppSchemeWithProfiles<T = Record<string, any>> extends AppScheme<T> {
    _views?: Partial<FieldViews>;
}
//# sourceMappingURL=schema-types.d.ts.map