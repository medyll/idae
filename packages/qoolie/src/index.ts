// Main entry point for @medyll/qoolie

// Core factory
export { createQoolie } from './lib/Qoolie.js';

// Main classes (for advanced usage)
export { Qoolie } from './lib/Qoolie.js';
export { QoolieCollection } from './lib/QoolieCollection.js';
export { SyncController } from './lib/SyncController.js';
export { DLQController } from './lib/DLQController.js';

// Server Push
export { ServerPushListener, SSEListener, WebSocketListener } from './lib/push/index.js';

// Encryption
export { EncryptionHelper, deriveKey, generateSalt } from './lib/encryption/index.js';

// Plugins
export { definePlugin, PluginManager } from './lib/plugins/index.js';

// Types
export type {
  QoolieOptions,
  QoolieInstance,
  CollectionConfig,
  CollectionConfigMap,
  SyncConfig,
  SyncStatus,
  SyncMode,
  SyncErrorContext,
  CircuitBreakerOptions,
  PushConfig,
  ServerChange,
} from './lib/types.js';

// Push types
export type {
  PushProtocol,
  PushListener,
  ServerChangeHandler,
} from './lib/push/types.js';

// Error classes
export { QoolieError } from './lib/types.js';

// Utils (optional exports for advanced users)
export { autoDetectBaseUrl } from './lib/utils/autoDetectBaseUrl.js';
export { normalizeConfig } from './lib/utils/normalizeConfig.js';

// React hooks (optional, react is peer dependency)
// Import from '@medyll/qoolie/react'
