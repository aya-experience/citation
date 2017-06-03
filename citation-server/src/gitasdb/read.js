import path from 'path';

import _ from 'lodash';
import fs from 'fs-promise';
import winston from 'winston';

import conf from '../conf';

const logger = winston.loggers.get('GitAsDb');

export async function readCollection(type) {
	try {
		logger.debug(`read collection ${type}`);
		const collectionPath = path.resolve(conf.work.content, conf.content.branch, type);
		const collectionFolders = await fs.readdir(collectionPath);
		return await Promise.all(collectionFolders.map(folder => readObject(type, folder)));
	} catch (error) {
		logger.error('Gitasdb read collection error', error);
		throw error;
	}
}

export async function readObject(type, id) {
	if (id === 'undefined') {
		return null;
	}
	try {
		logger.debug(`read object ${type} ${id}`);
		const objectPath = path.resolve(conf.work.content, conf.content.branch, type, id);
		const objectFiles = await fs.readdir(objectPath);
		const objectFields = await Promise.all(objectFiles.map(async file => {
			const ext = path.extname(file);
			const key = path.basename(file, ext);
			const contentString = (await fs.readFile(path.resolve(objectPath, file))).toString();
			const content = ext === '.json' ? JSON.parse(contentString) : contentString.trim();
			return {key, content};
		}));
		const object = {__id__: id, __type__: type};
		objectFields.forEach(field => {
			object[field.key] = field.content;
		});
		return object;
	} catch (error) {
		logger.debug('Gitasdb read object error', error);
		return null;
	}
}
