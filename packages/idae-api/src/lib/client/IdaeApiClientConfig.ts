// packages\idae-api\src\lib\client\IdaeApiClientConfig.ts
export interface IdaeApiClientConfigCoreOptions {
	host: string;
	port: number;
	method: 'http' | 'https';
	defaultDb: string;
	separator: string;
	token?: string;
}

export class IdaeApiClientConfigCore {
	private static instance: IdaeApiClientConfigCore;

	private options: IdaeApiClientConfigCoreOptions = {
		host: 'localhost',
		port: 3000,
		method: 'https',
		defaultDb: 'idaenext_sitebase_app',
		separator: '//',
		token: undefined,
	};

	private _baseUrl!: string;

	private constructor() {}

	public static getInstance(): IdaeApiClientConfigCore {
		if (!IdaeApiClientConfigCore.instance) {
			IdaeApiClientConfigCore.instance = new IdaeApiClientConfigCore();
		}
		return IdaeApiClientConfigCore.instance;
	}

	public setOptions(options: Partial<IdaeApiClientConfigCoreOptions> | undefined = {}): void {
		this.options = { ...this.options, ...options };

		this._baseUrl = this.forgeBaseUrl();
	}

	public get baseUrl(): string {
		return this._baseUrl;
	}

	private forgeBaseUrl(): string {
		return `${this.method}:${this.separator}${this.host}:${this.port}`;
	}

	get host(): string {
		return this.options.host;
	}
	get port(): number {
		return this.options.port;
	}

	get method(): 'http' | 'https' {
		return this.options.method;
	}

	get separator(): string {
		return this.options.separator;
	}

	get token(): string | undefined {
		return this.options.token;
	}

	get defaultDb(): string {
		return this.options.defaultDb;
	}
}

export const IdaeApiClientConfig = IdaeApiClientConfigCore.getInstance();
