import type { OutboxEntry } from '../outbox/OutboxStore';

export type DeliverStatus = 'success' | 'retry' | 'permanent';

export type DeliverResult = {
  status: DeliverStatus;
  response?: unknown;
  conflict?: { local: unknown; remote: unknown };
};

export interface IDeliverer {
  deliver(entry: OutboxEntry): Promise<DeliverResult>;
}
