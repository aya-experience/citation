import {mapSeries} from 'bluebird';
import {isObject, isArray, toPairs} from 'lodash';

import {readCollection, readObject} from '../gitasdb/read';
import {inspectObject, graphqlQuerySerialize} from '../gitasdb/inspect';

export function read(type, id = null) {
	return id === null ? readCollection(type) : [readObject(type, id)];
}

export async function inspect(root) {
	const inspection = await inspectObject(root.__type__, root.__id__);
	return graphqlQuerySerialize(inspection);
}

export function readChildren(links) {
	if (!isObject(links)) {
		return null;
	}
	return Promise.all(links.links.map(link => {
		const {collection, id} = link;
		return readObject(collection, id);
	}));
}

export function readChild(link) {
	if (!isObject(link)) {
		return null;
	}
	const {collection, id} = link.link;
	return readObject(collection, id);
}

export function readMap(map) {
	if (!isObject(map)) {
		return null;
	}
	return mapSeries(
		toPairs(map.map),
		pair => isArray(pair[1]) ?
			{__key__: pair[0], __list__: readChildren({links: pair[1]})} :
			{__key__: pair[0], __value__: readChild({link: pair[1]})}
	);
}
