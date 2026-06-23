<!--
ContextMenu.svelte
Global context menu container that handles positioning and content loading
@role context-menu
-->
<script lang="ts">
  import { mount, unmount } from 'svelte';
  import { machine } from '$lib/main/machine.js';
  import type { Component } from 'svelte';
  import { getContextMenuState, closeContextMenu } from './contextMenu.svelte.js';

  let menuElement: HTMLElement;
  let contentElement: HTMLElement;
  let contentApp: Record<string, unknown> | undefined;

  // Reactive state object — same instance every call, mutated in place by contextMenu.svelte.ts.
  const state = getContextMenuState();

  function handleClickOutside(e: MouseEvent): void {
    if (menuElement && !menuElement.contains(e.target as Node)) {
      closeContextMenu();
    }
  }
  
  function handleKeyDown(e: KeyboardEvent): void {
    if (e.key === 'Escape') {
      closeContextMenu();
    }
  }
  
  $effect(() => {
    if (state.isOpen) {
      document.addEventListener('click', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
      
      // Load content dynamically
      const loadContent = async () => {
        try {
          // Resolve the context menu component
          const ContextMenuContent = await machine.componentRegistry.resolve('contextmenu');

          // Swap out the previous content instance, if any.
          if (contentApp) {
            unmount(contentApp);
            contentApp = undefined;
          }

          contentApp = mount(ContextMenuContent as Component<Record<string, unknown>>, {
            target: contentElement,
            props: {
              collection: state.collection,
              collectionId: state.collectionId,
              vars: state.vars
            }
          }) as Record<string, unknown>;
        } catch (error) {
          console.error('Failed to load context menu content:', error);
        }
      };

      void loadContent();

      return () => {
        document.removeEventListener('click', handleClickOutside);
        document.removeEventListener('keydown', handleKeyDown);
        if (contentApp) {
          unmount(contentApp);
          contentApp = undefined;
        }
      };
    }
  });
</script>

<div
  bind:this={menuElement}
  class="context-menu"
  class:open={state.isOpen}
  style="position: fixed; left: {state.position.x}px; top: {state.position.y}px; z-index: 10000;"
>
  <div class="context-menu-content" bind:this={contentElement}></div>
</div>

<style lang="postcss">
  @layer components {
    .context-menu {
      display: none;
      background: var(--color-surface);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
      box-shadow: var(--shadow-lg);
      padding: var(--gutter-sm);
      min-width: 200px;
      max-width: 320px;
    }
    
    .context-menu.open {
      display: block;
    }
    
    .context-menu-content {
      width: 100%;
      max-height: 400px;
      overflow-y: auto;
      overscroll-behavior: contain;
    }
  }
</style>