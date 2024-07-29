// example.ts

import { IdaeApiClient } from '$lib/client/IdaeApiClient';
import { IdaeApiClientConfig } from '$lib/client/IdaeApiClientConfig';

async function runExample() {
	// Configure the client
	IdaeApiClientConfig.setOptions({
		host: 'localhost',
		port: 3000,
		method: 'http',
		defaultDb: 'idaenext_sitebase_app'
	});

	// Create a new client instance
	const client = new IdaeApiClient();

	try {
		// Get list of databases
		/* console.log('Getting list of databases:');
		const dbList = await client.getDbList();
		console.log(dbList); */

		// Get collections for the default database
		/* console.log('\nGetting collections for idaenext_sitebase_app:');
		const collections = await client.getCollections('idaenext_sitebase_app');
		console.log(collections); */

		// Work with app_conf collection
		const appConfCollection = client.collection('app_conf');

		// Create a new document
		console.log('\nCreating a new document in app_conf:');
		const newDoc = await appConfCollection.create({ name: 'Test Config', value: 'Test Value' });
		console.log(newDoc);

		// Find all documents
		console.log('\nFinding all documents in app_conf:');
		const allDocs = await appConfCollection.findAll();
		console.log(allDocs);

		// Find a specific document by ID
		console.log('\nFinding a specific document by ID:');
		const foundDoc = await appConfCollection.findById(newDoc._id);
		console.log(foundDoc);

		// Update the document
		console.log('\nUpdating the document:');
		const updatedDoc = await appConfCollection.update(newDoc._id, { value: 'Updated Value' });
		console.log(updatedDoc);

		// Delete the document
		console.log('\nDeleting the document:');
		const deleteResult = await appConfCollection.deleteById(newDoc._id);
		console.log(deleteResult);

		// Work with appscheme collection
		const appSchemeCollection = client.db('idaenext_sitebase_app').collection('appscheme');

		// Find all documents in appscheme
		console.log('\nFinding all documents in appscheme:');
		const appSchemeDocs = await appSchemeCollection.findAll();
		console.log(appSchemeDocs);

		// Delete many documents by query (be careful with this!)
		/* console.log('\nDeleting documents by query in appscheme_base:');
    const deleteResult2 = await client.collection('appscheme_base').deleteManyByQuery({ testField: 'testValue' });
    console.log(deleteResult2); */
	} catch (error) {
		console.error('An error occurred:', error);
	}
}

runExample();
