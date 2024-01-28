import { Idbq } from "../lib/scripts/idbq/idbq.js";
import type { Collection } from "../lib/scripts/collection.js";

export type Collection1 = {
  id: number;
  chatId: string;
  title: string;
  models: string[];
  created_at: Date;
  dateLastMessage: Date;
  context: number[];
};

export type Collection2 = {
  id: string;
  chatId: string;
  messageId: string;
  content: string;
  images?: string[];
  status: "done" | "sent" | "streaming" | "error";
  context: number[];
  model: string;
} & (
  | {
      role: "user";
    }
  | {
      role: "assistant";
      model?: string;
    }
);

export type Collection3 = {
  id: number;
  model: string;
  create_at: string;
  response: string;
  done: boolean;
  context: number[];
  created_at: string;
  eval_count: number;
  eval_duration: number;
  load_duration: number;
  prompt_eval_count: number;
  prompt_eval_duration: number;
  total_duration: number;
};

//
export class DataBase extends Idbq {
  chat!: Collection<Collection1>;
  messages!: Collection<Collection2>;

  constructor() {
    super("myDatabase");

    this.version(2).stores({
      chat: "&chatId, created_at, dateLastMessage",
      messages: "++id, chatId, created_at",
      stream: "++id, messageId, created_at, done",
    });
  }
}

export const dbase = new DataBase();

console.log(dbase.toString);
