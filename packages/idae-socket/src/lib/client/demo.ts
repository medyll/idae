import {EventDataClientInstance} from './index';
import {_config} from '../server/_config/config';
import {start} from '../index';

const parseArgs = require('minimist');

const argv = parseArgs(process.argv);

const defaultPort = argv?.port ?? _config.defaultPort;
const defaultHost = argv?.host ?? _config.defaultHost;


export function startClientDemo(port: number) {

  const dataClient = new EventDataClientInstance();

  dataClient.config.host           = defaultHost
  dataClient.config.port           = port
  dataClient.config.authentication = {authMode: 'Bearer', auth: 'Bearer ggfdgfdgfdgfdgfdgfdgfdgfdgfdgfd'}

  dataClient.onConnect      = ({socketId, socketConnected}) => {
    console.log('onConnect', socketId, socketConnected);
  };
  dataClient.onConnectError = ({socketId, socketConnected}) => {
    console.log('onConnectError', socketId, socketConnected);
  };
  dataClient.onDisconnect   = ({socketId, socketConnected}) => {
    console.log('onDisconnect', socketId, socketConnected);
  };
  dataClient.connect();
}

if (argv?.start) {
  // startClientDemo(defaultPort)
}
