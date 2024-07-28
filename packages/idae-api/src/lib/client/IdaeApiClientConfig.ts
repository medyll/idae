class IdaeApiClientConfig {
	private static instance: IdaeApiClientConfig;
	private _host: string;
	private _port: number;
	private _dbList: string[];
	private _method: 'http' | 'https';

	private constructor() {
		this._host = 'localhost';
		this._port = 3000;
		this._dbList = [];
		this._method = 'https';
	}

	public static getInstance(): IdaeApiClientConfig {
		if (!IdaeApiClientConfig.instance) {
			IdaeApiClientConfig.instance = new IdaeApiClientConfig();
		}
		return IdaeApiClientConfig.instance;
	}

	get host(): string {
		return this._host;
	}

	set host(value: string) {
		this._host = value;
	}

	get port(): number {
		return this._port;
	}

	set port(value: number) {
		this._port = value;
	}

	get dbList(): string[] {
		return this._dbList;
	}

	set dbList(value: string[]) {
		this._dbList = value;
	}

	get method(): 'http' | 'https' {
		return this._method;
	}

	set method(value: 'http' | 'https') {
		this._method = value;
	}
}

export { IdaeApiClientConfig };
