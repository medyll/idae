import { Idbq } from "../lib/scripts/idbq/idbq.js";
import type { Collection } from "../lib/scripts/collection/collection.js";

export type Chat = {
  id?: number;
  chatId?: string;
  title?: string;
  models?: string[];
  created_at?: Date;
  dateLastMessage?: Date;
  context?: number[];
};

export type ChatMessage = {
  id?: string;
  chatId: string;
  messageId?: string;
  content?: string;
  images?: string[];
  status?: "done" | "sent" | "streaming" | "error";
  context?: number[];
  model?: string;
} & (
  | {
      role?: "user";
    }
  | {
      role?: "assistant";
      model?: string;
    }
);

type IdbqModel = {
  [key: string]: {
    keyPath: string;
    model: any;
  };
};
//
export class DataBase extends Idbq {
  chat!: Collection<Chat>;
  messages!: Collection<ChatMessage>;

  constructor(dbName: string, idbqModel?: IdbqModel) {
    super(dbName);

    this.version(1).stores({
      chat: "&chatId, created_at, dateLastMessage",
      messages: "++id, chatId, created_at",
    });
  }
}

let idbqModel = {
  chat: {
    keyPath: "&chatId, created_at, dateLastMessage",
    model: {} as Chat,
  },
  messages: {
    keyPath: "++id, chatId, created_at",
    model: {} as ChatMessage,
  },
};

export const dbase = new DataBase("oneDatabase", idbqModel);
