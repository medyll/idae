// ENGINE — no domain literals
// Policy registry that will be injected with domain implementations

import type {
  RelationPolicy,
  MetaModelProvider,
  UserScopePolicy,
  RightsPolicy,
  Capabilities,
  FrameCatalog
} from './interfaces.js';

/**
 * Policy registry type - mirrors the domain's PolicyRegistry
 */
export interface EnginePolicyRegistry {
  relation?: RelationPolicy;
  meta?: MetaModelProvider;
  userScope?: UserScopePolicy;
  rights?: RightsPolicy;
  capabilities?: Capabilities;
  frameCatalog?: FrameCatalog;
}

// Global registry that will be populated by domain boot
let policyRegistry: EnginePolicyRegistry = {};

/**
 * Inject domain policies into the engine registry
 * Called by domain boot process
 */
export function injectPolicies(registry: EnginePolicyRegistry): void {
  policyRegistry = registry;
  console.log('Engine policies injected:', Object.keys(registry));
}

/**
 * Get the current policy registry
 */
export function getPolicyRegistry(): EnginePolicyRegistry {
  return policyRegistry;
}

/**
 * Get a specific policy implementation
 */
export function getPolicy<T extends keyof EnginePolicyRegistry>(
  policyName: T
): EnginePolicyRegistry[T] | undefined {
  return policyRegistry[policyName];
}

/**
 * Check if a policy is available
 */
export function hasPolicy<T extends keyof EnginePolicyRegistry>(
  policyName: T
): boolean {
  return policyRegistry[policyName] !== undefined;
}