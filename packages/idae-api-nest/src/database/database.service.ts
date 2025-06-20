import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as mongoose from 'mongoose';

@Injectable()
export class DatabaseService {
  private readonly logger = new Logger(DatabaseService.name);
  private connections: { [key: string]: mongoose.Connection } = {};
  private incrementConnection: mongoose.Connection | null = null;

  base: string;
  mongoPort: number;
  mongoHost: string;
  mongoUser: string | undefined;
  mongoPassword: string | undefined;

  constructor(private configService: ConfigService) {
    this.mongoHost = this.configService.get('mongo.host') || 'localhost';
    this.mongoPort = this.configService.get('mongo.port') || 27017;
    this.mongoUser =
      this.configService.get<string>('mongo.user') || process.env.MONGO_USER;
    this.mongoPassword =
      this.configService.get<string>('mongo.password') ||
      process.env.MONGO_PASSWORD;
  }

  private getUri(base: string) {
    return `mongodb://${this.mongoHost}:${this.mongoPort}/${base}`;
  }

  getConnection(base: string): mongoose.Connection {
    if (!base) {
      throw new Error('Base name is required to get a MongoDB connection');
    }
    this.base = base;
    if (this.connections[base]) {
      return this.connections[base];
    }

    const options: mongoose.ConnectOptions = {};

    if (this.mongoUser && this.mongoPassword) {
      options.authSource = 'admin';
      options.auth = {
        username: this.mongoUser,
        password: this.mongoPassword,
      };
    }

    try {
      const conn = mongoose.createConnection(this.getUri(base), options);
      this.connections[base] = conn;
      return conn;
    } catch (error) {
      this.logger.error(
        `Failed to create MongoDB connection for base "${base}": ${error}`,
      );
      throw error;
    }
  }

  /**
   * Get or create a dedicated connection to the idae_increment database for auto-increment counters
   */
  getIncrementConnection(): mongoose.Connection {
    if (this.incrementConnection) {
      return this.incrementConnection;
    }

    this.incrementConnection = this.getConnection('idae_increment');

    return this.incrementConnection;
  }
}
