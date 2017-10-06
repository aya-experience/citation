import { mapValues, fromPairs } from 'lodash';

function toLinkInput(input, type) {
	const link = input ? input : {};
	return {
		_role_: 'link',
		link: {
			type: type === '*' ? link._type_ : type,
			id: link._id_
		}
	};
}

function toLinksInput(inputs, type) {
	const links = inputs ? inputs : [];
	return {
		_role_: 'links',
		links: links.map(link => ({
			type: type === '*' ? link._type_ : type,
			id: link._id_
		}))
	};
}

function toKeyValueInput(inputPairs) {
	const pairs = inputPairs ? inputPairs : [];
	return {
		_role_: 'map',
		map: fromPairs(
			pairs.map(pair => [
				pair._key_,
				pair._value_ === null
					? pair._list_.map(link => ({
							type: link._type_,
							id: link._id_
						}))
					: { type: pair._value_._type_, id: pair._value_._id_ }
			])
		)
	};
}

export default function form2data(values, fields) {
	return mapValues(values, (value, key) => {
		const field = fields[key];
		if (field) {
			if (field.ofType === 'KeyValuePair') {
				return toKeyValueInput(value);
			} else if (field.kind === 'LIST') {
				return toLinksInput(value, field.typeName);
			} else if (field.kind === 'OBJECT') {
				return toLinkInput(value, field.typeName);
			}
		}
		return value ? value : '';
	});
}
