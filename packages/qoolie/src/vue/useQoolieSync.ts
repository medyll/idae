import { ref, onUnmounted } from 'vue';
import type { Ref } from 'vue';
import type { SyncStatus } from './types.js';
import { getQoolie } from './useQoolie.js';

/**
 * Vue 3 composable to get qoolie sync status
 * 
 * @returns Sync status and control functions
 * 
 * @example
 * ```vue
 * <script setup lang="ts">
 * const { status, pause, resume, flush } = useQoolieSync();
 * </script>
 * 
 * <template>
 *   <div>
 *     <span v-if="status?.running">🟢 Syncing</span>
 *     <span v-else>🔴 Paused</span>
 *     <span v-if="status?.networkPaused">(Offline)</span>
 *     <span>Queue: {{ status?.queueLength }}</span>
 *     <button @click="pause">Pause</button>
 *     <button @click="resume">Resume</button>
 *     <button @click="flush">Flush</button>
 *   </div>
 * </template>
 * ```
 */
export function useQoolieSync(): {
  /** Current sync status (reactive) */
  status: Ref<SyncStatus | null>;
  /** Loading state (initial status fetch) */
  loading: Ref<boolean>;
  /** Error if status fetch failed */
  error: Ref<Error | null>;
  /** Pause sync */
  pause: () => void;
  /** Resume sync */
  resume: () => void;
  /** Flush pending operations */
  flush: () => Promise<void>;
  /** Refresh status */
  refresh: () => Promise<void>;
} {
  const status = ref<SyncStatus | null>(null) as Ref<SyncStatus | null>;
  const loading = ref(true);
  const error = ref<Error | null>(null);

  const fetchStatus = async () => {
    const qoolie = getQoolie();
    if (!qoolie) {
      loading.value = false;
      status.value = null;
      return;
    }

    try {
      loading.value = true;
      error.value = null;
      const syncStatus = await qoolie.sync.getStatus();
      status.value = syncStatus;
    } catch (err) {
      error.value = err as Error;
    } finally {
      loading.value = false;
    }
  };

  // Initial fetch
  fetchStatus();

  // Subscribe to sync events for real-time updates
  const qoolie = getQoolie();
  if (qoolie) {
    const unsubscribe = qoolie.sync.onEvent(() => {
      // Refresh status on any sync event
      fetchStatus();
    });

    onUnmounted(() => {
      unsubscribe();
    });
  }

  const pause = () => {
    const q = getQoolie();
    if (q) {
      q.sync.pause();
      fetchStatus();
    }
  };

  const resume = () => {
    const q = getQoolie();
    if (q) {
      q.sync.resume();
      fetchStatus();
    }
  };

  const flush = async () => {
    const q = getQoolie();
    if (q) {
      await q.sync.flush();
      fetchStatus();
    }
  };

  return {
    status,
    loading,
    error,
    pause,
    resume,
    flush,
    refresh: fetchStatus,
  };
}
