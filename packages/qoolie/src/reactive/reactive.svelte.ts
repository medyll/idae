/**
 * Qoolie with Svelte 5 Runes - Reactive Queries
 * 
 * Qoolie supports Svelte 5 runes for reactive queries when using the 'svelte5' state engine (default).
 * 
 * @see https://svelte.dev/docs/svelte/$derived
 */

import type { QoolieOptions, QoolieInstance, CollectionConfigMap } from '../lib/types.js';

/**
 * Create a reactive query result using Svelte 5 $derived
 * 
 * @example
 * ```svelte
 * <script lang="ts">
 * import { createQoolie } from '@medyll/qoolie';
 * 
 * const qoolie = createQoolie({
 *   dbName: 'my-app',
 *   collections: {
 *     users: { keyPath: '++id' }
 *   }
 * });
 * 
 * // Reactive query - automatically updates when data changes
 * let adults = $derived(qoolie.collection.users.where({ age: { $gte: 18 } }));
 * let allUsers = $derived(qoolie.collection.users.getAll());
 * </script>
 * 
 * {#each adults.value as user}
 *   <p>{user.name} - {user.age}</p>
 * {/each}
 * ```
 */
export interface ReactiveQueryResult<T> {
  /** Current value (updated reactively) */
  value: T[];
  /** Loading state */
  loading: boolean;
  /** Error if any */
  error: Error | null;
  /** Refresh the query */
  refresh: () => Promise<void>;
}

/**
 * Options for reactive queries
 */
export interface ReactiveQueryOptions {
  /** Enable automatic refresh on data changes (default: true) */
  reactive?: boolean;
  /** Debounce time in ms for reactive updates (default: 0) */
  debounceMs?: number;
}

/**
 * Use a reactive query in Svelte 5 components
 * 
 * Note: This is a type helper. The actual reactivity comes from Svelte 5 $derived.
 * 
 * @example
 * ```svelte
 * <script lang="ts">
 * import { createQoolie } from '@medyll/qoolie';
 * 
 * const qoolie = createQoolie({
 *   dbName: 'my-app',
 *   collections: { users: { keyPath: '++id' } }
 * });
 * 
 * // Simple reactive query
 * let users = $derived(qoolie.collection.users.getAll());
 * 
 * // Query with filters
 * let activeUsers = $derived(
 *   qoolie.collection.users.where({ active: true })
 * );
 * 
 * // Query with multiple conditions
 * let adultAdmins = $derived(
 *   qoolie.collection.users.where({
 *     age: { $gte: 18 },
 *     role: 'admin'
 *   })
 * );
 * </script>
 * ```
 */
export function useReactiveQuery<T>(
  queryFn: () => Promise<T[]>
): ReactiveQueryResult<T> {
  // This is a type helper - actual implementation uses Svelte 5 $derived
  return {
    value: [] as T[],
    loading: false,
    error: null,
    refresh: async () => {
      await queryFn();
    },
  };
}

/**
 * Example: Svelte 5 Component with Reactive Queries
 * 
 * ```svelte
 * <script lang="ts">
 * import { createQoolie } from '@medyll/qoolie';
 * import type { User } from './types';
 * 
 * const qoolie = createQoolie<{ users: { keyPath: '++id'; ts: User } }>({
 *   dbName: 'my-app',
 *   collections: {
 *     users: { keyPath: '++id', ts: {} as User }
 *   }
 * });
 * 
 * // Reactive queries with $derived
 * let allUsers = $derived(qoolie.collection.users.getAll());
 * let adults = $derived(qoolie.collection.users.where({ age: { $gte: 18 } }));
 * let admins = $derived(qoolie.collection.users.where({ role: 'admin' }));
 * 
 * // Computed values
 * let adultAdmins = $derived(
 *   adults.value.filter(u => u.role === 'admin')
 * );
 * 
 * // Add user
 * async function addUser(name: string, age: number) {
 *   await qoolie.collection.users.create({ name, age, role: 'user' });
 *   // adults.value automatically updates!
 * }
 * 
 * // Delete user
 * async function deleteUser(id: number) {
 *   await qoolie.collection.users.delete(id);
 *   // allUsers.value automatically updates!
 * }
 * </script>
 * 
 * <div>
 *   <h1>Users ({allUsers.value.length})</h1>
 *   <h2>Adults ({adults.value.length})</h2>
 *   <ul>
 *     {#each adults.value as user}
 *       <li>
 *         {user.name} - {user.age}
 *         {#if user.role === 'admin'}
 *           <span class="badge">Admin</span>
 *         {/if}
 *         <button onclick={() => deleteUser(user.id)}>Delete</button>
 *       </li>
 *     {/each}
 *   </ul>
 *   
 *   <button onclick={() => addUser('New User', 25)}>Add Adult User</button>
 * </div>
 * ```
 */

/**
 * Example: Reactive Query with Options
 * 
 * ```svelte
 * <script lang="ts">
 * import { createQoolie } from '@medyll/qoolie';
 * 
 * const qoolie = createQoolie({
 *   dbName: 'my-app',
 *   collections: {
 *     posts: { keyPath: '++id' }
 *   }
 * });
 * 
 * // Reactive query with sorting and limiting
 * let recentPosts = $derived(
 *   qoolie.collection.posts.where({
 *     published: true
 *   })
 * );
 * 
 * // Get first 10 sorted by date
 * let topPosts = $derived(
 *   recentPosts.value
 *     .sort((a, b) => b.createdAt - a.createdAt)
 *     .slice(0, 10)
 * );
 * </script>
 * ```
 */
