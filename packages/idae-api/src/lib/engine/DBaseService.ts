import { Model, Document } from 'mongoose';
import { getModel } from './tools';
import { type RequestParams, type SortOptions } from './types';

class DBaseService {
	private model: Model<Document>;

	constructor(collection: string) {
		this.model = getModel(collection);
	}

	async create(document: any): Promise<Document> {
		const newDocument = new this.model(document);
		return newDocument.save();
	}

	async findAll(params: RequestParams): Promise<Document[]> {
		const sortOptions: SortOptions = {};
		if (params.sortBy) {
			const sortFields = (params.sortBy as string).split(',');
			sortFields.forEach((field) => {
				const [key, order] = field.split(':');
				sortOptions[key] = order === 'desc' ? -1 : 1;
			});
		}

		return this.model.find().sort(sortOptions);
	}

	async findById(id: string): Promise<Document | null> {
		return this.model.findById(id);
	}

	async findOne(params: RequestParams): Promise<Document | null> {
		return this.model.findOne(params.query);
	}

	async deleteById(id: string): Promise<Document | null> {
		return this.model.findByIdAndDelete(id);
	}

	async deleteManyByQuery(params: RequestParams): Promise<{ deletedCount?: number }> {
		return this.model.deleteMany(params.query);
	}

	decodeUrlParams(urlParams: string): RequestParams {
		const params: RequestParams = {};
		const urlParamsArray = urlParams.split('&');
		urlParamsArray.forEach((param) => {
			const [key, value] = param.split('=');
			if (key && value) {
				/** @ts-ignore */
				params[key] = JSON.parse(decodeURIComponent(value));
			}
		});
		return params;
	}
}

export default DBaseService;
