import { get, map, isArray, isObject, fromPairs, merge } from 'lodash';
import { createAction, createReducer } from 'redux-act';
import { query, mutation } from './graphql-client';

export const loadTypesSuccess = createAction('load schema success');
export const loadFieldsSuccess = createAction('load schema fields success');

export async function queryExistingTypes() {
	const response = await query(`{
		_schema {
			types {
				name
				kind
				fields {
					name
				}
			}
		}
	}`);

	return fromPairs(
		response.data._schema.types
			.filter(type => type.kind === 'OBJECT')
			.map(type => {
				type.fields = fromPairs(type.fields.map(field => [field.name, field]));
				return type;
			})
			.map(type => [type.name, type])
	);
}

export async function queryTypeFields(type) {
	const response = await query(`{
		_type(name: "${type}") {
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
		}
	}`);

	return fromPairs(
		response.data._type.fields.map(field => {
			return [
				field.name,
				{
					name: field.name,
					typeName: field.type.name ? field.type.name : field.name === 'children' ? type : '*',
					kind: field.type.kind,
					ofType: get(field.type, 'ofType.name')
				}
			];
		})
	);
}

export function loadTypes() {
	return dispatch => {
		return queryExistingTypes().then(response => dispatch(loadTypesSuccess(response)));
	};
}

export function loadTypeFields(type) {
	return dispatch => {
		return queryTypeFields(type).then(response =>
			dispatch(loadFieldsSuccess({ type, fields: response }))
		);
	};
}

export function writeSchema(schema) {
	function formatData(data) {
		return map(data, (value, key) => {
			let formatedData;
			if (isArray(value)) {
				if (key === 'type' && (value[0] === 'links' || value[0] === 'link')) {
					value = value.map(field => JSON.stringify(field));
					formatedData = `[${value.join(', ')}]`;
				} else {
					formatedData = `[${value.map(x => `{${formatData(x)}}`).join(', ')}]`;
				}
			} else if (isObject(value)) {
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

export const reducer = createReducer(
	{
		[loadTypesSuccess]: (state, types) => merge({}, state, types),
		[loadFieldsSuccess]: (state, { type, fields }) =>
			merge({}, state, {
				[type]: { fields }
			})
	},
	{}
);
