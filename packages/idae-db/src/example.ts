// example.ts
import { IdaeDb } from './lib/idaeDb.js';
import { DbType } from './lib/@types/types.js';

interface User {
	iduser: number;
	name: string;
	email: string;
	age: number;
}
async function main() {
	try {
		// init MongoDB
		const mongoDb = IdaeDb.init('mongodb://localhost:27017', {
			dbType: DbType.MONGODB,
			dbScope: 'a_idae_db_sitebase',
			dbScopeSeparator: '_',
			idaeModelOptions: {
				autoIncrementFormat: (collection: string) => `id${collection}`,
				autoIncrementDbCollection: 'auto_increment'
			}
		});
		// create connection to db
		await mongoDb.db('app');

		const usersCollection = mongoDb.collection<User>('user');

		usersCollection.registerEvents<any>({
			findById: {
				pre: (id) => console.log(`About to find document with id: ${id}`),
				post: (result, id) => console.log(`Found document for id ${id}:`, result),
				error: (error) => console.error('Error in findById:', error)
			},
			update: {
				pre: (id, data) => console.log(`About to update document ${id} with:`, data),
				post: (result, id, data) => console.log(`Updated document ${id}:`, result)
			},
			create: {
				pre: (data) => console.log(`About to create document with:`, data),
				post: (data, result) => console.log(`Created document `, data, result)
			}
		});

		// Insertion de documents
		await usersCollection.create({
			name: 'Karin Doe',
			email: 'Karin@example.com',
			age: 21
		});
		await usersCollection.create({
			name: 'Jean Doe',
			email: 'jean@example.com',
			age: 15
		});
		const newUser = await usersCollection.create({
			name: 'John Doe',
			email: 'john@example.com',
			age: 30
		});

		// Recherche d'un document
		const user = await usersCollection.findOne({ query: { email: 'john@example.com' } });

		// Mise à jour d'un document
		const updateResult = await usersCollection.update(user.iduser, { age: 31 });

		// Recherche avec paramètres
		const users = await usersCollection.find({
			query: { age: { $gt: 25 } },
			sortBy: 'name:asc',
			limit: 10
		});

		// Suppression d'un document
		const deleteResult = await usersCollection.deleteById(5);

		// Fermeture de la connexion
		await mongoDb.closeAllConnections();
	} catch (error) {
		console.error('An error occurred:', error);
	} finally {
		console.log('finally');
		return true;
	}
}

main()
	.then((what) => console.log(what))
	.catch(console.error);
