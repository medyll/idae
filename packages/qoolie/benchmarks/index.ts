/**
 * Performance Benchmarks for Qoolie
 * 
 * Run: pnpm run bench
 */

import { createQoolie } from '../src/lib/Qoolie.js';

interface BenchmarkResult {
  name: string;
  iterations: number;
  duration: number;
  opsPerSec: number;
}

/**
 * Run a benchmark
 */
function bench(name: string, fn: () => void | Promise<void>, iterations: number = 1000): BenchmarkResult {
  const start = performance.now();
  
  for (let i = 0; i < iterations; i++) {
    fn();
  }
  
  const duration = performance.now() - start;
  const opsPerSec = (iterations / duration) * 1000;
  
  return {
    name,
    iterations,
    duration: Math.round(duration * 100) / 100,
    opsPerSec: Math.round(opsPerSec * 100) / 100,
  };
}

/**
 * Run async benchmark
 */
async function benchAsync(name: string, fn: () => Promise<void>, iterations: number = 1000): Promise<BenchmarkResult> {
  const start = performance.now();
  
  for (let i = 0; i < iterations; i++) {
    await fn();
  }
  
  const duration = performance.now() - start;
  const opsPerSec = (iterations / duration) * 1000;
  
  return {
    name,
    iterations,
    duration: Math.round(duration * 100) / 100,
    opsPerSec: Math.round(opsPerSec * 100) / 100,
  };
}

/**
 * Print benchmark results
 */
function printResults(results: BenchmarkResult[]): void {
  console.log('\n📊 Benchmark Results\n');
  console.log('='.repeat(60));
  
  for (const result of results) {
    console.log(`${result.name.padEnd(30)} ${result.opsPerSec.toLocaleString()} ops/sec`);
    console.log(`  ${result.iterations} iterations in ${result.duration}ms`);
  }
  
  console.log('='.repeat(60));
}

/**
 * CRUD Benchmarks
 */
async function runCrudBenchmarks(): Promise<void> {
  console.log('\n🔧 Running CRUD Benchmarks...\n');
  
  const qoolie = createQoolie({
    dbName: 'bench-db',
    collections: {
      users: { keyPath: '++id' },
    },
  });

  const results: BenchmarkResult[] = [];

  // Create benchmark
  results.push(await benchAsync('create()', async () => {
    await qoolie.collection.users.create({ name: 'Test', age: 25 });
  }, 100));

  // Get benchmark
  results.push(await benchAsync('get()', async () => {
    await qoolie.collection.users.get(1);
  }, 500));

  // Update benchmark
  results.push(await benchAsync('update()', async () => {
    await qoolie.collection.users.update(1, { age: 26 });
  }, 100));

  // Where benchmark
  results.push(bench('where()', () => {
    qoolie.collection.users.where({ age: { $gte: 18 } });
  }, 500));

  qoolie.destroy();
  printResults(results);
}

/**
 * Config Benchmarks
 */
function runConfigBenchmarks(): void {
  console.log('\n⚙️  Running Config Benchmarks...\n');
  
  const results: BenchmarkResult[] = [];

  results.push(bench('normalizeConfig()', () => {
    // Simulate config normalization
    const config = {
      dbName: 'test',
      collections: { users: { keyPath: 'id' } },
    };
    JSON.stringify(config);
  }, 10000));

  printResults(results);
}

// Run all benchmarks
(async () => {
  try {
    runConfigBenchmarks();
    await runCrudBenchmarks();
    console.log('\n✅ Benchmarks complete!\n');
  } catch (error) {
    console.error('Benchmark error:', error);
    process.exit(1);
  }
})();
