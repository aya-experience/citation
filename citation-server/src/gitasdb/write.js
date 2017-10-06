import path from 'path';

import _ from 'lodash';
import fs from 'fs-extra';
import winston from 'winston';

import { create } from '../nodegit/wrapper';
import conf from '../conf';
import { readEntry } from './read';

const logger = winston.loggers.get('GitAsDb');

export function emptyField(field) {
	const role = field._role_;
	return _.isEmpty(field) || _.isUndefined(role) !== _.isEmpty(field[role]);
}

export async function writeEntry(type, data) {
	try {
		// Opening repository
		const repositoryPath = path.resolve(conf.work.content, conf.content.branch);
		const repository = await create(repositoryPath);
		let id = data._id_;
		const newId = data._newId_;
		delete data._id_;
		delete data._newId_;
		let entryPath;
		// FS delete
		if (newId && newId !== id) {
			const newEntryPath = path.resolve(repositoryPath, type, newId);
			if (!fs.existsSync(newEntryPath)) {
				if (id) {
					entryPath = path.resolve(repositoryPath, type, id);
					fs.remove(entryPath);
					await repository.remove(path.join(type, id));
				}
				id = newId;
				entryPath = newEntryPath;
			}
		}
		if (!id) {
			const error = { code: 409, message: 'Unavailable ID' };
			throw error;
		}
		entryPath = entryPath || path.resolve(repositoryPath, type, id);
		await fs.emptyDir(entryPath);
		// FS write
		const entryFields = Object.keys(data);
		await Promise.all(
			entryFields.map(async field => {
				let extension;
				let writeData;
				if (_.isObject(data[field])) {
					extension = 'json';
					writeData = JSON.stringify(data[field], null, 2);
				} else {
					extension = 'md';
					writeData = data[field];
				}
				const fieldPath = path.resolve(entryPath, `${field}.${extension}`);
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
		// Return read entry
		return await readEntry(type, id);
	} catch (error) {
		logger.error(`Gitasdb write error ${JSON.stringify(error)}`);
		throw error;
	}
}
