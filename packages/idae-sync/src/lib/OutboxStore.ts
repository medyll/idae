export type OutboxEntry = {
  id: string;
  collection: string;
  op: 'add'|'put'|'update'|'delete'|'updateWhere'|'deleteWhere';
  key?: any;
  data?: any;
  whereClause?: any;
  meta: { retryCount: number; lastAttempt?: string; createdAt: string; failed?: boolean; failureReason?: string };
};

export interface OutboxStore {
  append(entry: OutboxEntry): Promise<void>;
  list(limit?: number): Promise<OutboxEntry[]>;
  peek(): Promise<OutboxEntry | undefined>;
  ack(id: string): Promise<void>;
  remove(id: string): Promise<void>;
  updateMeta(id: string, metaPatch: Partial<OutboxEntry['meta']>): Promise<void>;
  transactionalAppend?(tx: any, entry: OutboxEntry): Promise<void>;
}
