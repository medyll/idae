import { IdaeApiClient } from '@medyll/idae-api';
import type { OutboxEntry } from '../outbox/OutboxStore';

export type DelivererResult = boolean; // true => entry delivered/consumed, false => transient failure (retry)

export class IdaeApiDeliverer {
  private client: any;

  constructor(clientConfig?: any) {
    this.client = IdaeApiClient.getInstance(clientConfig);
  }

  async deliver(entry: OutboxEntry): Promise<DelivererResult> {
    try {
      const collectionClient = this.client.collection(entry.collection);

      switch (entry.op) {
        case 'add':
          await collectionClient.create(entry.data);
          return true;
        case 'put':
        case 'update': {
          const id = entry.key || entry.data?._id || entry.data?.id;
          if (id) {
            await collectionClient.update(id, entry.data);
            return true;
          }
          await collectionClient.create(entry.data);
          return true;
        }
        case 'delete': {
          const id = entry.key || entry.data?._id || entry.data?.id;
          if (!id) return true; // nothing to do
          await collectionClient.deleteById(id);
          return true;
        }
        case 'updateWhere': {
          // whereClause should be a serialized Where<T>; pass through to API client
          await collectionClient.updateWhere(entry.whereClause, entry.data);
          return true;
        }
        case 'deleteWhere': {
          await collectionClient.deleteWhere(entry.whereClause);
          return true;
        }
        default:
          // Unknown op: consume to avoid blocking
          return true;
      }
    } catch (e: any) {
      // inspect for status
      const status = e?.status || e?.response?.status || e?.statusCode;
      if (status && status >= 400 && status < 500) {
        // Permanent failure: consume entry and surface telemetry elsewhere
        console.warn('IdaeApiDeliverer permanent failure', status, e);
        return true;
      }
      // Transient failure: retry later
      console.warn('IdaeApiDeliverer transient failure, will retry', e?.message ?? e);
      return false;
    }
  }
}

export function createIdaeApiDeliverer(cfg?: any) {
  return new IdaeApiDeliverer(cfg);
}
