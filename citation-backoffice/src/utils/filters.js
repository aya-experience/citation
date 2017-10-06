const reservedSchema = ['Query', 'Mutation', 'Schema', 'KeyValuePair'];
const editableSchemaName = ['Page', 'Component', 'Schema'];

const nameRegex = /^_(?!value).*_$/;
const typeRegex = /^_/;

export function testTypeName(type) {
	return !typeRegex.test(type.name) && !reservedSchema.includes(type.name);
}

export function testEditableName(type) {
	return testTypeName(type) && !editableSchemaName.includes(type.name);
}

export function testFieldName(field) {
	return !nameRegex.test(field.name);
}
