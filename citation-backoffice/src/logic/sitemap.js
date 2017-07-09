import { isArray, findIndex } from 'lodash';
import { createAction, createReducer } from 'redux-act';
import undoable, { includeAction, groupByActionTypes, ActionCreators } from 'redux-undo';

import { mutation, query } from './graphql-client';

export const loadPagesSuccess = createAction('load pages success');
export const savePagesSuccess = createAction('save pages success');
export const movePage = createAction('move page');
export const addPage = createAction('add page');
export const editPage = createAction('edit page');
export const editPageCommit = createAction('edit page commit');

export const loadPages = () => dispatch => {
	const loadQuery = `{
		Page {
			__id__, slug, title, position,
			children {__id__}
		}
	}`;
	return query(loadQuery).then(response => dispatch(loadPagesSuccess(response.data.Page)));
};

export const savePages = () => (dispatch, getState) => {
	const pagesToSave = getState().sitemap.present.pagesToSave;
	const mutationQuery = `{
		${pagesToSave.map(
			page => `${page.__id__}: editPage(page: {
				__id__: "${page.__id__}",
				${page.slug ? `slug: "${page.slug}",` : ''}
				title: "${page.title}",
				children: {
					__role__: "links",
					links: [${isArray(page.children)
						? page.children.map(
								child => `{
						collection: "Page",
						id: "${child.__id__}"
					}`
							)
						: ''}]
				},
				position: {
					x: ${page.position.x},
					y: ${page.position.y}
				}
			}) {__id__}
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
		if (page.__id__ === `newPage${newId}`) {
			newId++;
		}
	});
	return `newPage${newId}`;
};

const updatePage = (pages, pageId, newPage) => {
	const result = [...pages];
	const index = findIndex(result, page => page.__id__ === pageId);
	result[index] = newPage;
	return result;
};

const addToSave = (pagesToSave, ...newPagesToSave) => {
	const result = pagesToSave.filter(
		page => newPagesToSave.filter(pageToSave => page.__id__ === pageToSave.__id__).length === 0
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
				pages: updatePage(state.pages, page.__id__, updatedPage),
				pagesToSave: addToSave(state.pagesToSave, updatedPage)
			};
		},
		[addPage]: (state, page) => {
			const newPage = {
				__id__: createId(state.pages),
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
				pages: [...updatePage(state.pages, page.__id__, parentPage), newPage],
				pagesToSave: addToSave(state.pagesToSave, parentPage, newPage)
			};
		},
		[editPage]: (state, { page, position }) => ({
			...state,
			edition: { page, position }
		}),
		[editPageCommit]: (state, { oldPage, page }) => ({
			...state,
			pages: updatePage(state.pages, oldPage.__id__, page),
			pagesToSave: addToSave(state.pagesToSave, page)
		}),
		[savePagesSuccess]: state => ({
			...state,
			pagesToSave: []
		})
	},
	{ pages: [], edition: { page: null, position: null }, pagesToSave: [] }
);

export default undoable(reducer, {
	filter: includeAction([
		loadPagesSuccess.toString(),
		movePage.toString(),
		addPage.toString(),
		editPageCommit.toString()
	]),
	groupBy: groupByActionTypes(movePage.toString())
});
