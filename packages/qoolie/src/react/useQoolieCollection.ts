import { useState, useEffect, useCallback, useRef } from 'react';
import type { QoolieInstance, CollectionConfigMap } from './types.js';
import { getQoolie } from './useQoolie.js';

type QueryFunction<T> = (collection: any) => T;

interface UseQoolieCollectionOptions {
  /** Query function to execute on the collection */
  query?: (collection: any) => any;
  /** Enable reactive updates (default: true) */
  reactive?: boolean;
  /** Dependencies to re-run query when changed */
  dependencies?: any[];
}

/**
 * React hook to query a qoolie collection with optional reactivity
 * 
 * @param collectionName - Name of the collection to query
 * @param options - Query options
 * @returns Query result and loading state
 * 
 * @example
 * ```tsx
 * function UsersList() {
 *   const { data, loading, error } = useQoolieCollection('users', {
 *     query: (collection) => collection.where({ active: true }).toArray(),
 *     reactive: true,
 *   });
 * 
 *   if (loading) return <div>Loading...</div>;
 *   if (error) return <div>Error: {error.message}</div>;
 * 
 *   return (
 *     <ul>
 *       {data.map(user => (
 *         <li key={user.id}>{user.name}</li>
 *       ))}
 *     </ul>
 *   );
 * }
 * ```
 */
export function useQoolieCollection<T = any>(
  collectionName: string,
  options: UseQoolieCollectionOptions = {}
): {
  /** Query result data */
  data: T | null;
  /** Loading state */
  loading: boolean;
  /** Error if query failed */
  error: Error | null;
  /** Re-run the query */
  refresh: () => Promise<void>;
} {
  const { query, reactive = true, dependencies = [] } = options;

  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const queryRef = useRef(query);
  queryRef.current = query;

  const executeQuery = useCallback(async () => {
    const qoolie = getQoolie();
    if (!qoolie || !queryRef.current) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const collection = (qoolie.collection as any)[collectionName];
      if (!collection) {
        throw new Error(`Collection "${collectionName}" not found`);
      }
      const result = await queryRef.current(collection);
      setData(result);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [collectionName]);

  useEffect(() => {
    executeQuery();
  }, [executeQuery, ...dependencies]);

  // Subscribe to collection changes for reactive updates
  useEffect(() => {
    if (!reactive || !queryRef.current) {
      return;
    }

    const qoolie = getQoolie();
    if (!qoolie) {
      return;
    }

    // Subscribe to sync events to refresh data
    const unsubscribe = qoolie.sync.onEvent((event: any) => {
      if (event.collection === collectionName && event.type === 'delivered') {
        executeQuery();
      }
    });

    return () => {
      unsubscribe();
    };
  }, [collectionName, reactive, executeQuery]);

  return {
    data,
    loading,
    error,
    refresh: executeQuery,
  };
}

/**
 * Simple hook to get a collection reference without querying
 * 
 * @param collectionName - Name of the collection
 * @returns Collection reference or null
 */
export function useCollectionRef(collectionName: string): any {
  const qoolie = getQoolie();
  if (!qoolie) {
    return null;
  }
  return (qoolie.collection as any)[collectionName] || null;
}
