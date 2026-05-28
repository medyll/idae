/**
 * MachineFrameManager — singleton registry for dynamic frame controls.
 * DOM-first: frames auto-register on mount, unregister on unmount.
 */
import { mount, unmount, type Component } from 'svelte';
import { SvelteMap } from 'svelte/reactivity';
import { buildLoadInUrl } from './frameUrl.js';
import { componentRegistry } from '$lib/main/router/componentRegistry.js';

export interface FrameControls {
	load: (modulePath: string, collection: string, collectionId?: string, vars?: Record<string, string>) => void;
	show: () => void;
	hide: () => void;
	toggle: () => void;
	close: () => void;
	/** Bring the frame to front + focus it. Optional — only floating frames (dialogs) implement it. */
	focus?: () => void;
}

/**
 * Mount engine shared by Frame.svelte and Dialog.svelte.
 * Resolves a modulePath via componentRegistry and mounts it into the target element,
 * guarding against out-of-order async resolution and unmounting the previous instance.
 */
export interface FrameHost {
	load: (modulePath: string, collection: string, collectionId?: string, vars?: Record<string, string>) => void;
	destroy: () => void;
}

/** Resolves a human label for (collection, id) — injected by machine. */
export type LabelResolver = (collection: string, collectionId?: string) => Promise<string | undefined>;

export interface FrameRegisterOptions {
	replace?: boolean;
}

export interface NavigationEvent {
	modulePath:    string;
	collection:    string;
	collectionId?: string;
	vars?:         Record<string, string>;
	zone:          string;
}

export class MachineFrameManager {
	private registry = new SvelteMap<string, FrameControls>();
	private _pushFn?: (url: string) => void;
	private _onNavigate?: (e: NavigationEvent) => void;
	private _labelResolver?: LabelResolver;

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
	async resolveLabel(collection: string, collectionId?: string): Promise<string | undefined> {
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
	 */
	createHost(getTarget: () => HTMLElement | undefined): FrameHost {
		let seq = 0;
		let current: Record<string, unknown> | null = null;

		const destroy = () => {
			if (current) {
				unmount(current);
				current = null;
			}
		};

		return {
			load: (modulePath, collection, collectionId, vars) => {
				const s = ++seq;
				componentRegistry.resolve(modulePath).then((Comp) => {
					if (s !== seq) return;
					const target = getTarget();
					if (!target) return;
					destroy();
					current = mount(Comp as Component<Record<string, unknown>>, {
						target,
						props: {
							collection,
							collectionId,
							dataId: collectionId,
							vars
						}
					});
				}).catch((err) => {
					console.error(`[FrameManager] Error loading component for modulePath "${modulePath}":`, err);
				});
			},
			destroy
		};
	}

	/**
	 * URL-based navigation — pushes hash URL via router.
	 * Back/forward, deep links, refresh all work by construction.
	 */
	loadFrame(
		modulePath: string,
		collection: string,
		collectionId?: string,
		vars?: Record<string, string>,
		zone = 'main'
	): void {
		if (!this._pushFn) throw new Error('[FrameManager] router not set — call machine.init() first');
		const varsStr = vars && Object.keys(vars).length > 0 ? new URLSearchParams(vars).toString() : undefined;
		this._pushFn(buildLoadInUrl(modulePath, zone, collection, collectionId, varsStr));
		try {
			this._onNavigate?.({ modulePath, collection, collectionId, vars, zone });
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
		modulePath: string,
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
		modulePath: string,
		collection: string,
		collectionId?: string,
		vars?: Record<string, string>
	): Promise<void> {
		const frameId = `dialog:${modulePath}:${collection}:${collectionId ?? ''}`;
		// Already open → focus the existing dialog, don't reload/duplicate.
		const existing = this.registry.get(frameId);
		if (existing) {
			existing.show();
			existing.focus?.();
			return;
		}
		await this.load(frameId, modulePath, collection, collectionId, vars, async (id) => {
			const { openDialog } = await import('$lib/data-ui/fragments/dialog/dialog.svelte.js');
			openDialog({ id });
		});
	}

	/**
	 * Register a frame's controls under a unique frameId.
	 * By default throws if the frameId is already registered.
	 * `replace` is intended for DOM/HMR-driven remounts where the frame id is stable
	 * but the mounted component instance has been recreated.
	 */
	register(frameId: string, controls: FrameControls, options: FrameRegisterOptions = {}): void {
		const existing = this.registry.get(frameId);
		if (existing === controls) return;
		if (existing && !options.replace) {
			throw new Error(`[FrameManager] frame "${frameId}" already registered`);
		}
		this.registry.set(frameId, controls);
	}

	/**
	 * Unregister a frame by its frameId. No-op if not found.
	 */
	unregister(frameId: string): void {
		this.registry.delete(frameId);
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
		collectionId?: string,
		vars?: Record<string, string>,
		mountFn?: (frameId: string) => Promise<void>
	): Promise<void> {
		const controls = this.registry.get(frameId);
		if (controls) {
			controls.load(modulePath, collection, collectionId, vars);
			return;
		}

		const zone = typeof document !== 'undefined'
			? document.querySelector(`[data-target-zone="${frameId}"]`)
			: null;

		if (mountFn) {
			await mountFn(frameId);
			const fresh = this.registry.get(frameId);
			if (fresh) {
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
	}
}

export const machineFrameManager = new MachineFrameManager();
