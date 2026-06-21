import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest';
import { IdaeDb, DbType } from '@medyll/idae-db';
import { publishModel, seedIdaeRegistries } from '../bootstrap/publishModel.js';
import { buildIdaeModel } from '../bootstrap/seed/idaeModel.js';
import { config } from '../config.js';

const TEST_ORG = 'vitest';

const META_COLS = [
	'appscheme', 'appscheme_base', 'appscheme_field', 'appscheme_field_type',
	'appscheme_field_group', 'appscheme_type', 'appscheme_view_type',
	'appscheme_has_field', 'appscheme_view',
];

let idaeDb: IdaeDb;

describe('publishModel — core collections generate appscheme_view rows', () => {
	beforeAll(async () => {
		idaeDb = IdaeDb.init(config.mongodbUri, {
			dbType:           DbType.MONGODB,
			dbScope:          TEST_ORG,
			dbScopeSeparator: '_',
			idaeModelOptions: {
				autoIncrementFormat:       () => 'id',
				autoIncrementDbCollection: 'auto_increment',
			},
		});
		await idaeDb.db('machine_app');
	});

	afterEach(async () => {
		for (const name of META_COLS) {
			await idaeDb.collection(name).deleteWhere({ query: {} });
		}
	});

	afterAll(async () => {
		await (idaeDb as any).closeAllConnections?.();
	});

	it('generates appscheme_view rows for machine_user base collections', async () => {
		await seedIdaeRegistries({ org: TEST_ORG, mongoUri: config.mongodbUri });
		const coreModel = buildIdaeModel();
		await publishModel(coreModel, { org: TEST_ORG, mongoUri: config.mongodbUri });

		const views = await idaeDb.collection('appscheme_view').find({ query: {} });

		const appuserViews = views.filter((v: any) => v.fks?.appscheme?.code === 'appuser');
		expect(appuserViews.length).toBeGreaterThan(0);

		const fkViews = appuserViews.filter((v: any) => v.fks?.appscheme_view_type?.code === 'fk');
		expect(fkViews.length).toBeGreaterThan(0);
	});

	it('generates appscheme_view rows for machine_ai base collections', async () => {
		await seedIdaeRegistries({ org: TEST_ORG, mongoUri: config.mongodbUri });
		const coreModel = buildIdaeModel();
		await publishModel(coreModel, { org: TEST_ORG, mongoUri: config.mongodbUri });

		const views = await idaeDb.collection('appscheme_view').find({ query: {} });

		const aiChatSessionViews = views.filter((v: any) => v.fks?.appscheme?.code === 'ai_chat_session');
		expect(aiChatSessionViews.length).toBeGreaterThan(0);

		const fkViews = aiChatSessionViews.filter((v: any) => v.fks?.appscheme_view_type?.code === 'fk');
		expect(fkViews.length).toBeGreaterThan(0);
	});

	it('generates appscheme_view rows for machine_app base collections', async () => {
		await seedIdaeRegistries({ org: TEST_ORG, mongoUri: config.mongodbUri });
		const coreModel = buildIdaeModel();
		await publishModel(coreModel, { org: TEST_ORG, mongoUri: config.mongodbUri });

		const views = await idaeDb.collection('appscheme_view').find({ query: {} });

		const appschemeViews = views.filter((v: any) => v.fks?.appscheme?.code === 'appscheme');
		expect(appschemeViews.length).toBeGreaterThan(0);

		const fkViews = appschemeViews.filter((v: any) => v.fks?.appscheme_view_type?.code === 'fk');
		expect(fkViews.length).toBeGreaterThan(0);
	});

	it('publishes fkRelations for core collections in appscheme records', async () => {
		await seedIdaeRegistries({ org: TEST_ORG, mongoUri: config.mongodbUri });
		const coreModel = buildIdaeModel();
		await publishModel(coreModel, { org: TEST_ORG, mongoUri: config.mongodbUri });

		const appuser = await idaeDb.collection('appscheme').findOne({ query: { code: 'appuser' } });
		expect(appuser?.fkRelations).toBeDefined();
		expect(appuser?.fkRelations?.appuser_profile).toBeDefined();
		expect(appuser?.fkRelations?.appuser_profile?.code).toBe('appuser_profile');

		const aiChatSession = await idaeDb.collection('appscheme').findOne({ query: { code: 'ai_chat_session' } });
		expect(aiChatSession?.fkRelations).toBeDefined();
		expect(aiChatSession?.fkRelations?.appuser).toBeDefined();
		expect(aiChatSession?.fkRelations?.ai_companion).toBeDefined();
	});
});
