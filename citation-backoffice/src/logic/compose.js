import { isArray } from 'lodash';
import { createAction, createReducer } from 'redux-act';

import form2data from '../components/forms/form2data';
import { query, mutation } from './graphql-client';
import data2query from './data2query';

export const loadPageSuccess = createAction('load page success');
export const loadComponentsSuccess = createAction('load components success');
export const editComponent = createAction('edit component');
export const editComponentSuccess = createAction('edit component success');
export const addComponent = createAction('add component');
export const addComponentSuccess = createAction('add component success');
export const removeComponentSuccess = createAction('remove component success');
export const sortComponentsSuccess = createAction('sort components success');

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

export const editComponentSave = component => (dispatch, getState) => {
	const oldId = getState().compose.edition.component.__id__;
	const saveMutation = `{
		editComponent(component: {${data2query(oldId, component)}})
		${componentFields}
	}`;
	return mutation(saveMutation).then(response =>
		dispatch(
			editComponentSuccess({
				oldId,
				component: response.data.Component
			})
		)
	);
};

export const addComponentSave = component => (dispatch, getState) => {
	const parent = getState().compose.edition.parent;
	const fields = getState().fields.Component;
	if (!isArray(parent.children)) {
		parent.children = [];
	}
	parent.children.push({ __id__: component.__id__ });
	const parentData = form2data(parent, fields);
	const saveMutation = `{
		component: editComponent(component: {${data2query(component.__id__, component)}})
		${componentFields}
		parent: editComponent(component: {${data2query(parent.__id__, parentData)}})
		${componentFields}
	}`;
	return mutation(saveMutation).then(response =>
		dispatch(
			addComponentSuccess({
				component: response.data.component,
				parent: response.data.parent
			})
		)
	);
};

export const removeComponentSave = ({ parent, component }) => (dispatch, getState) => {
	parent.children = parent.children.filter(child => child.__id__ !== component.__id__);
	const fields = getState().fields.Component;
	const parentData = form2data(parent, fields);
	const componentData = form2data(component, fields);
	const saveMutation = `{
		editComponent(component: {${data2query(parent.__id__, parentData)}})
		${componentFields}
		deleteComponent(component: {${data2query(component.__id__, componentData)}})
		{__id__, message}
	}`;
	return mutation(saveMutation).then(response =>
		dispatch(
			removeComponentSuccess({
				parent: response.data.editComponent,
				component: response.data.deleteComponent
			})
		)
	);
};

export const sortComponentSave = ({ parent, oldIndex, newIndex }) => (dispatch, getState) => {
	const children = [...parent.children];
	const temp = children[oldIndex];
	children[oldIndex] = children[newIndex];
	children[newIndex] = temp;
	parent.children = children;
	const fields = getState().fields.Component;
	const parentData = form2data(parent, fields);
	const saveMutation = `{
		editComponent(component: {${data2query(parent.__id__, parentData)}})
		${componentFields}
	}`;
	return mutation(saveMutation).then(response => dispatch(sortComponentsSuccess(response.data.editComponent)));
};

function updateComponents(components, removeIds, additions) {
	return [...components.filter(component => removeIds.includes(component.__id__)), ...additions];
}

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
			edition: { component, position, parent: null }
		}),
		[editComponentSuccess]: (state, { oldId, component }) => ({
			...state,
			edition: { component: null, position: null, parent: null },
			components: updateComponents(state.components, [oldId], [component])
		}),
		[addComponent]: (state, { parent, position }) => ({
			...state,
			edition: { component: {}, position, parent }
		}),
		[addComponentSuccess]: (state, { parent, component }) => ({
			...state,
			edition: { component: null, position: null, parent: null },
			components: updateComponents(state.components, [parent.__id__, component.__id__], [parent, component])
		}),
		[removeComponentSuccess]: (state, { parent, component }) => ({
			...state,
			components: updateComponents(state.components, [parent.__id__, component.__id__], [parent])
		}),
		[sortComponentsSuccess]: (state, parent) => ({
			...state,
			components: updateComponents(state.components, [parent.__id__], [parent])
		})
	},
	{
		page: {},
		components: [],
		edition: { component: null, position: null, parent: null }
	}
);

export default reducer;
