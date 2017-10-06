import { isArray, findIndex } from 'lodash';
import { createAction, createReducer } from 'redux-act';
import undoable, { includeAction, groupByActionTypes, ActionCreators } from 'redux-undo';

import { mutation, query } from './graphql-client';

export const loadPagesSuccess = createAction('load pages success');
export const savePagesSuccess = createAction('save pages success');
export const movePage = createAction('move page');
export const addPage = createAction('add page');
export const editPage = createAction('edit page');

export const loadPages = () => dispatch => {
	const loadQuery = `{
		Page {
			_id_, slug, title, position,
			children {_id_}
		}
	}`;
	return query(loadQuery).then(response => dispatch(loadPagesSuccess(response.data.Page)));
};

export const savePages = () => (dispatch, getState) => {
	const pagesToSave = getState().sitemap.present.pagesToSave;
	const mutationQuery = `{
		${pagesToSave.map(
			page => `${page._id_}: editPage(page: {
				_id_: "${page._id_}",
				${page.slug ? `slug: "${page.slug}",` : ''}
				title: "${page.title}",
				children: {
					_role_: "links",
					links: [${isArray(page.children)
						? page.children.map(
								child => `{
						collection: "Page",
						id: "${child._id_}"
					}`
							)
						: ''}]
				},
				position: {
					x: ${page.position.x},
					y: ${page.position.y}
				}
			}) {_id_}
		`
		)}
	}`;
	return mutation(mutationQuery).then(() => {
		dispatch(ActionCreators.clearHistory());
		dispatch(savePagesSuccess());
	});
};

const createId = pages => {
	let newId = 0;
	pages.forEach(page => {
		if (page._id_ === `newPage${newId}`) {
			newId++;
		}
	});
	return `newPage${newId}`;
};

const updatePage = (pages, pageId, newPage) => {
	const result = [...pages];
	const index = findIndex(result, page => page._id_ === pageId);
	result[index] = newPage;
	return result;
};

const addToSave = (pagesToSave, ...newPagesToSave) => {
	const result = pagesToSave.filter(
		page => newPagesToSave.filter(pageToSave => page._id_ === pageToSave._id_).length === 0
	);
	result.push(...newPagesToSave);
	return result;
};

const reducer = createReducer(
	{
		[loadPagesSuccess]: (state, pages) => ({
			...state,
			pages
		}),
		[movePage]: (state, { page, position }) => {
			const updatedPage = { ...page, position };
			return {
				...state,
				pages: updatePage(state.pages, page._id_, updatedPage),
				pagesToSave: addToSave(state.pagesToSave, updatedPage)
			};
		},
		[addPage]: (state, page) => {
			const newPage = {
				_id_: createId(state.pages),
				slug: 'slug',
				title: 'New Page',
				component: null,
				children: null
			};
			const parentPage = {
				...page,
				children: isArray(page.children) ? [...page.children, newPage] : [newPage]
			};
			return {
				...state,
				pages: [...updatePage(state.pages, page._id_, parentPage), newPage],
				pagesToSave: addToSave(state.pagesToSave, parentPage, newPage)
			};
		},
		[editPage]: (state, { oldPage, page }) => ({
			...state,
			pages: updatePage(state.pages, oldPage._id_, page),
			pagesToSave: addToSave(state.pagesToSave, page)
		}),
		[savePagesSuccess]: state => ({
			...state,
			pagesToSave: []
		})
	},
	{ pages: [], pagesToSave: [] }
);

export default undoable(reducer, {
	filter: includeAction([
		loadPagesSuccess.toString(),
		movePage.toString(),
		addPage.toString(),
		editPage.toString()
	]),
	groupBy: groupByActionTypes(movePage.toString())
});
