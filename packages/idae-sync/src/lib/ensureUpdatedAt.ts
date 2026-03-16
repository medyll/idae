export function ensureUpdatedAt<T extends Record<string, unknown> | undefined>(obj: T): T {
  if (obj && typeof obj === 'object' && (obj as any).updated_at == null) {
    (obj as any).updated_at = new Date().toISOString();
  }
  return obj;
}
