import { IdaeChromaClient } from '../database/chromaClient.js';
import fs from 'fs/promises';
import path from 'path';

export class Processor {
	constructor(private chromaClient: IdaeChromaClient) {}

	async processFile(filePath: string, action: 'add' | 'change' | 'delete') {
		const fileId = this.generateFileId(filePath);
		const metadata = await this.getFileMetadata(filePath);

		switch (action) {
			case 'add':
			case 'change': {
				const content = await fs.readFile(filePath, 'utf-8');
				await this.chromaClient.addEntries(fileId, content, metadata);
				break;
			}
			case 'delete':
				await this.chromaClient.deleteEntries(fileId);
				break;
		}
	}

	private generateFileId(filePath: string): string {
		return path.relative(process.cwd(), filePath);
	}

	private async getFileMetadata(filePath: string) {
		const stats = await fs.stat(filePath);
		return {
			path: filePath,
			size: stats.size,
			lastModified: stats.mtime.toISOString(),
			extension: path.extname(filePath)
		};
	}
}
