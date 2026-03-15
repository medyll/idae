export type OnConflictResult = { resolution: 'local' | 'remote' | 'merge'; result?: unknown };

export type OnConflictHook = (
  local: unknown,
  remote: unknown,
  context: { collection: string; op: string; entryId?: string }
) => OnConflictResult | Promise<OnConflictResult>;

export function defaultOnConflict(local: unknown, remote: unknown): OnConflictResult {
  const localTs = local?.updated_at ? Date.parse(local.updated_at) : 0;
  const remoteTs = remote?.updated_at ? Date.parse(remote.updated_at) : 0;
  if (remoteTs > localTs) return { resolution: 'remote', result: remote };
  return { resolution: 'local', result: local };
}

export function mergeObjects(local: unknown, remote: unknown): OnConflictResult {
  const result = { ...local, ...remote };
  return { resolution: 'merge', result };
}

export class ConflictResolver {
  resolve(
    local: unknown,
    remote: unknown,
    context: { collection: string; op: string; entryId?: string }
  ): OnConflictResult {
    return defaultOnConflict(local, remote);
  }
}
