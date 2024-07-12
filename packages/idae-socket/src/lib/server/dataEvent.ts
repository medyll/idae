'use strict'

import {eventEmitterInstance} from './_utils/eventEmitterInstance';
import {IReceivedDataByPost, TRoutesConfig} from './@types';
import {socketIoServerInstance} from './socketBridge';
import {appRoutes} from './_utils/routes';

export  type TDataEvent =  dataEvent

class dataEvent {

  private routesConfig: TRoutesConfig;

  constructor() {
    this.routesConfig = appRoutes.getRoutes();
  }

  dataEventRouteListen() {

    Object.keys(this.routesConfig).map((eventRoute) => {
      eventEmitterInstance.on(eventRoute, (data: IReceivedDataByPost) => {
        if (!data.payload) {
          console.log('dataEvent:PAYLOAD_MISSING');
          return 'one terrible th happened';
        }
        if (data?.sender?.roles) {
          console.log('_eventEmitterDispatch ', eventRoute)
          this.eventEmitterDispatch(eventRoute, data);
        } else {
          console.log('dataEvent:PAYLOAD_ROLE_MISSING');
          return;
          // throw new Error ('dataEvent:PAYLOAD_ROLE_MISSING');
        }
      });
    })
  };

  eventEmitterDispatch(eventRoute: string, data: IReceivedDataByPost) {

    console.log('dispatch for ' + eventRoute);
    // own : private request for one socket.id
    if (data.rooms) {
      // send to each room / ROLE
      data.rooms.map((room) => {
        console.log('emitting to room', room);
        socketIoServerInstance.toRoom(room, eventRoute, data);
      });
    }
    if (data.payload.own) {
      socketIoServerInstance.toUser(data.payload.own, eventRoute, data);
    }
  }
}

export const dataEventInstance = new dataEvent();