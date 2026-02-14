// Core engine for idae-html components
// Re-exports idae-be helpers and exposes a global app registry on window
import * as beMod from '/packages/idae-be/src/lib/index.js';
// Re-export helpers from idae-dom-events so this package "delivers" it as part
// of the core runtime surface. Use same workspace path pattern as other imports.
import * as domMod from '/packages/idae-dom-events/src/lib/index.js';
// Include idae-stator helpers so `core` exposes state utilities as well.
import * as statorMod from '/packages/idae-stator/src/lib/index.js';

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
};
