/**
 * Script d'exploration MongoDB avec IdaeDb (lecture seule)
 */

import { IdaeDb, DbType } from '@medyll/idae-db';

const mongoUri = 'mongodb://admin:gwetme2011@localhost:27017';

async function explore() {
	try {
		const idaeDb = IdaeDb.init(mongoUri, {
			dbType: DbType.MONGODB,
			dbScope: 'machine_app',
		});

		console.log('✅ Connexion à MongoDB réussie');

		// Lister les collections
		const collections = await idaeDb.db('machine_app').listCollections().toArray();
		console.log('\n=== Collections dans machine_app ===');
		collections.forEach(col => console.log(`- ${col.name}`));

		// Analyser appscheme
		const appscheme = idaeDb.collection('appscheme');
		const appschemeDocs = await appscheme.find({}).limit(5).toArray();
		console.log('\n=== Exemple de documents appscheme ===');
		appschemeDocs.forEach(doc => {
			console.log(`- ${doc.code}: ${Object.keys(doc.gridFks || {}).length} FKs`);
		});

		// Analyser les FK
		const appschemeField = idaeDb.collection('appscheme_field');
		const fields = await appschemeField.find({}).limit(5).toArray();
		console.log('\n=== Exemple de champs ===');
		fields.forEach(field => {
			console.log(`- ${field.code} (type: ${field.fieldType})`);
		});

		console.log('\n✅ Exploration terminée (aucune écriture effectuée)');
	} catch (e) {
		console.error('❌ Erreur:', e.message);
	}
}

explore();