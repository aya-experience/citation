import _ from 'lodash';
import {createAction, createReducer} from 'redux-act';
import {query, mutation} from './graphql-client';

// Temporary fixed model
const fields = {
	Page: ['slug', 'title', 'children {__id__}', 'component {__id__}'].join(', '),
	Component: ['type', 'children {__id__}', 'data {__id__, __type__}'].join(', '),
	Content: ['title', 'content'].join(', ')
};

export const loadObjectSuccess = createAction('load object success');

export function loadObject(type, id) {
	return dispatch => {
		return query(`{${type}(id: "${id}") {__id__, ${fields[type]}}}`)
			.then(response => dispatch(loadObjectSuccess({type, id, data: response.data[type][0]})));
	};
}

export function writeObject(type, data) {
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
			return `${key}: ${formatedData}`;
		});
	}

	return dispatch => {
		return mutation(`{edit${type}(${formatData(data)}) {${fields[type]}}}`)
			.then(response => dispatch(loadObjectSuccess({
				type,
				id: response.data.editObject.__id__,
				data: response.data.editObject
			})));
	};
}

export const reducer = createReducer({
	[loadObjectSuccess]: (state, payload) => ({
		...state,
		[payload.type]: {
			...state[payload.type],
			[payload.id]: payload.data
		}
	})
}, {});
