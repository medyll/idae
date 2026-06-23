/**
 * MachineFrameManager — singleton registry for dynamic frame controls.
 * DOM-first: frames auto-register on mount, unregister on unmount.
 */
import { mount, unmount, type Component } from 'svelte';
import { SvelteMap } from 'svelte/reactivity';
import { buildLoadInUrl } from './frameUrl.js';
import { computeFrameId } from './frameUtils.js';
import { componentRegistry, type RegistryKey } from '$lib/main/router/componentRegistry.js';

export interface FrameControls {
	load: (modulePath: string, collection: string, collectionId?: string | number, vars?: Record<string, string>) => void;
	show: () => void;
	hide: () => void;
	toggle: () => void;
	close: () => void;
	/** Bring the frame to front + focus it. Optional — only floating frames (dialogs) implement it. */
	focus?: () => void;
	/** Whether this frame appears as a window in the taskbar. Inner content zones (loadIn) set false. */
	taskbar?: boolean;
}

/**
 * Mount engine shared by Frame.svelte and Dialog.svelte.
 * Resolves a modulePath via componentRegistry and mounts it into the target element,
 * guarding against out-of-order async resolution and unmounting the previous instance.
 */
export interface FrameHost {
	load: (modulePath: string, collection: string, collectionId?: string | number, vars?: Record<string, string>) => void;
	destroy: () => void;
}

/** Resolves a human label for (collection, id) — injected by machine. */
export type LabelResolver = (collection: string, collectionId?: string | number) => Promise<string | undefined>;

export interface FrameRegisterOptions {
	replace?: boolean;
}

export interface NavigationEvent {
	modulePath:    string;
	collection:    string;
	collectionId?: string | number;
	vars?:         Record<string, string>;
	zone:          string;
}

export class MachineFrameManager {
	private registry = new SvelteMap<string, FrameControls>();
	/** Zones with a Frame mount in flight — closes the race where the same URL fires twice
	 * before the first Frame's $effect registers, causing a duplicate Frame mount. */
	private mountingZones = new Set<string>();
	/** zone name → set of registered frameIds in that zone (for sibling hide/show). */
	private zoneFrames = new Map<string, Set<string>>();
	private _pushFn?: (url: string) => void;
	private _onNavigate?: (e: NavigationEvent) => void;
	private _labelResolver?: LabelResolver;
	private _contextMenuMounted = false;

	/** Injected by machine at init — enables URL-based navigation from framer. */
	setRouter(pushFn: (url: string) => void): void {
		this._pushFn = pushFn;
	}

	/** Injected by machine at init — fires after each loadFrame navigation. */
	setNavigationHook(fn: (e: NavigationEvent) => void): void {
		this._onNavigate = fn;
	}

	/** Injected by machine — resolves a record label (presentation) for dialog titles. */
	setLabelResolver(fn: LabelResolver): void {
		this._labelResolver = fn;
	}

	/** Resolve a human label for (collection, id). Falls back to undefined if no resolver set. */
	async resolveLabel(collection: string, collectionId?: string | number): Promise<string | undefined> {
		if (!this._labelResolver) return undefined;
		try {
			return await this._labelResolver(collection, collectionId);
		} catch {
			return undefined;
		}
	}

	/**
	 * Create a mount host bound to a target element (resolved lazily via getTarget).
	 * Shared engine for Frame.svelte and Dialog.svelte — see FrameHost.
	 *
	 * Toggle semantics (not swap): each distinct (modulePath, collection, collectionId, vars)
	 * mounts once into its own wrapper div and is kept alive. Re-loading the same content
	 * hides every sibling and shows the existing instance — no unmount, no re-render.
	 * Loading new content hides siblings and mounts the new instance. State is preserved
	 * across toggles. `destroy()` unmounts everything (frame teardown).
	 *
	 * `fill` (default true): the mounted content fills its zone via absolute
	 * inset:0 — correct for sized zones (main, panel). Set false for hosts whose
	 * own size is content-driven (floating dialog): content then sits in normal
	 * flow so the host can grow to fit it.
	 */
	createHost(getTarget: () => HTMLElement | undefined, opts: { fill?: boolean } = {}): FrameHost {
		const fill = opts.fill ?? true;
		const instances = new Map<string, { app: Record<string, unknown>; el: HTMLElement }>();
		let seq = 0;

		const contentKey = (modulePath: string, collection: string, collectionId?: string | number, vars?: Record<string, string>): string =>
			`${modulePath}::${computeFrameId(collection, collectionId, vars)}`;

		const hideAll = () => {
			for (const { el } of instances.values()) el.style.display = 'none';
		};

		const destroy = () => {
			for (const { app } of instances.values()) unmount(app);
			instances.clear();
		};

		return {
			load: (modulePath, collection, collectionId, vars) => {
				const key = contentKey(modulePath, collection, collectionId, vars);

				// Already mounted → toggle to it without re-rendering.
				const existing = instances.get(key);
				if (existing) {
					hideAll();
					existing.el.style.display = 'block';
					return;
				}

				const s = ++seq;
				componentRegistry.resolve(modulePath).then((Comp) => {
					const target = getTarget();
					if (!target) return;
					// Guard re-entrancy: another instance for this key may have mounted while resolving.
					if (instances.has(key)) {
						if (s === seq) {
							hideAll();
							instances.get(key)!.el.style.display = 'block';
						}
						return;
					}
					hideAll();
					const el = document.createElement('div');
					el.className = 'frame-content';
					el.dataset.contentKey = key;
					el.style.cssText = fill
						? 'position:absolute;inset:0;overflow:hidden;'
						: 'position:relative;width:100%;';
					target.appendChild(el);
					const app = mount(Comp as Component<Record<string, unknown>>, {
						target: el,
						props: {
							collection,
							collectionId,
							dataId: collectionId,
							vars
						}
					});
					instances.set(key, { app, el });
				}).catch((err) => {
					console.error(`[FrameManager] Error loading component for modulePath "${modulePath}":`, err);
				});
			},
			destroy
		};
	}

	/**
	 * Open the global context menu for (collection, collectionId) at the given page position.
	 * Mounts the singleton <ContextMenu> host into document.body on first use.
	 */
	openContextMenu(
		collection: string,
		collectionId: string | number,
		vars: Record<string, string> = {},
		x = 0,
		y = 0
	): void {
		this.#ensureContextMenuMounted().then(() => {
			import('$lib/data-ui/fragments/contextMenu.svelte.js').then(({ openContextMenu }) => {
				openContextMenu(collection, collectionId, vars, x, y);
			});
		});
	}

	/** Close the global context menu, if open. */
	closeContextMenu(): void {
		import('$lib/data-ui/fragments/contextMenu.svelte.js').then(({ closeContextMenu }) => {
			closeContextMenu();
		});
	}

	async #ensureContextMenuMounted(): Promise<void> {
		if (this._contextMenuMounted || typeof document === 'undefined') return;
		this._contextMenuMounted = true;
		const ContextMenu = (await import('$lib/data-ui/fragments/ContextMenu.svelte')).default;
		mount(ContextMenu as Component<Record<string, unknown>>, { target: document.body });
	}

	/**
	 * URL-based navigation — pushes hash URL via router.
	 * Back/forward, deep links, refresh all work by construction.
	 */
	loadFrame(
		modulePath: RegistryKey,
		collection: string,
		collectionId?: string | number,
		vars?: Record<string, string>,
		zone = 'main'
	): void {
		if (!this._pushFn) throw new Error('[FrameManager] router not set — call machine.init() first');
		const varsStr = vars && Object.keys(vars).length > 0 ? new URLSearchParams(vars).toString() : undefined;
		this._pushFn(buildLoadInUrl(modulePath, zone, collection, collectionId, varsStr));
		try {
			this._onNavigate?.({ modulePath, collection, collectionId, vars, zone });
			console.log(`[FrameManager] navigate: ${modulePath} in zone "${zone}" for ${collection}:${collectionId ?? ''}`);
		} catch (err) {
			console.warn('[FrameManager] navigation hook failed:', err);
		}
	}

	/**
	 * URL-based navigation into a specific zone.
	 * Zone is first param — explicit target.
	 */
	loadIn(
		zone: string,
		modulePath: RegistryKey,
		collection: string,
		collectionId?: string,
		vars?: Record<string, string>
	): void {
		this.loadFrame(modulePath, collection, collectionId, vars, zone);
	}

	/**
	 * Open the content in a floating draggable dialog (off-router).
	 * frameId is content-keyed: reopening the same (modulePath, collection, id) focuses the
	 * existing dialog instead of duplicating; different content stacks new dialogs.
	 */
	async loadInDialog(
		modulePath: RegistryKey,
		collection: string,
		collectionId?: string | number,
		vars?: Record<string, string>,
		opts?: { modal?: boolean; closable?: boolean }
	): Promise<void> {
		const frameId = `dialog:${modulePath}:${collection}:${collectionId ?? ''}`;
		console.log(`[FrameManager] loadInDialog: ${frameId}`);
		// Already open → focus the existing dialog, don't reload/duplicate.
		const existing = this.registry.get(frameId);
		if (existing) {
			existing.show();
			existing.focus?.();
			return;
		}
		await this.load(frameId, modulePath, collection, collectionId, vars, async (id) => {
			const { openDialog } = await import('$lib/data-ui/fragments/dialog/dialog.svelte.js');
			openDialog({ id, ...opts });
		});
	}

	/**
	 * Register a frame's controls under a unique frameId.
	 * By default throws if the frameId is already registered.
	 * `replace` is intended for DOM/HMR-driven remounts where the frame id is stable
	 * but the mounted component instance has been recreated.
	 *
	 * Zone frames (format "modulePath:zone", not starting with "dialog:") are tracked
	 * per-zone so siblings can be hidden when a new frame activates.
	 */
	register(frameId: string, controls: FrameControls, options: FrameRegisterOptions = {}): void {
		const existing = this.registry.get(frameId);
		if (existing === controls) return;
		if (existing && !options.replace) {
			throw new Error(`[FrameManager] frame "${frameId}" already registered`);
		}
		this.registry.set(frameId, controls);
		if (!frameId.startsWith('dialog:')) {
			const colonIdx = frameId.indexOf(':');
			if (colonIdx !== -1) {
				const zone = frameId.slice(colonIdx + 1);
				if (!this.zoneFrames.has(zone)) this.zoneFrames.set(zone, new Set());
				this.zoneFrames.get(zone)!.add(frameId);
			}
		}
	}

	/**
	 * Unregister a frame by its frameId. No-op if not found.
	 */
	unregister(frameId: string): void {
		this.registry.delete(frameId);
		if (!frameId.startsWith('dialog:')) {
			const colonIdx = frameId.indexOf(':');
			if (colonIdx !== -1) {
				const zone = frameId.slice(colonIdx + 1);
				this.zoneFrames.get(zone)?.delete(frameId);
			}
		}
	}

	/**
	 * For zone frames (format "modulePath:zone"): hide all sibling frames in the same
	 * zone and show the target frame. No-op for dialog frames.
	 */
	private activateZoneFrame(frameId: string): void {
		if (frameId.startsWith('dialog:')) return;
		const colonIdx = frameId.indexOf(':');
		if (colonIdx === -1) return;
		const zone = frameId.slice(colonIdx + 1);
		const siblings = this.zoneFrames.get(zone);
		if (!siblings) return;
		for (const sibId of siblings) {
			if (sibId !== frameId) this.registry.get(sibId)?.hide();
		}
		this.registry.get(frameId)?.show();
	}

	/**
	 * Load content into a frame.
	 * - Frame known (in registry) → delegates to controls.load()
	 * - Frame unknown → looks for DOM zone [data-target-zone="${frameId}"]
	 *   If zone found, caller should mount <Frame> there (auto-register happens on mount),
	 *   then this method retries with the now-registered frame.
	 *   If no zone found, throws.
	 *
	 * @param mountFn — optional callback to mount a <Frame> in the DOM zone.
	 *   Signature: (frameId: string) => Promise<void>
	 */
	async load(
		frameId: string,
		modulePath: string,
		collection: string,
		collectionId?: string | number,
		vars?: Record<string, string>,
		mountFn?: (frameId: string) => Promise<void>
	): Promise<void> {
		const controls = this.registry.get(frameId);
		if (controls) {
			this.activateZoneFrame(frameId);
			controls.load(modulePath, collection, collectionId, vars);
			return;
		}

		// A concurrent load is already mounting a Frame for this zone (same URL fired twice).
		// Skip the duplicate mount — the in-flight one will mount + load the same content.
		if (this.mountingZones.has(frameId)) return;

		const zone = typeof document !== 'undefined'
			? document.querySelector(`[data-target-zone="${frameId}"]`)
			: null;

		if (mountFn) {
			this.mountingZones.add(frameId);
			try {
				await mountFn(frameId);
			} finally {
				this.mountingZones.delete(frameId);
			}
			const fresh = this.registry.get(frameId);
			if (fresh) {
				this.activateZoneFrame(frameId);
				fresh.load(modulePath, collection, collectionId, vars);
				return;
			}
			if (zone) {
				throw new Error(`[FrameManager] frame "${frameId}" failed to register after mount`);
			}
		}

		if (!zone) {
			throw new Error(`[FrameManager] frame "${frameId}" not found and no DOM zone [data-target-zone="${frameId}"] exists`);
		}

		throw new Error(`[FrameManager] frame "${frameId}" not registered — mountFn required to mount <Frame> in zone`);
	}

	/** Show a frame by calling controls.show(). Throws if not found. */
	show(frameId: string): void {
		const controls = this.registry.get(frameId);
		if (!controls) throw new Error(`[FrameManager] frame "${frameId}" not found`);
		controls.show();
	}

	/** Hide a frame by calling controls.hide(). Throws if not found. */
	hide(frameId: string): void {
		const controls = this.registry.get(frameId);
		if (!controls) throw new Error(`[FrameManager] frame "${frameId}" not found`);
		controls.hide();
	}

	/** Toggle a frame visibility. Throws if not found. */
	toggle(frameId: string): void {
		const controls = this.registry.get(frameId);
		if (!controls) throw new Error(`[FrameManager] frame "${frameId}" not found`);
		controls.toggle();
	}

	/** Close a frame (unmount + unregister). Throws if not found. */
	close(frameId: string): void {
		const controls = this.registry.get(frameId);
		if (!controls) throw new Error(`[FrameManager] frame "${frameId}" not found`);
		controls.close();
	}

	/** Read-only view of currently open frames. */
	get openFrames(): ReadonlyMap<string, FrameControls> {
		return this.registry;
	}

	/** Check if a frame is registered. */
	has(frameId: string): boolean {
		return this.registry.has(frameId);
	}

	/** Get controls for a frame (or undefined). */
	getControls(frameId: string): FrameControls | undefined {
		return this.registry.get(frameId);
	}

	/** Clear all registered frames. */
	clear(): void {
		this.registry.clear();
		this.zoneFrames.clear();
	}
}

export const machineFrameManager = new MachineFrameManager();
