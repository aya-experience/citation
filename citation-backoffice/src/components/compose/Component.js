import { get, find } from 'lodash';
import React from 'react';
import { object, func } from 'prop-types';
import { compose, withHandlers } from 'recompose';
import { connect } from 'react-redux';

import { Breadcrumb } from '../common/Breadcrumb';
import { Link } from '../common/Link';
import { editComponentSave, addComponentSave } from '../../logic/compose';
import form2data from '../../utils/form2data';
import ComponentForm from './ComponentForm';
import { askReload } from './iframe-comunication';

const enhancer = compose(
	connect(
		(state, ownProps) => ({
			fields: get(state.model, 'Component.fields', {}),
			page: get(state.compose, 'page', {}),
			component: find(get(state.compose, 'components', []), {
				__id__: ownProps.match.params.id
			})
		}),
		dispatch => ({
			saveEdit: data => dispatch(editComponentSave(data)),
			saveAdd: data => dispatch(addComponentSave(data))
		})
	),
	withHandlers({
		submit: ({ close, saveEdit, saveAdd, edition }) => data => {
			const formatedData = form2data(data, {});
			const save = edition.parent === null ? saveEdit : saveAdd;
			save(formatedData).then(askReload);
			close();
		}
	})
);

const Component = ({ page, component, submit }) => (
	<div>
		<Breadcrumb>
			<Link to="/structure">STRUCTURE</Link> /{' '}
			<Link to={`/structure/compose/${page.__id__}`}>{page.__id__}</Link> /{' '}
			{component ? component.__id__ : 'New...'}
		</Breadcrumb>
		<ComponentForm initialValues={component ? component : null} onSubmit={submit} page={page} />
	</div>
);

Component.propTypes = {
	page: object.isRequired,
	component: object,
	submit: func.isRequired
};

export default enhancer(Component);
