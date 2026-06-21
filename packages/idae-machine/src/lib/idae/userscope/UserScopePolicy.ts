// idae/userscope/UserScopePolicy.ts — domain implementation of UserScopePolicy
// This file contains the concrete implementation of user-scoped collections and their natural keys

import type { UserScopePolicy } from '$lib/machine/ext/interfaces.js';

export class IdaeUserScopePolicy implements UserScopePolicy {
  private machine: any = null;
  
  constructor() {
    console.log('IdaeUserScopePolicy initialized');
  }
  
  initialize(machine: any): void {
    this.machine = machine;
    console.log('IdaeUserScopePolicy initialized with machine instance');
  }
  
  // Current user ID from machine rights
  currentUserId(): string | null {
    if (!this.machine) {
      throw new Error('IdaeUserScopePolicy not initialized - call initialize(machine) first');
    }
    
    // Access current user through machine.rights
    return this.machine?.rights?.currentUser?.id ?? null;
  }
  
  // Domain-specific scoped collections (appuser_*)
  scopedCollections(): string[] {
    return [
      'appuser_history',
      'appuser_prefs', 
      'appuser_activity',
      'appuser_session',
      'appuser_audit'
    ];
  }
  
  // Natural keys for each scoped collection
  naturalKey(collection: string): string[] | null {
    const naturalKeys: Record<string, string[]> = {
      appuser_history:  ['code', 'userId'],
      appuser_prefs:    ['collection', 'collection_value', 'userId'],
      appuser_activity: ['code', 'userId'],
      appuser_session:  ['token'],
      appuser_audit:    ['id']  // audit entries are unique
    };
    
    return naturalKeys[collection] ?? null;
  }
}

console.log('IdaeUserScopePolicy created, ready for initialization');