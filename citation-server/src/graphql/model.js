import path from 'path';

import _ from 'lodash';
import fs from 'fs-promise';

import conf from '../conf';

export async function readModel() {
	const modelPath = path.resolve(conf.work.content, 'master', 'model.json');
	const sourcesPath = path.resolve(conf.work.content, 'master', 'sources.json');
	return Array.prototype.concat(await fs.readJson(sourcesPath), await fs.readJson(modelPath));
}

export async function writeModel(newModel) {
	const modelPath = path.resolve(conf.work.content, 'master', 'model.json');
	return await fs.writeJSON(modelPath, newModel.schema.types);
}
