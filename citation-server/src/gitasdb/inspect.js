import path from 'path';

import _, { isArray, isObject, partition, values } from 'lodash';
import mergeDeep from 'merge-deep';
import fs from 'fs-extra';
import winston from 'winston';

import conf from '../conf';

const logger = winston.loggers.get('GitAsDb');

function linkIsValid(link, stack, modelTypes) {
	if (!modelTypes.includes(link.type)) {
		return true;
	}
	return (
		stack.filter(stackLink => stackLink.type === link.type && stackLink.id === link.id).length > 0
	);
}

async function inspectLink(link, stack, modelTypes) {
	if (linkIsValid(link, stack, modelTypes)) {
		return {};
	}
	const { type, id } = link;
	return inspectEntry(type, id, modelTypes, [...stack, link]);
}

async function inspectLinks(links, stack, modelTypes) {
	const inspections = await Promise.all(
		links.map(async link => {
			const inspection = await inspectLink(link, stack, modelTypes);
			return { [`... on ${link.type}`]: inspection };
		})
	);
	return mergeDeep({}, ...inspections);
}

async function inspectMap(map, stack, modelTypes) {
	const [listOfLinks, listOfLink] = partition(values(map), isArray);
	const linksInspections = await Promise.all(
		listOfLinks.map(async links => inspectLinks(links, stack, modelTypes))
	);
	const linkInspections = await Promise.all(
		listOfLink.map(async link => {
			const inspection = await inspectLink(link, stack, modelTypes);
			return { [`... on ${link.type}`]: inspection };
		})
	);
	return {
		_value_: mergeDeep({}, ...linkInspections),
		_list_: mergeDeep({}, ...linksInspections)
	};
}

export async function inspectEntry(type, id, modelTypes, stack = []) {
	try {
		logger.debug(`inspect entry ${type} ${id}`);
		const entryPath = path.resolve(conf.work.content, conf.content.branch, type, id);
		const entryFiles = await fs.readdir(entryPath);
		const entryFields = [
			'_id_',
			...(await Promise.all(
				entryFiles.map(async file => {
					const ext = path.extname(file);
					const key = path.basename(file, ext);
					if (ext === '.json') {
						const contentBuffer = await fs.readFile(path.resolve(entryPath, file));
						const content = JSON.parse(contentBuffer.toString());
						if (content._role_ === 'link') {
							return {
								[key]: await inspectLink(content.link, stack, modelTypes)
							};
						}
						if (content._role_ === 'links') {
							return {
								[key]: await inspectLinks(content.links, stack, modelTypes)
							};
						}
						if (content._role_ === 'map') {
							return {
								[key]: ['_key_', await inspectMap(content.map, stack, modelTypes)]
							};
						}
					}
					return key;
				})
			))
		];
		return entryFields.filter(x => !_.isEmpty(x));
	} catch (error) {
		logger.debug(`Gitasdb inspect error ${error}`);
		return [];
	}
}

export function graphqlQuerySerialize(query) {
	try {
		if (isArray(query)) {
			return query
				.map(graphqlQuerySerialize)
				.filter(value => value !== '')
				.join(', ');
		}

		if (isObject(query)) {
			return _(query)
				.map((value, key) => {
					const serialize = graphqlQuerySerialize(value);
					return serialize === '' ? '' : `${key} {${serialize}}`;
				})
				.filter(value => value !== '')
				.join(', ');
		}
		return query;
	} catch (error) {
		logger.error(`Gitasdb GraphQL Query Serialize error ${error}`);
		throw error;
	}
}
