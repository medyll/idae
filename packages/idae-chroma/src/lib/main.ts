import { Watcher } from './engine/watcher.js';
import { IdaeChromaClient } from './database/chromaClient.js';
import fs from 'fs/promises';
import path from 'path';

export interface ChromaDbConfig {
	path: string;
	collectionName?: string;
}

export interface WatcherOptions {
	ignored?: string | RegExp | ((path: string) => boolean);
	persistent?: boolean;
	ignoreInitial?: boolean;
	followSymlinks?: boolean;
	cwd?: string;
	disableGlobbing?: boolean;
	usePolling?: boolean;
	interval?: number;
	binaryInterval?: number;
	alwaysStat?: boolean;
	depth?: number;
	awaitWriteFinish?: boolean | { stabilityThreshold?: number; pollInterval?: number };
	ignorePermissionErrors?: boolean;
	atomic?: boolean | number;
}

export interface SearchParams {
	nResults?: number;
	where?: Record<string, any>;
	whereDocument?: Record<string, any>;
}

class IdaeChroma {
	private watchers: Map<string, Watcher> = new Map();
	#chromaClient: IdaeChromaClient;
	private configDir: string;

	constructor(chromaDbConfig?: ChromaDbConfig) {
		this.#chromaClient = new IdaeChromaClient(chromaDbConfig);
		this.configDir = path.join(process.cwd(), 'config');
	}

	get chromaClient() {
		return this.#chromaClient;
	}

	async addWatcher(directory: string, options: WatcherOptions): Promise<void> {
		try {
			const watcher = new Watcher(directory, options, this.#chromaClient);
			this.watchers.set(directory, watcher);
			watcher.start();
			await this.saveWatcherConfig(directory, options);
		} catch (error) {
			console.error(`Failed to add watcher for directory: ${directory}`, error);
			throw error;
		}
	}

	async searchEntries(query: string, params: SearchParams): Promise<any> {
		try {
			return await this.#chromaClient.query(query, params.nResults, params.where);
		} catch (error) {
			console.error('Failed to search entries:', error);
			throw error;
		}
	}

	stopAllWatchers(): void {
		this.watchers.forEach((watcher) => {
			try {
				watcher.stop();
			} catch (error) {
				console.error(`Failed to stop watcher:`, error);
			}
		});
	}

	private async saveWatcherConfig(directory: string, options: WatcherOptions): Promise<void> {
		try {
			const configName = `last_config_${path.basename(directory)}.json`;
			const configPath = path.join(this.configDir, configName);
			await fs.mkdir(this.configDir, { recursive: true });
			await fs.writeFile(configPath, JSON.stringify({ directory, options }, null, 2));
		} catch (error) {
			console.error(`Failed to save watcher config for directory: ${directory}`, error);
			throw error;
		}
	}

	async loadSavedWatchers(): Promise<void> {
		try {
			const files = await fs.readdir(this.configDir);
			for (const file of files) {
				if (file.startsWith('last_config_') && file.endsWith('.json')) {
					const configPath = path.join(this.configDir, file);
					const configContent = await fs.readFile(configPath, 'utf-8');
					const { directory, options } = JSON.parse(configContent);
					await this.addWatcher(directory, options);
				}
			}
		} catch (error) {
			console.error('Failed to load saved watchers:', error);
			throw error;
		}
	}
}

export default IdaeChroma;
