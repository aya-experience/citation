import path from 'path';

import fs from 'fs-extra';
import winston from 'winston';

import conf from '../conf';

const logger = winston.loggers.get('GitAsDb');

export async function readType(type) {
	try {
		logger.debug(`read type ${type}`);
		const typePath = path.resolve(conf.work.content, conf.content.branch, type);
		const typeFolders = await fs.readdir(typePath);
		return await Promise.all(typeFolders.map(folder => readEntry(type, folder)));
	} catch (error) {
		logger.debug('GitAsDb read type', error);
		return [];
	}
}

export async function readEntry(type, id) {
	if (id === 'undefined') {
		return null;
	}
	try {
		logger.debug(`read entry ${type} ${id}`);
		const entryPath = path.resolve(conf.work.content, conf.content.branch, type, id);
		const entryFiles = await fs.readdir(entryPath);
		const entryFields = await Promise.all(
			entryFiles.map(async file => {
				const ext = path.extname(file);
				const key = path.basename(file, ext);
				const contentString = (await fs.readFile(path.resolve(entryPath, file))).toString();
				const content = ext === '.json' ? JSON.parse(contentString) : contentString.trim();
				return { key, content };
			})
		);
		const entry = { _id_: id, _type_: type };
		entryFields.forEach(field => {
			entry[field.key] = field.content;
		});
		return entry;
	} catch (error) {
		logger.debug('GitAsDb read entry', error);
		return null;
	}
}
