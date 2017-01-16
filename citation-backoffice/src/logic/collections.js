import {createAction, createReducer} from 'redux-act';
import {query} from './graphql-client';

export const loadCollectionSuccess = createAction('load collection success');

export function loadCollection(type) {
	return dispatch => {
		return query(`{${type} {__id__}}`)
			.then(response => dispatch(loadCollectionSuccess({type, data: response.data[type]})));
	};
}

export const reducer = createReducer({
	[loadCollectionSuccess]: (state, payload) => ({
		...state,
		[payload.type]: payload.data
	})
}, {});
