import { useState, useEffect } from 'react';
import type { SyncStatus } from './types.js';
import { getQoolie } from './useQoolie.js';

/**
 * React hook to get qoolie sync status
 * 
 * @returns Sync status and control functions
 * 
 * @example
 * ```tsx
 * function SyncStatusIndicator() {
 *   const { status, pause, resume, flush } = useQoolieSync();
 * 
 *   return (
 *     <div>
 *       <span>
 *         {status.running ? '🟢 Syncing' : '🔴 Paused'}
 *         {status.networkPaused && ' (Offline)'}
 *       </span>
 *       <span>Queue: {status.queueLength}</span>
 *       <button onClick={pause}>Pause</button>
 *       <button onClick={resume}>Resume</button>
 *       <button onClick={flush}>Flush</button>
 *     </div>
 *   );
 * }
 * ```
 */
export function useQoolieSync(): {
  /** Current sync status */
  status: SyncStatus | null;
  /** Loading state (initial status fetch) */
  loading: boolean;
  /** Error if status fetch failed */
  error: Error | null;
  /** Pause sync */
  pause: () => void;
  /** Resume sync */
  resume: () => void;
  /** Flush pending operations */
  flush: () => Promise<void>;
  /** Refresh status */
  refresh: () => Promise<void>;
} {
  const [status, setStatus] = useState<SyncStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchStatus = async () => {
    const qoolie = getQoolie();
    if (!qoolie) {
      setLoading(false);
      setStatus(null);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const syncStatus = await qoolie.sync.getStatus();
      setStatus(syncStatus);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  // Subscribe to sync events for real-time updates
  useEffect(() => {
    const qoolie = getQoolie();
    if (!qoolie) {
      return;
    }

    const unsubscribe = qoolie.sync.onEvent(() => {
      // Refresh status on any sync event
      fetchStatus();
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const pause = () => {
    const qoolie = getQoolie();
    if (qoolie) {
      qoolie.sync.pause();
      fetchStatus();
    }
  };

  const resume = () => {
    const qoolie = getQoolie();
    if (qoolie) {
      qoolie.sync.resume();
      fetchStatus();
    }
  };

  const flush = async () => {
    const qoolie = getQoolie();
    if (qoolie) {
      await qoolie.sync.flush();
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
