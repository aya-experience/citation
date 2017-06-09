import { mapSeries } from 'bluebird';
import { isObject, isArray, toPairs } from 'lodash';

import { readCollection, readObject } from '../gitasdb/read';
import { inspectObject, graphqlQuerySerialize } from '../gitasdb/inspect';

export function read(type, id = null) {
	return id === null ? readCollection(type) : [readObject(type, id)];
}

export async function inspect(root, modelTypes) {
	const inspection = await inspectObject(root.__type__, root.__id__, modelTypes);
	return graphqlQuerySerialize(inspection);
}

export function readChildren(links, modelTypes) {
	if (!isObject(links)) {
		return null;
	}
	return Promise.all(
		links.links.filter(link => modelTypes.includes(link.collection)).map(link => {
			const { collection, id } = link;
			return readObject(collection, id);
		})
	);
}

export function readChild(link) {
	if (!isObject(link)) {
		return null;
	}
	const { collection, id } = link.link;
	return readObject(collection, id);
}

export function readMap(map, modelTypes) {
	if (!isObject(map)) {
		return null;
	}
	return mapSeries(
		toPairs(map.map),
		pair =>
			isArray(pair[1])
				? { __key__: pair[0], __list__: readChildren({ links: pair[1] }, modelTypes) }
				: { __key__: pair[0], __value__: readChild({ link: pair[1] }) }
	);
}
