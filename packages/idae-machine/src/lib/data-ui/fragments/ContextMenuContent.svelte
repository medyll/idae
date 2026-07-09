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
  import { useRecordData } from '$lib/data-ui/utils/useRecordData.svelte.js';
  import RecordToolbar from '$lib/shell/layout/RecordToolbar.svelte';

  let {
    collection,
    collectionId,
    vars = {}
  }: {
    collection: string;
    collectionId: string | number;
    vars?: Record<string, string>;
  } = $props();

  // BL-24: record resolution via the shared useRecordData hook (reactive machine.store
  // read, scheme.index-aware) — replaces the previous inline `records.find(r => r.id ==
  // collectionId)` (loose `==`, ignored scheme.index, never re-derived on store updates).
  const recordData = useRecordData(() => collection, () => ({ collectionId }));

  const canRead   = $derived(machine.rights.checkAccess(collection, 'R'));
  const canUpdate = $derived(machine.rights.checkAccess(collection, 'U'));
  const canDelete = $derived(machine.rights.checkAccess(collection, 'D'));
  const canCreate = $derived(machine.rights.checkAccess(collection, 'C'));
  const canList   = $derived(machine.rights.checkAccess(collection, 'L'));

  type MenuItem = {
    label: string;
    icon?: string;
    action: () => void;
    disabled?: boolean;
    divider?: boolean;
  };

  const menuItems = $derived.by((): MenuItem[] => {
    const items: MenuItem[] = [];

    if (canRead) {
      items.push({
        label: 'View',
        icon: 'eye',
        action: () => {
          machine.framer.loadInDialog('fiche', collection, collectionId);
        }
      });
    }

    if (canUpdate) {
      items.push({
        label: 'Edit',
        icon: 'pencil',
        action: () => {
          machine.framer.loadInDialog('fiche.update', collection, collectionId);
        }
      });
    }

    if (canDelete) {
      items.push({
        label: 'Delete',
        icon: 'trash',
        action: () => {
          if (confirm('Are you sure you want to delete this record?')) {
            // machine.action has no delete primitive (create/upsert only, see
            // MachineAction.ts) — delete is imperative CRUD, machine.collection is correct
            // here per CLAUDE.md invariant 8 (store = reactive read, collection = CRUD).
            void machine.collection(collection).delete(collectionId);
          }
        }
      });
    }

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

    // BL-17 — collection-level launch verbs (MAIN_MENU.md §2 table), gated by C/L
    // rights, reusing the BL-13 verb resolver (machine.menu.verbs) instead of calling
    // machine.framer directly. Only the ✅-built verbs are exposed; "Recherche rapide"/
    // "Comparer"/"Trier"/"console"/"images" stay TBD (no frame yet) — omitted, not stubbed.
    const hasRecordActions = canRead || canUpdate || canDelete || canCreate;
    const hasCollectionActions = canCreate || canList;

    if (hasCollectionActions && hasRecordActions) {
      items.push({ label: 'divider-collection', icon: 'divider', action: () => {}, divider: true });
    }

    if (canCreate) {
      items.push({
        label: 'Créer',
        icon: 'plus',
        action: () => {
          machine.menu.verbs.create?.(collection);
        }
      });
    }

    if (canList) {
      items.push({
        label: 'Espace',
        icon: 'layout',
        action: () => {
          machine.menu.verbs.space?.(collection);
        }
      });
      items.push({
        label: 'Parcourir',
        icon: 'list',
        action: () => {
          machine.menu.verbs.explorer?.(collection);
        }
      });
    }

    if (vars.customActions && (hasRecordActions || hasCollectionActions)) {
      items.push({ label: 'divider', icon: 'divider', action: () => {}, divider: true });
    }

    if (vars.customActions) {
      try {
        const customActions = JSON.parse(vars.customActions);
        if (Array.isArray(customActions)) {
          items.push(...customActions.map((action) => ({
            label: action.label,
            icon: action.icon,
            action: () => {
              if (action.action) {
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

    return items;
  });

  function handleItemClick(item: MenuItem): void {
    if (!item.divider && !item.disabled) {
      item.action();
      closeContextMenu();
    }
  }
</script>

<!--
  BL-22: the contextual menu of a record includes the record's own toolbar — additive
  for now (View/Edit/Delete/Duplicate stay rights-gated as built above; BL-17 will fold
  rights-gating into the toolbar itself). collection+collectionId are always present here.
-->
<context-menu-toolbar>
  <RecordToolbar {collection} {collectionId} />
</context-menu-toolbar>

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
    context-menu-toolbar {
      display: block;
      padding: 0 var(--gutter-sm, 0.5rem) var(--gutter-xs, 0.25rem);
      border-bottom: 1px solid var(--color-border);
      margin-bottom: var(--gutter-xs, 0.25rem);
    }

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