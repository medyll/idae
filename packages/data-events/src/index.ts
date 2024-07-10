'use strict';

import {_config} from './server/_config/config';
import {httpDriverInstance} from './server/httpDriver';
import {EventDataClientInstance} from './client';
import {startClientDemo} from './client/demo';

const parseArgs = require('minimist');
const argv      = parseArgs(process.argv);

const defaultPort = argv?.port ?? _config.defaultPort;

// auth mode Basic, Bearer
export function start(port: number) {

  httpDriverInstance.listen(port);

  startClientDemo(port);

  return httpDriverInstance;
}

if (argv?.start) {
  start(defaultPort);
}
// start from cmd line
// node /bin

// nodemon ./src/index.ts