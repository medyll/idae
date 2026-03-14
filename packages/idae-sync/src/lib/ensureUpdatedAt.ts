export function ensureUpdatedAt(obj: any): any {
  if (obj && typeof obj === 'object' && obj.updated_at == null) {
    obj.updated_at = new Date().toISOString();
  }
  return obj;
}
