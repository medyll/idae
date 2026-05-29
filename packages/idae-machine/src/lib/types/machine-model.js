// ── Helpers ───────────────────────────────────────────────────────────────────
/** Derive the index field name from a keyPath ('++id' → 'id', 'code' → 'code'). */
export function indexFromKeyPath(keyPath) {
    return (keyPath ?? '++id').replace(/^\+\+/, '');
}
//# sourceMappingURL=machine-model.js.map