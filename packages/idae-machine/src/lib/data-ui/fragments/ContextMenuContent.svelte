<!--
ContextMenuContent.svelte
Dynamic context menu content that builds menu items based on permissions and collection data
@role context-menu-content
@prop {string} collection - Collection name
@prop {string|number} collectionId - Record ID
@prop {Record<string, string>} [vars] - Additional variables for custom actions
-->
<script lang="ts">
  import { machine } from '$lib/main/machine.js';
  import { closeContextMenu } from './contextMenu.svelte.js';
  import { onMount } from 'svelte';
  
  let {
    collection,
    collectionId,
    vars = {}
  }: {
    collection: string;
    collectionId: string | number;
    vars?: Record<string, string>;
  } = $props();
  
  let menuItems = $state<{ 
    label: string; 
    icon?: string; 
    action: () => void; 
    disabled?: boolean; 
    divider?: boolean;
  }[]>([]);
  
  onMount(async () => {
    await buildMenuItems();
  });
  
  async function buildMenuItems(): Promise<void> {
    const items: typeof menuItems = [];
    
    // Get the record data
    const record = machine.store(collection)?.records?.find(r => r.id == collectionId);
    
    // Check permissions using machine.rights
    const canRead = machine.rights.checkAccess(collection, 'R');
    const canUpdate = machine.rights.checkAccess(collection, 'U');
    const canDelete = machine.rights.checkAccess(collection, 'D');
    const canCreate = machine.rights.checkAccess(collection, 'C');
    
    // View action
    if (canRead) {
      items.push({
        label: 'View',
        icon: 'eye',
        action: () => {
          machine.framer.loadInDialog('fiche', collection, collectionId);
        }
      });
    }
    
    // Edit action
    if (canUpdate) {
      items.push({
        label: 'Edit',
        icon: 'pencil',
        action: () => {
          machine.framer.loadInDialog('fiche.update', collection, collectionId);
        }
      });
    }
    
    // Delete action
    if (canDelete) {
      items.push({
        label: 'Delete',
        icon: 'trash',
        action: async () => {
          if (confirm('Are you sure you want to delete this record?')) {
            await machine.collection(collection).delete(collectionId);
          }
        }
      });
    }
    
    // Duplicate action
    if (canCreate) {
      items.push({
        label: 'Duplicate',
        icon: 'copy',
        action: () => {
          // Implement duplicate logic
          console.log('Duplicate action not yet implemented');
        }
      });
    }
    
    // Add divider if we have both standard and custom actions
    if (vars.customActions && (canRead || canUpdate || canDelete || canCreate)) {
      items.push({ label: 'divider', icon: 'divider', action: () => {}, divider: true });
    }
    
    // Add custom actions from vars
    if (vars.customActions) {
      try {
        const customActions = JSON.parse(vars.customActions);
        if (Array.isArray(customActions)) {
          items.push(...customActions.map(action => ({
            label: action.label,
            icon: action.icon,
            action: () => {
              if (action.action) {
                // Support both string actions (e.g., "loadInDialog:explorer") and function actions
                if (typeof action.action === 'string') {
                  const [cmd, ...args] = action.action.split(':');
                  if (cmd === 'loadInDialog') {
                    machine.framer.loadInDialog(args[0] as any, collection, collectionId);
                  }
                } else if (typeof action.action === 'function') {
                  action.action();
                }
              }
            },
            disabled: action.disabled
          })));
        }
      } catch (e) {
        console.warn('Failed to parse custom actions:', e);
      }
    }
    
    menuItems = items;
  }
  
  function handleItemClick(item: typeof menuItems[number]): void {
    if (!item.divider && !item.disabled) {
      item.action();
      closeContextMenu();
    }
  }
</script>

<ul class="context-menu-list">
  {#each menuItems as item (item.label)}
    {#if item.divider}
      <li class="context-menu-divider"></li>
    {:else}
      <li>
        <button
          type="button"
          class="context-menu-item"
          class:disabled={item.disabled}
          onclick={() => handleItemClick(item)}
          disabled={item.disabled}
        >
          {#if item.icon}
            <span class="context-menu-icon">{item.icon}</span>
          {/if}
          <span class="context-menu-label">{item.label}</span>
        </button>
      </li>
    {/if}
  {/each}
</ul>

<style lang="postcss">
  @layer components {
    .context-menu-list {
      list-style: none;
      padding: 0;
      margin: 0;
      display: flex;
      flex-direction: column;
      gap: var(--gutter-xs, 0.25rem);
    }
    
    .context-menu-item {
      display: flex;
      align-items: center;
      gap: var(--gutter-sm, 0.5rem);
      width: 100%;
      padding: var(--gutter-xs, 0.25rem) var(--gutter-sm, 0.5rem);
      background: transparent;
      border: none;
      border-radius: var(--radius-sm);
      cursor: pointer;
      text-align: left;
      font-size: var(--font-size-sm);
      line-height: 1.2;
      transition: background-color 0.1s ease;
    }
    
    .context-menu-item:hover:not(.disabled) {
      background: var(--color-hover);
    }
    
    .context-menu-item:focus-visible:not(.disabled) {
      outline: 2px solid var(--color-primary);
      outline-offset: -2px;
    }
    
    .context-menu-item.disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    
    .context-menu-icon {
      width: 1.2em;
      text-align: center;
      font-family: var(--font-icons, 'Font Awesome 6 Free');
      font-weight: 900;
    }
    
    .context-menu-label {
      flex: 1;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    
    .context-menu-divider {
      height: 1px;
      background: var(--color-border);
      margin: var(--gutter-xs, 0.25rem) 0;
    }
  }
</style>