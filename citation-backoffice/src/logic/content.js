import { merge, get, isObject, keys, fromPairs, mapValues } from 'lodash';
import { createAction, createReducer } from 'redux-act';

import data2query from '../utils/data2query';
import { query, mutation } from './graphql-client';

import { testTypeName } from '../utils/filters';
import fields2query from '../utils/fields2query';

export const loadTypesSuccess = createAction('load types success');
export const loadEntryStarted = createAction('load entry started');
export const loadEntrySuccess = createAction('load entry success');

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

export function loadEntry(type, id, fields) {
	return (dispatch, getState) => {
		const existingEntry = get(getState(), `content.${type}.${id}`);
		if (isObject(existingEntry) && keys(existingEntry).length > 1) {
			return;
		}
		dispatch(loadEntryStarted({ type, id }));
		return query(`{${type}(id: "${id}") {${fields2query(fields)}}}`).then(response =>
			dispatch(loadEntrySuccess({ type, id, data: response.data[type][0] }))
		);
	};
}

export function deleteEntry(type, id) {
	mutation(`{delete${type}(${type.toLowerCase()}: {__id__: "${id}"}) {__id__, message}}`);
}

export function writeEntry(type, id, data, fields) {
	return dispatch => {
		return mutation(
			`
			{edit${type}(${type.toLowerCase()}: {${data2query(id, data)}})
			{${fields2query(fields)}}}
			`
		).then(response =>
			dispatch(
				loadEntrySuccess({
					type,
					id: response.data[`edit${type}`].__id__,
					data: response.data[`edit${type}`]
				})
			)
		);
	};
}

export const reducer = createReducer(
	{
		[loadTypesSuccess]: (state, types) => merge({}, state, types),
		[loadEntryStarted]: (state, payload) => ({
			...state,
			[payload.type]: {
				...state[payload.type],
				[payload.id]: null
			}
		}),
		[loadEntrySuccess]: (state, payload) => ({
			...state,
			[payload.type]: {
				...state[payload.type],
				[payload.id]: payload.data
			}
		})
	},
	{}
);
