import path from 'path';

import _ from 'lodash';
import fs from 'fs-promise';
import winston from 'winston';

import {create} from '../nodegit/wrapper';
import {workingDirectory} from './constants';
import {readObject} from './read';

const logger = winston.loggers.get('GitUpdater');

export async function writeObject(type, data) {
	try {
		let id = data.__id__;
		delete data.__id__;
		const repositoryPath = path.resolve(workingDirectory, 'master');
		let objectPath = path.resolve(repositoryPath, type, id);
		const repository = await create(repositoryPath);

		// FS delete
		if (data.__newId__) {
			if (data.__newId__ !== id) {
				const newId = data.__newId__;
				const newObjectPath = path.resolve(repositoryPath, type, newId);
				if (!fs.existsSync(newObjectPath)) {
					fs.remove(objectPath);
					await repository.remove(path.join(type, id));
					id = newId;
					objectPath = newObjectPath;
				}
			}
			delete data.__newId__;
		}

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
		const oid = await repository.add(path.join(type, id));
		await repository.commit(oid);
		await repository.push();
		// Return read object
		return await readObject(type, id);
	} catch (error) {
		logger.error(`Gitasdb write error ${error}`);
		throw error;
	}
}
