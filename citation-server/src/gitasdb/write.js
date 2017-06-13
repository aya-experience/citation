import path from 'path';

import _ from 'lodash';
import fs from 'fs-promise';
import winston from 'winston';

import { create } from '../nodegit/wrapper';
import conf from '../conf';
import { readObject } from './read';

const logger = winston.loggers.get('GitAsDb');

export function emptyField(field) {
	const role = field.__role__;
	return _.isEmpty(field) || _.isUndefined(role) !== _.isEmpty(field[role]);
}

export async function writeObject(type, data) {
	try {
		// Opening repository
		const repositoryPath = path.resolve(conf.work.content, conf.content.branch);
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
			const error = { code: 409, message: 'Unavailable ID' };
			throw error;
		}
		objectPath = objectPath || path.resolve(repositoryPath, type, id);
		await fs.emptyDir(objectPath);
		// FS write
		const objectFields = Object.keys(data);
		await Promise.all(
			objectFields.map(async field => {
				let extension;
				let writeData;
				if (_.isObject(data[field])) {
					extension = 'json';
					writeData = JSON.stringify(data[field], null, 2);
				} else {
					extension = 'md';
					writeData = data[field];
				}
				const fieldPath = path.resolve(objectPath, `${field}.${extension}`);
				if (emptyField(data[field])) {
					await fs.remove(fieldPath);
				} else {
					await fs.writeFile(fieldPath, writeData);
				}
			})
		);
		// Git Push
		const oid = await repository.add(path.join(type, id));
		await repository.commit(oid);
		await repository.push(conf.content.branch);
		// Return read object
		return await readObject(type, id);
	} catch (error) {
		logger.error(`Gitasdb write error ${JSON.stringify(error)}`);
		throw error;
	}
}
