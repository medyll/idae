'use strict';

import {Socket} from 'socket.io/dist/socket';
import socketIO from 'socket.io';
import {Server} from 'net';
import {TRoutesConfig} from '../@types';
import {appRoutes} from '../_utils/routes';

const request        = require('request');
const socketThrottle = require('./socketThrottle');
const {_config}      = require('../_config/config');
const bodyParser     = require('body-parser');

const {createAdapter} = require('@socket.io/redis-adapter');
const {createClient}  = require('redis');

class SocketIoServerInstance {
  listeningIo: any;

  constructor(app: Server) {
    //@ts-ignore
    this.listeningIo = socketIO(app);

    return this.listeningIo
  }
}


class SocketIoServer {
  ioApp: any;

  private routesConfig: TRoutesConfig;

  constructor() {
    this.routesConfig = appRoutes.getRoutes();
  }

  init(app: Server) {
    this.ioApp = new SocketIoServerInstance(app);
    this.ioApp.use(this.authorization);

    this.onConnection();

    return this.ioApp
  }

  /**
   * first socket client connection authorization middleware
   * @param socket
   * @param next
   */
  async authorization(socket: Socket, next: any) {
    //
    const authMethod  = socket.handshake?.auth?.authMode
    const authHeaders = socket.handshake?.headers?.Authorization ?? socket.handshake?.auth?.Authorization

    // post to api for json_token
    if (!authHeaders) {
      return next(new Error('Missing Auth method'));
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

  onConnection() {

    this.ioApp.on('connection', (socket: Socket) => {
      this.debug('socket connected');

      this.listenConnectionEvents(socket);

      this.registerUser();

      return socket
    });
    this.ioApp.engine.on('initial_headers', (headers: any, req: any) => {
      headers['set-cookie'] = 'cookie=cookieString';
    });
  }

  registerUser() {

  }

  /**
   * init onConnection event listener
   */
  listenConnectionEvents(socket: Socket) {
    this.debug('listenConnectionEvents')
    this.listenLifeEvents(socket)
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
      this.debug('error ', error)
    });
    socket.on('disconnecting', (reason) => {
      this.debug('disconnecting ', reason)
    });
    socket.on('disconnect', (reason) => {
      this.debug('disconnect ', reason)
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
    this.ioApp.to(room).emit(eventRoute, data)
    this.debug('emitting data for ROOM ' + room)
  }

  toUser(own: any, eventRoute: any, data: any) {
    this.ioApp.to(own).emit(eventRoute, data)
    this.debug('emiting own data for OWN  /' + own)
  }

  toAll(own: any, eventRoute: any, data: any) {
    this.ioApp.emit(eventRoute, data)
    this.debug('emiting own data for All  /' + own)
  }

  debug(...log: any) {
    console.log('SocketIoServer: ', ...log)
  }
}

class SocketIoServerEmitter {

  private io: any;

  constructor(io: any) {

    this.io = io
  }

  /**
   *
   * @param room string
   * @param eventRoute string
   * @param data object
   */
  toRoom(room: string | string[], eventRoute: string, data: any) {
    // socketThrottle([eventRoute, data]);
    this.io.to(room).emit(eventRoute, data)
    console.log('emitting data for ROOM ' + room)
  }

  toUser(own: any, eventRoute: any, data: any) {
    this.io.to(own).emit(eventRoute, data)
    console.log('emiting own data for OWN  /' + own)
  }

  toAll(own: any, eventRoute: any, data: any) {
    this.io.emit(eventRoute, data)
    console.log('emiting own data for All  /' + own)
  }

}

export const socketIoServerInstance = new SocketIoServer()