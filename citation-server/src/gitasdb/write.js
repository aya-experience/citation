import path from 'path';
import _ from 'lodash';
import fs from 'fs-promise';

import {create} from '../nodegit/wrapper';
import {workingDirectory} from './constants';
import {readObject} from './read';

export async function writeObject(type, data) {
	try {
		const id = data.__id__;
		delete data.__id__;

		const repositoryPath = path.resolve(workingDirectory, 'master');
		const objectPath = path.resolve(repositoryPath, type, id);

		// FS delete
		await fs.emptyDir(objectPath);

		// FS write
		const objectFields = Object.keys(data);
		await Promise.all(objectFields.map(async field => {
			if (_.isObject(data[field])) {
				const fieldPath = path.resolve(objectPath, `${field}.json`);
				await fs.writeFile(fieldPath, JSON.stringify(data[field], null, 2));
			} else {
				const fieldPath = path.resolve(objectPath, `${field}.md`);
				await fs.writeFile(fieldPath, data[field]);
			}
		}));

		// Git Push
		const repository = await create(repositoryPath);
		const oid = await repository.add(path.join(type, id));
		await repository.commit(oid);
		await repository.push();

		// Return read object
		return await readObject(type, id);
	} catch (error) {
		console.error('Gitasdb write error', error);
		throw error;
	}
}
