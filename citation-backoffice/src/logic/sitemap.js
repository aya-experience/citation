import { createAction, createReducer } from 'redux-act';
import { queries } from 'citation-react-router';

import { serverUrl } from './graphql-client';

export const loadPagesSuccess = createAction('load pages success');
export const movePage = createAction('move page');
export const addPage = createAction('add page');

export function loadPages() {
	return dispatch => {
		return queries.queryPages(serverUrl).then(pages => dispatch(loadPagesSuccess(pages)));
	};
}

const updatePage = (pages, pageToUpdate = null, update = () => {}) =>
	pages.map(page => ({
		...(page === pageToUpdate ? update(page) : page),
		children: page.children === null ? null : updatePage(page.children, pageToUpdate, update)
	}));

export const reducer = createReducer(
	{
		[loadPagesSuccess]: (state, payload) => ({
			...state,
			pages: updatePage(payload)
		}),
		[movePage]: (state, { page, position }) => ({
			...state,
			pages: updatePage(state.pages, page, page => {
				page.position = position;
				return page;
			})
		}),
		[addPage]: (state, page) => ({
			...state,
			pages: updatePage(state.pages, page, page => {
				if (page.children === null) {
					page.children = [];
				}
				page.children.push({
					__id__: 'slug',
					slug: 'slug',
					title: 'New Page',
					component: null,
					children: null
				});
				return page;
			})
		})
	},
	{ pages: [] }
);
