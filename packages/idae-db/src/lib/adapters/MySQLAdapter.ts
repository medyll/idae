import { AbstractIdaeDbAdapter, type IdaeDbParams } from '../@types/types.js';
import { IdaeDbConnection } from '../IdaeDbConnection.js';
import { IdaeDBModel } from '../IdaeDBModel.js';
import mysql from 'mysql2/promise';

export class MysqlAdapter<T extends Record<string, any>> implements AbstractIdaeDbAdapter<T> {
	private model: IdaeDBModel<T>;
	private connection: IdaeDbConnection;
	private fieldId: string;
	private tableName: string;

	constructor(collection: string, connection: IdaeDbConnection) {
		this.connection = connection;
		this.model = this.connection.getModel<T>(collection);
		this.fieldId = this.model.fieldId;
		this.tableName = collection;
	}

	async findById(id: string): Promise<T[]> {
		const [rows] = await this.connection
			.getClient<mysql.Connection>()
			.execute(`SELECT * FROM ${this.tableName} WHERE ${this.fieldId} = ?`, [id]);
		return rows as T[];
	}

	async find(params: IdaeDbParams<T>): Promise<T[]> {
		const { query = {}, sortBy, limit, skip } = params;
		let sql = `SELECT * FROM ${this.tableName}`;
		const values: any[] = [];

		if (Object.keys(query).length > 0) {
			sql +=
				' WHERE ' +
				Object.keys(query)
					.map((key) => `${key} = ?`)
					.join(' AND ');
			values.push(...Object.values(query));
		}

		if (sortBy) {
			sql += ' ORDER BY ' + this.parseSortOptions(sortBy);
		}

		if (limit) {
			sql += ' LIMIT ?';
			values.push(Number(limit));
		}

		if (skip) {
			sql += ' OFFSET ?';
			values.push(Number(skip));
		}

		const [rows] = await this.connection.getClient<mysql.Connection>().execute(sql, values);
		return rows as T[];
	}

	async findOne(params: IdaeDbParams<T>): Promise<T | null> {
		const results = await this.find({ ...params, limit: 1 });
		return results[0] || null;
	}

	async create(data: Partial<T>): Promise<T> {
		const columns = Object.keys(data);
		const values = Object.values(data);
		const placeholders = columns.map(() => '?').join(', ');

		const [result] = await this.connection
			.getClient<mysql.Connection>()
			.execute(
				`INSERT INTO ${this.tableName} (${columns.join(', ')}) VALUES (${placeholders})`,
				values
			);

		const insertId = (result as mysql.ResultSetHeader).insertId;
		return { ...data, [this.fieldId]: insertId } as T;
	}

	async update(id: string, updateData: Partial<T>, options?: any): Promise<any> {
		const setClause = Object.keys(updateData)
			.map((key) => `${key} = ?`)
			.join(', ');
		const values = [...Object.values(updateData), id];

		const [result] = await this.connection
			.getClient<mysql.Connection>()
			.execute(`UPDATE ${this.tableName} SET ${setClause} WHERE ${this.fieldId} = ?`, values);

		return result;
	}

	async updateWhere(
		params: IdaeDbParams<T>,
		updateData: Partial<T>,
		options: any = {}
	): Promise<any> {
		const { query = {} } = params;
		const setClause = Object.keys(updateData)
			.map((key) => `${key} = ?`)
			.join(', ');
		const whereClause = Object.keys(query)
			.map((key) => `${key} = ?`)
			.join(' AND ');
		const values = [...Object.values(updateData), ...Object.values(query)];

		const [result] = await this.connection
			.getClient<mysql.Connection>()
			.execute(`UPDATE ${this.tableName} SET ${setClause} WHERE ${whereClause}`, values);

		return result;
	}

	async deleteById(id: string | number): Promise<any> {
		const [result] = await this.connection
			.getClient<mysql.Connection>()
			.execute(`DELETE FROM ${this.tableName} WHERE ${this.fieldId} = ?`, [id]);

		return result;
	}

	async deleteWhere(params: IdaeDbParams<T>): Promise<{ deletedCount?: number }> {
		const { query = {} } = params;
		const whereClause = Object.keys(query)
			.map((key) => `${key} = ?`)
			.join(' AND ');
		const values = Object.values(query);

		const [result] = await this.connection
			.getClient<mysql.Connection>()
			.execute(`DELETE FROM ${this.tableName} WHERE ${whereClause}`, values);

		return { deletedCount: (result as mysql.ResultSetHeader).affectedRows };
	}

	async transaction<TResult>(
		callback: (session: mysql.Connection) => Promise<TResult>
	): Promise<TResult> {
		const connection = await this.connection.getClient<mysql.Connection>();
		await connection.beginTransaction();

		try {
			const result = await callback(connection);
			await connection.commit();
			return result;
		} catch (error) {
			await connection.rollback();
			throw error;
		}
	}

	private parseSortOptions(sortBy: string): string {
		return sortBy
			.split(',')
			.map((field) => {
				const [key, order] = field.split(':');
				return `${key} ${order === 'desc' ? 'DESC' : 'ASC'}`;
			})
			.join(', ');
	}
}
