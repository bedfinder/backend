import * as mongoose from 'mongoose';
import { logger } from '../utils/logging';

interface DatabaseConfig {
  user?: string;
  password?: string;
  host: string;
  port: string;
  database: string;
  replica?: string;
  srv: boolean;
}

interface ConnectionOptions {
  keepAlive: boolean;
  keepAliveInitialDelay: number;
  useNewUrlParser: boolean;
  useCreateIndex: boolean;
  useUnifiedTopology?: boolean;
}

export class Connection {
  protected static getDatabaseConfig(): DatabaseConfig {
    return {
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      host: process.env.DB_HOST!,
      port: process.env.DB_PORT || '27017',
      database: process.env.DB_DATABASE!,
      replica: process.env.DB_REPLICA,
      srv: process.env.DB_SRV === 'true' || false,
    };
  }

  static async create(): Promise<void> {
    const config: DatabaseConfig = Connection.getDatabaseConfig();
    const url: string = Connection.toUrl(config);

    try {
      await mongoose.connect(url, Connection.getConnectionOptions(config));
    } catch (err) {
      logger.error(`Could not connect to mongodb: ${err}`);

      process.exit(1);

      return;
    }

    logger.info(
      `Successfully connected to ${process.env.DB_HOST}@${process.env.DB_DATABASE}`
    );
  }

  static async destroy(): Promise<void> {
    try {
      await mongoose.disconnect();
    } catch (e) {}
  }

  protected static getConnectionOptions(
    config: DatabaseConfig
  ): ConnectionOptions {
    const opt: ConnectionOptions = {
      keepAlive: true,
      keepAliveInitialDelay: 1,
      useNewUrlParser: true,
      useCreateIndex: true,
    };

    if (Connection.isSrvConnection(config)) {
      return opt;
    }

    return { ...opt, useUnifiedTopology: true };
  }

  protected static toUrl(config: DatabaseConfig): string {
    let url: string = Connection.isSrvConnection(config)
      ? 'mongodb+srv://'
      : 'mongodb://';

    if (Connection.hasCredentials(config)) {
      url += `${config.user}:${config.password}@${config.host}:${config.port}/${config.database}`;
    } else {
      url += `${config.host}:${config.port}/${config.database}`;
    }

    if (Connection.isReplicaSet(config)) {
      url += `?replicaSet=${config.replica}`;
    }

    return url;
  }

  protected static isReplicaSet(config: DatabaseConfig): boolean {
    return !!config.replica;
  }

  protected static isSrvConnection(config: DatabaseConfig): boolean {
    return config.srv;
  }

  protected static hasCredentials(config: DatabaseConfig): boolean {
    return (
      !!config.user &&
      config.user.length > 0 &&
      !!config.password &&
      config.password.length > 0
    );
  }
}
