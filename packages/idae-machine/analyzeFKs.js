/**
 * Script d'analyse des FK dans demo_machine_app
 */

import { MongoClient } from 'mongodb';

const mongoUri = 'mongodb://admin:gwetme2011@localhost:27017';
const client = new MongoClient(mongoUri);

async function analyzeFKs() {
	try {
		await client.connect();
		const db = client.db('demo_machine_app');

		// Lire tous les sch├ęmas
		const appscheme = db.collection('appscheme');
		const schemes = await appscheme.find({}).toArray();

		console.log('=== Analyse des FK ===');
		schemes.forEach(scheme => {
			const fks = scheme.gridFks || {};
			console.log(`\n${scheme.code}:`);
			Object.entries(fks).forEach(([fkKey, fk]) => {
				console.log(`  - ${fkKey} → ${fk.code} (id: ${fk.id}, required: ${fk.required})`);
			});
		});

		// V├ęrifier la coh├ęrence des FK
		console.log('\n=== V├ęrification des FK ===');
		const allFks = schemes.flatMap(s => Object.values(s.gridFks || {}));
		const fkCodes = allFks.map(fk => fk.code);
		const uniqueFkCodes = [...new Set(fkCodes)];

		console.log(`Total FKs: ${allFks.length}`);
		console.log(`Unique FK targets: ${uniqueFkCodes.length}`);

		// V├ęrifier que toutes les cibles existent
		const existingCollections = (await db.listCollections().toArray()).map(c => c.name);
		const missingTargets = uniqueFkCodes.filter(code => !existingCollections.includes(code));

		if (missingTargets.length > 0) {
			console.log('\n⚠ Cibles FK manquantes:');
			missingTargets.forEach(code => console.log(`  - ${code}`));
		} else {
			console.log('\n✅ Toutes les cibles FK existent');
		}

		console.log('\n✅ Analyse termin├ęe');
	} catch (e) {
		console.error('❌ Erreur:', e.message);
	} finally {
		await client.close();
	}
}

analyzeFKs();