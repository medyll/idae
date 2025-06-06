import { Injectable, Logger } from '@nestjs/common';
import * as mongoose from 'mongoose';

@Injectable()
export class DatabaseService {
  private readonly logger = new Logger(DatabaseService.name);
  private connections: { [key: string]: mongoose.Connection } = {};

  private getUri(base: string) {
    const host = process.env.MONGO_HOST || 'localhost';
    const port = process.env.MONGO_PORT || '27017';
    return `mongodb://${host}:${port}/${base}`;
  }

  getConnection(base: string): mongoose.Connection {
    if (this.connections[base]) {
      return this.connections[base];
    }

    const username = process.env.MONGO_USER;
    const password = process.env.MONGO_PASSWORD;

    const options: mongoose.ConnectOptions = {};

    if (username && password) {
      options.authSource = 'admin';
      options.auth = {
        username,
        password,
      };
    }

    try {
      const conn = mongoose.createConnection(this.getUri(base), options);

      conn.on('error', (err) => {
        this.logger.error(`MongoDB connection error for base "${base}": ${err}`);
      });

      conn.on('connected', () => {
        this.logger.log(`MongoDB connected to base "${base}"`);
      });

      conn.on('disconnected', () => {
        this.logger.warn(`MongoDB disconnected from base "${base}"`);
      });

      this.connections[base] = conn;
      return conn;
    } catch (error) {
      this.logger.error(`Failed to create MongoDB connection for base "${base}": ${error}`);
      throw error;
    }
  }
}
