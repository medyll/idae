import mongoose from 'mongoose';

// Connexion à la base de données
const dbUri = 'mongodb://127.0.0.1:27017';

async function main() {
	try {
		await mongoose.connect(dbUri, {
			bufferCommands: false,
			dbName: 'idaenext_sitebase_app'
		});

		console.log('Connecté à la base de données MongoDB');

		// Utilisation de mongoose.connection.db pour accéder à la collection sans modèle
		const db = mongoose.connection.db;
		const collection = db.collection('appscheme');

		// Récupération des données
		const appSchemes = await collection.find({}).toArray();
		console.log('Données de la collection appscheme :');
		console.log(JSON.stringify(appSchemes, null, 2));
	} catch (error) {
		console.error('Erreur :', error);
	} finally {
		// Fermeture de la connexion
		await mongoose.connection.close();
		console.log('Connexion à la base de données fermée');
	}
}

main();
