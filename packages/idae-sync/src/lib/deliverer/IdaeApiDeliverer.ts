import { IdaeApiClient } from '@medyll/idae-api';
import type { OutboxEntry } from '../outbox/OutboxStore';
import type { IDeliverer, DeliverResult } from './IDeliverer';

export class IdaeApiDeliverer implements IDeliverer {
  private client: ReturnType<typeof IdaeApiClient.getInstance>;

  constructor(clientConfig?: Record<string, unknown>) {
    this.client = IdaeApiClient.getInstance(clientConfig);
  }

  async deliver(entry: OutboxEntry): Promise<DeliverResult> {
    try {
      const collectionClient = this.client.collection(entry.collection);

      switch (entry.op) {
        case 'add':
          await collectionClient.create(entry.data);
          return { status: 'success' };
        case 'put':
        case 'update': {
          const id = entry.key || entry.data?._id || entry.data?.id;
          if (id) {
            await collectionClient.update(id, entry.data);
            return { status: 'success' };
          }
          await collectionClient.create(entry.data);
          return { status: 'success' };
        }
        case 'delete': {
          const id = entry.key || entry.data?._id || entry.data?.id;
          if (!id) return { status: 'success' }; // nothing to do
          await collectionClient.deleteById(id);
          return { status: 'success' };
        }
        case 'updateWhere': {
          // whereClause should be a serialized Where<T>; pass through to API client
          await collectionClient.updateWhere(entry.whereClause, entry.data);
          return { status: 'success' };
        }
        case 'deleteWhere': {
          await collectionClient.deleteWhere(entry.whereClause);
          return { status: 'success' };
        }
        default:
          // Unknown op: consume to avoid blocking
          return { status: 'success' };
      }
    } catch (e: unknown) {
      // inspect for status
      const errorObj = e as Record<string, unknown>;
      const status = errorObj?.status || (errorObj?.response as Record<string, unknown>)?.status || errorObj?.statusCode;
      if (status && typeof status === 'number' && status >= 400 && status < 500) {
        // Permanent failure: consume entry and surface telemetry elsewhere
        console.warn('IdaeApiDeliverer permanent failure', status, e);
        return { status: 'permanent', response: e };
      }
      // Transient failure: retry later
      console.warn('IdaeApiDeliverer transient failure, will retry', (errorObj?.message as string) ?? e);
      return { status: 'retry', response: e };
    }
  }
}

export function createIdaeApiDeliverer(cfg?: Record<string, unknown>) {
  return new IdaeApiDeliverer(cfg);
}
