import { createAction, createReducer } from 'redux-act';
import _ from 'lodash';
import { query } from './graphql-client';

export const loadCollectionSuccess = createAction('load collection success');

export function loadCollection(type) {
	return dispatch => {
		const types = type.map(field => `${field} {__id__}`);
		return query(`{${types}}`).then(response =>
			Object.keys(response.data).map(field =>
				dispatch(loadCollectionSuccess({ type: field, data: response.data[field] }))
			)
		);
	};
}

export const reducer = createReducer(
	{
		[loadCollectionSuccess]: (state, payload) => ({
			...state,
			[payload.type]: payload.data
		})
	},
	{}
);
