import _ from 'lodash';
import { createAction, createReducer } from 'redux-act';

import data2query from '../utils/data2query';
import { query, mutation } from './graphql-client';

export const loadObjectStarted = createAction('load object started');
export const loadObjectSuccess = createAction('load object success');

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
	const types = generateTypes(fields[type]);
	return (dispatch, getState) => {
		const stateObject = _.get(getState(), `objects.${type}.${id}`);
		if (!_.isUndefined(stateObject)) {
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
	const types = generateTypes(fields[type]);
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
