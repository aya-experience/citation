import path from 'path';

import _ from 'lodash';
import fs from 'fs-promise';

import {workingDirectory} from './../gitasdb/constants';

export async function readModel() {
	const modelPath = path.resolve(workingDirectory, 'master', 'model.json');
	const test = await fs.readJson(modelPath);
	return test;
}
