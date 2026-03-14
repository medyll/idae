const counters: Record<string, number> = {}
export function incCounter(name: string, by = 1) {
  counters[name] = (counters[name] || 0) + by
}
export function getCounter(name: string) {
  return counters[name] || 0
}
export function resetCounters() { Object.keys(counters).forEach(k => delete counters[k]) }
