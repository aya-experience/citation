import path from 'path';
import _ from 'lodash';
import fs from 'mz/fs';

import {workingDirectory} from './constants';

export async function readCollection(type) {
	try {
		console.log('read collection', type);
		const collectionPath = path.resolve(workingDirectory, 'master', type);
		const collectionFolders = await fs.readdir(collectionPath);
		return await Promise.all(collectionFolders.map(folder => readObject(type, folder)));
	} catch (error) {
		console.error('Gitasdb read collection error', error);
		throw error;
	}
}

export async function readObject(type, id) {
	try {
		console.log('read object', type, id);
		const objectPath = path.resolve(workingDirectory, 'master', type, id);
		const objectFiles = await fs.readdir(objectPath);
		const objectFields = await Promise.all(objectFiles.map(async file => {
			const ext = path.extname(file);
			const key = path.basename(file, ext);
			const contentString = (await fs.readFile(path.resolve(objectPath, file))).toString();
			let content = ext === '.json' ? JSON.parse(contentString) : contentString.trim();
			if (key === 'component') {
				content = await readObject('components', content);
			}
			return {key, content};
		}));
		const object = {type, id};
		objectFields.forEach(field => {
			object[field.key] = field.content;
		});
		return object;
	} catch (error) {
		console.error('Gitasdb read object error', error);
		throw error;
	}
}
