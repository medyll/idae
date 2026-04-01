/**
 * Server Push types for SSE and WebSocket support
 */

export type PushProtocol = 'sse' | 'websocket';

export interface PushConfig {
  /** Enable server push */
  enabled?: boolean;
  /** Protocol to use: 'sse' or 'websocket' */
  protocol?: PushProtocol;
  /** Server URL for push connection */
  url?: string;
  /** JWT token for authentication */
  token?: string;
  /** Reconnect interval in ms (default: 3000) */
  reconnectIntervalMs?: number;
  /** Max reconnect attempts (default: Infinity) */
  maxReconnects?: number;
  /** Connection timeout in ms (default: 30000) */
  timeoutMs?: number;
}

export interface ServerChange {
  /** Change type */
  type: 'create' | 'update' | 'delete';
  /** Collection name */
  collection: string;
  /** Document ID */
  id: any;
  /** Document data (for create/update) */
  data?: any;
  /** Timestamp of change */
  timestamp: number;
}

export type ServerChangeHandler = (change: ServerChange) => void | Promise<void>;

export interface PushListener {
  /** Start listening for server changes */
  start(): void;
  /** Stop listening */
  stop(): void;
  /** Check if connected */
  isConnected(): boolean;
  /** Set change handler */
  onChange(handler: ServerChangeHandler): void;
  /** Set authentication token */
  setToken(token: string): void;
}
