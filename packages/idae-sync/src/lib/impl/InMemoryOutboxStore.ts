import { OutboxEntry, OutboxStore } from '../OutboxStore';

export class InMemoryOutboxStore implements OutboxStore {
  private map = new Map<string, OutboxEntry>();
  private order: string[] = [];

  async append(entry: OutboxEntry): Promise<void> {
    this.map.set(entry.id, entry);
    this.order.push(entry.id);
  }

  async list(limit?: number): Promise<OutboxEntry[]> {
    const ids = limit ? this.order.slice(0, limit) : this.order.slice();
    return ids.map(id => this.map.get(id)!) ;
  }

  async peek(): Promise<OutboxEntry | undefined> {
    const id = this.order[0];
    if (!id) return undefined;
    return this.map.get(id);
  }

  async ack(id: string): Promise<void> {
    if (this.order[0] === id) {
      this.order.shift();
      this.map.delete(id);
    }
  }

  async remove(id: string): Promise<void> {
    this.map.delete(id);
    const idx = this.order.indexOf(id);
    if (idx >= 0) this.order.splice(idx,1);
  }

  async updateMeta(id: string, metaPatch: Partial<OutboxEntry['meta']>): Promise<void> {
    const e = this.map.get(id);
    if (!e) return;
    e.meta = { ...e.meta, ...metaPatch };
    this.map.set(id, e);
  }

  async transactionalAppend(tx: any, entry: OutboxEntry): Promise<void> {
    if (tx && Array.isArray(tx.staged)) {
      tx.staged.push(entry);
    } else {
      await this.append(entry);
    }
  }
}
