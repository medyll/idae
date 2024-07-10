import {Socket, SocketOptions} from 'socket.io-client/build/esm/socket';
import {ManagerOptions} from 'socket.io-client/build/esm/manager';

const io = require('socket.io-client');


class EventDataConfig {
  private _authentication!: { auth: string, authMode: 'Basic' | 'Bearer' | 'AwsSignature' }
  private _options!: Partial<ManagerOptions & SocketOptions>
  private _host!: string
  private _port!: number
  private _namespace!: string

  get authentication(): { auth: string; authMode: 'Basic' | 'Bearer' | 'AwsSignature' } {
    return this._authentication;
  }

  set authentication(value: { auth: string; authMode: 'Basic' | 'Bearer' | 'AwsSignature' }) {
    this._authentication = value;
  }

  get options(): Partial<ManagerOptions & SocketOptions> {
    return this._options;
  }

  set options(value: Partial<ManagerOptions & SocketOptions>) {
    this._options = value;
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

  get namespace(): string {
    return this._namespace;
  }

  set namespace(value: string) {
    this._namespace = value;
  }

}


export class EventDataClientInstance {

  public config!: EventDataConfig
  public socket!: Socket

  public onConnect?: (callBack: { socketId: string, socketConnected: boolean }) => void;
  public onDisconnect?: (callBack: { socketId: string, socketConnected: boolean }) => void;
  public onConnectError?: (callBack: { socketId: string, socketConnected: boolean }) => void;

  constructor() {
    this.config = new EventDataConfig();
    return this
  }

  connect() {
    const h   = [this.config.host, this.config.port].join(':');
    const uri = [h, this.config.namespace].filter(x => x).join('/');

    const opt = {
      auth    : {
        Authorization: this.config.authentication.auth
      },
      authMode: this.config.authentication.authMode
    }

    this.socket = io(uri, {...opt, ...this.config.options});
    this.socket.connect();

    this.connectEvents();
  }

  private connectEvents() {

    this.socket.on('connect_error', () => {
      if (this.onConnectError) {
        return this.onConnectError({socketId: this.socket.id, socketConnected: this.socket.connected})
      }
      setTimeout(() => {
        this.socket.connect();
      }, 1000);
    });

    this.socket.on('disconnect', (reason) => {
      if (this.onDisconnect) {
        return this.onDisconnect({socketId: this.socket.id, socketConnected: this.socket.connected})
      }
    });

    this.socket.on('connect', () => {
      if (this.onConnect) {
        return this.onConnect({socketId: this.socket.id, socketConnected: this.socket.connected})
      }
    });
  }
}