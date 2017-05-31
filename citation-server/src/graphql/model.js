import path from 'path';

import _ from 'lodash';
import fs from 'fs-promise';

import conf from '../conf';
import {updateSchema} from '../index';

export async function readModel() {
	const modelPath = path.resolve(conf.work.content, 'master', 'model.json');
	const sourcesPath = path.resolve('../citation-server/src/sources/sources.json');
	return Array.prototype.concat(await fs.readJson(sourcesPath), await fs.readJson(modelPath));
}

export async function writeModel(newModel) {
	newModel.schema.types.forEach(type => {
		const typePath = path.resolve(conf.work.content, 'master', type.name);
		if (!fs.existsSync(typePath)) {
			fs.mkdirSync(typePath);
		}
	});
	const modelPath = path.resolve(conf.work.content, 'master', 'model.json');
	const result = await fs.writeJSON(modelPath, newModel.schema.types);
	await updateSchema();
	return result;
}
