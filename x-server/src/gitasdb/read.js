import path from 'path';
import _ from 'lodash';
import fs from 'mz/fs';

import mergeDeep from 'merge-deep';

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
			if (content.__role__ === 'link') {
				const {collection, id} = content.link;
				content = await readObject(collection, id);
				const inspection = await inspectObject(collection, id);
				content.__tree__ = graphqlQuerySerialize(inspection);
			}
			if (content.__role__ === 'links') {
				content = await Promise.all(content.links.map(link => {
					const {collection, id} = link;
					return readObject(collection, id);
				}));
			}
			return {key, content};
		}));
		const object = {__id__: id, __type__: type};
		objectFields.forEach(field => {
			object[field.key] = field.content;
		});
		return object;
	} catch (error) {
		console.error('Gitasdb read object error', error);
		throw error;
	}
}

export async function inspectObject(type, id) {
	console.log('inspect object', type, id);
	const objectPath = path.resolve(workingDirectory, 'master', type, id);
	const objectFiles = await fs.readdir(objectPath);
	const objectFields = await Promise.all(objectFiles.map(async file => {
		const ext = path.extname(file);
		const key = path.basename(file, ext);
		if (ext === '.json') {
			const contentBuffer = await fs.readFile(path.resolve(objectPath, file));
			const content = JSON.parse(contentBuffer.toString());
			if (content.__role__ === 'link') {
				const {collection, id} = content.link;
				const inspection = await inspectObject(collection, id);
				return {[key]: inspection};
			}
			if (content.__role__ === 'links') {
				const linksInspection = await Promise.all(content.links.map(async link => {
					const {collection, id} = link;
					const inspection = await inspectObject(collection, id);
					return {[key]: {[`... on ${collection}`]: inspection}};
				}));
				return mergeDeep({}, ...linksInspection);
			}
		}
		return key;
	}));
	return objectFields;
}

export function graphqlQuerySerialize(query) {
	if (_.isArray(query)) {
		return `${query.map(graphqlQuerySerialize).join(', ')}`;
	}

	if (_.isObject(query)) {
		return _.map(query, (value, key) => {
			return `${key} {${graphqlQuerySerialize(value)}}`;
		}).join(', ');
	}

	return query;
}
