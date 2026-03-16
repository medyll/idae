/**
 * Throughput benchmark — run with: npx tsx test/benchmark.ts
 * Measures entries/sec for different batchSize values.
 */
import { InMemoryOutboxStore } from '../src/lib/outbox/InMemoryOutboxStore';
import { createSyncAdapter } from '../src/lib/SyncAdapter';
import type { OutboxEntry } from '../src/lib/outbox/OutboxStore';

const ENTRY_COUNT = 500;
const BATCH_SIZES = [1, 5, 10, 50];

function makeEntry(i: number): OutboxEntry {
  return {
    id: `e${i}`,
    collection: 'bench',
    op: 'add',
    data: { i },
    meta: { retryCount: 0, createdAt: new Date().toISOString() },
  };
}

async function runBench(batchSize: number): Promise<void> {
  const outbox = new InMemoryOutboxStore();
  const deliverFn = async (_entry: OutboxEntry) => ({ status: 'success' as const });
  const adapter = createSyncAdapter(outbox as any, { deliver: deliverFn }, { batchSize });

  for (let i = 0; i < ENTRY_COUNT; i++) {
    await outbox.enqueue(makeEntry(i));
  }

  const start = performance.now();
  while ((await outbox.list(1)).length > 0) {
    await adapter.processOnce();
  }
  const elapsed = performance.now() - start;
  const throughput = Math.round((ENTRY_COUNT / elapsed) * 1000);

  console.log(`batchSize=${String(batchSize).padStart(3)}  ${elapsed.toFixed(1).padStart(7)}ms  ${String(throughput).padStart(6)} entries/sec`);
}

async function main() {
  console.log(`\nidae-sync throughput benchmark (${ENTRY_COUNT} entries)\n`);
  console.log('batchSize     elapsed   throughput');
  console.log('─────────────────────────────────');
  for (const bs of BATCH_SIZES) {
    await runBench(bs);
  }
  console.log();
}

main().catch(console.error);
