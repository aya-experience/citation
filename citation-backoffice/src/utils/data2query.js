import { isString, isObject, isArray, map } from 'lodash';

import { filterByKeys } from './objects';
import { testFieldName } from './filters';

function formatData(data) {
	return map(data, (value, key) => {
		let formatedData;
		if (isArray(value)) {
			formatedData = `[${value.map(x => `{${formatData(x)}}`).join(', ')}]`;
		} else if (isObject(value)) {
			formatedData = `{${formatData(value)}}`;
		} else {
			formatedData = JSON.stringify(value);
		}
		return `${key}: ${formatedData}`;
	});
}

export default function data2query(oldId, data) {
	const newId = data.__id__;
	const newData = filterByKeys(data, testFieldName);
	newData.__newId__ = newId;

	if (isString(oldId)) {
		newData.__id__ = oldId;
	}

	return formatData(newData).join(',');
}
