/**
 * MachineFrameManager — singleton registry for dynamic frame controls.
 * DOM-first: frames auto-register on mount, unregister on unmount.
 */
import { SvelteMap } from 'svelte/reactivity';
import { buildLoadInUrl } from './frameUrl.js';

export interface FrameControls {
	load: (modulePath: string, collection: string, collectionId?: string, vars?: Record<string, string>) => void;
	show: () => void;
	hide: () => void;
	toggle: () => void;
	close: () => void;
}

export interface FrameRegisterOptions {
	replace?: boolean;
}

export class MachineFrameManager {
	private registry = new SvelteMap<string, FrameControls>();
	private _pushFn?: (url: string) => void;

	/** Injected by machine at init — enables URL-based navigation from framer. */
	setRouter(pushFn: (url: string) => void): void {
		this._pushFn = pushFn;
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

		// Frame not registered — check if a DOM zone exists
		const zone = typeof document !== 'undefined'
			? document.querySelector(`[data-target-zone="${frameId}"]`)
			: null;

		if (!zone) {
			throw new Error(`[FrameManager] frame "${frameId}" not found and no DOM zone [data-target-zone="${frameId}"] exists`);
		}

		if (!mountFn) {
			throw new Error(`[FrameManager] frame "${frameId}" not registered — mountFn required to mount <Frame> in zone`);
		}

		// Mount the Frame (auto-registers on mount), then load
		await mountFn(frameId);
		const fresh = this.registry.get(frameId);
		if (!fresh) {
			throw new Error(`[FrameManager] frame "${frameId}" failed to register after mount`);
		}
		fresh.load(modulePath, collection, collectionId, vars);
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
