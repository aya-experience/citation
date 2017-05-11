import _ from 'lodash';
import {createAction, createReducer} from 'redux-act';
import {query, mutation} from './graphql-client';

export const loadSchemaSuccess = createAction('load schema success');
export const loadSchemaFieldsSuccess = createAction('load schema fields success');
export const loadAllSchemaFieldsSuccess = createAction('load all schema fields success');

export async function queryExistingTypes() {
	return await query(`{
			__schema {
				types {
					name, kind
				}
			}
		}`);
}

export async function queryCustomTypes(type) {
	const result = {};
	const types = await query(`{
		__type(name: "${type}") {
				name
				fields {
					name
					type {
						name
						kind
					}
				}
			}
		}`);
	types.data.__type.fields.forEach(field => {
		result[field.name] = {};
		result[field.name].typeName = field.type.name ? field.type.name : (field.name === 'children' ? type : '*');
		result[field.name].kind = field.type.kind;
	});
	return result;
}

async function askTypes() {
	const existingTypes = await queryExistingTypes();
	const objectNames = [];
	Object.keys(existingTypes.data.__schema.types).forEach(key => {
		const field = existingTypes.data.__schema.types[key];
		if (field.kind === 'OBJECT' && field.name !== 'Query' && field.name !== 'Mutation' && !/^__/.test(field.name)) {
			objectNames.push(field.name);
		}
	});
	return objectNames;
}

export function loadSchema() {
	return dispatch => {
		return askTypes()
		.then(response => {
			dispatch(loadSchemaSuccess({data: response}));
		});
	};
}

export function loadSchemaFields(type) {
	return dispatch => {
		return queryCustomTypes(type)
		.then(response => {
			dispatch(loadSchemaFieldsSuccess({data: response}));
		});
	};
}

export function loadAllSchemaFields(type) {
	return dispatch => {
		return queryCustomTypes(type)
		.then(response => {
			dispatch(loadAllSchemaFieldsSuccess({type, data: response}));
		});
	};
}

export function writeSchema(schema) {
	console.log(schema);
	function formatData(data) {
		return _.map(data, (value, key) => {
			let formatedData;
			if (_.isArray(value)) {
				if (key === 'type' && (value[0] === 'links' || value[0] === 'link')) {
					value = value.map(field => JSON.stringify(field));
					formatedData = `[${value.join(', ')}]`;
				} else {
					formatedData = `[${value.map(x => `{${formatData(x)}}`).join(', ')}]`;
				}
			} else if (_.isObject(value)) {
				formatedData = `{${formatData(value)}}`;
			} else {
				formatedData = JSON.stringify(value);
			}
			return `${key}: ${formatedData}`;
		});
	}
	console.log(`{editSchema(${formatData(schema)}) {name}}`);
	return dispatch => {
		return mutation(`{editSchema(${formatData(schema)}) {name}}`)
			.then(response => console.log(response));
	};
}

export const allFieldsReducer = createReducer({
	[loadAllSchemaFieldsSuccess]: (state, payload) => ({
		...state,
		[payload.type]: payload.data
	})
}, {});

export const schemaReducer = createReducer({
	[loadSchemaSuccess]: (state, payload) => ({
		...state,
		data: payload.data
	})
}, {});

export const fieldsReducer = createReducer({
	[loadSchemaFieldsSuccess]: (state, payload) => ({
		...state,
		data: payload.data
	})
}, {});
