import path from 'path';
import fs from 'mz/fs';

import {workingDirectory} from './constants';

export async function readCollection(type) {
	try {
		const collectionPath = path.resolve(workingDirectory, 'master', type);
		const collectionFolders = await fs.readdir(collectionPath);
		console.log('read collection', type);
		return collectionFolders;
	} catch (error) {
		console.error('Gitasdb read collection error', error);
		throw error;
	}
}

export async function readObject(type, slug) {
	try {
		const objectPath = path.resolve(workingDirectory, 'master', type, slug);
		const objectFiles = await fs.readdir(objectPath);
		const objectFields = await Promise.all(objectFiles.map(async file => {
			return {
				key: path.basename(file, path.extname(file)),
				content: (await fs.readFile(path.resolve(objectPath, file))).toString()
			};
		}));
		const object = {};
		objectFields.forEach(field => {
			object[field.key] = field.content;
		});
		return object;
	} catch (error) {
		console.error('Gitasdb read object error', error);
		throw error;
	}
}
