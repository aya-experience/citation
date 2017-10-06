import { isArray } from 'lodash';
import { createAction, createReducer } from 'redux-act';

import form2data from '../utils/form2data';
import data2query from '../utils/data2query';
import { query, mutation } from './graphql-client';

export const loadPageSuccess = createAction('load page success');
export const loadComponentsSuccess = createAction('load components success');
export const editComponentSuccess = createAction('edit component success');
export const addComponentSuccess = createAction('add component success');
export const removeComponentSuccess = createAction('remove component success');
export const sortComponentsSuccess = createAction('sort components success');

const componentFields = `{
	_id_, type,
	children {_id_},
	props {_key_, _value_ {_id_, _type_}, _list_ {_id_, _type_}}
}`;

export const loadPage = id => dispatch => {
	const loadQuery = `{
		Page(id: "${id}") {
			_id_, slug, title
		}
	}`;
	return query(loadQuery).then(response => dispatch(loadPageSuccess(response.data.Page[0])));
};

export const loadComponents = () => dispatch => {
	const loadQuery = `{
		Component ${componentFields}
	}`;
	return query(loadQuery).then(response =>
		dispatch(loadComponentsSuccess(response.data.Component))
	);
};

export const editComponentSave = component => (dispatch, getState) => {
	const oldId = getState().compose.edition.component._id_;
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
	const fields = getState().model.Component.fields;
	if (!isArray(parent.children)) {
		parent.children = [];
	}
	parent.children.push({ _id_: component._id_ });
	const parentData = form2data(parent, fields);
	const saveMutation = `{
		component: editComponent(component: {${data2query(component._id_, component)}})
		${componentFields}
		parent: editComponent(component: {${data2query(parent._id_, parentData)}})
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
	parent.children = parent.children.filter(child => child._id_ !== component._id_);
	const fields = getState().model.Component.fields;
	const parentData = form2data(parent, fields);
	const componentData = form2data(component, fields);
	const saveMutation = `{
		editComponent(component: {${data2query(parent._id_, parentData)}})
		${componentFields}
		deleteComponent(component: {${data2query(component._id_, componentData)}})
		{_id_, message}
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
	const fields = getState().model.Component.fields;
	const parentData = form2data(parent, fields);
	const saveMutation = `{
		editComponent(component: {${data2query(parent._id_, parentData)}})
		${componentFields}
	}`;
	return mutation(saveMutation).then(response =>
		dispatch(sortComponentsSuccess(response.data.editComponent))
	);
};

function updateComponents(components, removeIds, additions) {
	return [...components.filter(component => removeIds.includes(component._id_)), ...additions];
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
		[editComponentSuccess]: (state, { oldId, component }) => ({
			...state,
			components: updateComponents(state.components, [oldId], [component])
		}),
		[addComponentSuccess]: (state, { parent, component }) => ({
			...state,
			components: updateComponents(
				state.components,
				[parent._id_, component._id_],
				[parent, component]
			)
		}),
		[removeComponentSuccess]: (state, { parent, component }) => ({
			...state,
			components: updateComponents(state.components, [parent._id_, component._id_], [parent])
		}),
		[sortComponentsSuccess]: (state, parent) => ({
			...state,
			components: updateComponents(state.components, [parent._id_], [parent])
		})
	},
	{
		page: {},
		components: []
	}
);

export default reducer;
