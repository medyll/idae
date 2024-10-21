import { type ChromaQueryParams } from './lib/database/chromaClient.js';
import IdaeChroma, { ChromaDbConfig, WatcherOptions } from './lib/main.js';

// Configuration pour ChromaDB
const chromaDbConfig: ChromaDbConfig = {
	path: './chromadb'
};

// Options pour le watcher
const watcherOptions: WatcherOptions = {
	ignored: /(^|[\/\\])\../, // Ignore les fichiers cachés
	persistent: true
};

// Fonction principale asynchrone
async function main() {
	try {
		// Initialisation de IdaeChroma
		const idaeChroma = new IdaeChroma(chromaDbConfig);

		// Ajout d'un watcher
		await idaeChroma.addWatcher('./documents', watcherOptions);

		// Chargement des watchers sauvegardés
		await idaeChroma.loadSavedWatchers();

		// Exemple de recherche
		const searchParams: ChromaQueryParams = {
			queryTexts: 'exemple de requête',
			nResults: 5,
			where: { type: 'document' }
		};
		await idaeChroma.chromaClient.initCollection('test_collection');
		const searchResults = await idaeChroma.chromaClient.query(searchParams);
		console.log('Résultats de la recherche:', searchResults);

		// Arrêt de tous les watchers après un certain temps
		setTimeout(() => {
			idaeChroma.stopAllWatchers();
			console.log('Tous les watchers ont été arrêtés.');
		}, 60000); // Arrête après 1 minute
	} catch (error) {
		console.error('Une erreur est survenue:', error);
	}
}

// Exécution de la fonction principale
main();
