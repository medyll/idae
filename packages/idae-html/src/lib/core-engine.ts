// Core engine for idae-html components
// Re-exports idae-be helpers and exposes a global app registry on window
import * as beMod from '/packages/idae-be/src/lib/index.js';
// Re-export helpers from idae-dom-events so this package "delivers" it as part
// of the core runtime surface. Use same workspace path pattern as other imports.
import * as domMod from '/packages/idae-dom-events/src/lib/index.js';
// Include idae-stator helpers so `core` exposes state utilities as well.
import * as statorMod from '/packages/idae-stator/src/lib/index.js';
// Include idae-csss so core can redistribute styling helpers
import * as csssMod from '/packages/idae-csss/src/lib/index.ts';

type AppRegistry = {
  loadedScripts: Record<string, boolean>;
  components: Record<string, any>;
  registerScript: (key: string, url?: string) => void;
  isScriptLoaded: (key: string) => boolean;
  registerComponent: (name: string, value: any) => void;
  getComponent: (name: string) => any;
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
    registerComponent(name: string, value: any) {
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
    }
    ,
    async loadResources(urls: string[]) {
      const loaders = urls.map((u) => {
        const url = String(u);
        if (url.endsWith('.css')) return registry.loadStyle(url);
        // treat as script by default
        return registry.loadScript(url);
      });
      await Promise.all(loaders);
    }
  };
  win.__idae_app = registry;
}

export const app = win.__idae_app as AppRegistry;

// Re-export commonly used helpers from idae-be so components import from core-engine
const be = (beMod as any).be;
const toBe = (beMod as any).toBe;
const createBe = (beMod as any).createBe;

// idae-dom-events exports (htmlDom, cssDom, htmluModules)
const htmlDom = (domMod as any).htmlDom || (domMod as any).Htmlu;
const cssDom = (domMod as any).cssDom;
const htmluModules = (domMod as any).htmluModules;
// idae-stator exports (state helpers). Expose commonly used helpers.
const stator = (statorMod as any).stator || (statorMod as any).default || (statorMod as any).createStator;
const createStator = (statorMod as any).createStator || (statorMod as any).default || (statorMod as any).stator;

// idae-csss exports (parser, action, runtime helpers)
const csss = (csssMod as any).csss || (csssMod as any).default || csssMod;
const CsssNode = (csssMod as any).CsssNode || (csssMod as any).CsssNode;
const OpCssParser = (csssMod as any).OpCssParser || (csssMod as any).OpCssParser;
function registerComponent(name: string, value: any) {
  // Accept either a function initializer (legacy) or an object spec { script: fn, style?: string, meta?: {...} }
  const spec = (typeof value === 'function') ? { script: value } : value || {};
  app.registerComponent(name, spec);
  try { initComponent(name); } catch (e) { /* ignore init errors on register */ }
}

function initComponent(name: string, root: ParentNode = document) {
  const comp = app.getComponent(name);
  if (!comp) return;
  // comp may be a function (legacy) or an object spec { script }
  const script = (typeof comp === 'function') ? comp : (comp && comp.script ? comp.script : null);
  if (typeof script !== 'function') return;
  try {
    const els = (root as any).querySelectorAll ? Array.from((root as any).querySelectorAll(`[data-component="${name}"]`)) : [];
    els.forEach((el: any) => {
      try { script(el); } catch (e) { console.error('component init error', name, e); }
    });
  } catch (e) { /* ignore */ }
}

function initRegisteredComponents(root: ParentNode = document) {
  try {
    Object.keys(app.components || {}).forEach((name) => initComponent(name, root));
  } catch (e) { /* ignore */ }
}

function autoInitRegisteredComponents() {
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => initRegisteredComponents(document));
  else initRegisteredComponents(document);
}

export const core = {
  app,
  be,
  toBe,
  createBe
  ,
  // convenience re-exports from idae-dom-events
  htmlDom,
  cssDom,
  htmluModules,
  // state helpers
  stator,
  createStator
  ,
  // styling helpers from idae-csss
  csss,
  CsssNode,
  csssParser : OpCssParser,
  // registry helpers
  registerComponent,
  initComponent,
  initRegisteredComponents,
  autoInitRegisteredComponents
};

// Utility: render HTML (string or Node) and replace <slot> elements using DOM parsing.
// slots: { [name: string]: string | Node } where `default` represents unnamed slot content.
// options.allowHtml: when false (default) string slot content is inserted as text (escaped).
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
  const slotEls = (root as any).querySelectorAll ? Array.from((root as any).querySelectorAll('slot')) : [];
  slotEls.forEach((slotEl: Element) => {
    const name = slotEl.getAttribute('name') || 'default';
    const provided = slots[name];
    const parent = slotEl.parentNode;
    if (!parent) return;
    // Determine replacement nodes
    let nodes: Node[] = [];
    if (provided == null) {
      // use fallback content : children of slotEl
      nodes = Array.from(slotEl.childNodes as any as Node[]);
    } else if (typeof provided === 'string') {
      if (allowHtml) {
        const t = document.createElement('template');
        t.innerHTML = provided;
        nodes = Array.from(t.content.childNodes);
      } else {
        nodes = [document.createTextNode(provided)];
      }
    } else if (provided instanceof Node) {
      nodes = [provided.cloneNode(true) as Node];
    }
    // Replace slot element with nodes (or remove if none)
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
    // apply slots to template content
    applySlotsToElement(t.content as unknown as ParentNode, slots, options);
    frag.appendChild(t.content.cloneNode(true));
  } else if (template instanceof Node) {
    const container = document.createElement('div');
    container.appendChild(template.cloneNode(true));
    applySlotsToElement(container, slots, options);
    // move children into fragment
    Array.from(container.childNodes).forEach((n) => frag.appendChild(n));
  }
  return frag;
}

// Export helpers on core for external usage
(core as any).applySlotsToElement = applySlotsToElement;
(core as any).renderHtmlWithSlots = renderHtmlWithSlots;

// Auto-initialize any components that have been registered and are present in the document.
core.autoInitRegisteredComponents();
