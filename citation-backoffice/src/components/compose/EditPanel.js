import React from 'react';
import { object, func } from 'prop-types';
import { compose, withHandlers } from 'recompose';
import { connect } from 'react-redux';

import { editComponent, editComponentSave, addComponentSave } from '../../logic/compose';
import form2data from '../../utils/form2data';
import ComponentForm from './ComponentForm';
import { askReload } from './iframe-comunication';

const enhancer = compose(
	connect(
		state => ({ fields: state.fields, edition: state.compose.edition }),
		dispatch => ({
			close: () => dispatch(editComponent({ component: null, position: null })),
			saveEdit: data => dispatch(editComponentSave(data)),
			saveAdd: data => dispatch(addComponentSave(data))
		})
	),
	withHandlers({
		submit: ({ close, saveEdit, saveAdd, edition, fields }) => data => {
			const formatedData = form2data(data, fields.Component);
			const save = edition.parent === null ? saveEdit : saveAdd;
			save(formatedData).then(askReload);
			close();
		}
	})
);

const EditPanel = ({ edition, close, submit }) =>
	<div
		className="EditPanel"
		style={{
			top: `calc(${edition.position}px - 5rem + 8rem)`,
			left: `calc(50% - 15rem + 6rem)`,
			width: '30rem',
			height: '20rem'
		}}
	>
		<a className="close" onClick={close}>
			X
		</a>
		<h1>Component form</h1>
		<ComponentForm onSubmit={submit} />
	</div>;

EditPanel.propTypes = {
	edition: object.isRequired,
	close: func.isRequired,
	submit: func.isRequired
};

export default enhancer(EditPanel);
