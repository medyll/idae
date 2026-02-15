// Core engine for idae-html components
// Re-exports idae-be helpers and exposes a global app registry on window
import * as beMod from '@medyll/idae-be';
import * as domMod from '@medyll/idae-dom-events';
import * as statorMod from '@medyll/idae-stator';
import * as csssMod from '@medyll/idae-csss';
import * as idbqlMod from '@medyll/idae-idbql';

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

export const app = win.__idae_app as AppRegistry;

// Re-exports
const be = (beMod as any).be;
const toBe = (beMod as any).toBe;
const createBe = (beMod as any).createBe;
const htmlDom = (domMod as any).htmlDom || (domMod as any).Htmlu;
const cssDom = (domMod as any).cssDom;
const htmluModules = (domMod as any).htmluModules;
const stator = (statorMod as any).stator || (statorMod as any).default || (statorMod as any).createStator;
const createStator = (statorMod as any).createStator || (statorMod as any).default || (statorMod as any).stator;
const csss = (csssMod as any).csss || (csssMod as any).default || csssMod;
const CsssNode = (csssMod as any).CsssNode || (csssMod as any).CsssNode;
const OpCssParser = (csssMod as any).OpCssParser || (csssMod as any).OpCssParser;
const createIdbqDb = (idbqlMod as any).createIdbqDb || (idbqlMod as any).createIdbDb || undefined;
const createIdbqlState = (idbqlMod as any).createIdbqlState || undefined;
const idbql = (idbqlMod as any).idbql || (idbqlMod as any).default || undefined;

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

  if (spec.resources?.length) {
    app.loadResources(spec.resources);
  }
  try { 
    initComponent(name); 
  } catch (e) { /* ignore */ }
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
    const els = (root as any).querySelectorAll ? Array.from((root as any).querySelectorAll(`[data-component="${name}"]`)) : [];
    els.forEach((el: any) => {
      try {
        const defaultProps = comp.props || {};
        const elementProps = parsePropsFromDataset(el.dataset);
        const props = { ...defaultProps, ...elementProps };
        script(el, props);
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
        console.log('Component left DOM:', node);
        // Optionally, add cleanup logic here if needed
      });
    }
  });
}

export const core = {
  app,
  be,
  toBe,
  createBe,
  htmlDom,
  cssDom,
  htmluModules,
  stator,
  createStator,
  csss,
  CsssNode,
  csssParser : OpCssParser,
  createIdbqDb,
  createIdbqlState,
  idbql,
  registerComponent,
  initComponent,
  initRegisteredComponents,
  autoInitRegisteredComponents
};

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

core.autoInitRegisteredComponents();