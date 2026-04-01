// Mock for @medyll/idae-sync

export function initSync() {
  return {
    stop: () => {},
    flush: async () => {},
    getStatus: async () => ({
      running: true,
      networkPaused: false,
      queueLength: 0,
      mode: 'mobile-first',
    }),
    outbox: {
      size: async () => 0,
      listDlq: async () => [],
      replayDlq: async () => {},
      clearDlq: async () => {},
    },
    syncAdapter: {
      start: () => {},
      stop: () => {},
      getStatus: async () => ({
        running: true,
        networkPaused: false,
        queueLength: 0,
        mode: 'mobile-first',
      }),
      flush: async () => {},
      onSyncEvent: () => () => {},
    },
    deliverer: {},
    setMode: () => {},
    onSyncEvent: () => () => {},
  };
}

export class SyncAdapter {
  start() {}
  stop() {}
  async getStatus() {
    return {
      running: true,
      networkPaused: false,
      queueLength: 0,
      mode: 'mobile-first',
    };
  }
  async flush() {}
  onSyncEvent() {
    return () => {};
  }
}

export class OutboxStore {
  async size() {
    return 0;
  }
  async listDlq() {
    return [];
  }
  async replayDlq() {}
  async clearDlq() {}
}

export class IdaeApiDeliverer {}
