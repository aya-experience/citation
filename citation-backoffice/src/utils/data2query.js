import { isString, isObject, isArray, map } from 'lodash';

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
	data.__newId__ = data.__id__;
	if (isString(oldId)) {
		data.__id__ = oldId;
	} else {
		delete data.__id__;
	}
	return formatData(data);
}
