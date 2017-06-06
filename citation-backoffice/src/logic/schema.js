import _ from 'lodash';
import { createAction, createReducer } from 'redux-act';
import { query, mutation } from './graphql-client';

import { filterSchemaNames } from './../utils/filters';

export const loadSchemaSuccess = createAction('load schema success');
export const loadSchemaFieldsSuccess = createAction('load schema fields success');

export async function queryExistingTypes() {
	return await query(`{
			__schema {
				types {
					name, kind
				}
			}
		}`);
}

export async function queryCustomTypes(types) {
	const result = {};
	const request = types.map(
		type => `
		${type}: __type(name: "${type}") {
				name
				fields {
					name
					type {
						name
						kind
						ofType {
							name
							kind
						}
					}
				}
			}`
	);
	const returnedTypes = await query(`{
			${request.join(', ')}
		}`);
	Object.keys(returnedTypes.data).map(returnedType => {
		result[returnedType] = {};
		return returnedTypes.data[returnedType].fields.map(field => {
			result[returnedType][field.name] = {
				typeName: field.type.name ? field.type.name : field.name === 'children' ? returnedType : '*',
				kind: field.type.kind,
				ofType: _.get(field.type, 'ofType.name')
			};
			return result[field.name];
		});
	});
	return result;
}

export async function askTypes() {
	const existingTypes = await queryExistingTypes();
	const objectNames = [];
	Object.keys(existingTypes.data.__schema.types).forEach(key => {
		const field = existingTypes.data.__schema.types[key];
		if (field.kind === 'OBJECT' && filterSchemaNames(field.name)) {
			objectNames.push(field.name);
		}
	});
	return objectNames;
}

export function loadSchema() {
	return dispatch => {
		return askTypes().then(response => dispatch(loadSchemaSuccess({ data: response })));
	};
}

export function loadSchemaFields(type) {
	return dispatch => {
		return queryCustomTypes(type).then(response => dispatch(loadSchemaFieldsSuccess({ data: response })));
	};
}

export function writeSchema(schema) {
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
	return () => {
		return mutation(`{editSchema(${formatData(schema)}) {name}}`);
	};
}

export const schemaReducer = createReducer(
	{
		[loadSchemaSuccess]: (state, payload) => ({
			...state,
			data: payload.data
		})
	},
	{}
);

export const fieldsReducer = createReducer(
	{
		[loadSchemaFieldsSuccess]: (state, payload) => ({
			...state,
			...payload.data
		})
	},
	{}
);
