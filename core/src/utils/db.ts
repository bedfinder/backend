import { createConnection } from 'mongoose';
import { log } from './logging';

const name = require('../../package.json').name;
const env = process.env;
let uri = `${env.DATABASE_HOST || 'localhost'}:${env.DATABASE_PORT || 27017}`;

if (env.DATABASE_USER && env.DATABASE_PASSWORD) {
  uri = `${env.DATABASE_USER}:${env.DATABASE_PASS}@${uri}`;
}

export const createDatabaseConnection = createConnection(
  `mongodb://${uri}/${env.DATABASE_DB || name}`,
  {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  }
)
  .then(connection => {
    log.info(
      `Connected to: ${connection.host} / ${connection.db.databaseName}`
    );
    return connection;
  })
  .catch(error => {
    log.error('Not able to connect to database');
    process.exit(1);
  });
