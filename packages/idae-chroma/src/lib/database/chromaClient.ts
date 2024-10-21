import { ChromaClient as Chroma, Collection, QueryParams } from 'chromadb';

type Metadata = Record<string, string | number | boolean>;

export type ChromaQueryParams = QueryParams;

export class IdaeChromaClient {
	private client: Chroma;
	private collection: Collection | null = null;
	private collectionName!: string;

	constructor(config?: { path: string }) {
		try {
			this.client = new Chroma(config);
		} catch (error) {
			console.error('Erreur lors de la création du client Chroma:', error);
			throw new Error('Impossible de se connecter à la base de données Chroma');
		}
	}

	async initCollection(collectionName: string) {
		if (!this.collection) {
			try {
				this.collectionName = collectionName;
				this.collection = await this.client.getOrCreateCollection({
					name: this.collectionName
				});
			} catch (error) {
				console.error('Erreur lors de la création ou récupération de la collection:', error);
				throw new Error(`Impossible de créer ou récupérer la collection ${this.collectionName}`);
			}
		}
	}

	async addEntries(
		ids: string | string[],
		contents: string | string[],
		metadatas: Metadata | Metadata[],
		embeddings?: number[] | number[][]
	) {
		if (!this.collection) throw new Error('Collection not initialized');
		await this.collection.add({
			ids: Array.isArray(ids) ? ids : [ids],
			documents: Array.isArray(contents) ? contents : [contents],
			metadatas: Array.isArray(metadatas) ? metadatas : [metadatas],
			embeddings: embeddings
				? Array.isArray(embeddings[0])
					? (embeddings as number[][])
					: [embeddings as number[]]
				: undefined
		});
	}

	async updateEntries(
		ids: string | string[],
		contents: string | string[],
		metadatas: Metadata | Metadata[],
		embeddings?: number[] | number[][]
	) {
		if (!this.collection) throw new Error('Collection not initialized');
		await this.collection.update({
			ids: Array.isArray(ids) ? ids : [ids],
			documents: Array.isArray(contents) ? contents : [contents],
			metadatas: Array.isArray(metadatas) ? metadatas : [metadatas],
			embeddings: embeddings
				? Array.isArray(embeddings[0])
					? (embeddings as number[][])
					: [embeddings as number[]]
				: undefined
		});
	}

	async deleteEntries(ids: string | string[]) {
		if (!this.collection) throw new Error('Collection not initialized');
		await this.collection.delete({
			ids: Array.isArray(ids) ? ids : [ids]
		});
	}

	async query(query: QueryParams) {
		if (!this.collection) throw new Error('Collection not initialized');
		return await this.collection.query(query);
	}

	async getEntries(ids: string | string[]) {
		if (!this.collection) throw new Error('Collection not initialized');
		return await this.collection.get({
			ids: Array.isArray(ids) ? ids : [ids]
		});
	}

	async getEntriesByMetadata(where: Metadata) {
		if (!this.collection) throw new Error('Collection not initialized');
		return await this.collection.get({
			where
		});
	}

	async listCollections() {
		try {
			return await this.client.listCollections();
		} catch (error) {
			console.error('Erreur lors de la liste des collections:', error);
			throw new Error('Impossible de lister les collections');
		}
	}

	async deleteCollection(name: string) {
		try {
			await this.client.deleteCollection({ name });
			if (this.collection?.name === name) {
				this.collection = null;
			}
		} catch (error) {
			console.error('Erreur lors de la suppression de la collection:', error);
			throw new Error(`Impossible de supprimer la collection ${name}`);
		}
	}

	async count() {
		if (!this.collection) throw new Error('Collection not initialized');
		return await this.collection.count();
	}
}
