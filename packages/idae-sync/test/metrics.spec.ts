import { describe, it, expect, beforeEach } from 'vitest'
import { incCounter, getCounter, resetCounters } from '../src/lib/observability/metrics'

describe('metrics', () => {
  beforeEach(() => resetCounters())
  it('increments and reads counters', () => {
    expect(getCounter('x')).toBe(0)
    incCounter('x')
    expect(getCounter('x')).toBe(1)
    incCounter('x', 4)
    expect(getCounter('x')).toBe(5)
  })
})
