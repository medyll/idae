export type CircuitBreakerState = 'closed' | 'open' | 'half-open';

export type CircuitBreakerOptions = {
  /** Number of consecutive failures before opening (default: 5) */
  failureThreshold?: number;
  /** How long (ms) to keep circuit open before trying again (default: 30_000) */
  resetTimeoutMs?: number;
};

export class CircuitBreaker {
  private failures = new Map<string, number>();
  private openUntil = new Map<string, number>();
  private readonly failureThreshold: number;
  private readonly resetTimeoutMs: number;

  constructor(opts?: CircuitBreakerOptions) {
    this.failureThreshold = opts?.failureThreshold ?? 5;
    this.resetTimeoutMs = opts?.resetTimeoutMs ?? 30_000;
  }

  /** Returns true if the circuit is OPEN (requests should be blocked) */
  isOpen(collection: string): boolean {
    const until = this.openUntil.get(collection);
    if (!until) return false;
    if (Date.now() >= until) {
      // Half-open: allow one probe
      this.openUntil.delete(collection);
      return false;
    }
    return true;
  }

  getState(collection: string): CircuitBreakerState {
    const until = this.openUntil.get(collection);
    if (!until) return 'closed';
    if (Date.now() >= until) return 'half-open';
    return 'open';
  }

  recordSuccess(collection: string): void {
    this.failures.delete(collection);
    this.openUntil.delete(collection);
  }

  recordFailure(collection: string): void {
    const count = (this.failures.get(collection) ?? 0) + 1;
    this.failures.set(collection, count);
    if (count >= this.failureThreshold) {
      this.openUntil.set(collection, Date.now() + this.resetTimeoutMs);
      this.failures.delete(collection);
    }
  }

  reset(collection?: string): void {
    if (collection) {
      this.failures.delete(collection);
      this.openUntil.delete(collection);
    } else {
      this.failures.clear();
      this.openUntil.clear();
    }
  }

  getStatus(): Record<string, { state: CircuitBreakerState; failures: number; openUntil?: number }> {
    const result: Record<string, { state: CircuitBreakerState; failures: number; openUntil?: number }> = {};
    const collections = new Set([...this.failures.keys(), ...this.openUntil.keys()]);
    for (const col of collections) {
      result[col] = {
        state: this.getState(col),
        failures: this.failures.get(col) ?? 0,
        openUntil: this.openUntil.get(col),
      };
    }
    return result;
  }
}
