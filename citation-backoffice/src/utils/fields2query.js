import { map } from 'lodash';

export default function fields2query(fields) {
	return [
		'__id__',
		...map(fields, (field, fieldId) => {
			if (field.kind === 'OBJECT' || field.kind === 'LIST') {
				if (field.ofType === 'KeyValuePair') {
					return `${fieldId} {__key__, __value__ {__id__, __type__}, __list__ {__id__, __type__}}`;
				}
				if (field.typeName === '*') {
					return `${fieldId} {__id__, __type__}`;
				}
				return `${fieldId} {__id__}`;
			}
			return `${fieldId}`;
		})
	].join(',');
}
