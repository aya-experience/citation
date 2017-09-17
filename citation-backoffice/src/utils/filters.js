import { keys, isEmpty, toPairs, fromPairs } from 'lodash';

const reservedSchema = ['Query', 'Mutation', 'Schema', 'KeyValuePair'];
const reservedSchemaNames = ['Page', 'Component', 'Schema', 'KeyValuePair'];
const editableSchemaName = ['Page', 'Component', 'Schema'];

const nameRegex = /^__(?!value).*__$/;
const typeRegex = /^__/;

export function testTypeName(type) {
	return !typeRegex.test(type.name) && !reservedSchema.includes(type.name);
}

export function testEditableName(type) {
	return testTypeName(type) && !editableSchemaName.includes(type.name);
}

export function testFieldName(field) {
	return !nameRegex.test(field.name);
}

export function filterSchemaEditable(values) {
	const pairs = toPairs(values);
	const filteredPairs = pairs.filter(([key]) => !editableSchemaName.includes(key));
	return fromPairs(filteredPairs);
}

export function filterFields(values, reservedNames) {
	const response = {};
	keys(values)
		.filter(type => !reservedNames.includes(type))
		.map(type => {
			response[type] = {};
			return Object.keys(values[type])
				.filter(field => !nameRegex.test(field))
				.map(field => {
					response[type][field] = values[type][field];
					return response;
				});
		});
	return response;
}

export function filterSchemaNames(name) {
	return !reservedSchema.includes(name) && !regexNames(name);
}

export function regexNames(name) {
	return typeRegex.test(name);
}

export function filterSchemaFields(values) {
	if (!values || isEmpty(values)) {
		return values;
	}
	return filterFields(values, reservedSchemaNames);
}

export function filterObjectFields(values) {
	if (!values || isEmpty(values)) {
		return values;
	}
	return filterFields(values, []);
}
