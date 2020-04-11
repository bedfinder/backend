/** TODO: create usefull healthcheck */

import http from 'http';
import { log } from './logging';

const options = {
  host: 'localhost/__internal/health',
  port: process.env.PORT || 3000,
  timeout: 2000,
};

const request = http.request(options, res => {
  log.info(`STATUS: ${res.statusCode}`);
  if (res.statusCode === 200) {
    process.exit(0);
  } else {
    process.exit(1);
  }
});

request.on('error', err => {
  log.error('UNHEALTHY');
  process.exit(1);
});

request.end();
