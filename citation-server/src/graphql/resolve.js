import { mapSeries } from 'bluebird';
import { isObject, isArray, toPairs } from 'lodash';

import { readType, readEntry } from '../gitasdb/read';
import { inspectEntry, graphqlQuerySerialize } from '../gitasdb/inspect';

export function read(type, id = null) {
	return id === null ? readType(type) : [readEntry(type, id)];
}

export async function inspect(root, modelTypes) {
	const inspection = await inspectEntry(root.__type__, root.__id__, modelTypes);
	return graphqlQuerySerialize(inspection);
}

export function readChildren(links, modelTypes) {
	if (!isObject(links)) {
		return null;
	}
	return Promise.all(
		links.links.filter(link => modelTypes.includes(link.type)).map(link => {
			const { type, id } = link;
			return readEntry(type, id);
		})
	);
}

export function readChild(link) {
	if (!isObject(link)) {
		return null;
	}
	const { type, id } = link.link;
	return readEntry(type, id);
}

export function readMap(map, modelTypes) {
	if (!isObject(map)) {
		return null;
	}
	return mapSeries(
		toPairs(map.map),
		pair =>
			isArray(pair[1])
				? {
						__key__: pair[0],
						__list__: readChildren({ links: pair[1] }, modelTypes)
					}
				: { __key__: pair[0], __value__: readChild({ link: pair[1] }) }
	);
}
