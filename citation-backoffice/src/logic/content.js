import { merge, get, isUndefined, fromPairs, mapValues } from 'lodash';
import { createAction, createReducer } from 'redux-act';

import data2query from '../utils/data2query';
import { query, mutation } from './graphql-client';

import { testTypeName } from '../utils/filters';

export const loadTypesSuccess = createAction('load types success');
export const loadObjectStarted = createAction('load object started');
export const loadObjectSuccess = createAction('load object success');

export function loadTypes(types) {
	return dispatch => {
		const queries = types.filter(testTypeName).map(type => `${type.name} {__id__}`);
		return query(`{${queries}}`).then(response => {
			const formatedData = mapValues(response.data, entries =>
				fromPairs(entries.map(entry => [entry.__id__, entry]))
			);
			return dispatch(loadTypesSuccess(formatedData));
		});
	};
}

export function generateTypes(fields) {
	const requiredFields = Object.keys(fields).map(field => {
		if (fields[field].kind === 'OBJECT' || fields[field].kind === 'LIST') {
			if (fields[field].ofType === 'KeyValuePair') {
				return `${field} {__key__, __value__ {__id__, __type__}, __list__ {__id__, __type__}}`;
			}
			if (fields[field].typeName === '*') {
				return `${field} {__id__, __type__}`;
			}
			return `${field} {__id__}`;
		}
		return `${field}`;
	});
	requiredFields.push('__id__');
	return requiredFields;
}

export function loadObject(type, id, fields) {
	const types = generateTypes(fields);
	return (dispatch, getState) => {
		const stateObject = get(getState(), `objects.${type}.${id}`);
		if (!isUndefined(stateObject)) {
			return;
		}
		dispatch(loadObjectStarted({ type, id }));
		return query(`{${type}(id: "${id}") {__id__, ${types.join(', ')}}}`).then(response =>
			dispatch(loadObjectSuccess({ type, id, data: response.data[type][0] }))
		);
	};
}

export function deleteObject(type, id) {
	mutation(`{delete${type}(${type.toLowerCase()}: {__id__: "${id}"}) {__id__, message}}`);
}

export function writeObject(type, id, data, fields) {
	const types = generateTypes(fields);
	return dispatch => {
		return mutation(
			`
			{edit${type}(${type.toLowerCase()}: {${data2query(id, data)}})
			{${types.join(', ')}}}
			`
		).then(response =>
			dispatch(
				loadObjectSuccess({
					type,
					id: response.data[`edit${type}`].__id__,
					data: response.data.editObject
				})
			)
		);
	};
}

export const reducer = createReducer(
	{
		[loadTypesSuccess]: (state, types) => merge({}, state, types),
		[loadObjectStarted]: (state, payload) => ({
			...state,
			[payload.type]: {
				...state[payload.type],
				[payload.id]: null
			}
		}),
		[loadObjectSuccess]: (state, payload) => ({
			...state,
			[payload.type]: {
				...state[payload.type],
				[payload.id]: payload.data
			}
		})
	},
	{}
);
