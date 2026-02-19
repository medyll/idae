// Core engine for idae-html components
// Re-exports idae-be helpers and exposes a global app registry on window
import { be, toBe } from '@medyll/idae-be';
import { cssDom, htmlDom } from '@medyll/idae-dom-events';
import { stator } from '@medyll/idae-stator';
import { csss, OpCssParser } from '@medyll/idae-csss';
// import * as idbqlMod from '@medyll/idae-idbql';

type AppRegistry = {
  loadedScripts: Record<string, boolean>;
  components: Record<string, ComponentSpec>;
  registerScript: (key: string, url?: string) => void;
  isScriptLoaded: (key: string) => boolean;
  registerComponent: (name: string, value: ComponentSpec) => void;
  getComponent: (name: string) => ComponentSpec;
  loadScript: (url: string, key?: string) => Promise<void>;
  loadStyle: (url: string, key?: string) => Promise<void>;
  loadResources: (urls: string[]) => Promise<void>;
};

// Ensure a single global registry on window
const win = (globalThis as any) as Window & { __idae_app?: AppRegistry };
if (!win.__idae_app) {
  const registry: AppRegistry = {
    loadedScripts: {},
    components: {},
    registerScript(key: string) {
      registry.loadedScripts[key] = true;
    },
    isScriptLoaded(key: string) {
      return !!registry.loadedScripts[key];
    },
    registerComponent(name: string, value: ComponentSpec) {
      registry.components[name] = value;
    },
    getComponent(name: string) {
      return registry.components[name];
    },
    loadScript(url: string, key?: string) {
      const id = key || url;
      if (registry.loadedScripts[id]) return Promise.resolve();
      return new Promise<void>((resolve, reject) => {
        try {
          const s = document.createElement('script');
          s.src = url;
          s.async = true;
          s.onload = () => {
            registry.registerScript(id);
            resolve();
          };
          s.onerror = () => reject(new Error('Failed to load script ' + url));
          document.head.appendChild(s);
        } catch (e) {
          reject(e);
        }
      });
    },
    loadStyle(url: string, key?: string) {
      const id = key || url;
      if (registry.loadedScripts[id]) return Promise.resolve();
      return new Promise<void>((resolve, reject) => {
        try {
          const l = document.createElement('link');
          l.rel = 'stylesheet';
          l.href = url;
          l.onload = () => {
            registry.registerScript(id);
            resolve();
          };
          l.onerror = () => reject(new Error('Failed to load style ' + url));
          document.head.appendChild(l);
        } catch (e) {
          reject(e);
        }
      });
    },
    async loadResources(urls: string[]) {
      const loaders = urls.map((u) => {
        const url = String(u);
        if (url.endsWith('.css')) return registry.loadStyle(url);
        return registry.loadScript(url);
      });
      await Promise.all(loaders);
    }
  };
  win.__idae_app = registry;
}

// Auto-load package theme CSS so components use centralized styling.
try {
  // Resolve the theme path relative to this module so bundlers produce a correct URL
  const themeUrl = new URL('./theme/theme.css', import.meta.url).href;
  // Load without awaiting; ignore failures silently
  (win.__idae_app as AppRegistry).loadStyle(themeUrl, 'idae-theme').catch(() => {});
} catch (e) {
  // import.meta may not be available in some non-module contexts; ignore silently
}

export const app = win.__idae_app as AppRegistry;

// Track per-instance cleanup functions so we can call them when elements are removed
const mountedCleanup: WeakMap<HTMLElement, Function> = new WeakMap();

// `be` and `toBe` imported directly above
// `stator` imported directly above
// `csss`, `CsssNode` and `OpCssParser` imported directly above
// const createIdbqDb = (idbqlMod as any).createIdbqDb || (idbqlMod as any).createIdbDb || undefined;
// const createIdbqlState = (idbqlMod as any).createIdbqlState || undefined;
// const idbql = (idbqlMod as any).idbql || (idbqlMod as any).default || undefined;

interface ComponentSpec {
  script: (root: HTMLElement, props: any) => void | Function; 
  props?: Record<string, any>; 
  resources?: string[]; 
  on?: Record<string, (root: HTMLElement, event: Event) => void>; 
  meta?: {
    author?: string;
    version?: string;
    description?: string;
    [key: string]: any;
  };
}

function registerComponent(name: string, value: ComponentSpec) { 
  const spec: ComponentSpec = value;
  app.registerComponent(name, spec);

  // Ensure declared resources are loaded before initializing existing instances.
  // Components should still guard against missing resources in their own logic,
  // but the engine will attempt to await declared resources when possible.
  (async () => {
    try {
      if (spec.resources?.length) {
        await app.loadResources(spec.resources);
      }
    } catch (e) {
      // ignore resource loading failures; components must handle missing deps
    }

    try {
      initComponent(name);
    } catch (e) { /* ignore */ }
  })();
}

function parsePropsFromDataset(dataset: DOMStringMap): Record<string, any> {
  const props: Record<string, any> = {};
  for (const key in dataset) {
    if (Object.prototype.hasOwnProperty.call(dataset, key)) {
      const value = dataset[key];
      if (value === 'true') props[key] = true;
      else if (value === 'false') props[key] = false;
      else if (/^\d+$/.test(value!)) props[key] = parseInt(value!, 10);
      else if (/^\d*\.\d+$/.test(value!)) props[key] = parseFloat(value!);
      else if (value?.startsWith('{') || value?.startsWith('[')) {
        try { props[key] = JSON.parse(value!); } catch { props[key] = value; }
      } else {
        props[key] = value;
      }
    }
  }
  return props;
}

/**
 * Initializes a specific component on a given root
 */
function initComponent(name: string, root: ParentNode = document) {
  const comp = app.getComponent(name);
  if (!comp) return;

  const script = (typeof comp === 'function') ? comp : (comp && comp.script ? comp.script : null);
  if (typeof script !== 'function') return;

  try {
    const els: HTMLElement[] = [];
    // If the root itself is a matching element, include it
    if ((root as any).nodeType === Node.ELEMENT_NODE) {
      const rootEl = root as Element;
      if (rootEl.getAttribute && rootEl.getAttribute('data-component') === name) {
        els.push(rootEl as HTMLElement);
      }
    }

    if ((root as any).querySelectorAll) {
      Array.from((root as any).querySelectorAll(`[data-component="${name}"]`)).forEach((e) => els.push(e as HTMLElement));
    }

    els.forEach((el: HTMLElement) => {
      try {
        // Prevent double initialization
        if (el.hasAttribute('data-hydrated')) return;

        const defaultProps = comp.props || {};
        const elementProps = parsePropsFromDataset(el.dataset);
        const props = { ...defaultProps, ...elementProps };

        const maybeCleanup = script(el, props);
        if (typeof maybeCleanup === 'function') {
          mountedCleanup.set(el, maybeCleanup as Function);
        }

        try {
          el.setAttribute('data-hydrated', '1');
        } catch {}
      } catch (e) { console.error('component init error', name, e); }
    });
  } catch (e) { /* ignore */ }
}

function initRegisteredComponents(root: ParentNode = document) {
  try {
    Object.keys(app.components || {}).forEach((name) => initComponent(name, root));
  } catch (e) { /* ignore */ }
}

/**
 * Automatically initializes all registered components on the document once it is loaded.
 * If the document is already loaded, it will initialize the components immediately.
 * Additionally, sets up DOM observation to monitor when components enter or leave the DOM.
 * @example
 * import { core } from '/packages/idee-html/src/lib/core-engine.ts';
 * core.autoInitRegisteredComponents();
 */
function autoInitRegisteredComponents() {
  const initAndSetup = () => {
    initRegisteredComponents(document);
    setupDomObserver();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAndSetup);
  } else {
    initAndSetup();
  }
}

/**
 * Sets up a MutationObserver to detect when components enter or leave the DOM.
 * Automatically initializes newly added components and logs when components are removed.
 * @example
 * import { core } from '/packages/idee-html/src/lib/core-engine.ts';
 * core.setupDomObserver();
 */
function setupDomObserver() {
  htmlDom.track(document.body, {
    onChildListChange: (element: Node, mutation: MutationRecord, observer: MutationObserver) => {
      // When components enter the DOM
      mutation.addedNodes.forEach((node: Node) => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          initRegisteredComponents(node as ParentNode);
        }
      });
      // When components leave the DOM
      mutation.removedNodes.forEach((node: Node) => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          const el = node as unknown as HTMLElement;
          // Call cleanup if one was registered for this element
          try {
            const fn = mountedCleanup.get(el as HTMLElement);
            if (typeof fn === 'function') {
              try { fn(); } catch (e) { console.error('component cleanup error', e); }
              mountedCleanup.delete(el as HTMLElement);
            }
          } catch (e) {
            // ignore
          }
        }
      });
    }
  });
}

export const core: any = {
  app,
  be,
  toBe,
  htmlDom,
  cssDom,
  stator,
  csss,
  csssParser : OpCssParser,
  registerComponent,
  initComponent,
  initRegisteredComponents,
  autoInitRegisteredComponents
};

/**
 * Returns true when the server has pre-rendered slots for this page.
 * Client components can call this to avoid double-inserting slot content.
 * Usage: if (core.serverSlotsEnabled()) { /* hydrate-only path *\/ }
 */
function serverSlotsEnabled() {
  try {
    if (typeof document === 'undefined') return false;
    return !!document.querySelector('meta[name="idae-server-slots"]');
  } catch (e) {
    return false;
  }
}

(core as any).serverSlotsEnabled = serverSlotsEnabled;

function escapeHtml(s: string) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function applySlotsToElement(root: ParentNode, slots?: Record<string, string | Node>, options?: { allowHtml?: boolean }) {
  if (!slots) return;
  const allowHtml = !!(options && options.allowHtml);
  const slotEls = ((root as any).querySelectorAll ? Array.from((root as any).querySelectorAll('slot')) : []) as Element[];
  slotEls.forEach((slotEl: Element) => {
    const name = slotEl.getAttribute('name') || 'default';
    const provided = slots[name];
    const parent = slotEl.parentNode;
    if (!parent) return;

    let nodes: Node[] = [];
    if (provided == null) {
      nodes = Array.from(slotEl.childNodes);
    } else if (typeof provided === 'string') {
      if (allowHtml) {
        const t = document.createElement('template');
        t.innerHTML = provided;
        nodes = Array.from(t.content.childNodes);
      } else {
        nodes = [document.createTextNode(provided)];
      }
    } else if (provided instanceof Node) {
      nodes = [provided.cloneNode(true)];
    }

    if (nodes.length === 0) {
      parent.removeChild(slotEl);
    } else {
      nodes.forEach((n) => parent.insertBefore(n, slotEl));
      parent.removeChild(slotEl);
    }
  });
}

function renderHtmlWithSlots(template: string | Node, slots?: Record<string, string | Node>, options?: { allowHtml?: boolean }) {
  const frag = document.createDocumentFragment();
  if (typeof template === 'string') {
    const t = document.createElement('template');
    t.innerHTML = template;
    applySlotsToElement(t.content as unknown as ParentNode, slots, options);
    frag.appendChild(t.content.cloneNode(true));
  } else if (template instanceof Node) {
    const container = document.createElement('div');
    container.appendChild(template.cloneNode(true));
    applySlotsToElement(container, slots, options);
    Array.from(container.childNodes).forEach((n) => frag.appendChild(n));
  }
  return frag;
}

(core as any).applySlotsToElement = applySlotsToElement;
(core as any).renderHtmlWithSlots = renderHtmlWithSlots;

/**
 * Render a template (string or Node) with provided slots.
 * Works both in-browser (uses DOM) and server-side (string-based fallback).
 */
function renderComponent(template: string | Node, slots?: Record<string, string | Node>, options?: { allowHtml?: boolean }) {
  const allowHtml = !!(options && options.allowHtml);

  // Browser path: reuse existing DOM-based renderer
  if (typeof document !== 'undefined' && typeof (template as any) !== 'string') {
    const frag = renderHtmlWithSlots(template as Node, slots, options);
    const container = document.createElement('div');
    container.appendChild(frag.cloneNode(true));
    return container.innerHTML;
  }

  // If template is a Node in a server environment, try to serialize it
  if (typeof document !== 'undefined' && typeof (template as any) === 'string') {
    const frag = renderHtmlWithSlots(template as string, slots, options);
    const container = document.createElement('div');
    container.appendChild(frag.cloneNode(true));
    return container.innerHTML;
  }

  // Server-side string-only fallback: simple regex-based slot replacement
  let html = typeof template === 'string' ? template : '';
  if (!slots || Object.keys(slots).length === 0) return html;

  // Replace named slots with fallback handling
  html = html.replace(/<slot[^>]*name=["']([^"']+)["'][^>]*>([\s\S]*?)<\/slot>/gi, (m, name, fallback) => {
    const provided = slots[name];
    if (provided == null) return fallback || '';
    if (typeof provided === 'string') return allowHtml ? provided : escapeHtml(provided as string);
    return '';
  });

  // Replace default/unnamed slots
  html = html.replace(/<slot(?![^>]*name=)[^>]*>([\s\S]*?)<\/slot>/gi, (m, fallback) => {
    const provided = (slots as any)['default'];
    if (provided == null) return fallback || '';
    if (typeof provided === 'string') return allowHtml ? provided : escapeHtml(provided as string);
    return '';
  });

  return html;
}

(core as any).renderComponent = renderComponent;

core.autoInitRegisteredComponents();

/**
 * props(arg?)
 * - arg: Element | string (uuid)
 * Behavior:
 * - If arg is Element: read `data-props-id` from dataset.
 * - If arg is string: treat as uuid.
 * - If no arg: try `window.__idae_componentDataPageUuid`, then fallback to dataset props.
 * Returns a shallow-cloned plain object with server exports or dataset props.
 */
export function props(arg?: HTMLElement | string): Record<string, any> {
  try {
    const winAny = (globalThis as any) as any;
    const map = winAny.__idae_componentDataMap || {};
    const pageUuid = winAny.__idae_componentDataPageUuid || undefined;

    let uuid: string | undefined;

    if (arg && typeof arg === 'string') {
      uuid = arg;
    } else if (arg instanceof HTMLElement) {
      const el = arg as HTMLElement;
      uuid = (el as any).dataset?.propsId || el.getAttribute('data-props-id') || undefined;
    }

    if (!uuid) uuid = pageUuid;

    if (uuid && map && map[uuid]) {
      const mod = map[uuid];
      const out: Record<string, any> = {};
      Object.keys(mod || {}).forEach((k) => {
        try { out[k] = (mod as any)[k]; } catch { /* ignore */ }
      });
      return { ...out };
    }

    // Fallback: if arg is HTMLElement, return dataset props
    if (arg instanceof HTMLElement) {
      return parsePropsFromDataset((arg as HTMLElement).dataset);
    }

    // No arg: try to find first element with data-props-id and merge map+dataset if possible
    if (!arg && typeof document !== 'undefined') {
      const el = document.querySelector('[data-props-id]') as HTMLElement | null;
      if (el) {
        const dsProps = parsePropsFromDataset(el.dataset);
        const dp = el.getAttribute('data-props-id');
        if (dp && map && map[dp]) return { ...(map[dp] || {}), ...dsProps };
        return dsProps;
      }
    }

    return {};
  } catch (e) {
    return {};
  }
}

// expose on core registry as convenience
(core as any).props = props;


cssDom('[data-component]', {
  trackChildList: true,
  trackAttributes: true,
  trackResize: true
}).each((element, changes: any) => {
  console.log('Detected element:', element);

  if (changes?.attributes) {
      console.log('Attribute changes:', changes.attributes);
  }

  if (changes?.childList) {
      console.log('Child list modifications:', changes.childList);
  }

  if (changes?.characterData) {
      console.log('Character data changes:', changes.characterData);
  }

  if (changes?.resize) {
      console.log('Resize detected:', changes.resize);
  }
});