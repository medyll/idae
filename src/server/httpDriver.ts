'use strict'

import {TRoutesConfig} from './@types';
import {eventEmitterInstance} from './_utils/eventEmitterInstance';
import {socketIoServerInstance} from './socketBridge';
import * as http from 'http';
import express from 'express';
import cors from 'cors';
import * as core from 'express-serve-static-core';
import bodyParser from 'body-parser';
import {appRoutes} from './_utils/routes';
import {dataEventInstance, TDataEvent} from './dataEvent';

export  type THttpDriver = httpDriver

class httpDriver {

  private options: any;
  private port!: number;
  private app!: core.Express;
  private httpServer!: http.Server;
  private socketIoServer: any;
  private routesConfig: TRoutesConfig;
  private dataEventInstance: TDataEvent;
  private EventsEmitInstance: any;

  constructor(vars?: undefined, options?: undefined) {
    this.options            = Object.assign({}, options || {});
    this.routesConfig       = appRoutes.getRoutes();
    this.app                = appAdapter.use('express');

    this.dataEventInstance  = dataEventInstance;
    this.EventsEmitInstance = eventEmitterInstance;
  }

  listen(port?: number) {

    this.port = port ?? this.port;
    if (!this.port) throw new Error('dataEvent:PORT_MISSING');

    this.httpServer     = this.app.listen(this.port);
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
    response.send({status: 'ok'});
    //
    this.EventsEmitInstance.emit(request.path.slice(1), request.body);
  }
}

class appAdapter {

  static use(type: 'express') {
    const app = express();
    app.use(express.static('public'));
    app.use(bodyParser.urlencoded({extended: true}));
    app.use(bodyParser.json());
    app.use(bodyParser.raw());
    app.use(cors());
    //
    return app
  }
}

export const httpDriverInstance = new httpDriver();
 
