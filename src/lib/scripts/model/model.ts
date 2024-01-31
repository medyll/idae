export type Model = {
  name: string;
  version?: number;
  schema: SchemaType;
  fields: Record<string, Field>;
};

export type SchemaType = {
  primary: string;
  autoIncrement: boolean;
  indexes: string[];
};

export type Field = {
  name: string;
  type: string;
  dataType: string;
  required?: boolean;
  unique?: boolean;
  indexed?: boolean;
  default?: any;
};

const model = {
  name: "users",
  schema: {
    primary: "userId",
    autoIncrement: true,
    indexes: ["name", "age"],
  },
  fields: {
    userId: {
      name: "userId",
      type: "number",
      required: true,
      unique: true,
      indexed: true,
      default: null,
    },
    name: {
      name: "name",
      type: "string",
      required: true,
      unique: false,
      indexed: true,
      default: null,
    },
    age: {
      name: "age",
      type: "number",
      required: true,
      unique: false,
      indexed: true,
      default: null,
    },
  },
} satisfies Model;
