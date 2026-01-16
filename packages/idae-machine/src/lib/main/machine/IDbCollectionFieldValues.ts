import type { TplCollectionName } from '@medyll/idae-idbql';
import { IDbCollectionValues } from './IDbCollectionValues.js';
import type { IDbForge } from '../machineForge.js';


export class IDbCollectionFieldValues<T extends Record<string, any>> {
	#collection: TplCollectionName;
	#collectionValues: IDbCollectionValues<T>;
	#data: T;

	/**
 * Returns the IDbForge metadata for a given field name.
 * @param fieldName The field name to introspect.
 */
	public getForge(fieldName: keyof T): IDbForge | undefined {
		return this.#collectionValues.idbBase.parseCollectionFieldName(
			this.#collection,
			String(fieldName)
		);
	}
	constructor(collection: TplCollectionName, data: T, collectionValues?: IDbCollectionValues<T>) {
		this.#collection = collection;
		this.#collectionValues = collectionValues ?? new IDbCollectionValues(collection);
		this.#data = data;
	}

	format(fieldName: keyof T): string | string[] {
		const fieldInfo = this.#collectionValues.idbBase.parseCollectionFieldName(
			this.#collection,
			fieldName
		);
		if (fieldInfo?.is === 'array') {
			return this.iterateArray(String(fieldName), this.#data);
		}

		if (fieldInfo?.is === 'object') {
			return this.iterateObject(String(fieldName), this.#data);
		}
		return this.#collectionValues.format(fieldName, this.#data);
	}

	getInputDataSet(fieldName: keyof T) {
		return this.#collectionValues.getInputDataSet(String(fieldName), this.#data);
	}
	// renamed from parseCollectionFieldName
	// get forge(): IDbForge | undefined {
	//     return undefined; // Pas de #fieldName dans cette classe, getter non pertinent
	// }
	iterateArray(fieldName: string, data: any[]): IDbForge[] {
		return this.#collectionValues.iterateArrayField(fieldName, data);
	}

	iterateObject(fieldName: string, data: Record<string, any>): IDbForge[] {
		return this.#collectionValues.iterateObjectField(fieldName, data);
	}
}
