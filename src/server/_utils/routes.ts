import {IRouteProps, TRoute, TRoutesConfig} from '../@types';
const cmdRoutes = require('../_config/cmdRoutes.json');

export class appRoutes {

  static getRoutes():TRoutesConfig{
    if(!Object.keys(cmdRoutes)?.length){
      console.error('MISSING ALLOWED ROUTES')
    }
    return cmdRoutes
  }

  static getRoute(route:TRoute):IRouteProps {
    return cmdRoutes?.[route] ?? {}
  }
}