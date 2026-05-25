// Stub for @medyll/idae-api — server sync, not active in offline/browser mode
declare const window: any;

// Expose logs for debugging
if (typeof window !== 'undefined') {
	window.__stubLogs = window.__stubLogs || [];
}

export class IdaeApiClient {
	private static _instance: IdaeApiClient | null = null;
	private _baseUrl = '';
	private _token = '';

	static getInstance(config?: { baseUrl?: string; defaultDb?: string; token?: string; headers?: Record<string, string> }) {
		if (!IdaeApiClient._instance) {
			IdaeApiClient._instance = new IdaeApiClient();
		}
		if (config?.baseUrl) {
			IdaeApiClient._instance._baseUrl = config.baseUrl;
		}
		if (config?.token) {
			IdaeApiClient._instance._token = config.token;
		}
		if (typeof window !== 'undefined') {
			window.__stubLogs.push(`getInstance: baseUrl=${config?.baseUrl}, token=${config?.token ? 'set' : 'empty'}`);
		}
		return IdaeApiClient._instance;
	}

	configure(_opts: any) { return this; }

	collection(name: string) {
		const baseUrl = this._baseUrl;
		const token = this._token;
		if (typeof window !== 'undefined') {
			window.__stubLogs.push(`collection(${name}): baseUrl=${baseUrl}, token=${token ? 'set' : 'empty'}`);
		}
		return {
			get: async () => [],
			post: async () => ({}),
			put: async () => ({}),
			delete: async () => ({}),
			where: async (params?: any) => {
				if (typeof window !== 'undefined') {
					window.__stubLogs.push(`where(${name}): baseUrl=${baseUrl}`);
				}
				if (!baseUrl) return [];
				try {
					const url = `${baseUrl}/api/data/${name}`;
					const headers: Record<string, string> = {};
					const authToken = token || (typeof window !== 'undefined' ? localStorage.getItem('auth_token') || '' : '');
					if (authToken) {
						headers['Authorization'] = `Bearer ${authToken}`;
					}
					const res = await fetch(url, { headers });
					if (typeof window !== 'undefined') {
						window.__stubLogs.push(`where(${name}): status=${res.status}`);
					}
					if (!res.ok) return [];
					const data = await res.json();
					const result = Array.isArray(data) ? data : data.data ?? [];
					if (typeof window !== 'undefined') {
						window.__stubLogs.push(`where(${name}): returned ${result.length} items`);
					}
					return result;
				} catch (e: any) {
					if (typeof window !== 'undefined') {
						window.__stubLogs.push(`where(${name}): error=${e.message}`);
					}
					return [];
				}
			},
		};
	}
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
