// Minimal deterministic serializer for "where" objects
export function serializeWhere(where: unknown): string {
  function serialize(value: unknown): string {
    if (value === null || typeof value === 'number' || typeof value === 'boolean') {
      return JSON.stringify(value);
    }
    if (typeof value === 'string') {
      return JSON.stringify(value);
    }
    if (Array.isArray(value)) {
      return '[' + value.map(serialize).join(',') + ']';
    }
    if (typeof value === 'object') {
      const keys = Object.keys(value).sort();
      const entries = keys.map(k => JSON.stringify(k) + ':' + serialize(value[k]));
      return '{' + entries.join(',') + '}';
    }
    // fallback
    return JSON.stringify(value);
  }

  return serialize(where);
}

export function deserializeWhere(s: string): unknown {
  return JSON.parse(s);
}

export function isDeterministic(a: unknown, b: unknown): boolean {
  return serializeWhere(a) === serializeWhere(b);
}

export class WhereSerializer {
  serialize(where: unknown): string {
    return serializeWhere(where);
  }

  deserialize(s: string): unknown {
    return deserializeWhere(s);
  }
}
