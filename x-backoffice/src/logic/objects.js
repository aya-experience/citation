import {createAction, createReducer} from 'redux-act';
import {query, mutation} from './graphql-client';

export const loadObjectSuccess = createAction('load object success');

export function loadObject(type, slug) {
	return dispatch => {
		return query(`{object(type: "${type}", slug: "${slug}") {title, content}}`)
			.then(response => dispatch(loadObjectSuccess({type, slug, data: response.data.object})));
	};
}

export function writeObject(type, slug, data) {
	return dispatch => {
		return mutation(`{editObject(
			type: "${type}",
			slug: "${slug}",
			title: "${data.title}",
			content: "${data.content}"
		) {title, content}}`)
			.then(response => dispatch(loadObjectSuccess({type, slug, data: response.data.editObject})));
	};
}

export const reducer = createReducer({
	[loadObjectSuccess]: (state, payload) => ({
		...state,
		[payload.type]: {
			...state[payload.type],
			[payload.slug]: payload.data
		}
	})
}, {});
