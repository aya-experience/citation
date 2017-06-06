import path from 'path';

import _, { isArray, isObject, values } from 'lodash';
import fs from 'fs-promise';
import mergeDeep from 'merge-deep';
import winston from 'winston';

import conf from '../conf';
import {getTypesNames} from '../graphql/model';

const logger = winston.loggers.get('GitAsDb');

let modelTypes;

function includesLink(stack, link) {
	if (!modelTypes.includes(link.collection)) {
		return true;
	}
	return stack.filter(stackLink => stackLink.collection === link.collection && stackLink.id === link.id).length > 0;
}

export async function inspectObject(type, id, stack = []) {
	modelTypes = await getTypesNames();
	try {
		logger.debug(`inspect object ${type} ${id}`);
		const objectPath = path.resolve(conf.work.content, conf.content.branch, type, id);
		const objectFiles = await fs.readdir(objectPath);
		const objectFields = await Promise.all(
			objectFiles.map(async file => {
				const ext = path.extname(file);
				const key = path.basename(file, ext);
				if (ext === '.json') {
					const contentBuffer = await fs.readFile(path.resolve(objectPath, file));
					const content = JSON.parse(contentBuffer.toString());
					if (content.__role__ === 'link') {
						if (includesLink(stack, content.link)) {
							return;
						}
						const { collection, id } = content.link;
						const inspection = await inspectObject(collection, id, [...stack, content.link]);
						return { [key]: inspection };
					}
					if (content.__role__ === 'links') {
						const linksInspection = await Promise.all(
							content.links.filter(link => !includesLink(stack, link)).map(async link => {
								const { collection, id } = link;
								const inspection = await inspectObject(collection, id, [...stack, link]);
								return { [key]: { [`... on ${collection}`]: inspection } };
							})
						);
						return mergeDeep({}, ...linksInspection);
					}
					if (content.__role__ === 'map') {
						const __value__ = await Promise.all(
							values(content.map).filter(link => !includesLink(stack, link)).map(async link => {
								const { collection, id } = link;
								const inspection = await inspectObject(collection, id, [...stack, link]);
								return { [`... on ${collection}`]: inspection };
							})
						);
						return { [key]: ['__key__', { __value__ }] };
					}
				}
				return key;
			})
		);
		return objectFields.filter(x => !_.isEmpty(x));
	} catch (error) {
		logger.debug(`Gitasdb inspect error ${error}`);
		return [];
	}
}

export function graphqlQuerySerialize(query) {
	try {
		if (isArray(query)) {
			return `${query.map(graphqlQuerySerialize).join(', ')}`;
		}

		if (isObject(query)) {
			return _(query)
				.pickBy(value => !_.isEmpty(value))
				.map((value, key) => `${key} {${graphqlQuerySerialize(value)}}`)
				.join(', ');
		}

		return query;
	} catch (error) {
		logger.error(`Gitasdb GraphQL Query Serialize error ${error}`);
		throw error;
	}
}
