import _ from 'lodash';
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
		const objectFilesAndDirectories = await fs.readdir(objectPath);
		const objectFieldsAndChildren = await Promise.all(objectFilesAndDirectories.map(async file => {
			const stats = await fs.stat(path.join(objectPath, file));
			if (stats.isFile()) {
				return {
					type: 'object',
					key: path.basename(file, path.extname(file)),
					content: (await fs.readFile(path.resolve(objectPath, file))).toString()
				};
			}
			return {
				type: 'child',
				key: file
			};
		}));
		const [objectFields, objectChildren] = _.partition(objectFieldsAndChildren, element => element.type === 'object');

		const object = {};
		objectFields.forEach(field => {
			object[field.key] = field.content;
		});
		object.children = await Promise.all(objectChildren.map(child => readObject(type, path.join(slug, child.key))));
		return object;
	} catch (error) {
		console.error('Gitasdb read object error', error);
		throw error;
	}
}
