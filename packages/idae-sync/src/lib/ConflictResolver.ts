export type OnConflictResult = { resolution: 'local' | 'remote' | 'merge'; result?: any };

export type OnConflictHook = (
  local: any,
  remote: any,
  context: { collection: string; op: string; entryId?: string }
) => OnConflictResult | Promise<OnConflictResult>;

export function defaultOnConflict(local: any, remote: any): OnConflictResult {
  const localTs = local?.updated_at ? Date.parse(local.updated_at) : 0;
  const remoteTs = remote?.updated_at ? Date.parse(remote.updated_at) : 0;
  if (remoteTs > localTs) return { resolution: 'remote', result: remote };
  return { resolution: 'local', result: local };
}

export function mergeObjects(local: any, remote: any): OnConflictResult {
  const result = { ...local, ...remote };
  return { resolution: 'merge', result };
}
