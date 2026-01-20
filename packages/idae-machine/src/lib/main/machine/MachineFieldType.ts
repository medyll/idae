export enum defaultTypes {
  id = "id",
  any = "any",
  date = "date",
  datetime = "datetime",
  time = "time",
  text = "text",
  number = "number",
  boolean = "boolean",
  url = "url",
  email = "email",
  phone = "phone",
  password = "password",
  file = "file",
  image = "image",
}

export interface FieldTypeDef {
  id: string;
  formatter: (value: any) => any;
  validator?: (value: any) => boolean;
}

const fieldTypeRegistry: Record<string, FieldTypeDef> = {};

/* Register default field types */
const defautlFielTypesDef: Record<string, FieldTypeDef> = {
  mail : {
    id: defaultTypes.email,
    formatter: (value: any) => String(value).toLowerCase(),
    validator: (value: any) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(String(value).toLowerCase());
    },
  },
  url: {
    id: defaultTypes.url,
    formatter: (value: any) => String(value).toLowerCase(),
    validator: (value: any) => {
      try {
        new URL(String(value).toLowerCase());
        return true;
      } catch {
        return false;
      }
    },
  },  
  phone: {
    id: defaultTypes.phone,
    formatter: (value: any) => String(value),
    validator: (value: any) => {
      const phoneRegex = /^\+?[\d\s-]{10,}$/;
      return phoneRegex.test(String(value));
    },
  },  
  date: {
    id: defaultTypes.date,
    formatter: (value: any) => { new Date(value) },
    validator: (value: any) => {
      const date = new Date(value);      
      return !isNaN(date.getTime());
    },
  },  
  datetime: {
    id: defaultTypes.datetime,
    formatter: (value: any) => { new Date(value) },
    validator: (value: any) => {
      const date = new Date(value);      
      return !isNaN(date.getTime());
    },
  },  
  time: {
    id: defaultTypes.time,
    formatter: (value: any) => { new Date(value) },
    validator: (value: any) => {
      const date = new Date(value);      
      return !isNaN(date.getTime());
    },
  },  
  email: {
    id: defaultTypes.email,
    formatter: (value: any) => String(value).toLowerCase(),
    validator: (value: any) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(String(value).toLowerCase());
    },
  },
  text: {
    id: defaultTypes.text,
    formatter: (value: any) => String(value),
    validator: (value: any) => true,
  },
  number: {
    id: defaultTypes.number,
    formatter: (value: any) => Number(value),
    validator: (value: any) => typeof value === "number" && !isNaN(value),
  },
  boolean: {
    id: defaultTypes.boolean,
    formatter: (value: any) => Boolean(value),
    validator: (value: any) => typeof value === "boolean",
  },
  any: {
    id: defaultTypes.any,
    formatter: (value: any) => value,
    validator: (value: any) => true,      
  },
};

for (const defKey in defautlFielTypesDef) {
  const def = defautlFielTypesDef[defKey];
  fieldTypeRegistry[def.id] = def;
}
export class MachineFieldType {
  constructor() {}

  registerFieldType(def: FieldTypeDef) {
    fieldTypeRegistry[def.id] = def;
  }

  registerFieldTypes(defs: FieldTypeDef[]) {
    defs.forEach((def) => this.registerFieldType(def));
  }

  getFieldType(id: FieldTypeId): FieldTypeDef | undefined {
    return fieldTypeRegistry[id];
  }

  getAllFieldTypes(): FieldTypeDef[] {
    return Object.values(fieldTypeRegistry);
  }

  private validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private validateUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  private validatePhone(phone: string): boolean {
    const phoneRegex = /^\+?[\d\s-]{10,}$/;
    return phoneRegex.test(phone);
  }

  private validateDateTime(value: string | Date, type: string): boolean {
    const date = value instanceof Date ? value : new Date(value);
    if (isNaN(date.getTime())) return false;

    switch (type) {
      case defaultTypes.date:
        return true; // La conversion en Date a déjà validé le format
      case defaultTypes.time:
        // Vérifiez si la chaîne contient uniquement l'heure
        return /^([01]\d|2[0-3]):([0-5]\d)(:([0-5]\d))?$/.test(value as string);
      case defaultTypes.datetime:
        return true; // La conversion en Date a déjà validé le format
      default:
        return false;
    }
  }
}
