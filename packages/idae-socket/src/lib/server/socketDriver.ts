import { _config } from "./_config/config.js";
import { EventDataClientInstance } from "../client.js";
import { appRoutes } from "./_utils/routes.js";
import { TRoutesConfig } from "./@types";
import { eventEmitterInstance } from "./_utils/eventEmitterInstance.js";

const parseArgs = require("minimist");

const argv = parseArgs(process.argv);
const defaultPort = argv?.port ?? _config.defaultPort;
const defaultHost = argv?.host ?? _config.defaultHost;

export class SocketDriver {
  private routesConfig: TRoutesConfig;
  private port!: number;
  private EventsEmitInstance: any;
  private DataClient: EventDataClientInstance;

  constructor(port: number) {
    this.routesConfig = appRoutes.getRoutes();
    this.EventsEmitInstance = eventEmitterInstance;
    this.DataClient = new EventDataClientInstance();
  }

  listen(port?: number) {
    this.port = port ?? this.port;

    this.DataClient.config.host = defaultHost;
    this.DataClient.config.port = this.port;
    this.DataClient.config.authentication = {
      authMode: "Bearer",
      auth: "Bearer ggfdgfdgfdgfdgfdgfdgfdgfdgfdgfd",
    };

    this.DataClient.connect();
  }

  routing() {
    Object.values(this.routesConfig).map((eventRoute) => {
      this.DataClient.socket.on(eventRoute.route, (payload, callBack) => {
        this.doRouting(eventRoute.route, payload, callBack);
        callBack({
          status: "OK",
        });
      });
    });
  }

  doRouting(route: string, payload: any, callBack: any) {
    this.EventsEmitInstance.emit(route, payload);
  }
}
