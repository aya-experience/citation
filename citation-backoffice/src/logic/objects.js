import _ from 'lodash';
import {createAction, createReducer} from 'redux-act';
import {query, mutation} from './graphql-client';

export const loadObjectStarted = createAction('load object started');
export const loadObjectSuccess = createAction('load object success');

export function generateTypes(fields) {
	const requiredFields = Object.keys(fields).map(field => {
		if (fields[field].kind === 'OBJECT' || fields[field].kind === 'LIST') {
			if (fields[field].typeName === '*') {
				return (`${field} {__id__, __type__}`);
			}
			return (`${field} {__id__}`);
		}
		return (`${field}`);
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
		dispatch(loadObjectStarted({type, id}));
		return query(`{${type}(id: "${id}") {__id__, ${types.join(', ')}}}`)
			.then(response => dispatch(loadObjectSuccess({type, id, data: response.data[type][0]})));
	};
}

export function writeObject(type, id, data, fields) {
	function formatData(data) {
		return _.map(data, (value, key) => {
			let formatedData;
			if (_.isArray(value)) {
				formatedData = `[${value.map(x => `{${formatData(x)}}`).join(', ')}]`;
			} else if (_.isObject(value)) {
				formatedData = `{${formatData(value)}}`;
			} else {
				formatedData = JSON.stringify(value);
			}
			return key === type ? `${key.toLowerCase()}: ${formatedData}` : `${key}: ${formatedData}`;
		});
	}
	data[type].__newId__ = data[type].__id__;
	if (id) {
		data[type].__id__ = id;
	} else {
		delete data[type].__id__;
	}
	const types = generateTypes(fields[type]);
	return dispatch => {
		return mutation(`{edit${type}(${formatData(data)}) {${types.join(', ')}}}`)
			.then(response => dispatch(loadObjectSuccess({
				type,
				id: response.data[`edit${type}`].__id__,
				data: response.data.editObject
			}))
		);
	};
}

export const reducer = createReducer({
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
}, {});
