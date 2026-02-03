'use strict';

import type { Socket } from 'socket.io';
import { Server as SocketIOServer } from 'socket.io';
import { Server } from 'net';
import { TRoutesConfig } from '../@types';
import { appRoutes } from '../_utils/routes';
// @ts-ignore
import socketThrottle from './socketThrottle';
import { _config } from '../_config/config';

import { createAdapter } from '@socket.io/redis-adapter';
import { createClient } from 'redis';

/**
 * Interface for Auth Validation
 * Implement this interface to provide real authentication
 */
interface IAuthValidator {
	validate(token: string): Promise<boolean>;
}

class SocketIoServer {
	ioApp: any;

	private routesConfig: TRoutesConfig;

	constructor() {
		this.routesConfig = appRoutes.getRoutes();
	}

	init(app: Server) {
		this.ioApp = new SocketIOServer(app, {
			cors: {
				origin: '*',
				methods: ['GET', 'POST']
			}
		});
		this.ioApp.use(this.authorization.bind(this));

		this.onConnection();

		return this.ioApp;
	}

	/**
	 * first socket client connection authorization middleware
	 * @param socket
	 * @param next
	 */
	async authorization(socket: Socket, next: any) {
		//
		const authMethod = socket.handshake?.auth?.authMode;
		const authHeaders =
			socket.handshake?.headers?.Authorization ?? socket.handshake?.auth?.Authorization;

		// post to api for json_token
		if (!authHeaders) {
			return next(new Error('Missing Auth method'));
		}
		
		// ---------------------------------------------------------
		// AUTH DELEGATION
		// In a real scenario, validate the token here.
		// For now, we allow everything but log a warning if it looks suspicious.
		// ---------------------------------------------------------
		const isValid = await this.validateToken(authHeaders);
		if (!isValid) {
			// Uncomment to enforce auth
			// return next(new Error('Invalid Credentials'));
			console.warn('[idae-socket] Auth validation failed (soft-pass)');
		}

		next();

		switch (authMethod) {
			case 'Basic':
			case 'Bearer':
			case 'AwsSignature':
				next();
				break;
			case 'UrlToken':
				next();
				break;
		}
	}

	async validateToken(token: string): Promise<boolean> {
		// TODO: Implement real token validation (e.g. JWT verify, or call to idae-api-nest)
		// For now, simple presence check
		return !!token && token.length > 5;
	}

	onConnection() {
		this.ioApp.on('connection', (socket: Socket) => {
			this.debug('socket connected');

			this.listenConnectionEvents(socket);

			this.registerUser();

			return socket;
		});
		this.ioApp.engine.on('initial_headers', (headers: any, req: any) => {
			headers['set-cookie'] = 'cookie=cookieString';
		});
	}

	registerUser() {}

	/**
	 * init onConnection event listener
	 */
	listenConnectionEvents(socket: Socket) {
		this.debug('listenConnectionEvents');
		this.listenLifeEvents(socket);
		this.listenAuth(socket);
		this.listenRoutes(socket);
	}

	listenRoutes(socket: Socket) {
		// received events from clients
		socket.onAny((eventName, ...args) => {
			// ...
		});

		Object.values(this.routesConfig).map((eventRoute) => {
			socket.on(eventRoute.route, (payload, callBack) => {
				//
				this.debug('on ' + eventRoute.route, payload, callBack);
				callBack({
					status: 'OK'
				});
			});
		});
	}

	/**
	 *
	 * @param socket socketIoObject
	 */
	listenAuth(socket: Socket) {
		socket.on('grantIn', (data, fn) => {
			this.debug('grantIn', data, fn);
			if (data.ROLE) {
				socket.join(data.ROLE);
			}
			if (data.host) {
				socket.join(data.host);
			}

			if (fn) return fn('true');
		});
	}

	/**
	 *
	 * @param socket socketIoObject
	 */
	listenLifeEvents(socket: Socket) {
		socket.on('error', (error) => {
			this.debug('error ', error);
		});
		socket.on('disconnecting', (reason) => {
			this.debug('disconnecting ', reason);
		});
		socket.on('disconnect', (reason) => {
			this.debug('disconnect ', reason);
		});
	}

	/**
	 *
	 * @param room string
	 * @param eventRoute string
	 * @param data object
	 */
	toRoom(room: string | string[], eventRoute: string, data: any) {
		// socketThrottle([eventRoute, data]);
		this.ioApp.to(room).emit(eventRoute, data);
		this.debug('emitting data for ROOM ' + room);
	}

	toUser(own: any, eventRoute: any, data: any) {
		this.ioApp.to(own).emit(eventRoute, data);
		this.debug('emiting own data for OWN  /' + own);
	}

	toAll(own: any, eventRoute: any, data: any) {
		this.ioApp.emit(eventRoute, data);
		this.debug('emiting own data for All  /' + own);
	}

	debug(...log: any) {
		console.log('SocketIoServer: ', ...log);
	}
}

class SocketIoServerEmitter {
	private io: any;

	constructor(io: any) {
		this.io = io;
	}

	/**
	 *
	 * @param room string
	 * @param eventRoute string
	 * @param data object
	 */
	toRoom(room: string | string[], eventRoute: string, data: any) {
		// socketThrottle([eventRoute, data]);
		this.io.to(room).emit(eventRoute, data);
		console.log('emitting data for ROOM ' + room);
	}

	toUser(own: any, eventRoute: any, data: any) {
		this.io.to(own).emit(eventRoute, data);
		console.log('emiting own data for OWN  /' + own);
	}

	toAll(own: any, eventRoute: any, data: any) {
		this.io.emit(eventRoute, data);
		console.log('emiting own data for All  /' + own);
	}
}

export const socketIoServerInstance = new SocketIoServer();
