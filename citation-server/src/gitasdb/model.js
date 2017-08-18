import path from 'path';

import fs from 'fs-extra';

import conf from '../conf';
import { updateSchema } from '../index';

export async function readModel() {
	const modelPath = path.resolve(conf.work.content, conf.content.branch, 'model.json');
	let modelTypes;
	try {
		modelTypes = await fs.readJson(modelPath);
	} catch (e) {
		modelTypes = [];
	}
	const sourcesPath = path.resolve('../citation-server/src/sources/sources.json');
	const sourcesTypes = await fs.readJson(sourcesPath);
	return [...sourcesTypes, ...modelTypes];
}

export async function writeModel(newModel) {
	newModel.schema.types.forEach(type => {
		const typePath = path.resolve(conf.work.content, conf.content.branch, type.name);
		if (!fs.existsSync(typePath)) {
			fs.mkdirSync(typePath);
		}
	});
	const modelPath = path.resolve(conf.work.content, conf.content.branch, 'model.json');
	const result = await fs.writeJSON(modelPath, newModel.schema.types);
	await updateSchema();
	return result;
}

export function getTypesNames(model) {
	return model.map(type => type.name);
}
