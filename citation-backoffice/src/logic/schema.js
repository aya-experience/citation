import {createAction, createReducer} from 'redux-act';
import {query} from './graphql-client';

export const loadSchemaSuccess = createAction('load schema success');
export const loadSchemaFieldsSuccess = createAction('load schema fieds success');

export async function queryExistingTypes() {
	return query(`{
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
	return queryExistingTypes().then(response => {
		const objectNames = [];
		Object.keys(response.data.__schema.types).forEach(key => {
			const field = response.data.__schema.types[key];
			if (field.kind === 'OBJECT' && field.name !== 'Query' && field.name !== 'Mutation' && !field.name.startsWith('__')) {
				objectNames.push(field.name);
			}
		});
		return objectNames;
	});
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
