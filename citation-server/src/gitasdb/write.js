import path from 'path';

import _ from 'lodash';
import fs from 'fs-promise';
import winston from 'winston';

import {create} from '../nodegit/wrapper';
import conf from '../conf';
import {readObject} from './read';

const logger = winston.loggers.get('GitAsDb');

export async function writeObject(type, data) {
	try {
		// Opening repository
		const repositoryPath = path.resolve(conf.work.content, 'master');
		const repository = await create(repositoryPath);
		let id = data.__id__;
		const newId = data.__newId__;
		delete data.__id__;
		delete data.__newId__;
		let objectPath;
		// FS delete
		if (newId && newId !== id) {
			const newObjectPath = path.resolve(repositoryPath, type, newId);
			if (!fs.existsSync(newObjectPath)) {
				if (id) {
					objectPath = path.resolve(repositoryPath, type, id);
					fs.remove(objectPath);
					await repository.remove(path.join(type, id));
				}
				id = newId;
				objectPath = newObjectPath;
			}
		}
		if (!id) {
			const error = {code: 409, message: 'Unavailable ID'};
			throw (error);
		}
		objectPath = objectPath || path.resolve(repositoryPath, type, id);
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
		logger.error(`Gitasdb write error ${JSON.stringify(error)}`);
		throw error;
	}
}
