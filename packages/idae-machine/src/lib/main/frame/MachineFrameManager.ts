/**
 * MachineFrameManager — singleton registry for dynamic frame controls.
 * DOM-first: frames auto-register on mount, unregister on unmount.
 */

export interface FrameControls {
	load: (modulePath: string, collection: string, collectionId?: string, vars?: Record<string, string>) => void;
	show: () => void;
	hide: () => void;
	toggle: () => void;
	close: () => void;
}

export class MachineFrameManager {
	private registry = new Map<string, FrameControls>();

	/**
	 * Register a frame's controls under a unique frameId.
	 * Throws if the frameId is already registered.
	 */
	register(frameId: string, controls: FrameControls): void {
		if (this.registry.has(frameId)) {
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
