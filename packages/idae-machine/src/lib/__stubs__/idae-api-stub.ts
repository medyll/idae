// Stub for @medyll/idae-api — server sync, not active in offline/browser mode
export class IdaeApiClient {
	static getInstance() { return new IdaeApiClient(); }
	configure(_opts: any) { return this; }
	collection(_name: string) { return { get: async () => [], post: async () => ({}), put: async () => ({}), delete: async () => ({}) }; }
}
export class IdaeApiClientCollection {}
export class IdaeApiClientConfig {}
export class IdaeApiClientConfigCore {
	static getInstance() { return new IdaeApiClientConfigCore(); }
}
export const IdaeApiClientConfig_ = new IdaeApiClientConfigCore();
export class IdaeApiClientRequest {}
export type DbType = any;
export type IdaeDbAdapter = any;
export type IdaeDbApiMethods = any;
export default {};
