import _ from 'lodash';
import {createAction, createReducer} from 'redux-act';
import {query, mutation} from './graphql-client';

// Temporary fixed model
const fields = {
	Page: ['__id__', 'slug', 'title', 'children {__id__}', 'component {__id__}'].join(', '),
	Component: ['type', 'children {__id__}', 'data {__id__, __type__}'].join(', '),
	Content: ['title', 'content'].join(', ')
};

export const loadObjectStarted = createAction('load object started');
export const loadObjectSuccess = createAction('load object success');

export function loadObject(type, id) {
	return (dispatch, getState) => {
		const stateObject = _.get(getState(), `objects.${type}.${id}`);
		if (!_.isUndefined(stateObject)) {
			return;
		}

		dispatch(loadObjectStarted({type, id}));
		return query(`{${type}(id: "${id}") {__id__, ${fields[type]}}}`)
			.then(response => dispatch(loadObjectSuccess({type, id, data: response.data[type][0]})));
	};
}

export function writeObject(type, id, data) {
	const subType = type.toLowerCase();
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
	data[subType].__newId__ = data[subType].__id__;
	data[subType].__id__ = id;
	return dispatch => {
		return mutation(`{edit${type}(${formatData(data)}) {${fields[type]}}}`)
			.then(response => {
				dispatch(loadObjectSuccess({
					type,
					id: response.data[`edit${type}`].__id__,
					data: response.data.editObject
				}));
			});
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
