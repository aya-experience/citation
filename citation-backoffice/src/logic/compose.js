import { createAction, createReducer } from 'redux-act';

import { query, mutation } from './graphql-client';
import data2query from './data2query';

export const loadPageSuccess = createAction('load page success');
export const loadComponentsSuccess = createAction('load components success');
export const editComponent = createAction('edit component');
// export const editComponentSuccess = createAction('edit component success');
export const removeComponent = createAction('remove component');
export const addChildComponent = createAction('add child component');
export const addChildComponentCommit = createAction('add child component commit');
export const sortChildComponent = createAction('sort child component');
export const saveComponentsSuccess = createAction('save components success');

const componentFields = `{
	__id__, type,
	children {__id__},
	props {__key__, __value__ {__id__, __type__}, __list__ {__id__, __type__}}
}`;

export const loadPage = id => dispatch => {
	const loadQuery = `{
		Page(id: "${id}") {
			__id__, slug, title
		}
	}`;
	return query(loadQuery).then(response => dispatch(loadPageSuccess(response.data.Page[0])));
};

export const loadComponents = () => dispatch => {
	const loadQuery = `{
		Component ${componentFields}
	}`;
	return query(loadQuery).then(response => dispatch(loadComponentsSuccess(response.data.Component)));
};

export const editComponentSave = (oldId, data) => dispatch => {
	const saveMutation = `{
		editComponent(component: {${data2query(oldId, data)}})
		${componentFields}
	}`;
	return mutation(saveMutation).then(response => dispatch(saveComponentsSuccess(response.data.Component)));
};

const reducer = createReducer(
	{
		[loadPageSuccess]: (state, page) => ({
			...state,
			page
		}),
		[loadComponentsSuccess]: (state, components) => ({
			...state,
			components
		}),
		[editComponent]: (state, { component, position }) => ({
			...state,
			edition: { component, position }
		}),
		[saveComponentsSuccess]: (state, oldId, component) => ({
			...state,
			edition: { component: null, position: null },
			components: [...state.components.filter(component => component.__id__ === oldId), component]
		})
	},
	{
		page: {},
		components: [],
		edition: { component: null, position: null }
	}
);

export default reducer;
