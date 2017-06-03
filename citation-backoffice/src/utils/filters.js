import _ from 'lodash';

const reservedSchema = ['Query', 'Mutation', 'Schema'];
const reservedSchemaNames = ['Page', 'Component', 'Content', 'Schema', 'KeyValuePair'];
const nameRegex = /^__(?!value).*__$/;

export function filterFields(values, reservedNames) {
	const response = {};
	Object.keys(values).filter(type => !reservedNames.includes(type)).map(type => {
		response[type] = {};
		return Object.keys(values[type]).filter(field => !nameRegex.test(field)).map(field => {
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
	return nameRegex.test(name);
}

export function filterSchemaFields(values) {
	if (!values || _.isEmpty(values)) {
		return values;
	}
	return filterFields(values, reservedSchemaNames);
}

export function filterObjectFields(values) {
	if (!values || _.isEmpty(values)) {
		return values;
	}
	return filterFields(values, []);
}
