import chokidar from 'chokidar';
import { Processor } from './processor.js';
import { IdaeChromaClient } from '../database/chromaClient.js';
import { WatcherOptions } from '../main.js';

export class Watcher {
	private watcher!: chokidar.FSWatcher;
	private processor: Processor;

	constructor(
		private directory: string,
		private options: WatcherOptions,
		private chromaClient: IdaeChromaClient
	) {
		this.processor = new Processor(chromaClient);
	}

	start() {
		this.watcher = chokidar.watch(this.directory, this.options);

		this.watcher
			.on('add', (path) => this.processor.processFile(path, 'add'))
			.on('change', (path) => this.processor.processFile(path, 'change'))
			.on('unlink', (path) => this.processor.processFile(path, 'delete'));
	}

	stop() {
		this.watcher.close();
	}
}
