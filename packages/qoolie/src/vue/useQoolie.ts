import { ref, onUnmounted, shallowRef } from 'vue';
import type { QoolieInstance, CollectionConfigMap, QoolieOptions } from './types.js';
import { createQoolie } from '../lib/Qoolie.js';

// Global qoolie instance for singleton pattern
let globalQoolieInstance: QoolieInstance<any> | null = null;

/**
 * Vue 3 composable to get or create a Qoolie instance
 * 
 * @param options - Qoolie configuration (only used on first call)
 * @returns Reactive qoolie instance reference
 * 
 * @example
 * ```vue
 * <script setup lang="ts">
 * const { qoolie } = useQoolie({
 *   dbName: 'my-app',
 *   sync: { enabled: true, token: '...' },
 *   collections: { users: { keyPath: 'id' } },
 * });
 * </script>
 * ```
 */
export function useQoolie<T extends CollectionConfigMap>(
  options?: QoolieOptions<T>
): {
  /** Qoolie instance (shallow ref for reactivity) */
  qoolie: ReturnType<typeof shallowRef<QoolieInstance<T> | null>>;
  /** Initialize qoolie with options */
  init: (opts: QoolieOptions<T>) => void;
  /** Destroy the qoolie instance */
  destroy: () => void;
} {
  const qoolie = shallowRef<QoolieInstance<T> | null>(null);

  // Initialize qoolie instance once
  if (!globalQoolieInstance && options) {
    globalQoolieInstance = createQoolie(options);
  }

  if (!globalQoolieInstance && !options) {
    console.warn('[useQoolie] Qoolie instance not initialized. Call useQoolie() with options first.');
  }

  if (globalQoolieInstance) {
    qoolie.value = globalQoolieInstance as QoolieInstance<T>;
  }

  // Cleanup on unmount (optional - don't auto-destroy)
  onUnmounted(() => {
    // Optional: uncomment to auto-destroy on unmount
    // qoolie.value?.destroy();
    // globalQoolieInstance = null;
    // qoolie.value = null;
  });

  const init = (opts: QoolieOptions<T>) => {
    if (!globalQoolieInstance) {
      globalQoolieInstance = createQoolie(opts);
      qoolie.value = globalQoolieInstance as QoolieInstance<T>;
    }
  };

  const destroy = () => {
    if (globalQoolieInstance) {
      globalQoolieInstance.destroy();
      globalQoolieInstance = null;
      qoolie.value = null;
    }
  };

  return {
    qoolie,
    init,
    destroy,
  };
}

/**
 * Get the current qoolie instance without initializing
 * @returns Qoolie instance or null if not initialized
 */
export function getQoolie<T extends CollectionConfigMap>(): QoolieInstance<T> | null {
  return globalQoolieInstance as QoolieInstance<T> | null;
}

/**
 * Destroy the global qoolie instance
 */
export function destroyQoolie(): void {
  if (globalQoolieInstance) {
    globalQoolieInstance.destroy();
    globalQoolieInstance = null;
  }
}
