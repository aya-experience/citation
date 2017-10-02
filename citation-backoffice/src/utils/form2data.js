import { mapValues, fromPairs } from 'lodash';

function toLinkInput(input, type) {
	const link = input ? input : {};
	return {
		__role__: 'link',
		link: {
			type: type === '*' ? link.__type__ : type,
			id: link.__id__
		}
	};
}

function toLinksInput(inputs, type) {
	const links = inputs ? inputs : [];
	return {
		__role__: 'links',
		links: links.map(link => ({
			type: type === '*' ? link.__type__ : type,
			id: link.__id__
		}))
	};
}

function toKeyValueInput(inputPairs) {
	const pairs = inputPairs ? inputPairs : [];
	return {
		__role__: 'map',
		map: fromPairs(
			pairs.map(pair => [
				pair.__key__,
				pair.__value__ === null
					? pair.__list__.map(link => ({
							type: link.__type__,
							id: link.__id__
						}))
					: { type: pair.__value__.__type__, id: pair.__value__.__id__ }
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
