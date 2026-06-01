/**
 * MachineSocket.ts
 * Socket client factory for machine.socket.
 */

import { EventDataClientInstance } from '@medyll/idae-socket';

export interface MachineSocketOptions {
	url:          string;
	token?:       string;
	authMode?:    'Bearer' | 'Basic' | 'AwsSignature';
	autoConnect?: boolean;
}

export function createSocketClient(opts: MachineSocketOptions): EventDataClientInstance {
	const client = new EventDataClientInstance();
	client.config.host           = opts.url;
	client.config.port           = 0; // port is embedded in host URL
	client.config.authentication = {
		auth:     opts.token ? `Bearer ${opts.token}` : 'Bearer ',
		authMode: opts.authMode ?? 'Bearer',
	};
	if (opts.autoConnect !== false) client.connect();
	return client;
}
