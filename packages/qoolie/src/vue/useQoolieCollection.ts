import { ref, computed, onUnmounted, watch } from 'vue';
import type { Ref } from 'vue';
import { getQoolie } from './useQoolie.js';

interface UseQoolieCollectionOptions<T = any> {
  /** Query function to execute on the collection */
  query?: (collection: any) => Promise<T> | T;
  /** Enable reactive updates (default: true) */
  reactive?: boolean;
  /** Dependencies to re-run query when changed */
  dependencies?: any[];
}

/**
 * Vue 3 composable to query a qoolie collection with optional reactivity
 * 
 * @param collectionName - Name of the collection to query
 * @param options - Query options
 * @returns Reactive query result
 * 
 * @example
 * ```vue
 * <script setup lang="ts">
 * const { data, loading, error, refresh } = useQoolieCollection('users', {
 *   query: (collection) => collection.where({ active: true }).toArray(),
 *   reactive: true,
 *   dependencies: [],
 * });
 * </script>
 * 
 * <template>
 *   <div v-if="loading">Loading...</div>
 *   <div v-else-if="error">Error: {{ error.message }}</div>
 *   <ul v-else>
 *     <li v-for="user in data" :key="user.id">{{ user.name }}</li>
 *   </ul>
 * </template>
 * ```
 */
export function useQoolieCollection<T = any>(
  collectionName: string,
  options: UseQoolieCollectionOptions<T> = {}
): {
  /** Query result data (reactive) */
  data: Ref<T | null>;
  /** Loading state (reactive) */
  loading: Ref<boolean>;
  /** Error if query failed (reactive) */
  error: Ref<Error | null>;
  /** Re-run the query */
  refresh: () => Promise<void>;
} {
  const { query, reactive = true, dependencies = [] } = options;

  const data = ref<T | null>(null) as Ref<T | null>;
  const loading = ref(true);
  const error = ref<Error | null>(null);

  const executeQuery = async () => {
    const qoolie = getQoolie();
    if (!qoolie || !query) {
      loading.value = false;
      return;
    }

    try {
      loading.value = true;
      error.value = null;
      const collection = (qoolie.collection as any)[collectionName];
      if (!collection) {
        throw new Error(`Collection "${collectionName}" not found`);
      }
      const result = await query(collection);
      data.value = result;
    } catch (err) {
      error.value = err as Error;
    } finally {
      loading.value = false;
    }
  };

  // Run query on mount and when dependencies change
  watch(
    () => [...dependencies, collectionName],
    () => {
      executeQuery();
    },
    { immediate: true }
  );

  // Subscribe to sync events for reactive updates
  if (reactive && query) {
    const qoolie = getQoolie();
    if (qoolie) {
      const unsubscribe = qoolie.sync.onEvent((event: any) => {
        if (event.collection === collectionName && event.type === 'delivered') {
          executeQuery();
        }
      });

      onUnmounted(() => {
        unsubscribe();
      });
    }
  }

  return {
    data,
    loading,
    error,
    refresh: executeQuery,
  };
}

/**
 * Simple composable to get a collection reference without querying
 * 
 * @param collectionName - Name of the collection
 * @returns Collection reference
 */
export function useCollectionRef(collectionName: string): Ref<any> {
  const qoolie = getQoolie();
  const collection = ref<any>(null);

  if (qoolie) {
    collection.value = (qoolie.collection as any)[collectionName] || null;
  }

  return collection;
}
