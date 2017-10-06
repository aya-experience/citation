import { map } from 'lodash';

export default function fields2query(fields) {
	return [
		'_id_',
		...map(fields, (field, fieldId) => {
			if (field.kind === 'OBJECT' || field.kind === 'LIST') {
				if (field.ofType === 'KeyValuePair') {
					return `${fieldId} {_key_, _value_ {_id_, _type_}, _list_ {_id_, _type_}}`;
				}
				if (field.typeName === '*') {
					return `${fieldId} {_id_, _type_}`;
				}
				return `${fieldId} {_id_}`;
			}
			return `${fieldId}`;
		})
	].join(',');
}
