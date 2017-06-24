import { createAction, createReducer } from 'redux-act';
import { queries } from 'citation-react-router';

import { serverUrl } from './graphql-client';

export const loadPagesSuccess = createAction('load pages success');
export const movePage = createAction('move page');

export function loadPages() {
	return dispatch => {
		return queries.queryPages(serverUrl).then(pages => dispatch(loadPagesSuccess(pages)));
	};
}

const updatePagePosition = (pages, pageToMove, position) => {
	return pages.map(page => ({
		...page,
		children: page.children === null ? null : updatePagePosition(page.children, pageToMove, position),
		position: page === pageToMove ? position : page.position
	}));
};

export const reducer = createReducer(
	{
		[loadPagesSuccess]: (state, payload) => ({
			...state,
			pages: updatePagePosition(payload, null, null)
		}),
		[movePage]: (state, { page, position }) => ({
			...state,
			pages: updatePagePosition(state.pages, page, position)
		})
	},
	{ pages: [] }
);
