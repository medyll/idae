/**
 * Script d'exploration MongoDB (lecture seule)
 */

import { MongoClient } from 'mongodb';

const mongoUri = 'mongodb://admin:gwetme2011@localhost:27017';
const client = new MongoClient(mongoUri);

async function explore() {
	try {
		await client.connect();
		console.log('✅ Connexion à MongoDB réussie');

		// Lister les bases
		const dbs = await client.db().admin().listDatabases();
		console.log('\n=== Bases disponibles ===');
		dbs.databases.forEach(db => console.log(`- ${db.name}`));

		// Explorer demo_machine_app (base de test)
		const db = client.db('demo_machine_app');
		const collections = await db.listCollections().toArray();
		console.log('\n=== Collections dans machine_app ===');
		collections.forEach(col => console.log(`- ${col.name}`));

		// Analyser appscheme
		const appscheme = db.collection('appscheme');
		const appschemeDocs = await appscheme.find({}).limit(5).toArray();
		console.log('\n=== Exemple de documents appscheme ===');
		appschemeDocs.forEach(doc => {
			console.log(`- ${doc.code}: ${Object.keys(doc.gridFks || {}).length} FKs`);
		});

		// Analyser les FK
		const appschemeField = db.collection('appscheme_field');
		const fields = await appschemeField.find({}).limit(5).toArray();
		console.log('\n=== Exemple de champs ===');
		fields.forEach(field => {
			console.log(`- ${field.code} (type: ${field.fieldType})`);
		});

		console.log('\n✅ Exploration terminée (aucune écriture effectuée)');
	} catch (e) {
		console.error('❌ Erreur:', e.message);
	} finally {
		await client.close();
	}
}

explore();