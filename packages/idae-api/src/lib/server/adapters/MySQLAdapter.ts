// packages\idae-api\src\lib\adapters\MySQLAdapter.ts
import type { ApiServerRequestParams } from '$lib/server/engine/types';
import { Sequelize, Model, DataTypes, type BuildOptions } from 'sequelize';
import type { DatabaseAdapter } from './types';
import dotenv from 'dotenv';

interface MySQLDocument extends Model {
	id: number;
	[key: string]: any;
}

type MySQLModelStatic = typeof Model & {
	new (values?: object, options?: BuildOptions): MySQLDocument;
};

dotenv.config();

export class MySQLAdapter<T extends MySQLDocument> implements DatabaseAdapter<T> {
	private sequelize: Sequelize;
	private model: MySQLModelStatic;

	constructor(tableName: string) {
		this.sequelize = new Sequelize({
			dialect: 'mysql',
			host: process.env.MYSQL_HOST || 'localhost',
			port: Number(process.env.MYSQL_PORT) || 3306,
			database: process.env.MYSQL_DATABASE || 'database',
			username: process.env.MYSQL_USER || 'root',
			password: process.env.MYSQL_PASSWORD || 'password'
		});

		this.model = this.sequelize.define(
			tableName,
			{
				id: {
					type: DataTypes.INTEGER.UNSIGNED,
					autoIncrement: true,
					primaryKey: true
				}
				// Define other fields here as needed
			},
			{
				timestamps: false,
				tableName
			}
		) as MySQLModelStatic;
	}

	async create(document: Partial<T>): Promise<T> {
		const newDocument = await this.model.create(document);
		return newDocument as T;
	}

	async where(params: ApiServerRequestParams): Promise<T[]> {
		const { query = {}, sortBy, limit, skip } = params;
		const options: any = {
			where: query,
			order: this.parseSortOptions(sortBy),
			limit: limit ? Number(limit) : undefined,
			offset: skip ? Number(skip) : undefined
		};
		const results = await this.model.findAll(options);
		return results as T[];
	}

	async findById(id: string): Promise<T | null> {
		const result = await this.model.findByPk(id);
		return result ? (result as T) : null;
	}

	async findOne(params: ApiServerRequestParams): Promise<T | null> {
		const { query = {} } = params;
		const result = await this.model.findOne({ where: query });
		return result ? (result as T) : null;
	}

	async update(id: string, updateData: Partial<T>): Promise<T | null> {
		const [affectedCount, affectedRows] = await this.model.update(updateData, {
			where: { id },
			returning: true
		});
		return affectedCount > 0 ? (affectedRows[0] as T) : null;
	}

	async deleteById(id: string): Promise<T | null> {
		const result = await this.model.findByPk(id);
		if (result) {
			await result.destroy();
			return result as T;
		}
		return null;
	}

	async deleteManyByQuery(params: ApiServerRequestParams): Promise<{ deletedCount?: number }> {
		const { query = {} } = params;
		const deletedCount = await this.model.destroy({ where: query });
		return { deletedCount };
	}

	private parseSortOptions(sortBy?: string): any[] {
		if (!sortBy) return [];
		return sortBy.split(',').map((field) => {
			const [key, order] = field.split(':');
			return [key, order === 'desc' ? 'DESC' : 'ASC'];
		});
	}
}
