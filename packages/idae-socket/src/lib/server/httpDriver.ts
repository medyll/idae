'use strict';

import { TRoutesConfig } from './@types';
import { eventEmitterInstance } from './_utils/eventEmitterInstance';
import { socketIoServerInstance } from './socketBridge';
import * as http from 'http';
import express from 'express';
import cors from 'cors';
import * as core from 'express-serve-static-core';
import { appRoutes } from './_utils/routes';
import { dataEventInstance, TDataEvent } from './dataEvent';
import { IServerConfig, _config } from './_config/config';

export type THttpDriver = httpDriver;

export class httpDriver {
	private config: IServerConfig;
	private port!: number;
	private app!: core.Express;
	private httpServer!: http.Server;
	private socketIoServer: any;
	private routesConfig: TRoutesConfig;
	private dataEventInstance: TDataEvent;
	private EventsEmitInstance: any;

	constructor(configOverride: Partial<IServerConfig> = {}) {
		this.config = { ..._config, ...configOverride };
		this.routesConfig = appRoutes.getRoutes();
		this.app = appAdapter.use('express');

		this.dataEventInstance = dataEventInstance;
		this.EventsEmitInstance = eventEmitterInstance;
	}

	listen(port?: number) {
		this.port = port ?? this.port;
		if (!this.port) throw new Error('dataEvent:PORT_MISSING');

		this.httpServer = this.app.listen(this.port);
		this.socketIoServer = socketIoServerInstance.init(this.httpServer);

		this.routing();

		this.dataEventInstance.dataEventRouteListen();
	}

	routing() {
		Object.values(this.routesConfig).map((eventRoute) => {
			this.app.post(`/${eventRoute.route}`, this.doRouting.bind(this));
		});
	}

	doRouting(request: express.Request, response: express.Response) {
		//
		response.status(200);
		response.send({ status: 'ok' });
		
		let data = request.body;
		if (this.config.payloadMapper) {
			try {
				data = this.config.payloadMapper(data);
			} catch (e) {
				console.error('[idae-socket] Payload mapping failed:', e);
			}
		}

		this.EventsEmitInstance.emit(request.path.slice(1), data);
	}

	close() {
		if (this.httpServer) {
			this.httpServer.close();
		}
	}
}

class appAdapter {
	static use(type: 'express') {
		const app = express();
		app.use(express.static('public'));
		app.use(express.urlencoded({ extended: true }));
		app.use(express.json());
		// app.use(express.raw()); 
		app.use(cors());
		//
		return app;
	}
}

export const httpDriverInstance = new httpDriver();
